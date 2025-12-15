const { createClient } = require("@supabase/supabase-js");
const { readFileSync } = require("fs");
const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../.env.local") });
require("dotenv").config({ path: resolve(__dirname, "../.env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing Supabase credentials");
  console.error("   Required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log("🚀 Starting subscription migration...\n");

  try {
    // Read the SQL file
    const sqlPath = resolve(__dirname, "../backend/supabase/supabase-migration-subscriptions.sql");
    const sql = readFileSync(sqlPath, "utf-8");

    console.log("📄 Reading migration file:", sqlPath);
    console.log("📊 Executing SQL migration...\n");

    // Split SQL into individual statements and execute
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("COMMENT"));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (statement) {
        try {
          // Use the REST API to execute SQL
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseServiceKey,
              Authorization: `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ sql_query: statement + ";" }),
          });

          if (!response.ok) {
            // Try direct query for DDL statements
            const { error } = await supabase.rpc("exec_sql", {
              sql_query: statement + ";",
            });
            if (error) {
              console.log(`⚠️  Statement skipped (may already exist): ${statement.substring(0, 60)}...`);
              errorCount++;
            } else {
              successCount++;
            }
          } else {
            successCount++;
          }
        } catch (err) {
          console.log(`⚠️  Statement skipped: ${statement.substring(0, 60)}...`);
          errorCount++;
        }
      }
    }

    console.log(`\n✅ Executed ${successCount} statements`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} statements had issues (may already exist)`);
    }

    // Verify tables were created
    console.log("\n✅ Verifying migration...\n");

    const { data: tables, error: verifyError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["subscriptions", "subscription_payments", "subscription_cancellations"]);

    if (verifyError) {
      console.log("⚠️  Could not verify automatically. Please check manually in Supabase dashboard.");
      console.log("\n📋 To verify manually, run this query in Supabase SQL Editor:");
      console.log(`
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'subscription_payments', 'subscription_cancellations');
      `);
    } else if (tables && tables.length === 3) {
      console.log("✅ Migration successful! All tables created:");
      tables.forEach((table) => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log("⚠️  Some tables may be missing. Please verify manually.");
      console.log(`   Found ${tables?.length || 0} out of 3 expected tables.`);
    }

    console.log("\n✨ Migration completed!");
    console.log("\n💡 Note: Supabase REST API has limitations for DDL statements.");
    console.log("   If tables weren't created, please run the SQL manually in Supabase SQL Editor.");
    console.log(`   SQL file: ${sqlPath}`);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("\n💡 Please run the migration manually:");
    console.error("   1. Open Supabase Dashboard > SQL Editor");
    console.error("   2. Copy the contents of:");
    console.error(`      ${resolve(__dirname, "../backend/supabase/supabase-migration-subscriptions.sql")}`);
    console.error("   3. Paste and run in SQL Editor");
    process.exit(1);
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


