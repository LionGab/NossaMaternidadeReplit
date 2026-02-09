# Growth Funnel QA — Checklist Executável

> Validação end-to-end: deep link → onboarding → paywall → conversão  
> **Fase:** Growth Attribution + Paywall Experiments  
> **Última atualização:** 2026-02-09

---

## 1. Pré-requisitos

- [ ] App instalado em device físico ou simulador (sandbox)
- [ ] Usuário **não** autenticado (ou logout) para fluxo onboarding
- [ ] Supabase SQL Editor aberto para validação no banco
- [ ] Deep link configurado: `nossamaternidade://`

---

## 2. Deep Links com UTM (1 por canal)

Abra cada link no device e confira que o onboarding abre corretamente.

### 2.1 Instagram (organic story)

```
nossamaternidade://onboarding/welcome?utm_source=instagram&utm_medium=organic_story&utm_campaign=nathia_trial_push_wk04&content_id=story_2026_02_09_03&creator_cta_id=story_swipeup_01
```

- [ ] App abre
- [ ] Tela de onboarding/welcome exibida
- [ ] Params capturados (source=instagram, medium=organic_story, campaign=nathia_trial_push_wk04)

### 2.2 TikTok (bio link)

```
nossamaternidade://onboarding/welcome?utm_source=tiktok&utm_medium=bio_link&utm_campaign=nathia_trial_push_wk04&content_id=profile_bio_01&creator_cta_id=bio_link_cta
```

- [ ] App abre
- [ ] Onboarding exibido
- [ ] Params capturados

### 2.3 YouTube (description)

```
nossamaternidade://onboarding/welcome?utm_source=youtube&utm_medium=description&utm_campaign=nathia_trial_push_wk04&content_id=video_2026_02_09&creator_cta_id=description_link_01
```

- [ ] App abre
- [ ] Onboarding exibido
- [ ] Params capturados

---

## 3. Fluxo Paywall

Em cada execução do fluxo:

- [ ] Paywall aparece após etapas do onboarding
- [ ] CTA **Trial** abre sem travar
- [ ] CTA **Restore** abre sem travar
- [ ] CTA **Skip** funciona sem travar
- [ ] Navegação não regride (não volta tela anterior ao fechar)

---

## 4. Cenários de Compra (Sandbox)

Executar **3 cenários** no device em ambiente sandbox.

### 4.1 Trial/Purchase — Sucesso

- [ ] Iniciar fluxo → chegar ao paywall
- [ ] Tocar em **Trial** ou **Assinar**
- [ ] Completar compra sandbox (Apple/Google)
- [ ] App confirma acesso premium
- [ ] **Evidência:** 1 linha em `paywall_outcomes` com `outcome_type = 'purchased'` ou equivalente

### 4.2 Purchase — Cancelado

- [ ] Iniciar fluxo → chegar ao paywall
- [ ] Tocar em **Trial** → cancelar na sheet de compra
- [ ] Voltar ao paywall sem crash
- [ ] **Evidência:** outcome `cancelled` ou ausência de `purchased`

### 4.3 Restore — Sucesso ou Falha

- [ ] Iniciar fluxo → paywall
- [ ] Tocar em **Restaurar compras**
- [ ] Caso 1: conta com assinatura → restore sucesso, premium ativado
- [ ] Caso 2: conta sem assinatura → mensagem de falha clara
- [ ] **Evidência:** outcome `restored` ou `restore_failed` conforme cenário

---

## 5. Validação no Banco (SQL Editor Supabase)

Executar no [SQL Editor](https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/sql/new) após cada rodada de testes.

### 5.1 Attribution

```sql
SELECT * FROM user_attribution
ORDER BY last_touch_at DESC
LIMIT 20;
```

**Esperado:**
- [ ] 1 linha por toque válido (deep link com UTM)
- [ ] `source`, `campaign`, `content_id`, `creator_cta_id` preenchidos conforme link

### 5.2 Paywall Exposures

```sql
SELECT * FROM paywall_exposures
ORDER BY displayed_at DESC
LIMIT 20;
```

**Esperado:**
- [ ] 1 linha por exibição do paywall
- [ ] `experiment_name`, `variant` preenchidos

### 5.3 Paywall Outcomes

```sql
SELECT * FROM paywall_outcomes
ORDER BY occurred_at DESC
LIMIT 20;
```

**Esperado:**
- [ ] 1 linha por ação (purchased, cancelled, restored, restore_failed, skipped)
- [ ] `outcome_type` coerente com ação do usuário

### 5.4 Creator Content Performance

```sql
SELECT * FROM creator_content_performance
ORDER BY day_date DESC
LIMIT 20;
```

**Esperado:**
- [ ] Contadores atualizados por `source`, `content_id`, `creator_cta_id`
- [ ] `day_date` = data do teste

---

## 6. Journey CRM — Enqueue

Validar endpoint `/enqueue-journey`.

### 6.1 Chamada (curl ou Postman)

```bash
curl -X POST "https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/crm-lifecycle/enqueue-journey" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<uuid>",
    "journey_name": "growth_onboarding_trial",
    "payload": {}
  }'
```

- [ ] Resposta 200 ou 201
- [ ] Sem erro de CORS ou auth

### 6.2 Validação no Banco

```sql
SELECT * FROM notification_queue
ORDER BY created_at DESC
LIMIT 10;
```

**Esperado:**
- [ ] Inserção em `notification_queue` com `journey_name` e `payload` corretos

---

## 7. Critérios de Aceite (Checklist Final)

| # | Critério | Status |
|---|----------|--------|
| 1 | 1 linha em `user_attribution` por toque válido (deep link UTM) | [ ] |
| 2 | Exposição registrada em `paywall_exposures` | [ ] |
| 3 | Outcome correto em `paywall_outcomes` (purchased/cancelled/restored/skipped) | [ ] |
| 4 | Contadores atualizados em `creator_content_performance` | [ ] |
| 5 | Sem regressão de navegação (onboarding → paywall → CTA) | [ ] |
| 6 | Sem regressão de compra (trial/restore/skip funcionam) | [ ] |
| 7 | `/enqueue-journey` insere em `notification_queue` | [ ] |

---

## 8. Evidências e Notas

| Data | Executor | Deep Link Testado | Resultado | Observações |
|------|----------|-------------------|-----------|-------------|
|      |          |                   |           |             |

---

## 9. Referências

- **UTM Taxonomy:** [UTM_TAXONOMY_CREATOR.md](../UTM_TAXONOMY_CREATOR.md) (se existir)
- **Edge Function:** `crm-lifecycle` — [Dashboard](https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/functions)
- **Migration:** `032_growth_attribution_experiments.sql`
