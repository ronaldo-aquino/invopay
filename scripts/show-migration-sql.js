const { readFileSync } = require("fs");
const { resolve } = require("path");

const SQL_FILE = resolve(__dirname, "../backend/supabase/supabase-migration-subscriptions.sql");

console.log("=".repeat(70));
console.log("📋 SUBSCRIPTION MIGRATION SQL");
console.log("=".repeat(70));
console.log("");
console.log("Copy the SQL below and paste it into Supabase SQL Editor:");
console.log("");
console.log("-".repeat(70));
console.log("");

const sql = readFileSync(SQL_FILE, "utf-8");
console.log(sql);

console.log("");
console.log("-".repeat(70));
console.log("");
console.log("📝 Instructions:");
console.log("   1. Open: https://supabase.com/dashboard");
console.log("   2. Select your project");
console.log("   3. Go to: SQL Editor (left sidebar)");
console.log("   4. Paste the SQL above");
console.log("   5. Click 'Run' (or press Ctrl+Enter)");
console.log("");
console.log("=".repeat(70));


