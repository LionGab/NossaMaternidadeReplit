#!/usr/bin/env node
/**
 * Script de diagnóstico do Supabase
 * Verifica se as variáveis estão sendo carregadas corretamente
 */

require("dotenv").config({ path: ".env.local" });

console.log("\n🔍 DIAGNÓSTICO SUPABASE\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Verificar variáveis no process.env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const functionsUrl = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

console.log("📋 Variáveis de Ambiente:\n");
console.log(
  `EXPO_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅ " + supabaseUrl.substring(0, 40) + "..." : "❌ NÃO CONFIGURADO"}`
);
console.log(
  `EXPO_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? "✅ " + supabaseKey.substring(0, 30) + "..." : "❌ NÃO CONFIGURADO"}`
);
console.log(
  `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL: ${functionsUrl ? "✅ " + functionsUrl : "❌ NÃO CONFIGURADO"}`
);

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Verificar se Supabase pode ser inicializado
if (supabaseUrl && supabaseKey) {
  console.log("✅ Todas as variáveis obrigatórias estão configuradas\n");
  console.log("💡 PRÓXIMOS PASSOS:\n");
  console.log("1. Pare o servidor Expo (Ctrl+C)");
  console.log("2. Limpe o cache: npm start -- --clear");
  console.log("3. Ou reinicie completamente: npm run clean && npm start");
  console.log("\n⚠️  IMPORTANTE: O Expo precisa ser reiniciado após mudanças no .env.local\n");
} else {
  console.log("❌ ERRO: Variáveis obrigatórias faltando!\n");
  console.log("Verifique o arquivo .env.local\n");
  process.exit(1);
}
