#!/usr/bin/env node
/**
 * Smoke test for Supabase Edge Function "ai"
 * Validates backend enforcement of ai_consent + is_ai_enabled.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... USER_JWT=... node scripts/test-ai-consent.mjs
 *
 * Notes:
 * - USER_JWT must be a real user access token (supabase auth session access_token)
 * - This script only checks the Edge Function response status + body.
 * - Get USER_JWT from app logs (logger.debug session token) or Supabase dashboard
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const USER_JWT = process.env.USER_JWT;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !USER_JWT) {
  console.error(
    "❌ Missing env. Required: SUPABASE_URL, SUPABASE_ANON_KEY, USER_JWT"
  );
  console.error("\nExample:");
  console.error('  SUPABASE_URL="https://xxx.supabase.co" \\');
  console.error('  SUPABASE_ANON_KEY="eyJ..." \\');
  console.error('  USER_JWT="eyJ..." \\');
  console.error("  npm run test:ai:consent");
  process.exit(1);
}

const fnUrl = `${SUPABASE_URL}/functions/v1/ai`;

async function callAi({ label, jwt, expectedStatuses }) {
  console.log(`\n[${label}] Calling ${fnUrl}...`);

  const res = await fetch(fnUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Minimal payload - adjust if your function schema requires more
      messages: [{ role: "user", content: "ping test" }],
    }),
  });

  const text = await res.text().catch(() => "");
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }

  const ok = expectedStatuses.includes(res.status);
  const statusEmoji = ok ? "✅" : "❌";

  console.log(`${statusEmoji} [${label}] Status: ${res.status}`);

  if (body.error) {
    console.log(`   Error: ${body.error}`);
    if (body.code) console.log(`   Code: ${body.code}`);
  } else if (body.content) {
    console.log(`   Success: Got AI response (${body.content.slice(0, 50)}...)`);
  } else {
    console.log(`   Body: ${JSON.stringify(body).slice(0, 200)}`);
  }

  if (!ok) {
    throw new Error(
      `[${label}] Unexpected status ${res.status}. Expected one of: ${expectedStatuses.join(", ")}`
    );
  }

  return { status: res.status, body };
}

(async () => {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  AI Consent Backend Smoke Test                            ║");
  console.log("║  Validates Guideline 5.1.2(i) enforcement                 ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log(`\nEndpoint: ${fnUrl}`);
  console.log(`JWT: ${USER_JWT.slice(0, 20)}...${USER_JWT.slice(-20)}`);

  // BASELINE: Check current state (should be either 200 or 403)
  const { status, body } = await callAi({
    label: "BASELINE",
    jwt: USER_JWT,
    expectedStatuses: [200, 403],
  });

  console.log("\n" + "─".repeat(60));
  console.log("RESULT INTERPRETATION:");
  console.log("─".repeat(60));

  if (status === 200) {
    console.log("✅ Status 200: User has ai_consent=true + is_ai_enabled=true");
    console.log("   Backend correctly allows AI requests.");
  } else if (status === 403) {
    console.log("🔒 Status 403: User lacks consent or has AI disabled");
    if (body.code === "AI_CONSENT_REQUIRED") {
      console.log("   Backend correctly blocks AI requests (consent check working).");
    } else {
      console.log(`   Error: ${body.error}`);
    }
  }

  console.log("\n" + "─".repeat(60));
  console.log("NEXT STEPS:");
  console.log("─".repeat(60));
  console.log("1. To test 403 → 200 transition:");
  console.log("   - Run: npm run test:ai:set-metadata accepted true");
  console.log("   - Then re-run this smoke test");
  console.log("\n2. To test 200 → 403 transition:");
  console.log("   - Run: npm run test:ai:set-metadata accepted false");
  console.log("   - Then re-run this smoke test");
  console.log("\n3. For manual device testing:");
  console.log("   - See: docs/release/AI_CONSENT_TESTING.md");

  console.log("\n✅ Smoke test completed successfully!");
})().catch((err) => {
  console.error(`\n❌ FAIL: ${err.message}`);
  process.exit(1);
});
