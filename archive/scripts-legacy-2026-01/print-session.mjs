#!/usr/bin/env node
/**
 * Script para obter USER_JWT (access token) para testes
 *
 * Usage:
 *   node scripts/print-session.mjs
 *   OU
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... TEST_EMAIL=... TEST_PASSWORD=... node scripts/print-session.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para ler variáveis de ambiente do .env.local
function getEnvValue(varName) {
  if (process.env[varName]) {
    return process.env[varName];
  }

  try {
    const envPath = join(__dirname, "..", ".env.local");
    const envContent = readFileSync(envPath, "utf8");
    const match = envContent.match(new RegExp(`^${varName}=(.*)$`, "m"));
    return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
  } catch (error) {
    return null;
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || getEnvValue("EXPO_PUBLIC_SUPABASE_URL") || "";

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || getEnvValue("EXPO_PUBLIC_SUPABASE_ANON_KEY") || "";

const TEST_EMAIL = process.env.TEST_EMAIL || "admin@admin.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "admin123";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  console.error("   Configure SUPABASE_URL e SUPABASE_ANON_KEY");
  console.error(
    "   OU configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getAccessToken() {
  console.log("🔐 Fazendo login para obter USER_JWT...\n");
  console.log(`   Email: ${TEST_EMAIL}`);
  console.log(`   URL: ${SUPABASE_URL}\n`);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (error) {
      console.error("❌ Erro no login:", error.message);

      if (error.message.includes("Invalid login credentials")) {
        console.log("\n💡 Usuário não existe ou senha incorreta.");
        console.log("   Execute primeiro: npm run create:admin");
        console.log("   OU configure TEST_EMAIL e TEST_PASSWORD com credenciais válidas");
      }

      process.exit(1);
    }

    if (data?.session?.access_token) {
      const session = data.session;

      console.log("✅ Login realizado com sucesso!\n");
      console.log("📋 Informações da sessão:");
      console.log(`   User ID: ${session.user.id}`);
      console.log(`   Email: ${session.user.email}`);
      console.log(`   Expira em: ${session.expires_in}s\n`);

      console.log("🔑 USER_JWT (copie este valor):");
      console.log("─".repeat(60));
      console.log(session.access_token);
      console.log("─".repeat(60));

      console.log("\n💡 Para usar no teste:");
      console.log(`   $env:USER_JWT="${session.access_token}"`);
      console.log(`   npm run test:ai:consent`);

      console.log("\n💡 Para configurar consentimento (precisa SERVICE_ROLE_KEY):");
      console.log(`   $env:USER_ID="${session.user.id}"`);
      console.log(`   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..." # Obtenha no Dashboard`);
      console.log(`   npm run test:ai:set-metadata accepted true`);

      // Retornar também em formato JSON para facilitar automação
      return {
        access_token: session.access_token,
        user_id: session.user.id,
        expires_in: session.expires_in,
      };
    }

    console.error("❌ Login falhou: access_token não retornado");
    process.exit(1);
  } catch (error) {
    console.error("❌ Erro fatal:", error.message);
    process.exit(1);
  }
}

getAccessToken()
  .then((result) => {
    if (result) {
      console.log("\n✅ Token obtido com sucesso!");
    }
  })
  .catch((error) => {
    console.error("\n❌ Erro:", error);
    process.exit(1);
  });
