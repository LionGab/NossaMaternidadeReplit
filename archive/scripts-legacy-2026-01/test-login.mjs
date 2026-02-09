/**
 * Script para testar login com credenciais admin
 * Email: admin@admin.com
 * Senha: admin123
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

const SUPABASE_URL = getEnvValue("EXPO_PUBLIC_SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = getEnvValue("EXPO_PUBLIC_SUPABASE_ANON_KEY") || "";

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin123";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  console.error("   Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin() {
  console.log("🔐 Testando login admin...\n");
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Senha: ${ADMIN_PASSWORD}\n`);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (error) {
      console.error("❌ Erro no login:", error.message);

      if (error.message.includes("Invalid login credentials")) {
        console.log("\n💡 Usuário não existe ou senha incorreta.");
        console.log("   Execute primeiro: node scripts/create-admin-user.mjs");
      }

      process.exit(1);
    }

    if (data?.user && data?.session) {
      console.log("✅ Login realizado com sucesso!\n");
      console.log(`   ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Nome: ${data.user.user_metadata?.name || "N/A"}`);
      console.log(`   Email confirmado: ${data.user.email_confirmed_at ? "Sim ✅" : "Não ⚠️"}`);
      console.log(`   Token: ${data.session.access_token.substring(0, 30)}...`);
      console.log(`   Expira em: ${data.session.expires_in}s`);

      if (!data.user.email_confirmed_at) {
        console.log("\n⚠️  ATENÇÃO: Email não confirmado.");
        console.log("   Para confirmar no Dashboard:");
        console.log(
          `   ${SUPABASE_URL.replace("/rest/v1", "")}/dashboard/project/${SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1]}/auth/users`
        );
        console.log(`   Encontre o usuário ${ADMIN_EMAIL} e marque como confirmado.\n`);
      }

      return { success: true, user: data.user, session: data.session };
    }

    console.error("❌ Login falhou: dados não retornados");
    process.exit(1);
  } catch (error) {
    console.error("❌ Erro fatal:", error.message);
    process.exit(1);
  }
}

testLogin()
  .then((result) => {
    if (result?.success) {
      console.log("\n✅ Teste de login concluído com sucesso!\n");
    }
  })
  .catch((error) => {
    console.error("\n❌ Erro:", error);
    process.exit(1);
  });
