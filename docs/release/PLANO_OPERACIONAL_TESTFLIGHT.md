# Plano Operacional de Lançamento TestFlight — Nossa Maternidade

**Data de Criação:** 2026-01-05
**Versão:** 1.0.0
**Objetivo:** Lançar no iOS TestFlight seguindo gates G0–G7

---

## 1. Executive Summary

### Estado Atual

- **G0–G1:** ✅ PASS (evidência: `docs/release/GATES.md` linhas 10-12)
  - TypeScript: 0 errors
  - ESLint: 0 errors, 41 warnings (não bloqueantes)
  - Build readiness: ALL PASS
  - Console scan: 0 matches
- **G2–G5:** ⏳ PENDING (requer validação manual)
- **G6–G7:** ⏳ PENDING (aguardando G2–G5)

**Evidência G0–G1:** `docs/release/GATES.md` linhas 88-90 + `CHECKLIST_GATES.md` linhas 5-10

### Top 3 Riscos para TestFlight

1. **RLS incompleto (G3):** Risco de vazamento de dados se tabelas não protegidas
   - **Detecção:** Review manual de migrations + teste de acesso cruzado
   - **Mitigação:** Executar SQL de verificação antes de G6

2. **RevenueCat sandbox não testado (G4):** Compra pode falhar em produção
   - **Detecção:** Teste manual no TestFlight com sandbox account
   - **Mitigação:** Validar compra completa antes de G7

3. **Auth providers não validados (G2):** Apple/Google login pode quebrar em device real
   - **Detecção:** Teste manual em iOS device físico
   - **Mitigação:** Validar todos os 3 providers antes de G6

### Top 3 Prioridades Esta Semana

1. **G2 (Auth):** Validar Email/Google/Apple login em device iOS real (2h)
2. **G3 (RLS):** Review completo de todas as tabelas + teste de acesso cruzado (3h)
3. **G4 (RevenueCat):** Teste sandbox completo (compra + restore + webhook) (2h)

---

## 2. Definição de Done para TestFlight

App está pronto para TestFlight quando:

- ✅ **G0 PASS:** `npm run diagnose:production` retorna exit 0
- ✅ **G1 PASS:** `npm run quality-gate` (ou `quality-gate:win`) retorna exit 0
- ✅ **G2 PASS:** Login funciona com Email, Google e Apple em device iOS real
- ✅ **G3 PASS:** Todas as tabelas têm RLS habilitado + policies documentadas + teste de acesso cruzado bloqueado
- ✅ **G4 PASS:** Compra sandbox completa + restore funciona + webhook recebe eventos
- ✅ **G5 PASS:** NathIA responde + consent modal aparece + fallback funciona
- ✅ **G6 PASS:** Build iOS production completa sem erros
- ✅ **G7 PASS:** Build enviado para TestFlight e disponível para testers

**Critério de bloqueio:** Qualquer gate FAIL bloqueia avanço para o próximo.

---

## 3. Plano por Gates (G0–G7)

### G0 — Diagnose (Ambiente)

**Objetivo:** Validar que ambiente está pronto para build production

**Checklist:**

- [ ] Executar `npm run diagnose:production`
- [ ] Verificar exit code = 0
- [ ] Confirmar que `check-build-ready` passou (eas.json, app.config.js, icons, splash)

**Evidência exigida:**

- Comando: `npm run diagnose:production`
- Output esperado: `SUCCESS: Projeto pronto para build!` (ou equivalente)
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log em `docs/release/LOGS/`)

**Critério PASS/FAIL:**

- **PASS:** Exit 0 + todos os checks verdes
- **FAIL:** Qualquer erro fatal ou check vermelho

**Dono:** Dev Lead
**Status atual:** ✅ PASS (2026-01-05)

---

### G1 — Quality Gate

**Objetivo:** Garantir qualidade de código (TypeScript + ESLint + build check + console scan)

**Checklist:**

- [ ] Executar `npm run quality-gate` (ou `npm run quality-gate:win` no Windows)
- [ ] Verificar TypeScript: 0 errors
- [ ] Verificar ESLint: 0 errors (warnings OK)
- [ ] Verificar build readiness: ALL PASS
- [ ] Verificar console scan: 0 matches (exceto logger.ts)

**Evidência exigida:**

- Comando: `npm run quality-gate:win` (Windows) ou `npm run quality-gate` (Unix)
- Output esperado: `SUCCESS: All quality gates passed! Ready for PR/build.`
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log em `docs/release/LOGS/`)

**Critério PASS/FAIL:**

- **PASS:** Exit 0 + 0 errors em todos os checks
- **FAIL:** Qualquer error em TypeScript, ESLint ou console scan

**Dono:** Dev Lead
**Status atual:** ✅ PASS (2026-01-05)

---

### G2 — Auth (Autenticação)

**Objetivo:** Validar que todos os fluxos de autenticação funcionam em device iOS real

**Checklist:**

- [ ] Build development iOS instalado no device físico
- [ ] Testar login Email/Senha: criar conta + login + logout
- [ ] Testar login Google: fluxo completo + logout
- [ ] Testar login Apple: fluxo completo + logout (iOS only)
- [ ] Verificar refresh token: aguardar expiração + validar renovação automática

**Evidência exigida:**

- Método: Teste manual em device iOS real
- Cenário testado: Device físico (não simulador)
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log/observações)
- Screenshots/vídeo: Opcional, mas recomendado

**Critério PASS/FAIL:**

- **PASS:** Todos os 3 providers funcionam + logout limpa sessão + refresh funciona
- **FAIL:** Qualquer provider falha ou logout não limpa sessão

**Dono:** Backend Lead
**Reviewer:** QA
**Status atual:** ⏳ PENDING

**Pré-requisitos:**

- Bundle ID correto: `br.com.nossamaternidade.app` (evidência: `app.config.js` → `expo.ios.bundleIdentifier`)
- Redirect URIs configurados (Google + Supabase)
- Apple capability habilitada no bundle (Sign In with Apple)

---

### G3 — RLS (Row Level Security)

**Objetivo:** Garantir que todas as tabelas estão protegidas por RLS

**Checklist:**

- [ ] Executar SQL de verificação (ver abaixo)
- [ ] Review manual de todas as migrations em `supabase/migrations/`
- [ ] Teste de acesso cruzado: tentar acessar dados de outro usuário (deve ser bloqueado)
- [ ] Documentar policies existentes

**Evidência exigida:**

- Comando SQL:

```sql
-- Verificar RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

- Output esperado: Todas as tabelas com `rowsecurity = true` + policies documentadas
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log/observações)
- Teste manual: Tentar SELECT/UPDATE/DELETE de dados de outro usuário (deve retornar 0 rows)

**Critério PASS/FAIL:**

- **PASS:** 100% das tabelas com RLS habilitado + policies existem + acesso cruzado bloqueado
- **FAIL:** Qualquer tabela sem RLS ou acesso cruzado permitido

**Dono:** Backend Lead
**Reviewer:** Security
**Status atual:** ⏳ PENDING

**Tabelas críticas (devem ter RLS):**

- `profiles`, `user_onboarding`
- `community_posts`, `community_comments`, `post_likes`
- `cycle_settings`, `daily_logs`, `habits`
- `chat_messages`, `chat_conversations`
- `premium_subscriptions`, `subscription_events`

---

### G4 — RevenueCat (Monetização)

**Objetivo:** Validar que compras sandbox funcionam + webhook recebe eventos

**Checklist:**

- [ ] Verificar RevenueCat Dashboard: entitlement "premium" ativo + offering "default" configurado
- [ ] Confirmar **Product IDs oficiais** (há IDs "atuais" e "legacy" no repo — ver seção abaixo)
- [ ] Verificar App Store Connect: produtos criados com os IDs oficiais
- [ ] Verificar RevenueCat: produtos/ofertas apontando para os mesmos IDs oficiais
- [ ] Build development iOS instalado no device físico
- [ ] Criar sandbox test account no App Store Connect (se não existir)
- [ ] Testar compra mensal: fluxo completo até confirmação
- [ ] Testar restore purchases: logout + login + verificar premium restaurado
- [ ] Verificar webhook: Supabase recebe eventos (INITIAL_PURCHASE, RENEWAL, etc.)

**Evidência exigida:**

- Método: Teste manual em device iOS real com sandbox account
- Cenário testado: Compra completa + restore + webhook logs
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log/observações)
- Webhook logs: `npx supabase functions logs webhook --tail` (deve mostrar eventos)

**Critério PASS/FAIL:**

- **PASS:** Compra completa funciona + restore funciona + webhook recebe eventos
- **FAIL:** Compra falha OU restore não funciona OU webhook não recebe eventos

**Dono:** Product Owner
**Reviewer:** Dev Lead
**Status atual:** ⏳ PENDING

**Produtos esperados:**

- **IDs atuais (no código):** `nossa_maternidade_monthly` e `nossa_maternidade_yearly` (evidência: `src/types/premium.ts` → `PRODUCT_IDS.MONTHLY/YEARLY`)
- **IDs legacy (compat):** `com.nossamaternidade.subscription.monthly` e `com.nossamaternidade.subscription.annual` (evidência: `src/types/premium.ts` → `PRODUCT_IDS.*_LEGACY`)
- Entitlement: `premium` (exato, case-sensitive)
- Offering: `default` (exato, case-sensitive)

**Valores hardcoded (NÃO alterar):**

- Bundle ID: `br.com.nossamaternidade.app` (evidência: `app.config.js` → `expo.ios.bundleIdentifier`)
- Product IDs: `src/types/premium.ts` (evidência: `PRODUCT_IDS`)

---

### G5 — NathIA (Assistente IA)

**Objetivo:** Validar que NathIA funciona com guardrails e fallback

**Checklist:**

- [ ] Verificar pre-classifier: Edge Function `/ai` filtra input (crisis keywords)
- [ ] Testar chat: enviar mensagem + verificar resposta
- [ ] Testar fallback chain: desabilitar Gemini → verificar Claude → verificar GPT-4o
- [ ] Verificar guardrails médicos: disclaimers aparecem quando necessário
- [ ] Verificar rate limiting: enviar 20+ mensagens/min → verificar bloqueio
- [ ] Verificar consent modal: aparece antes do primeiro uso

**Evidência exigida:**

- Método: Teste manual no app
- Cenário testado: Chat funcional + fallback + guardrails + rate limit
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log/observações)
- Edge Function logs: `npx supabase functions logs ai --tail` (deve mostrar pre-classifier)

**Critério PASS/FAIL:**

- **PASS:** Chat responde + fallback funciona + guardrails ativos + rate limit funciona + consent aparece
- **FAIL:** Chat não responde OU fallback não funciona OU guardrails ausentes

**Dono:** AI Lead
**Reviewer:** Product Owner
**Status atual:** ⏳ PENDING

**Arquivos críticos:**

- Edge Function: `supabase/functions/ai/index.ts`
- Pre-classifier: `src/ai/policies/crisis-detection.ts`
- Consent modal: `src/components/chat/AIConsentModal.tsx`

---

### G6 — Build (EAS)

**Objetivo:** Gerar build iOS production sem erros

**Checklist:**

- [ ] Confirmar que G0–G5 estão PASS
- [ ] Executar `npm run build:prod:ios`
- [ ] Aguardar build completar (20-40 minutos)
- [ ] Verificar artefato gerado: .ipa disponível no EAS Dashboard

**Evidência exigida:**

- Comando: `npm run build:prod:ios`
- Output esperado: `Build finished` + link para .ipa
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log/observações)
- EAS Dashboard: Build aparece como "Finished" (não "Failed")

**Critério PASS/FAIL:**

- **PASS:** Build completa sem erros + .ipa disponível
- **FAIL:** Build falha OU .ipa não gerado

**Dono:** Release Lead
**Reviewer:** Dev Lead
**Status atual:** ⏳ PENDING

**Pré-requisitos:**

- G0–G5 PASS
- EAS CLI instalado: `npm install -g eas-cli`
- Logado no EAS: `eas login`
- Credenciais Apple configuradas (`eas.json`)

---

### G7 — Submit (TestFlight)

**Objetivo:** Enviar build para TestFlight e disponibilizar para testers

**Checklist:**

- [ ] Confirmar que G6 está PASS
- [ ] Executar `npm run submit:prod:ios`
- [ ] Aguardar upload completar (5-10 minutos)
- [ ] Verificar App Store Connect: build aparece em TestFlight
- [ ] Adicionar testers internos (5+ emails)
- [ ] Verificar metadata: Privacy Policy URL, Terms URL, AI Disclaimer URL

**Evidência exigida:**

- Comando: `npm run submit:prod:ios`
- Output esperado: `Successfully submitted to App Store Connect`
- Registro: atualizar `docs/release/GATES.md` (tabela "Status Geral" + log/observações)
- App Store Connect: Build aparece em "TestFlight" tab

**Critério PASS/FAIL:**

- **PASS:** Build enviado + aparece no TestFlight + testers adicionados + metadata completa
- **FAIL:** Upload falha OU build não aparece OU metadata incompleta

**Dono:** Release Lead
**Reviewer:** Dev Lead
**Status atual:** ⏳ PENDING

**Pré-requisitos:**

- G6 PASS
- Metadata completa no App Store Connect:
  - Privacy Policy URL (pública, acessível)
  - Terms of Service URL (pública, acessível)
  - AI Disclaimer URL (pública, acessível)

---

## 4. Correções/Refinos Pré-TestFlight (Máximo 10 Itens)

### 1. Validar RLS em todas as tabelas (G3)

**Impacto:** 🔴 CRÍTICO — Risco de vazamento de dados
**Esforço:** M (3h)
**Como validar:** Executar SQL de verificação (G3) + teste de acesso cruzado

**Ação:** Review completo de `supabase/migrations/` + executar SQL de verificação

---

### 2. Testar Auth em device iOS real (G2)

**Impacto:** 🔴 CRÍTICO — Login pode quebrar em produção
**Esforço:** P (2h)
**Como validar:** Teste manual em device físico (Email + Google + Apple)

**Ação:** Build development + instalar no device + testar todos os providers

---

### 3. Validar RevenueCat sandbox (G4)

**Impacto:** 🔴 CRÍTICO — Compras podem falhar
**Esforço:** P (2h)
**Como validar:** Compra sandbox completa + restore + webhook logs

**Ação:** Teste manual no TestFlight com sandbox account

---

### 4. Verificar URLs legais públicas (G7)

**Impacto:** 🟡 ALTO — App Store pode rejeitar se URLs não acessíveis
**Esforço:** P (30min)
**Como validar:** `curl -I <URL>` retorna 200 OK para todas as URLs

**Ação:** Verificar que Privacy Policy, Terms e AI Disclaimer estão publicados e acessíveis

**URLs esperadas:**

- Privacy Policy: `https://nossamaternidade.com.br/privacidade` (ou equivalente)
- Terms: `https://nossamaternidade.com.br/termos` (ou equivalente)
- AI Disclaimer: `https://nossamaternidade.com.br/ai-disclaimer` (ou equivalente)

---

### 5. Validar NathIA guardrails (G5)

**Impacto:** 🟡 ALTO — Risco de resposta inadequada em crise
**Esforço:** M (2h)
**Como validar:** Teste manual com keywords de crise + verificar disclaimers

**Ação:** Enviar mensagens com crisis keywords → verificar bloqueio + recursos exibidos

---

### 6. Verificar error boundaries (Não-bloqueante, mas recomendado)

**Impacto:** 🟢 MÉDIO — App pode crash sem tratamento de erro
**Esforço:** P (1h)
**Como validar:** Forçar erro em componente → verificar tela de erro exibida

**Ação:** Review de `src/components/ErrorBoundary.tsx` e `src/components/ScreenErrorBoundary.tsx`

**Evidência:** Arquivos existem: `src/components/ErrorBoundary.tsx`, `src/components/ScreenErrorBoundary.tsx`

---

### 7. Validar offline handling (Não-bloqueante, mas recomendado)

**Impacto:** 🟢 BAIXO — UX degradada sem internet
**Esforço:** P (30min)
**Como validar:** Desabilitar WiFi → usar app → verificar mensagens de erro adequadas

**Ação:** Teste manual com WiFi desabilitado

---

### 8. Verificar acessibilidade básica (Não-bloqueante, mas recomendado)

**Impacto:** 🟢 BAIXO — Pode afetar usuários com deficiência
**Esforço:** P (1h)
**Como validar:** Teste manual com VoiceOver (iOS) + verificar tap targets >= 44pt

**Ação:** Review de componentes críticos (paywall, chat, onboarding)

**Evidência:** Comando disponível: `npm run audit:a11y:check`

---

### 9. Padronizar loading + error recovery (Não-bloqueante, mas recomendado)

**Impacto:** 🟡 ALTO — Melhora UX e reduz “flakiness” percebida (carregando infinito / erro sem recovery)
**Esforço:** M (2–4h)
**Como validar:** Simular falhas/rede lenta e validar:

- Mensagem clara (sem “silêncio”)
- Retry/manual refresh disponível
- Loading consistente (não fica travado)

**Ação:** Padronizar loading + erro (principalmente em: Auth, Comunidade/Feed, Paywall, NathIA)

**Nota:** Sem dependências novas — usar utilitários/hooks existentes do repo.

---

### 10. Review de logs sensíveis (Não-bloqueante, mas recomendado)

**Impacto:** 🟢 BAIXO — Risco de vazamento via logs
**Esforço:** P (30min)
**Como validar:** Scan de `logger.*` calls → verificar que não há dados sensíveis

**Ação:** Review manual de `src/utils/logger.ts` + grep por `logger.*` em `src/`

---

## 5. Pós-TestFlight / Backlog (Não-bloqueante)

### E2E Testing

**Descrição:** Implementar testes E2E com Maestro ou Detox
**Dependências:** Aprovação para adicionar libs (Maestro ou Detox)
**Condição:** Após TestFlight estável

**Nota:** Requer avaliação de libs (não adicionar sem aprovação)

---

### Aumento de Coverage

**Descrição:** Aumentar cobertura de testes unitários para >80%
**Dependências:** Nenhuma (Jest já existe)
**Condição:** Após TestFlight estável

---

### Cache Layer

**Descrição:** Implementar cache layer para reduzir chamadas API
**Dependências:** Nenhuma (pode usar AsyncStorage existente)
**Condição:** Após validação de performance

---

### A11y Automation

**Descrição:** Automatizar testes de acessibilidade (axe-core ou similar)
**Dependências:** Aprovação para adicionar lib (axe-core)
**Condição:** Após TestFlight estável

**Nota:** Requer aprovação para lib nova

---

### Documentação Extensa

**Descrição:** Gerar documentação técnica completa (TypeDoc ou similar)
**Dependências:** Aprovação para adicionar lib (TypeDoc)
**Condição:** Após TestFlight estável

**Nota:** Requer aprovação para lib nova

---

### Storybook

**Descrição:** Implementar Storybook para componentes UI
**Dependências:** Aprovação para adicionar lib (@storybook/react-native)
**Condição:** Após TestFlight estável

**Nota:** Requer aprovação para lib nova

---

## 6. Riscos e Mitigações

### Risco 1: RLS incompleto → vazamento de dados

**Probabilidade:** 🟡 MÉDIA
**Impacto:** 🔴 CRÍTICO
**Mitigação:** Executar SQL de verificação antes de G6 + review manual de todas as migrations
**Sinal de detecção:** SQL retorna tabelas sem RLS OU teste de acesso cruzado permite acesso

---

### Risco 2: RevenueCat sandbox não testado → compras falham em produção

**Probabilidade:** 🟡 MÉDIA
**Impacto:** 🔴 CRÍTICO
**Mitigação:** Teste completo de compra + restore antes de G7
**Sinal de detecção:** Compra falha no TestFlight OU webhook não recebe eventos

---

### Risco 3: Auth providers não validados → login quebra em device real

**Probabilidade:** 🟡 MÉDIA
**Impacto:** 🔴 CRÍTICO
**Mitigação:** Teste manual em device iOS físico antes de G6
**Sinal de detecção:** Login falha no TestFlight OU redirect URIs incorretos

---

### Risco 4: URLs legais não acessíveis → App Store rejeita

**Probabilidade:** 🟢 BAIXA
**Impacto:** 🟡 ALTO
**Mitigação:** Verificar URLs com `curl` antes de G7
**Sinal de detecção:** `curl -I <URL>` retorna 404 OU timeout

---

### Risco 5: NathIA guardrails ausentes → resposta inadequada em crise

**Probabilidade:** 🟢 BAIXA
**Impacto:** 🔴 CRÍTICO
**Mitigação:** Teste manual com crisis keywords antes de G6
**Sinal de detecção:** NathIA responde sem disclaimer em cenário de crise

---

### Risco 6: Build EAS falha → atraso no lançamento

**Probabilidade:** 🟢 BAIXA
**Impacto:** 🟡 MÉDIO
**Mitigação:** Validar G0–G5 antes de G6 + monitorar build em tempo real
**Sinal de detecção:** Build retorna "Failed" no EAS Dashboard

---

### Risco 7: Metadata incompleta → App Store rejeita

**Probabilidade:** 🟢 BAIXA
**Impacto:** 🟡 ALTO
**Mitigação:** Checklist completo de metadata antes de G7
**Sinal de detecção:** App Store Connect mostra "Missing required information"

---

### Risco 8: Webhook RevenueCat não configurado → premium não sincroniza

**Probabilidade:** 🟡 MÉDIA
**Impacto:** 🟡 ALTO
**Mitigação:** Teste de webhook antes de G7 + verificar logs
**Sinal de detecção:** Webhook não recebe eventos OU premium não ativa após compra

---

## 7. Próximos Passos (72h)

### Dia 1 (Hoje)

1. **G2 — Auth (2h)**
   - Build development iOS
   - Instalar no device físico
   - Testar Email + Google + Apple login
   - Registrar resultado em `docs/release/GATES.md`

2. **G3 — RLS (3h)**
   - Executar SQL de verificação
   - Review manual de migrations
   - Teste de acesso cruzado
   - Registrar resultado em `docs/release/GATES.md`

### Dia 2 (Amanhã)

3. **G4 — RevenueCat (2h)**
   - Criar sandbox test account (se não existir)
   - Testar compra mensal completa
   - Testar restore purchases
   - Verificar webhook logs
   - Registrar resultado em `docs/release/GATES.md`

4. **G5 — NathIA (2h)**
   - Testar chat funcional
   - Testar fallback chain
   - Validar guardrails (crisis keywords)
   - Verificar consent modal
   - Registrar resultado em `docs/release/GATES.md`

### Dia 3 (Depois de amanhã)

5. **G6 — Build (1h setup + 20-40min build)**
   - Confirmar G0–G5 PASS
   - Executar `npm run build:prod:ios`
   - Monitorar build no EAS Dashboard
   - Registrar resultado em `docs/release/GATES.md`

6. **G7 — Submit (30min)**
   - Confirmar G6 PASS
   - Executar `npm run submit:prod:ios`
   - Adicionar testers internos
   - Verificar metadata completa
   - Registrar resultado em `docs/release/GATES.md`

---

## Perguntas para Destravar

1. **Dispositivos iOS alvo:** Quais dispositivos iOS serão usados para teste? (iPhone modelo + iOS version)
   - **Resposta necessária para:** G2 (Auth) e G4 (RevenueCat)

2. **Status do RevenueCat Dashboard:** Entitlement "premium" e offering "default" estão configurados?
   - **Resposta necessária para:** G4 (RevenueCat)
   - **Como verificar:** RevenueCat Dashboard → Entitlements → "premium" → Offering "default"

3. **URLs legais:** Privacy Policy, Terms e AI Disclaimer estão publicados e acessíveis?
   - **Resposta necessária para:** G7 (Submit)
   - **URLs esperadas:** Fornecer URLs públicas (ou confirmar que serão criadas)

4. **Sandbox test account:** Existe sandbox test account no App Store Connect?
   - **Resposta necessária para:** G4 (RevenueCat)
   - **Como criar:** App Store Connect → Users and Access → Sandbox → Testers → + Create Tester

5. **Status do webhook RevenueCat:** Webhook está configurado no RevenueCat Dashboard?
   - **Resposta necessária para:** G4 (RevenueCat)
   - **URL (formato):** `https://<SUPABASE_PROJECT>.supabase.co/functions/v1/webhook/revenuecat` (evidência: `supabase/functions/webhook/index.ts` → endpoint `POST /revenuecat`)

6. **Product IDs oficiais (App Store Connect + RevenueCat):** quais IDs estão realmente cadastrados e quais vamos usar como fonte de verdade?
   - **Resposta necessária para:** G4 (RevenueCat)
   - **Evidência no repo:** `src/types/premium.ts` tem IDs atuais (`nossa_maternidade_*`) e legacy (`com.nossamaternidade.subscription.*`)
   - **Como verificar:** App Store Connect → Nossa Maternidade → Monetização → Assinaturas + RevenueCat → Products/Entitlements/Offerings

7. **Status do Supabase RLS:** Todas as tabelas têm RLS habilitado?
   - **Resposta necessária para:** G3 (RLS)
   - **Como verificar:** Executar SQL de verificação (G3)

8. **Status do NathIA pre-classifier:** Pre-classifier está ativo na Edge Function `/ai`?
   - **Resposta necessária para:** G5 (NathIA)
   - **Como verificar:** `npx supabase functions logs ai --tail` → enviar mensagem → verificar logs

9. **Status do EAS credentials:** Credenciais Apple estão configuradas no `eas.json`?
   - **Resposta necessária para:** G6 (Build)
   - **Como verificar:** `eas.json` → `production.ios.submit.ascApiKeyPath` existe

10. **Status do metadata App Store Connect:** Metadata está completo (Privacy Policy URL, Terms URL, AI Disclaimer URL)?
    - **Resposta necessária para:** G7 (Submit)
    - **Como verificar:** App Store Connect → Nossa Maternidade → App Information → URLs

---

**Fim do documento**

**Próxima ação:** Responder perguntas acima + executar G2–G5 sequencialmente
