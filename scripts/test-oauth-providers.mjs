#!/usr/bin/env node
/**
 * Teste de configuração OAuth (Gate G2) - Nossa Maternidade
 *
 * Verifica se Google e Apple estão habilitados no Supabase Auth.
 * Usa GET /auth/v1/settings (anon key) para ler a configuração.
 *
 * Uso:
 *   npm run test:oauth
 *   node scripts/test-oauth-providers.mjs
 *
 * Variáveis (opcional): EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
 * Se não definidas, usa .env.local ou URL/anon do projeto conhecido.
 */

import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const PROJECT_REF = "lqahkqfpynypbmhtffyi";
const DEFAULT_URL = `https://${PROJECT_REF}.supabase.co`;
// Anon key pública (igual test-ai-edge-function.mjs) – fallback quando .env.local não existe
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYWhrcWZweW55cGJtaHRmZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzcyMTQsImV4cCI6MjA4MTE1MzIxNH0.NBDr1-eUGnOeQIYnWOwxTBZwCzA7E7M_V88iRndajYc";

function loadEnvLocal() {
  const path = join(rootDir, ".env.local");
  if (!existsSync(path)) return {};
  const raw = readFileSync(path, "utf8");
  const out = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1);
      out[key] = val;
    }
  }
  return out;
}

function getSupabaseConfig() {
  const env = { ...process.env, ...loadEnvLocal() };
  const url = env.EXPO_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const anonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;
  return { url, anonKey };
}

function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, value: null };
  }
}

async function fetchAuthSettings(baseUrl, anonKey) {
  const url = `${baseUrl.replace(/\/$/, "")}/auth/v1/settings`;
  const headers = {
    apikey: anonKey,
    "Content-Type": "application/json",
  };
  const res = await fetch(url, { method: "GET", headers });
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`GET /auth/v1/settings falhou (${res.status}): ${raw}`);
  }
  const parsed = safeJsonParse(raw);
  if (!parsed.ok) throw new Error(`Resposta inválida: ${raw}`);
  return parsed.value;
}

function isProviderEnabled(settings, provider) {
  const key = `external_${provider}_enabled`;
  if (typeof settings[key] === "boolean") return settings[key];
  const ext = settings.external;
  if (ext && typeof ext[provider] === "object" && ext[provider].enabled === true) return true;
  if (ext && typeof ext[provider] === "boolean") return ext[provider];
  return false;
}

async function main() {
  const { url, anonKey } = getSupabaseConfig();

  if (!anonKey) {
    console.error("❌ EXPO_PUBLIC_SUPABASE_ANON_KEY não definida e fallback indisponível.");
    console.log("\n💡 Defina em .env.local ou:");
    console.log("   EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx node scripts/test-oauth-providers.mjs");
    console.log(
      "\n   Chave anon: https://supabase.com/dashboard/project/" + PROJECT_REF + "/settings/api"
    );
    process.exit(1);
  }

  console.log("🔍 Verificando providers OAuth no Supabase Auth...\n");
  console.log(`   Projeto: ${PROJECT_REF}`);
  console.log(`   URL: ${url}\n`);

  try {
    const settings = await fetchAuthSettings(url, anonKey);
    const google = isProviderEnabled(settings, "google");
    const apple = isProviderEnabled(settings, "apple");

    if (google) console.log("✅ Google: configurado e habilitado");
    else console.log("❌ Google: não habilitado ou não configurado");

    if (apple) console.log("✅ Apple: configurado e habilitado");
    else console.log("❌ Apple: não habilitado ou não configurado");

    if (google && apple) {
      console.log("\n✅ Gate G2 (OAuth): passou. Ambos os providers estão ativos.");
      process.exit(0);
    }

    console.log("\n💡 Habilitar providers:");
    console.log("   https://supabase.com/dashboard/project/" + PROJECT_REF + "/auth/providers");
    process.exit(1);
  } catch (err) {
    console.error("❌ Erro:", err.message);
    if (err.message.includes("401") || err.message.includes("403")) {
      console.log("\n💡 Verifique se EXPO_PUBLIC_SUPABASE_ANON_KEY está correta em .env.local");
    }
    process.exit(1);
  }
}

main();
