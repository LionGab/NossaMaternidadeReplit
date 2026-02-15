#!/usr/bin/env node
/**
 * Teste de Edge Function /ai do Supabase
 *
 * Testa se a NathIA está respondendo corretamente.
 *
 * Uso:
 *   node scripts/test-ai-edge-function.mjs
 */

import { createClient } from "@supabase/supabase-js";

// Credenciais do projeto (públicas - podem ser expostas)
const SUPABASE_URL = "https://lqahkqfpynypbmhtffyi.supabase.co";
const SUPABASE_ANON_KEY = "***REMOVED***"; // Anon key pública

const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

console.log("🧪 Testando Edge Function /ai da NathIA\n");
console.log(`   URL: ${FUNCTIONS_URL}/ai`);
console.log(`   Projeto: lqahkqfpynypbmhtffyi\n`);

async function testAIEdgeFunction() {
  // 1. Criar cliente Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 2. Fazer login de teste (criar usuário temporário ou usar existente)
  console.log("🔐 Autenticando usuário de teste...\n");

  const testEmail = `ai-test-${Date.now()}@test.com`;
  const testPassword = "TestPassword123!";

  // Tentar criar usuário de teste com AI consent
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: "AI Test User",
        onboarding_completed: true,
        ai_consent: true, // Consentimento de IA
        is_ai_enabled: true, // IA habilitada
      },
    },
  });

  if (signUpError && !signUpError.message.includes("already registered")) {
    console.error("❌ Erro ao criar usuário de teste:", signUpError.message);

    // Tentar login com usuário existente conhecido
    console.log("⚠️  Tentando login com usuário padrão...\n");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: "test@test.com",
      password: "test123456",
    });

    if (signInError) {
      console.error("❌ Não foi possível autenticar:", signInError.message);
      console.log("\n💡 Para testar a Edge Function, você precisa:");
      console.log("   1. Criar um usuário de teste no app");
      console.log("   2. Ou configurar credenciais de teste neste script\n");
      process.exit(1);
    }

    console.log("✅ Login bem-sucedido!\n");
  } else {
    console.log("✅ Usuário de teste criado!\n");
  }

  // 3. Pegar JWT token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.access_token) {
    console.error("❌ Não foi possível obter sessão/token");
    process.exit(1);
  }

  const jwt = session.access_token;
  console.log(`🔑 JWT Token obtido: ${jwt.substring(0, 20)}...\n`);

  // 4. Chamar Edge Function /ai
  console.log("🧠 Enviando mensagem de teste para NathIA...\n");

  // Primeiro teste: forçar Gemini específico (sem fallback)
  const testMessage = {
    messages: [
      {
        role: "user",
        content: 'Olá NathIA! Responda apenas "OK funcionando" para confirmar que está ativa.',
      },
    ],
    provider: "gemini", // Forçar Gemini
    grounding: false,
    stream: false, // Desabilitar streaming para simplificar
  };

  try {
    const response = await fetch(`${FUNCTIONS_URL}/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(testMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Edge Function retornou erro (${response.status}):`, errorText);

      if (response.status === 401) {
        console.log("\n💡 Erro de autenticação. JWT inválido ou expirado.");
      } else if (response.status === 429) {
        console.log("\n💡 Rate limit atingido. Aguarde alguns minutos.");
      } else if (response.status === 500) {
        console.log("\n💡 Erro interno do servidor. Possíveis causas:");
        console.log("   - GEMINI_API_KEY não configurada nos Supabase Secrets");
        console.log("   - Edge Function com erro de runtime");
        console.log("   - Rate limit do Gemini API excedido");
      }

      process.exit(1);
    }

    const data = await response.json();

    console.log("✅ Resposta recebida da NathIA!\n");
    console.log("📝 Resposta:", JSON.stringify(data, null, 2));
    console.log("\n✅ Edge Function /ai está funcional!\n");

    // Verificar estrutura da resposta
    if (data.response && typeof data.response === "string") {
      console.log("✅ Response field OK");
    } else {
      console.warn("⚠️  Response field inválido ou ausente");
    }

    if (data.provider) {
      console.log(`✅ Provider usado: ${data.provider}`);
    }

    console.log("\n🎉 Teste concluído com sucesso!");
    console.log("\n💡 Próximos passos:");
    console.log("   1. Validar no app (enviar mensagem pelo chat)");
    console.log("   2. Testar com imagem (Claude Vision)");
    console.log("   3. Testar grounding (Gemini + Google Search)\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao chamar Edge Function:", err.message);

    if (err.message.includes("fetch")) {
      console.log("\n💡 Verifique sua conexão com a internet");
    }

    process.exit(1);
  }
}

// Executar teste
testAIEdgeFunction();
