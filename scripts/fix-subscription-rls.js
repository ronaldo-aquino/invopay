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

async function testSubscriptionAccess() {
  console.log("🔍 Testing subscription table access...\n");

  try {
    // Try to insert a test record (will fail but should show if table is accessible)
    const testData = {
      subscription_id_bytes32: "0x0000000000000000000000000000000000000000000000000000000000000000",
      creator_wallet_address: "0x0000000000000000000000000000000000000000",
      payer_wallet_address: "0x0000000000000000000000000000000000000000",
      receiver_wallet_address: "0x0000000000000000000000000000000000000000",
      amount: 0,
      currency: "USDC",
      period_seconds: 86400,
      next_payment_due: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .insert(testData)
      .select();

    if (error) {
      if (error.message.includes("schema cache")) {
        console.log("❌ Schema cache issue confirmed");
        console.log("\n💡 SOLUÇÃO: Reinicie o projeto Supabase");
        console.log("   1. Dashboard > Settings > General");
        console.log("   2. Clique em 'Restart project'");
        console.log("   3. Aguarde 1-2 minutos");
      } else if (error.code === "23505") {
        console.log("✅ Tabela acessível! (erro de duplicata é esperado)");
        console.log("   O cache pode ter sido atualizado.");
      } else {
        console.log(`⚠️  Erro: ${error.message}`);
        console.log(`   Código: ${error.code}`);
      }
    } else {
      console.log("✅ Tabela acessível e funcionando!");
    }
  } catch (err) {
    console.log(`❌ Erro: ${err.message}`);
  }
}

testSubscriptionAccess()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


