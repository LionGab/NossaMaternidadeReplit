# TestFlight Gates v1

> Nossa Maternidade — Release Framework para iOS TestFlight
> Versao: 1.0.0 | Data: 2026-01-05

## Objetivo

Este documento define os **gates de qualidade** que devem ser executados e aprovados antes de qualquer build ser enviado para TestFlight (iOS) ou Play Console Internal Track (Android).

---

## Sequencia de Gates

```
G-1 (Secrets) -> G0 (Diagnose) -> G1 (Quality) -> G2 (Auth) -> G3 (RLS) -> G4 (RevenueCat) -> G5 (NathIA) -> G6 (Build) -> G7 (Submit)
```

Cada gate deve passar (PASS) antes de prosseguir para o proximo.

---

## Regras Globais (Obrigatórias)

- Responder/operar sempre em pt-BR; comunicação objetiva.
- TypeScript strict: proibido `any`.
- Proibido `@ts-ignore` / `@ts-expect-error` sem justificativa explícita.
- Proibido `console.*` em `src/**`. Substituir por `logger.*`.
- Sem dependências novas (salvo justificativa técnica forte).
- Padrão de arquitetura: services + hooks + components.
- Respeitar Design System (tokens/theme/dark mode).
- Acessibilidade: WCAG AAA por padrão.
- **Atomic commits**: 1 tema por commit, com racional técnico.

### Evidência (obrigatória para declarar PASS)

Para cada Gate:

- Colar output dos comandos (ou link para log)
- Listar correções com **arquivo:linha**
- Confirmar cenário testado (device real / sandbox etc.)
- Marcar no painel `docs/release/GATES.md`

---

## Checklist por Gate

### G-1 — Secrets Scan

| Check           | Comando                     | Criterio           |
| --------------- | --------------------------- | ------------------ |
| Scan de secrets | `rg` com patterns sensíveis | 0 secrets expostos |

**Bloqueante**: Sim

---

### G0 — Diagnose (Ambiente)

| Check              | Comando                       | Criterio |
| ------------------ | ----------------------------- | -------- |
| TypeScript compila | `npm run typecheck`           | 0 errors |
| Lint passa         | `npm run lint`                | 0 errors |
| Build ready        | `npm run diagnose:production` | ALL PASS |

**Bloqueante**: Sim

---

### G1 — Quality Gate

| Check                 | Comando                    | Criterio  |
| --------------------- | -------------------------- | --------- |
| Quality Gate completo | `npm run quality-gate`     | 0 errors  |
| Quality Gate Windows  | `npm run quality-gate:win` | 0 errors  |
| Nenhum console.log    | scan automatico            | 0 matches |

**Bloqueante**: Sim

---

### G2 — Auth (Autenticacao)

| Check             | Metodo     | Criterio             |
| ----------------- | ---------- | -------------------- |
| Login Email/Senha | Manual/E2E | Funcional            |
| Login Google      | Manual/E2E | Funcional            |
| Login Apple       | Manual/E2E | Funcional (iOS only) |
| Logout            | Manual/E2E | Limpa sessao         |
| Refresh Token     | Automatico | Renova sem erro      |

**Bloqueante**: Sim

**Pré-requisitos**:

- iOS Bundle ID correto: `br.com.nossamaternidade.app`
- Redirect URIs coerentes (Google + Supabase)
- Apple capability habilitada no bundle (Sign In with Apple)
- `expo-auth-session` e `expo-apple-authentication` configurados

---

### G3 — RLS (Row Level Security)

| Check                    | Metodo                 | Criterio      |
| ------------------------ | ---------------------- | ------------- |
| Todas as tabelas com RLS | `supabase/migrations/` | 100% coverage |
| Policies documentadas    | Review manual          | Existem       |
| Teste de acesso cruzado  | Manual                 | Bloqueado     |

**Bloqueante**: Sim

**Verificação SQL**:

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

**Tabelas críticas**:

- `profiles`, `user_onboarding`
- `community_posts`, `community_comments`, `post_likes`
- `cycle_settings`, `daily_logs`, `habits`
- `chat_messages`, `chat_conversations`

---

### G4 — RevenueCat (Monetizacao)

| Check                     | Metodo                 | Criterio                 |
| ------------------------- | ---------------------- | ------------------------ |
| Produtos configurados     | RevenueCat Dashboard   | `premium` offering ativo |
| Sandbox iOS funcional     | TestFlight             | Compra completa          |
| Sandbox Android funcional | Internal Track         | Compra completa          |
| Webhook configurado       | Supabase Edge Function | Recebe eventos           |

**Bloqueante**: Sim (para monetizacao)

**Produtos**:

- `nossa_maternidade_monthly`
- `nossa_maternidade_yearly`
- Entitlement: `premium`
- Offering: `default`

---

### G5 — NathIA (Assistente IA)

| Check                   | Metodo        | Criterio               |
| ----------------------- | ------------- | ---------------------- |
| Pre-classifier ativo    | Edge Function | Filtra input           |
| Fallback chain funciona | Teste manual  | Responde sempre        |
| Guardrails medicos      | Teste manual  | Disclaimers presentes  |
| Rate limiting           | Teste manual  | Bloqueia apos limite   |
| Consent antes do uso    | Manual        | AIConsentModal aparece |

**Bloqueante**: Sim (se AI features habilitadas)

---

### G6 — Build (EAS)

| Check             | Comando                      | Criterio                |
| ----------------- | ---------------------------- | ----------------------- |
| Build iOS         | `npm run build:prod:ios`     | SUCCESS                 |
| Build Android     | `npm run build:prod:android` | SUCCESS                 |
| Artefatos gerados | EAS Dashboard                | .ipa + .aab disponiveis |

**Bloqueante**: Sim

---

### G7 — Submit (Lojas)

| Check             | Comando/Acao                     | Criterio                 |
| ----------------- | -------------------------------- | ------------------------ |
| Submit iOS        | `npm run submit:prod:ios`        | Uploaded to TestFlight   |
| Submit Android    | `npm run submit:prod:android`    | Uploaded to Play Console |
| Metadata completa | App Store Connect / Play Console | Review aprovado          |

**Bloqueante**: Sim

---

## Matriz de Responsabilidades

| Gate  | Owner         | Reviewer      |
| ----- | ------------- | ------------- |
| G-1   | Security      | Dev Lead      |
| G0-G1 | CI/Automacao  | Dev Lead      |
| G2    | Backend Lead  | QA            |
| G3    | Backend Lead  | Security      |
| G4    | Product Owner | Dev Lead      |
| G5    | AI Lead       | Product Owner |
| G6-G7 | Release Lead  | Dev Lead      |

---

## Fluxo de Aprovacao

```
1. Dev cria branch feature/fix
2. PR passa CI (G0 + G1 automaticos)
3. Code Review aprovado
4. Merge para main
5. Release Lead executa G2-G5 (manuais ou E2E)
6. Todos gates PASS -> G6 (Build)
7. Build SUCCESS -> G7 (Submit)
8. TestFlight/Internal Track disponivel para testers
```

---

## Rollback

Se qualquer gate falhar apos submit:

1. **NAO aprovar** o build para External Testing / Production
2. Criar issue com logs do gate que falhou
3. Fix no codigo -> novo ciclo completo de gates
4. Novo build com versao incrementada

---

## Versionamento

| Campo                   | Regra                                    |
| ----------------------- | ---------------------------------------- |
| `version`               | Semantic (1.0.0, 1.1.0, 2.0.0)           |
| `buildNumber` (iOS)     | Sequencial via EAS (autoIncrement: true) |
| `versionCode` (Android) | Sequencial via EAS (autoIncrement: true) |

**IMPORTANTE**: Nunca decrementar build numbers. Lojas rejeitam.

---

## Checklist Final Pre-TestFlight (DoD)

- [ ] G-1 PASS (secrets scan)
- [ ] G0 PASS (`npm run diagnose:production`)
- [ ] G1 PASS (`npm run quality-gate` ou `quality-gate:win`)
- [ ] G2 PASS (3 providers + logout no iOS real device)
- [ ] G3 PASS (zero permission denied)
- [ ] G4 PASS (purchase + restore)
- [ ] G5 PASS (consent + chat + fallback)
- [ ] G6 PASS (EAS build completa)
- [ ] G7 PASS (TestFlight disponível)

---

## Referencias

- [GATES.md](./GATES.md) — Scoreboard principal
- [eas.json](../../eas.json) — Perfis de build
- [app.config.js](../../app.config.js) — Configuracao Expo
- [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) — Checklist geral

---

## Configuração Oficial

- **Bundle ID (iOS):** `br.com.nossamaternidade.app`
- **Package (Android):** `com.liongab.nossamaternidade`
- **Comando Gate (Windows):** `npm run quality-gate:win`

---

## Historico

| Versao | Data       | Mudancas                                 |
| ------ | ---------- | ---------------------------------------- |
| v1.0.0 | 2026-01-05 | Documento inicial com 9 gates (G-1 → G7) |
