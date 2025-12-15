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

async function refreshCache() {
  console.log("🔄 Attempting to refresh Supabase schema cache...\n");

  // Try to query each table with a simple SELECT to force cache refresh
  const tables = ["subscriptions", "subscription_payments", "subscription_cancellations"];
  
  for (const tableName of tables) {
    try {
      console.log(`📊 Querying ${tableName}...`);
      
      // Try a simple query to force schema cache update
      const { data, error } = await supabase
        .from(tableName)
        .select("id")
        .limit(1);
      
      if (error) {
        if (error.message.includes("schema cache")) {
          console.log(`   ⚠️  ${tableName}: Schema cache issue detected`);
          console.log(`   💡 Solution: Restart your Supabase project or wait a few minutes`);
        } else {
          console.log(`   ❌ ${tableName}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${tableName}: Accessible (cache may be updated)`);
      }
    } catch (err) {
      console.log(`   ⚠️  ${tableName}: ${err.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("💡 SOLUÇÕES PARA ATUALIZAR O CACHE:");
  console.log("=".repeat(60));
  console.log("");
  console.log("Opção 1: Reiniciar o projeto Supabase (Recomendado)");
  console.log("   1. Acesse: https://supabase.com/dashboard");
  console.log("   2. Selecione seu projeto");
  console.log("   3. Vá em: Settings > General");
  console.log("   4. Clique em 'Restart project' ou 'Pause/Resume'");
  console.log("");
  console.log("Opção 2: Aguardar alguns minutos");
  console.log("   O cache do PostgREST atualiza automaticamente");
  console.log("   Geralmente leva 1-5 minutos após criar as tabelas");
  console.log("");
  console.log("Opção 3: Verificar políticas RLS");
  console.log("   Certifique-se de que as políticas RLS estão corretas");
  console.log("   e permitem SELECT na tabela subscriptions");
  console.log("");
}

refreshCache()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


