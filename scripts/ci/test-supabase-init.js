#!/usr/bin/env node
/**
 * Testa se o Supabase pode ser inicializado com as variáveis atuais
 */

require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("\n🧪 TESTE DE INICIALIZAÇÃO DO SUPABASE\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ ERRO: Variáveis não encontradas!\n");
  console.log("URL:", supabaseUrl ? "✅" : "❌");
  console.log("KEY:", supabaseAnonKey ? "✅" : "❌");
  process.exit(1);
}

console.log("✅ Variáveis encontradas");
console.log("URL:", supabaseUrl.substring(0, 50) + "...");
console.log("KEY:", supabaseAnonKey.substring(0, 30) + "...\n");

// Tentar importar e inicializar Supabase
try {
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log("✅ Supabase inicializado com sucesso!\n");
  console.log("💡 O problema pode ser:");
  console.log("   1. Cache do Metro bundler");
  console.log("   2. Expo precisa ser reiniciado");
  console.log("   3. Variáveis não estão sendo carregadas no runtime\n");
  console.log("🔧 SOLUÇÃO:");
  console.log("   1. Pare o servidor Expo (Ctrl+C)");
  console.log("   2. Execute: npm start -- --clear");
  console.log("   3. Ou: npm run clean && npm start\n");
} catch (error) {
  console.log("❌ ERRO ao inicializar Supabase:");
  console.log(error.message);
  process.exit(1);
}
