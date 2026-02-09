#!/usr/bin/env node
/**
 * Script de Checagem Rápida de Variáveis de Ambiente
 *
 * Verifica se as variáveis críticas do ambiente estão configuradas.
 * Versão simplificada do validate-env.js para uso no npm run check-env
 *
 * Uso: npm run check-env
 */

// Carregar variáveis de ambiente do .env.local
require("dotenv").config({ path: ".env.local" });

const REQUIRED_VARS = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_ENV",
];

const OPTIONAL_VARS = ["EXPO_PUBLIC_REVENUECAT_IOS_KEY", "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY"];

let hasErrors = false;

console.log("🔍 Verificando variáveis de ambiente...\n");

// Verificar variáveis obrigatórias
REQUIRED_VARS.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ ERRO: ${varName} não está definida`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  }
});

// Verificar variáveis opcionais
console.log("\n📦 Variáveis opcionais:");
OPTIONAL_VARS.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️  ${varName}: não definida (opcional)`);
  } else {
    console.log(`✅ ${varName}: configurada`);
  }
});

// Verificar se há variáveis proibidas no ambiente local
const FORBIDDEN_VARS = [
  "GEMINI_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

console.log("\n🔒 Verificando segurança:");
FORBIDDEN_VARS.forEach((varName) => {
  if (process.env[varName]) {
    console.error(`❌ ERRO DE SEGURANÇA: ${varName} NÃO deve estar no .env.local!`);
    console.error(`   Esta chave deve estar apenas nas Edge Function Secrets do Supabase.`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error("\n❌ Verificação falhou. Corrija os erros acima.\n");
  process.exit(1);
}

console.log("\n✅ Verificação concluída com sucesso!\n");
process.exit(0);
