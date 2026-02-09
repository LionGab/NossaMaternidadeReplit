#!/usr/bin/env node
/**
 * Script de Validação de Variáveis de Ambiente
 *
 * Verifica se todas as variáveis necessárias estão configuradas corretamente.
 *
 * Uso: node scripts/validate-env.js
 */

// Carregar variáveis de ambiente do .env.local
require("dotenv").config({ path: ".env.local" });

const requiredVars = {
  // Supabase - Obrigatórias
  EXPO_PUBLIC_SUPABASE_URL: {
    required: true,
    pattern: /^https:\/\/[a-z0-9]+\.supabase\.co$/,
    expected: "https://lqahkqfpynypbmhtffyi.supabase.co",
    description: "URL do projeto Supabase",
  },
  EXPO_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    pattern: /^eyJ/,
    description: "Anon key do Supabase (JWT)",
  },
  EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL: {
    required: true,
    pattern: /^https:\/\/[a-z0-9]+\.supabase\.co\/functions\/v1$/,
    expected: "https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1",
    description: "URL base das Edge Functions",
  },

  // ElevenLabs - Opcionais (usado no client para TTS)
  EXPO_ELEVENLABS_API_KEY: {
    required: false,
    pattern: /^sk_/,
    description: "API key do ElevenLabs (opcional)",
  },
  VOICE_ID: {
    required: false,
    description: "ID da voz do ElevenLabs (opcional)",
  },
};

// Variáveis que NÃO devem estar no .env.local (devem estar nas Edge Function Secrets)
const forbiddenVars = [
  "GEMINI_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "EXPO_GEMINI_API_KEY",
  "EXPO_CLAUDE_API_KEY",
  "EXPO_OPENAI_API_KEY",
];

function validateEnv() {
  console.log("🔍 Validando variáveis de ambiente...\n");

  const errors = [];
  const warnings = [];
  const success = [];

  // Verificar variáveis obrigatórias
  for (const [varName, config] of Object.entries(requiredVars)) {
    const value = process.env[varName];

    if (!value) {
      if (config.required) {
        errors.push(`❌ ${varName}: NÃO CONFIGURADA (obrigatória)`);
      } else {
        warnings.push(`⚠️  ${varName}: Não configurada (opcional)`);
      }
    } else {
      // Validar formato
      if (config.pattern && !config.pattern.test(value)) {
        errors.push(`❌ ${varName}: Formato inválido`);
        if (config.expected) {
          errors.push(`   Esperado: ${config.expected}`);
        }
        errors.push(`   Recebido: ${value.substring(0, 50)}...`);
      } else {
        // Verificar se está usando o projeto correto
        if (varName.includes("SUPABASE") && value.includes("igacnomjrgvdwycxlyla")) {
          errors.push(`❌ ${varName}: Usando projeto ANTIGO (igacnomjrgvdwycxlyla)`);
          errors.push(`   Deve usar: lqahkqfpynypbmhtffyi`);
        } else {
          success.push(`✅ ${varName}: OK`);
        }
      }
    }
  }

  // Verificar variáveis proibidas (API keys de IA no client)
  for (const varName of forbiddenVars) {
    if (process.env[varName]) {
      errors.push(`❌ ${varName}: NÃO DEVE estar no .env.local!`);
      errors.push(`   → Configure nas Edge Function Secrets do Supabase`);
    }
  }

  // Verificar projeto Supabase
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    if (supabaseUrl.includes("lqahkqfpynypbmhtffyi")) {
      success.push(`✅ Projeto Supabase: CORRETO (lqahkqfpynypbmhtffyi)`);
    } else if (supabaseUrl.includes("igacnomjrgvdwycxlyla")) {
      errors.push(`❌ Projeto Supabase: ANTIGO (igacnomjrgvdwycxlyla)`);
      errors.push(`   → Atualize para: lqahkqfpynypbmhtffyi`);
    }
  }

  // Resultado
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 RESULTADO DA VALIDAÇÃO\n");

  if (success.length > 0) {
    console.log("✅ Variáveis Corretas:");
    success.forEach((msg) => console.log(`   ${msg}`));
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("⚠️  Avisos:");
    warnings.forEach((msg) => console.log(`   ${msg}`));
    console.log("");
  }

  if (errors.length > 0) {
    console.log("❌ Erros:");
    errors.forEach((msg) => console.log(`   ${msg}`));
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("❌ VALIDAÇÃO FALHOU");
    console.log("\n📝 Próximos passos:");
    console.log("   1. Atualize o .env.local com as variáveis corretas");
    console.log("   2. Remova API keys de IA do .env.local");
    console.log("   3. Configure API keys nas Edge Function Secrets:");
    console.log(
      "      https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/settings/functions"
    );
    process.exit(1);
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ VALIDAÇÃO PASSOU!");
    console.log("\n💡 Lembrete:");
    console.log("   - API keys de IA devem estar nas Edge Function Secrets");
    console.log("   - Nunca commite o .env.local no git");
    process.exit(0);
  }
}

// Executar validação
validateEnv();
