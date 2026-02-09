# Release Gates

> Nossa Maternidade — TestFlight Release Framework

---

## Overview

Release gates são checkpoints de qualidade que devem passar antes de qualquer build ser enviado para TestFlight (iOS) ou Play Console (Android).

```
G-1 (Secrets) → G0 (Diagnose) → G1 (Quality) → G2 (Auth) → G3 (RLS) → G4 (RevenueCat) → G5 (NathIA) → G6 (Build) → G7 (Submit)
```

---

## Gate Summary

| Gate | Nome         | Comando                       | Bloqueante |
| ---- | ------------ | ----------------------------- | ---------- |
| G-1  | Secrets Scan | Manual (rg)                   | Sim        |
| G0   | Diagnose     | `npm run diagnose:production` | Sim        |
| G1   | Quality Gate | `npm run quality-gate`        | Sim        |
| G2   | Auth         | `npm run test:oauth`          | Sim        |
| G3   | RLS          | `npm run verify-backend`      | Sim        |
| G4   | RevenueCat   | Manual                        | Sim        |
| G5   | NathIA       | `npm run test:gemini`         | Sim        |
| G6   | Build        | `npm run build:prod:ios`      | Sim        |
| G7   | Submit       | `npm run submit:prod:ios`     | Sim        |

---

## G-1: Secrets Scan

### Objetivo

Garantir que nenhum secret seja exposto no código.

### Comando

```bash
# Scan manual com ripgrep
rg -i "(api_key|secret|password|token|credential)" --type ts --type tsx
rg "sk-|appl_|goog_|eyJ" --type ts --type tsx
```

### Critérios

- 0 secrets expostos no código
- `.env*` no `.gitignore`
- EAS secrets configurados

### Evidência

- Output do scan
- Screenshot do EAS secrets dashboard

---

## G0: Diagnose (Ambiente)

### Objetivo

Verificar que o ambiente está pronto para build.

### Comando

```bash
npm run diagnose:production
# ou Windows
npm run diagnose:production:win
```

### Checks

| Check       | Critério |
| ----------- | -------- |
| TypeScript  | 0 errors |
| ESLint      | 0 errors |
| Build ready | ALL PASS |

### Evidência

- Output completo do comando

---

## G1: Quality Gate

### Objetivo

Validação completa de qualidade do código.

### Comando

```bash
npm run quality-gate
# ou Windows
npm run quality-gate:win
```

### Checks

| Check                       | Critério  |
| --------------------------- | --------- |
| TypeScript (`tsc --noEmit`) | 0 errors  |
| ESLint                      | 0 errors  |
| Build check                 | SUCCESS   |
| Console.log scan            | 0 matches |

### Evidência

- Output completo do comando
- Todos os checks em verde

---

## G2: Auth (Autenticação)

### Objetivo

Verificar que todos os providers de auth funcionam.

### Comando

```bash
npm run test:oauth
```

### Checks (Manual ou E2E)

| Provider      | Método       | Critério        |
| ------------- | ------------ | --------------- |
| Email/Senha   | Manual       | Login funcional |
| Google        | Manual       | Login funcional |
| Apple         | Manual (iOS) | Login funcional |
| Logout        | Manual       | Limpa sessão    |
| Refresh Token | Automático   | Renova sem erro |

### Pré-requisitos

- iOS Bundle ID: `br.com.nossamaternidade.app`
- Redirect URIs configurados (Google + Supabase)
- Apple capability habilitada (Sign In with Apple)
- `expo-auth-session` e `expo-apple-authentication` configurados

### Evidência

- Screenshot de cada login bem-sucedido
- Logs de console mostrando token refresh

---

## G3: RLS (Row Level Security)

### Objetivo

Garantir que RLS está habilitado em todas as tabelas.

### Comando

```bash
npm run verify-backend
```

### Verificação SQL

```sql
-- Verificar RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Verificar policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public';
```

### Tabelas Críticas

- `profiles`
- `user_onboarding`
- `community_posts`
- `community_comments`
- `post_likes`
- `chat_conversations`
- `chat_messages`
- `cycle_settings`
- `daily_logs`
- `habits`

### Teste de Acesso Cruzado

1. Criar 2 usuários de teste
2. User A tenta ler dados de User B
3. Deve retornar vazio (não erro)

### Evidência

- Output do verify-backend
- Screenshot do SQL query mostrando RLS = true

---

## G4: RevenueCat (Monetização)

### Objetivo

Verificar que IAP está configurado e funcional.

### Checks (Manual)

| Check                 | Método         | Critério                 |
| --------------------- | -------------- | ------------------------ |
| Produtos configurados | Dashboard      | `premium` offering ativo |
| Sandbox iOS           | TestFlight     | Compra completa          |
| Sandbox Android       | Internal Track | Compra completa          |
| Webhook               | Edge Function  | Recebe eventos           |

### Produtos

- `nossa_maternidade_monthly`
- `nossa_maternidade_yearly`

### Entitlement

- `premium`

### Offering

- `default`

### Evidência

- Screenshot do RevenueCat dashboard
- Log de compra sandbox
- Log do webhook recebendo evento

---

## G5: NathIA (Assistente IA)

### Objetivo

Verificar que o chat AI está funcional.

### Comando

```bash
npm run test:gemini
```

### Checks

| Check              | Método        | Critério              |
| ------------------ | ------------- | --------------------- |
| Gemini API key     | Script        | Válida                |
| Pre-classifier     | Edge Function | Filtra input          |
| Resposta           | Manual        | Responde sempre       |
| Guardrails médicos | Manual        | Disclaimers presentes |
| Rate limiting      | Manual        | Bloqueia após limite  |

### Teste Manual

1. Enviar mensagem "Olá"
2. Verificar resposta
3. Enviar 6 mensagens (free tier limit)
4. 7ª mensagem deve mostrar paywall

### Evidência

- Output do test:gemini
- Screenshot do chat funcionando
- Screenshot do rate limit

---

## G6: Build (EAS)

### Objetivo

Build de produção bem-sucedido.

### Comando

```bash
# iOS
npm run build:prod:ios
# ou Windows
npm run build:prod:ios:win

# Android
npm run build:prod:android
# ou Windows
npm run build:prod:android:win
```

### Checks

| Check         | Critério                |
| ------------- | ----------------------- |
| Quality gate  | Passa antes do build    |
| Build iOS     | SUCCESS                 |
| Build Android | SUCCESS                 |
| Artefatos     | .ipa + .aab disponíveis |

### Evidência

- Link do EAS build
- Screenshot do build SUCCESS
- Artefatos disponíveis para download

---

## G7: Submit (Lojas)

### Objetivo

Submeter build para review das lojas.

### Comando

```bash
# iOS
npm run submit:prod:ios

# Android
npm run submit:prod:android
```

### Checks

| Check          | Critério                 |
| -------------- | ------------------------ |
| Submit iOS     | Uploaded to TestFlight   |
| Submit Android | Uploaded to Play Console |
| Metadata       | Completa                 |

### Evidência

- Screenshot do App Store Connect
- Screenshot do Play Console
- Status "Waiting for Review"

---

## Fluxo de Aprovação

```
1. Dev cria branch feature/fix
2. PR passa CI (G0 + G1 automáticos)
3. Code Review aprovado
4. Merge para main
5. Release Lead executa G2-G5 (manuais)
6. Todos gates PASS → G6 (Build)
7. Build SUCCESS → G7 (Submit)
8. TestFlight disponível para testers
```

---

## Checklist Final

```markdown
- [ ] G-1 PASS (secrets scan limpo)
- [ ] G0 PASS (`npm run diagnose:production`)
- [ ] G1 PASS (`npm run quality-gate`)
- [ ] G2 PASS (3 providers + logout)
- [ ] G3 PASS (RLS 100%)
- [ ] G4 PASS (purchase + restore)
- [ ] G5 PASS (chat + fallback)
- [ ] G6 PASS (build SUCCESS)
- [ ] G7 PASS (TestFlight disponível)
```

---

## Rollback

Se qualquer gate falhar após submit:

1. **NÃO aprovar** o build para External Testing / Production
2. Criar issue com logs do gate que falhou
3. Fix no código → novo ciclo completo de gates
4. Novo build com versão incrementada

---

## Versionamento

| Campo                   | Regra                              |
| ----------------------- | ---------------------------------- |
| `version`               | Semantic (1.0.0, 1.1.0)            |
| `buildNumber` (iOS)     | Sequencial via EAS (autoIncrement) |
| `versionCode` (Android) | Sequencial via EAS (autoIncrement) |

**IMPORTANTE**: Nunca decrementar build numbers. Lojas rejeitam.

---

## Responsabilidades

| Gate  | Owner         | Reviewer      |
| ----- | ------------- | ------------- |
| G-1   | Security      | Dev Lead      |
| G0-G1 | CI/Automação  | Dev Lead      |
| G2    | Backend Lead  | QA            |
| G3    | Backend Lead  | Security      |
| G4    | Product Owner | Dev Lead      |
| G5    | AI Lead       | Product Owner |
| G6-G7 | Release Lead  | Dev Lead      |
