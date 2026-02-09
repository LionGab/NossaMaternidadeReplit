# Checklist de Lançamento – O que falta para 100%?

**Data**: 29 de dezembro de 2025
**Autor**: Manus AI

Este documento consolida todas as pendências críticas e de alta prioridade que precisam ser resolvidas para que o aplicativo **Nossa Maternidade** esteja 100% funcional e pronto para o lançamento.

---

## 🔴 Nível 1: Crítico (Impede o Lançamento)

| #   | Item                                | Status          | Ação Necessária                                                                                                                                                                                     |
| --- | ----------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Credenciais de Build (Android)**  | ❌ **Pendente** | Adicionar o arquivo `google-play-service-account.json` na raiz do projeto. Sem ele, o RevenueCat não valida as compras e o build para a Play Store pode falhar.                                     |
| 2   | **Credenciais de Build (iOS)**      | ❌ **Pendente** | Adicionar o arquivo `ApiKey_E7IV510UXU7D.p8` (App Store Connect API Key) na raiz do projeto. Essencial para o EAS Build de produção.                                                                |
| 3   | **Produtos na App Store Connect**   | ❌ **Pendente** | Criar os produtos `nossa_maternidade_monthly` (R$ 19,99) e `nossa_maternidade_yearly` (R$ 79,99) no App Store Connect. Atualmente, o RevenueCat reporta "Missing Metadata" porque eles não existem. |
| 4   | **Produtos no Google Play Console** | ❌ **Pendente** | Criar os produtos `premium_monthly` (R$ 19,99) e `premium_yearly` (R$ 79,99) no Google Play Console. O RevenueCat não consegue verificá-los devido à falta do `service-account.json`.               |
| 5   | **Secret do Webhook (Supabase)**    | ❌ **Pendente** | Configurar a variável de ambiente `REVENUECAT_WEBHOOK_SECRET` nas Edge Functions do Supabase. Sem isso, a comunicação entre RevenueCat e Supabase falhará.                                          |

---

## 🟡 Nível 2: Alta Prioridade (Funcionalidades Principais)

| #   | Item                                 | Status            | Ação Necessária                                                                                                                                                                                                                                                                                     |
| --- | ------------------------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6   | **API Keys para IA (Supabase)**      | ❌ **Pendente**   | Configurar as variáveis `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, e `GEMINI_API_KEY` nas Edge Functions do Supabase para habilitar as funcionalidades de IA (NathIA).                                                                                                                                  |
| 7   | **API Key da ElevenLabs (Supabase)** | ❌ **Pendente**   | Configurar a variável `ELEVENLABS_API_KEY` nas Edge Functions do Supabase para habilitar a funcionalidade de Text-to-Speech (Voz da NathIA).                                                                                                                                                        |
| 8   | **Variáveis de Ambiente no App**     | ⚠️ **Incompleto** | O arquivo `.env.local` não possui valores para `EXPO_PUBLIC_IMGUR_CLIENT_ID`, `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, e `EXPO_PUBLIC_ONESIGNAL_APP_ID`. Preencher para habilitar upload de imagens, error tracking, pagamentos diretos (se aplicável) e push notifications. |

---

## 🟢 Nível 3: Opcional / Melhorias

| #   | Item                         | Status              | Ação Necessária                                                                                                                                                                           |
| --- | ---------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9   | **Rate Limiting (IA)**       | ⚠️ **Opcional**     | Configurar as variáveis `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` para habilitar o controle de uso (rate limiting) das funções de IA, prevenindo abusos e custos inesperados. |
| 10  | **Disponibilidade (Países)** | ⏳ **A Configurar** | A disponibilidade do app está configurada para o Brasil. É preciso adicionar os outros países desejados diretamente no App Store Connect e Google Play Console antes do lançamento.       |

---

## Resumo das Ações Imediatas

1.  **Obter e adicionar os 3 arquivos de credenciais**: `google-play-service-account.json`, `ApiKey_E7IV510UXU7D.p8`.
2.  **Configurar os produtos** nas duas lojas (Apple e Google).
3.  **Configurar as variáveis de ambiente** no Supabase Dashboard, especialmente o `REVENUECAT_WEBHOOK_SECRET` e as chaves de IA.

Após a conclusão desses itens, o aplicativo estará 100% funcional e pronto para os testes finais e o lançamento.
