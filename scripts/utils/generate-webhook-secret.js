/**
 * Script para gerar secret do webhook RevenueCat
 *
 * Uso: node scripts/generate-webhook-secret.js
 *
 * Gera um secret seguro de 32 bytes (base64) para usar no:
 * - Supabase Secrets (REVENUECAT_WEBHOOK_SECRET)
 * - RevenueCat Dashboard (Authorization header value)
 */

const crypto = require("crypto");

function generateWebhookSecret() {
  // Gerar 32 bytes aleatórios e converter para base64
  const secret = crypto.randomBytes(32).toString("base64");

  console.log("\n🔐 REVENUECAT WEBHOOK SECRET GERADO\n");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(secret);
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("📋 PRÓXIMOS PASSOS:\n");
  console.log("1. Adicionar no Supabase Secrets:");
  console.log(
    "   - Acesse: https://app.supabase.com/project/lqahkqfpynypbmhtffyi/settings/functions"
  );
  console.log('   - Clique em "Add secret"');
  console.log("   - Name: REVENUECAT_WEBHOOK_SECRET");
  console.log(`   - Value: ${secret}`);
  console.log("   - Save\n");

  console.log("2. Configurar no RevenueCat Dashboard:");
  console.log("   - Acesse: https://app.revenuecat.com");
  console.log("   - Vá em Project Settings → Integrations → Webhooks");
  console.log('   - Clique em "+ Add Webhook"');
  console.log(
    "   - Webhook URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat"
  );
  console.log(`   - Authorization header value: ${secret}`);
  console.log(
    "   - Events: Selecione todos (ou pelo menos INITIAL_PURCHASE, RENEWAL, CANCELLATION)"
  );
  console.log("   - Save\n");

  console.log("⚠️  IMPORTANTE:");
  console.log("   - Guarde este secret em local seguro");
  console.log("   - NÃO commite este valor no Git");
  console.log("   - Use o MESMO valor no Supabase e RevenueCat\n");

  return secret;
}

// Executar
if (require.main === module) {
  generateWebhookSecret();
}

module.exports = { generateWebhookSecret };
