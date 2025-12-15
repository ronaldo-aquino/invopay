import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });
dotenv.config({ path: resolve(__dirname, "../.env") });

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

    // Execute the SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, try direct query execution
      console.log("⚠️  RPC method not available, trying direct execution...\n");
      
      // Split SQL into individual statements
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      for (const statement of statements) {
        if (statement) {
          try {
            const { error: execError } = await supabase.rpc("exec_sql", {
              sql_query: statement + ";",
            });
            if (execError) {
              console.error(`❌ Error executing statement: ${statement.substring(0, 50)}...`);
              console.error(`   ${execError.message}`);
            }
          } catch (err: any) {
            console.error(`❌ Error: ${err.message}`);
          }
        }
      }
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
      tables.forEach((table: any) => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log("⚠️  Some tables may be missing. Please verify manually.");
    }

    console.log("\n✨ Migration completed!");
    console.log("\n💡 Note: If you see errors above, you may need to run the SQL manually");
    console.log("   in the Supabase SQL Editor. The SQL file is located at:");
    console.log(`   ${sqlPath}`);
  } catch (error: any) {
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


