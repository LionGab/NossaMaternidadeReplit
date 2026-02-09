/**
 * Script de diagnóstico para verificar configuração do Supabase
 * Verifica se as variáveis estão disponíveis em diferentes contextos
 */

const Constants = require("expo-constants").default;

console.log("🔍 Diagnóstico de Configuração Supabase\n");

// 1. Verificar process.env
console.log("1️⃣ process.env:");
console.log(
  "   EXPO_PUBLIC_SUPABASE_URL:",
  process.env.EXPO_PUBLIC_SUPABASE_URL ? "✅ SET" : "❌ MISSING"
);
console.log(
  "   EXPO_PUBLIC_SUPABASE_ANON_KEY:",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? "✅ SET" : "❌ MISSING"
);

// 2. Verificar Constants.expoConfig.extra
console.log("\n2️⃣ Constants.expoConfig.extra:");
const extra = Constants.expoConfig?.extra;
if (extra) {
  console.log("   supabaseUrl:", extra.supabaseUrl ? "✅ SET" : "❌ MISSING");
  console.log("   supabaseAnonKey:", extra.supabaseAnonKey ? "✅ SET" : "❌ MISSING");
  console.log("   supabaseFunctionsUrl:", extra.supabaseFunctionsUrl ? "✅ SET" : "❌ MISSING");

  if (extra.supabaseUrl) {
    console.log(`   URL Preview: ${extra.supabaseUrl.substring(0, 40)}...`);
  }
  if (extra.supabaseAnonKey) {
    console.log(`   Key Preview: ${extra.supabaseAnonKey.substring(0, 30)}...`);
  }
} else {
  console.log("   ❌ extra config não disponível");
}

// 3. Verificar se getEnv funcionaria
console.log("\n3️⃣ Simulação getEnv():");
function getEnv(key) {
  // Simular lógica do getEnv
  const STATIC_ENV_CACHE = {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };

  const cachedValue = STATIC_ENV_CACHE[key];
  if (cachedValue) return cachedValue;

  const extra = Constants.expoConfig?.extra;
  if (!extra) return undefined;

  const ENV_TO_EXTRA_ALIASES = {
    EXPO_PUBLIC_SUPABASE_URL: "supabaseUrl",
    EXPO_PUBLIC_SUPABASE_ANON_KEY: "supabaseAnonKey",
  };

  const extraAlias = ENV_TO_EXTRA_ALIASES[key];
  if (extraAlias) {
    const aliasValue = extra[extraAlias];
    if (aliasValue) return String(aliasValue);
  }

  return undefined;
}

const url = getEnv("EXPO_PUBLIC_SUPABASE_URL");
const key = getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY");

console.log("   EXPO_PUBLIC_SUPABASE_URL:", url ? "✅ SET" : "❌ MISSING");
console.log("   EXPO_PUBLIC_SUPABASE_ANON_KEY:", key ? "✅ SET" : "❌ MISSING");

if (url && key) {
  console.log("\n✅ Supabase está configurado corretamente!");
} else {
  console.log("\n❌ Supabase NÃO está configurado!");
  console.log("\n💡 Solução:");
  console.log("   - Verifique se as variáveis estão no eas.json");
  console.log("   - Verifique se app.config.js tem valores padrão");
  console.log("   - No build de produção, EAS injeta variáveis do eas.json");
}
