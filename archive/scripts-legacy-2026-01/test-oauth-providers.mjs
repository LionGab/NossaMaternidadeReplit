/**
 * Script de teste para validar providers OAuth (Google e Apple)
 * Verifica status REAL via API /auth/v1/settings
 *
 * Nota: Apple Sign In usa autenticação NATIVA no iOS (não OAuth via browser)
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para ler variáveis de ambiente do .env.local
function getEnvValue(varName) {
  // Tenta process.env primeiro
  if (process.env[varName]) {
    return process.env[varName];
  }

  // Tenta ler do .env.local
  try {
    const envPath = join(__dirname, "..", ".env.local");
    const envContent = readFileSync(envPath, "utf8");
    const match = envContent.match(new RegExp(`^${varName}=(.*)$`, "m"));
    return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
  } catch (error) {
    return null;
  }
}

const SUPABASE_URL = getEnvValue("EXPO_PUBLIC_SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = getEnvValue("EXPO_PUBLIC_SUPABASE_ANON_KEY") || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  console.error("   Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY");
  console.error("   No arquivo .env.local ou como variáveis de ambiente");
  process.exit(1);
}

// Buscar status real dos providers via API
async function getAuthSettings() {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar settings:", error.message);
    return null;
  }
}

// Executar teste
async function runTests() {
  console.log("🧪 TESTE DE PROVIDERS OAUTH - STATUS REAL");
  console.log("=".repeat(60));
  console.log(`\n📡 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...\n`);

  const settings = await getAuthSettings();

  if (!settings) {
    console.error("\n❌ Não foi possível obter configurações do Supabase");
    process.exit(1);
  }

  const external = settings.external || {};

  console.log("📊 STATUS DOS PROVIDERS (via API /auth/v1/settings)\n");

  const providers = [
    { name: "email", displayName: "Email/Senha" },
    { name: "google", displayName: "Google" },
    { name: "apple", displayName: "Apple Sign In" },
  ];

  const results = {};

  console.log("┌────────────────┬─────────────┬──────────────────────────────────┐");
  console.log("│ Provider       │ Status      │ Ação Necessária                  │");
  console.log("├────────────────┼─────────────┼──────────────────────────────────┤");

  for (const provider of providers) {
    const isEnabled = external[provider.name] === true;
    const status = isEnabled ? "✅ ATIVO" : "❌ INATIVO";
    let action = isEnabled ? "Nenhuma" : "Habilitar no Dashboard";

    // Caso especial: email sempre ativo por padrão
    if (provider.name === "email" && isEnabled) {
      action = "OK - Funcionando";
    }

    // Caso especial: Apple ativo mas precisa verificar credenciais
    if (provider.name === "apple" && isEnabled) {
      action = "Verificar credenciais";
    }

    results[provider.name] = { enabled: isEnabled, action };

    const name = provider.displayName.padEnd(14);
    const statusPad = isEnabled ? "✅ ATIVO    " : "❌ INATIVO  ";
    const actionPad = action.padEnd(32);

    console.log(`│ ${name} │ ${statusPad} │ ${actionPad} │`);
  }

  console.log("└────────────────┴─────────────┴──────────────────────────────────┘");

  // Resumo
  const activeCount = Object.values(results).filter((r) => r.enabled).length;
  const inactiveCount = Object.values(results).filter((r) => !r.enabled).length;

  console.log(`\n📊 RESUMO:`);
  console.log(`   Providers ativos: ${activeCount}/3`);
  console.log(`   Providers inativos: ${inactiveCount}/3`);

  // Ações necessárias
  const inactiveProviders = providers.filter((p) => !results[p.name].enabled);

  if (inactiveProviders.length > 0) {
    console.log("\n🚨 AÇÃO NECESSÁRIA:");
    console.log("\n   Habilitar providers no Supabase Dashboard:");
    console.log(`   https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers\n`);

    for (const provider of inactiveProviders) {
      console.log(`   📋 ${provider.displayName}:`);

      if (provider.name === "google") {
        console.log("      1. Google Cloud Console: https://console.cloud.google.com");
        console.log("      2. Criar OAuth 2.0 Client ID (Web application)");
        console.log(
          "      3. Redirect URI: https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback"
        );
        console.log("      4. Copiar Client ID e Secret para Supabase\n");
      }

      if (provider.name === "apple") {
        console.log("      1. Apple Developer: https://developer.apple.com");
        console.log("      2. Criar Services ID com Sign in with Apple");
        console.log(
          "      3. Configurar Return URL: https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback"
        );
        console.log("      4. Gerar Key (.p8) e copiar para Supabase\n");
      }
    }

    // Dica: Apple Sign In no iOS usa autenticação nativa
    if (results.apple?.enabled) {
      console.log("   ℹ️  Apple Sign In: No iOS usa sheet NATIVA (não browser).\n");
      console.log("      Teste no dispositivo iOS real para validar credenciais.\n");
    }
  } else {
    console.log("\n✅ Todos os providers estão configurados!");
    console.log("   Teste o login social no app para validar credenciais.\n");
  }

  console.log("=".repeat(60));
  console.log("\n📖 Documentação: docs/SUPABASE_OAUTH_SETUP.md\n");

  // Exit code baseado no status
  process.exit(inactiveProviders.length > 0 ? 1 : 0);
}

// Executar
runTests().catch((error) => {
  console.error("\n❌ Erro fatal:", error);
  process.exit(1);
});
