const { createClient } = require("@supabase/supabase-js");
const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../.env.local") });
require("dotenv").config({ path: resolve(__dirname, "../.env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log("🔍 Checking if subscription tables exist...\n");

  const tables = ["subscriptions", "subscription_payments", "subscription_cancellations"];
  const results = {};

  for (const tableName of tables) {
    try {
      // Try to query the table - if it exists, this will work
      const { data, error } = await supabase.from(tableName).select("id").limit(1);
      
      if (error) {
        const isSchemaCacheError = 
          error.message?.includes("schema cache") ||
          error.message?.includes("Could not find the table") ||
          error.code === "PGRST301" ||
          error.code === "PGRST116";
        
        if (isSchemaCacheError) {
          results[tableName] = "⚠️  Schema cache error (table may exist but not in cache)";
        } else if (error.code === "42P01" || error.message.includes("does not exist")) {
          results[tableName] = "❌ Does not exist";
        } else {
          results[tableName] = `⚠️  Error: ${error.message}`;
        }
      } else {
        results[tableName] = "✅ Exists";
      }
    } catch (err) {
      results[tableName] = `❌ Error: ${err.message}`;
    }
  }

  console.log("Results:");
  console.log("=".repeat(50));
  Object.entries(results).forEach(([table, status]) => {
    console.log(`${table.padEnd(30)} ${status}`);
  });
  console.log("=".repeat(50));

  const allExist = Object.values(results).every((status) => status === "✅ Exists");
  
  const hasCacheErrors = Object.values(results).some((status) => 
    typeof status === "string" && status.includes("Schema cache error")
  );
  const hasMissingTables = Object.values(results).some((status) => 
    typeof status === "string" && status.includes("Does not exist")
  );

  if (allExist) {
    console.log("\n✅ All subscription tables exist! Migration already done.");
  } else if (hasCacheErrors) {
    console.log("\n⚠️  Schema cache issue detected!");
    console.log("\n📋 SOLUÇÃO:");
    console.log("   1. Acesse: https://supabase.com/dashboard");
    console.log("   2. Selecione seu projeto");
    console.log("   3. Vá em: Settings > General");
    console.log("   4. Clique em: 'Restart project' ou 'Pause/Resume'");
    console.log("   5. Aguarde 2-5 minutos após reiniciar");
    console.log("\n💡 As tabelas podem existir no banco, mas o PostgREST precisa recarregar o cache.");
  } else if (hasMissingTables) {
    console.log("\n❌ Some tables are missing. You need to run the migration manually.");
    console.log("\n📋 To run migration:");
    console.log("   1. Run: npm run migrate:subscriptions:show");
    console.log("   2. Copy the SQL output");
    console.log("   3. Paste in Supabase SQL Editor and run");
    console.log("   4. After running, restart your Supabase project");
  } else {
    console.log("\n⚠️  Some tables have errors. Check the messages above.");
  }
}

checkTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

