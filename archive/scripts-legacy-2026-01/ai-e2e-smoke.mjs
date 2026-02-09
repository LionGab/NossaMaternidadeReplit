#!/usr/bin/env node
/**
 * AI E2E Smoke Test (no service_role key needed)
 *
 * What it does:
 * - Signs in as a test user (default: admin@admin.com / admin123)
 * - Updates its own user_metadata via supabase.auth.updateUser:
 *   1) ai_consent=true + is_ai_enabled=true  -> expects AI 200
 *   2) is_ai_enabled=false                   -> expects AI 403
 *   3) is_ai_enabled=true                    -> expects AI 200
 *
 * Why:
 * - Validates end-to-end that the deployed Edge Function `ai` is active and enforcing consent/enabled flags.
 * - Does NOT require SUPABASE_SERVICE_ROLE_KEY (avoids admin API).
 *
 * Usage:
 *   node scripts/ai-e2e-smoke.mjs
 *
 * Optional env overrides:
 *   EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
 *   TEST_EMAIL, TEST_PASSWORD
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getEnvValue(varName) {
  if (process.env[varName]) return process.env[varName];
  try {
    const envPath = join(__dirname, "..", ".env.local");
    const envContent = readFileSync(envPath, "utf8");
    const match = envContent.match(new RegExp(`^${varName}=(.*)$`, "m"));
    if (!match) return null;
    return match[1]
      .trim()
      .replace(/\s+#.*$/, "")
      .replace(/^["']|["']$/g, "");
  } catch {
    return null;
  }
}

const SUPABASE_URL = getEnvValue("EXPO_PUBLIC_SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = getEnvValue("EXPO_PUBLIC_SUPABASE_ANON_KEY") || "";

const TEST_EMAIL = process.env.TEST_EMAIL || "admin@admin.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "admin123";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Missing env. Required:");
  console.error("   - EXPO_PUBLIC_SUPABASE_URL");
  console.error("   - EXPO_PUBLIC_SUPABASE_ANON_KEY");
  console.error("Configure no .env.local (public vars) or pass via env.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signInGetJwt() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (error) throw new Error(`signInWithPassword failed: ${error.message}`);
  const jwt = data?.session?.access_token;
  if (!jwt) throw new Error("signInWithPassword did not return access_token");
  return jwt;
}

async function updateMyMetadata(patch) {
  const { error } = await supabase.auth.updateUser({ data: patch });
  if (error) throw new Error(`updateUser failed: ${error.message}`);
}

async function callAi(jwt, expectedStatus) {
  const fnUrl = `${SUPABASE_URL}/functions/v1/ai`;

  const res = await fetch(fnUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "ping" }],
    }),
  });

  const text = await res.text().catch(() => "");
  const prefix = text.slice(0, 160).replace(/\s+/g, " ");

  console.log(`AI_E2E_STATUS ${res.status} (expected ${expectedStatus})`);
  console.log(`AI_E2E_BODY_PREFIX ${prefix}`);

  if (res.status !== expectedStatus) {
    throw new Error(`Unexpected status ${res.status}. Expected ${expectedStatus}.`);
  }
}

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  AI E2E Smoke Test (user metadata + Edge Function)        ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log(`User: ${TEST_EMAIL}`);
  console.log(`Project: ${SUPABASE_URL}`);

  console.log("\n[1/3] Enable AI + consent (expect 200)...");
  await signInGetJwt();
  await updateMyMetadata({ ai_consent: true, is_ai_enabled: true });
  const jwt200 = await signInGetJwt();
  await callAi(jwt200, 200);

  console.log("\n[2/3] Disable AI (expect 403)...");
  await updateMyMetadata({ is_ai_enabled: false });
  const jwt403 = await signInGetJwt();
  await callAi(jwt403, 403);

  console.log("\n[3/3] Re-enable AI (expect 200)...");
  await updateMyMetadata({ is_ai_enabled: true });
  const jwt200b = await signInGetJwt();
  await callAi(jwt200b, 200);

  console.log("\n✅ AI_E2E_SMOKE_PASS");
}

main().catch((e) => {
  console.error(`\n❌ AI_E2E_SMOKE_FAIL: ${e.message}`);
  process.exit(1);
});
