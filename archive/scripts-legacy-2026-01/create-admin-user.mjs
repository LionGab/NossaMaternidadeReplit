/**
 * Script para criar/atualizar usuário admin no Supabase
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

// Para criar usuário admin, precisamos da service_role_key
// Mas vamos tentar criar via signUp primeiro
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Admin";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  console.error("   Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createOrUpdateAdmin() {
  console.log("🔐 Criando/Atualizando usuário admin...\n");
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Senha: ${ADMIN_PASSWORD}`);
  console.log(`   Nome: ${ADMIN_NAME}\n`);

  // Primeiro, tentar fazer login para verificar se o usuário existe
  console.log("🔍 Verificando se usuário já existe...");

  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (loginData?.user && !loginError) {
    console.log("✅ Usuário admin já existe e a senha está correta!");
    console.log(`   ID: ${loginData.user.id}`);
    console.log(`   Email confirmado: ${loginData.user.email_confirmed_at ? "Sim" : "Não"}`);
    return { success: true, user: loginData.user, message: "Usuário já existe" };
  }

  // Se não conseguiu fazer login, tentar criar novo usuário
  if (loginError) {
    console.log("⚠️  Login falhou. Tentando criar novo usuário...");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          name: ADMIN_NAME,
        },
        emailRedirectTo: undefined, // Não precisa de confirmação por email
      },
    });

    if (signUpError) {
      // Se o erro é que o usuário já existe, precisamos usar a API Admin
      if (
        signUpError.message.includes("already registered") ||
        signUpError.message.includes("User already registered")
      ) {
        console.log("⚠️  Usuário já existe mas senha pode estar incorreta.");
        console.log("   Para atualizar a senha, use o Supabase Dashboard:");
        console.log(
          `   ${SUPABASE_URL.replace("/rest/v1", "")}/dashboard/project/${SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1]}/auth/users`
        );
        console.log("\n   Ou use a API Admin com service_role_key:");
        console.log(
          "   curl -X PUT 'https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/admin/users/{user_id}' \\"
        );
        console.log("     -H 'apikey: <SERVICE_ROLE_KEY>' \\");
        console.log("     -H 'Authorization: Bearer <SERVICE_ROLE_KEY>' \\");
        console.log("     -H 'Content-Type: application/json' \\");
        console.log(`     -d '{\"password\":\"${ADMIN_PASSWORD}\"}'`);

        return {
          success: false,
          error: "Usuário já existe. Use Dashboard ou API Admin para atualizar senha.",
        };
      }

      console.error("❌ Erro ao criar usuário:", signUpError.message);
      return { success: false, error: signUpError.message };
    }

    if (signUpData?.user) {
      console.log("✅ Usuário admin criado com sucesso!");
      console.log(`   ID: ${signUpData.user.id}`);
      console.log(`   Email: ${signUpData.user.email}`);
      console.log(`   ⚠️  Nota: Email pode precisar ser confirmado no Dashboard`);

      return { success: true, user: signUpData.user, message: "Usuário criado" };
    }
  }

  return { success: false, error: "Erro desconhecido" };
}

// Executar
createOrUpdateAdmin()
  .then((result) => {
    if (result.success) {
      console.log("\n✅ Concluído!");
      console.log("\n💡 Para confirmar o email automaticamente:");
      console.log(
        `   Acesse: ${SUPABASE_URL.replace("/rest/v1", "")}/dashboard/project/${SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1]}/auth/users`
      );
      console.log(`   Encontre o usuário ${ADMIN_EMAIL} e marque como confirmado.\n`);
    } else {
      console.log("\n❌ Falha ao criar/atualizar usuário admin");
      if (result.error) {
        console.log(`   Erro: ${result.error}\n`);
      }
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("\n❌ Erro fatal:", error);
    process.exit(1);
  });
