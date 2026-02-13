/**
 * Script de validação completa para lançamento
 *
 * Verifica:
 * - Product IDs consistentes
 * - Arquivos de credenciais presentes
 * - Configurações do app.config.js
 * - Variáveis de ambiente
 *
 * Uso: node scripts/validate-launch-config.js
 */

const fs = require("fs");
const path = require("path");

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function checkFile(filePath, required = true) {
  const exists = fs.existsSync(path.join(process.cwd(), filePath));
  if (exists) {
    log(`✅ ${filePath}`, COLORS.green);
    return true;
  } else {
    if (required) {
      log(`❌ ${filePath} (REQUERIDO)`, COLORS.red);
    } else {
      log(`⚠️  ${filePath} (opcional)`, COLORS.yellow);
    }
    return false;
  }
}

function checkProductIds() {
  log("\n📦 Verificando Product IDs...", COLORS.cyan);

  const revenuecatPath = path.join(process.cwd(), "src/services/revenuecat.ts");
  const premiumTypesPath = path.join(process.cwd(), "src/types/premium.ts");

  const revenuecatContent = fs.readFileSync(revenuecatPath, "utf8");
  const premiumTypesContent = fs.readFileSync(premiumTypesPath, "utf8");

  const expectedMonthly = "nossa_maternidade_monthly";
  const expectedYearly = "nossa_maternidade_yearly";

  const revenuecatHasMonthly = revenuecatContent.includes(`"${expectedMonthly}"`);
  const revenuecatHasYearly = revenuecatContent.includes(`"${expectedYearly}"`);
  const premiumHasMonthly = premiumTypesContent.includes(`"${expectedMonthly}"`);
  const premiumHasYearly = premiumTypesContent.includes(`"${expectedYearly}"`);

  if (revenuecatHasMonthly && revenuecatHasYearly && premiumHasMonthly && premiumHasYearly) {
    log(`✅ Product IDs consistentes: ${expectedMonthly} / ${expectedYearly}`, COLORS.green);
    return true;
  } else {
    log(`❌ Product IDs inconsistentes!`, COLORS.red);
    log(
      `   revenuecat.ts: ${revenuecatHasMonthly && revenuecatHasYearly ? "✅" : "❌"}`,
      COLORS.yellow
    );
    log(`   premium.ts: ${premiumHasMonthly && premiumHasYearly ? "✅" : "❌"}`, COLORS.yellow);
    return false;
  }
}

function checkAppConfig() {
  log("\n⚙️  Verificando app.config.js...", COLORS.cyan);

  const configPath = path.join(process.cwd(), "app.config.js");
  const content = fs.readFileSync(configPath, "utf8");

  let allGood = true;

  // Verificar owner (conta EAS: liongab)
  if (content.includes('owner: "liongab"')) {
    log('✅ owner: "liongab"', COLORS.green);
  } else {
    log("❌ owner incorreto (esperado: liongab)", COLORS.red);
    allGood = false;
  }

  // Verificar projectId (EAS project ID)
  if (content.includes('projectId: "ec07a024-3e98-4023-af9b-1c5ecb9df2af"')) {
    log("✅ projectId correto", COLORS.green);
  } else {
    log("❌ projectId incorreto", COLORS.red);
    allGood = false;
  }

  // Verificar SDK version (SDK 55 / RN 0.83.1 requer 36)
  if (content.includes("compileSdkVersion: 36") && content.includes("targetSdkVersion: 36")) {
    log("✅ Android SDK 36 configurado", COLORS.green);
  } else {
    log("⚠️  Android SDK pode não estar em 36", COLORS.yellow);
  }

  return allGood;
}

function main() {
  log("\n🚀 VALIDAÇÃO DE CONFIGURAÇÃO PARA LANÇAMENTO\n", COLORS.cyan);
  log("═══════════════════════════════════════════════════════════\n");

  let allChecks = true;

  // Verificar arquivos de credenciais
  log("🔑 Verificando credenciais...", COLORS.cyan);
  const hasGooglePlay = checkFile("google-play-service-account.json", true);
  const hasApiKey = checkFile("ApiKey_E7IV510UXU7D.p8", true);

  if (!hasGooglePlay || !hasApiKey) {
    allChecks = false;
  }

  // Verificar Product IDs
  const productIdsOk = checkProductIds();
  if (!productIdsOk) {
    allChecks = false;
  }

  // Verificar app.config.js
  const configOk = checkAppConfig();
  if (!configOk) {
    allChecks = false;
  }

  // Verificar .env.local
  log("\n📄 Verificando .env.local...", COLORS.cyan);
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const requiredVars = [
      "EXPO_PUBLIC_SUPABASE_URL",
      "EXPO_PUBLIC_SUPABASE_ANON_KEY",
      "EXPO_PUBLIC_REVENUECAT_IOS_KEY",
      "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY",
    ];

    let envOk = true;
    for (const varName of requiredVars) {
      if (
        envContent.includes(`${varName}=`) &&
        !envContent.includes(`${varName}=\n`) &&
        !envContent.includes(`${varName}= `)
      ) {
        log(`✅ ${varName}`, COLORS.green);
      } else {
        log(`❌ ${varName} (faltando ou vazio)`, COLORS.red);
        envOk = false;
      }
    }

    if (!envOk) {
      allChecks = false;
    }
  } else {
    log("❌ .env.local não encontrado", COLORS.red);
    allChecks = false;
  }

  // Resumo
  log("\n═══════════════════════════════════════════════════════════\n", COLORS.cyan);

  if (allChecks) {
    log("✅ TODAS AS VERIFICAÇÕES PASSARAM!", COLORS.green);
    log("\n🎉 O app está pronto para build de produção!\n", COLORS.green);
  } else {
    log("❌ ALGUMAS VERIFICAÇÕES FALHARAM", COLORS.red);
    log("\n⚠️  Corrija os itens acima antes de fazer build de produção.\n", COLORS.yellow);
    log("📖 Consulte: docs/CHECKLIST_LANCAMENTO_ACOES.md\n", COLORS.cyan);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
