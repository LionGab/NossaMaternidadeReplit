#!/usr/bin/env node
/**
 * Script de validação de secrets EAS
 * Verifica se todos os secrets necessários estão configurados
 *
 * Uso: node scripts/validate-secrets.js
 */

const requiredSecrets = {
  // Supabase (obrigatório)
  EXPO_PUBLIC_SUPABASE_URL: {
    description: "URL do projeto Supabase",
    required: true,
    example: "https://xxxxx.supabase.co",
  },
  EXPO_PUBLIC_SUPABASE_ANON_KEY: {
    description: "Chave anônima do Supabase",
    required: true,
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  },
  EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL: {
    description: "URL das Edge Functions do Supabase",
    required: true,
    example: "https://xxxxx.supabase.co/functions/v1",
  },

  // Sentry (recomendado para produção)
  EXPO_PUBLIC_SENTRY_DSN: {
    description: "DSN do Sentry para error tracking",
    required: false,
    example: "https://xxxxx@sentry.io/xxxxx",
  },
  SENTRY_AUTH_TOKEN: {
    description: "Token de autenticação do Sentry para sourcemaps",
    required: false,
    example: "sntrys_xxxxx",
  },

  // RevenueCat (se usar IAP/Premium)
  EXPO_PUBLIC_REVENUECAT_IOS_KEY: {
    description: "Chave pública do RevenueCat para iOS",
    required: false,
    example: "appl_xxxxx",
  },
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: {
    description: "Chave pública do RevenueCat para Android",
    required: false,
    example: "goog_xxxxx",
  },
};

function validateSecrets() {
  console.log("🔍 Validando secrets EAS...\n");

  const missing = [];
  const optional = [];

  Object.entries(requiredSecrets).forEach(([key, config]) => {
    const value = process.env[key];
    const status = value ? "✅" : config.required ? "❌" : "⚠️";

    console.log(`${status} ${key}`);
    console.log(`   ${config.description}`);

    if (!value) {
      if (config.required) {
        missing.push({ key, ...config });
        console.log(`   ⚠️  FALTANDO (obrigatório)`);
      } else {
        optional.push({ key, ...config });
        console.log(`   ℹ️  Opcional`);
      }
    } else {
      console.log(`   ✓ Configurado`);
    }
    console.log("");
  });

  // Resumo
  console.log("\n📊 Resumo:");
  console.log(
    `✅ Secrets configurados: ${Object.keys(requiredSecrets).length - missing.length - optional.length}`
  );
  console.log(`❌ Secrets obrigatórios faltando: ${missing.length}`);
  console.log(`⚠️  Secrets opcionais faltando: ${optional.length}`);

  // Instruções para configurar
  if (missing.length > 0) {
    console.log("\n\n🔧 Para configurar os secrets faltantes:\n");
    console.log("1. Primeiro, crie o projeto EAS (se ainda não criou):");
    console.log("   npx eas-cli build:configure\n");
    console.log("2. Configure cada secret obrigatório:");
    missing.forEach(({ key, example }) => {
      console.log(`\n   npx eas-cli env:create --name ${key} --value "${example}" --scope project`);
    });
    console.log("\n3. Valide novamente:");
    console.log("   node scripts/validate-secrets.js\n");

    process.exit(1);
  }

  console.log("\n✅ Todos os secrets obrigatórios estão configurados!");

  if (optional.length > 0) {
    console.log("\nℹ️  Secrets opcionais não configurados (recomendados para produção):");
    optional.forEach(({ key, description }) => {
      console.log(`   - ${key}: ${description}`);
    });
  }

  process.exit(0);
}

// Executar validação
validateSecrets();
