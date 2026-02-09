#!/usr/bin/env node
/**
 * Set user metadata for ai_consent / is_ai_enabled (Admin)
 *
 * ⚠️  REQUIRES SERVICE ROLE KEY - NEVER COMMIT THIS KEY ⚠️
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... USER_ID=... \
 *   node scripts/set-user-metadata-ai.mjs accepted true
 * # 1. Configurar todas as variáveis (incluindo SERVICE_ROLE_KEY)

# 2. Configurar consentimento
npm run test:ai:set-metadata accepted true

# 3. Testar novamente (deve retornar 200 agora)
npm run test:ai:consent
 *
 * Args:
 *   consent: accepted|declined|clear
 *   enabled: true|false|keep
 *
 * Examples:
 *   # Accept consent + enable AI
 *   npm run test:ai:set-metadata accepted true
 *
 *   # Accept consent but disable AI
 *   npm run test:ai:set-metadata accepted false
 *
 *   # Decline consent (keep enabled state)
 *   npm run test:ai:set-metadata declined keep
 *
 *   # Clear consent (reset to unknown)
 *   npm run test:ai:set-metadata clear keep
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = process.env.USER_ID;

if (!SUPABASE_URL || !SERVICE_ROLE || !USER_ID) {
  console.error("❌ Missing env. Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, USER_ID");
  console.error("\nExample:");
  console.error('  SUPABASE_URL="https://xxx.supabase.co" \\');
  console.error('  SUPABASE_SERVICE_ROLE_KEY="eyJ..." \\');
  console.error('  USER_ID="uuid-here" \\');
  console.error("  npm run test:ai:set-metadata accepted true");
  process.exit(1);
}

const [consentArg, enabledArg] = process.argv.slice(2);

if (!consentArg || !enabledArg) {
  console.error("❌ Missing arguments");
  console.error("\nUsage:");
  console.error("  node scripts/set-user-metadata-ai.mjs <consent> <enabled>");
  console.error("\nArguments:");
  console.error("  consent: accepted|declined|clear");
  console.error("  enabled: true|false|keep");
  console.error("\nExamples:");
  console.error("  npm run test:ai:set-metadata accepted true   # Accept + enable");
  console.error("  npm run test:ai:set-metadata accepted false  # Accept but disable");
  console.error("  npm run test:ai:set-metadata declined keep   # Decline consent");
  console.error("  npm run test:ai:set-metadata clear keep      # Reset to unknown");
  process.exit(1);
}

function parseConsent(arg) {
  if (arg === "accepted") return true;
  if (arg === "declined") return false;
  if (arg === "clear") return "delete";
  throw new Error(`Invalid consent arg: ${arg}. Use: accepted|declined|clear`);
}

function parseEnabled(arg) {
  if (arg === "true") return true;
  if (arg === "false") return false;
  if (arg === "keep") return null;
  throw new Error(`Invalid enabled arg: ${arg}. Use: true|false|keep`);
}

let consent, enabled;
try {
  consent = parseConsent(consentArg);
  enabled = parseEnabled(enabledArg);
} catch (err) {
  console.error(`❌ ${err.message}`);
  process.exit(1);
}

async function adminUpdateUser() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  AI Consent Metadata Update (Admin)                      ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log(`\nUser ID: ${USER_ID}`);
  console.log(`Consent: ${consentArg} → ${consent === "delete" ? "DELETE" : consent}`);
  console.log(`Enabled: ${enabledArg} → ${enabled === null ? "KEEP" : enabled}`);

  // Build patch object
  const patch = {};
  if (consent === "delete") {
    // To delete a key, we need to explicitly set it to null
    patch.ai_consent = null;
  } else if (consent !== null) {
    patch.ai_consent = consent;
  }

  if (enabled !== null) {
    patch.is_ai_enabled = enabled;
  }

  console.log(`\nPatch: ${JSON.stringify(patch, null, 2)}`);

  const url = `${SUPABASE_URL}/auth/v1/admin/users/${USER_ID}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE}`,
      apikey: SERVICE_ROLE,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_metadata: patch,
    }),
  });

  const text = await res.text().catch(() => "");
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }

  if (!res.ok) {
    console.error(`\n❌ Admin update failed: ${res.status}`);
    console.error(`Response: ${JSON.stringify(body, null, 2)}`);
    throw new Error(`Admin API returned ${res.status}`);
  }

  console.log("\n✅ User metadata updated successfully!");
  console.log("\nUpdated user_metadata:");
  console.log(JSON.stringify(body.user_metadata || patch, null, 2));

  console.log("\n" + "─".repeat(60));
  console.log("NEXT STEPS:");
  console.log("─".repeat(60));
  console.log("1. Run smoke test to verify backend enforcement:");
  console.log("   npm run test:ai:consent");
  console.log("\n2. Test in app:");
  console.log("   - Logout + login to refresh token");
  console.log("   - Or wait for token refresh (~1 hour)");
  console.log("   - Try sending AI message");

  console.log("\n" + "─".repeat(60));
  console.log("EXPECTED BEHAVIOR:");
  console.log("─".repeat(60));

  if (consent === true && enabled === true) {
    console.log("✅ Backend should return 200 (AI requests allowed)");
  } else if (consent === true && enabled === false) {
    console.log("🔒 Backend should return 403 (AI disabled by user)");
  } else if (consent === false || consent === "delete") {
    console.log("🔒 Backend should return 403 (consent not granted)");
  } else if (consent === null && enabled === true) {
    console.log("✅ Backend should return 200 (consent kept, AI enabled)");
  }
}

adminUpdateUser().catch((e) => {
  console.error(`\n❌ FAIL: ${e.message}`);
  process.exit(1);
});
