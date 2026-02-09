# Mensagens de Status - Auditoria A11Y v1.1

**Data:** 2025-12-29
**Fonte:** `docs/AUDIT_A11Y_DEEP_REPORT.json`, `docs/AUDIT_A11Y_FIXES_PLAN.md`, `docs/a11y-baseline.json`, `scripts/audit-a11y-deep.js`

---

## (1) Mensagem curta (WhatsApp/Slack)

```
Auditoria A11Y v1.1 | 2025-12-29
P0/BLOCKER: 125 → 57 (Δ -68, -54%)
Labels: 36% → 51%
Imagens: 11% → 64%
Inputs: 31% → 54%
TypeScript ✅ | ESLint ✅ (executado localmente)
Próximo: 57 P0 restantes. Top 3: AffirmationsScreen (6), CommunityComposer (5), CommunityPostCard (4).
```

---

## (2) Mensagem completa (PR/registro)

**Auditoria A11Y v1.1 — 2025-12-29**
Fonte: `docs/AUDIT_A11Y_DEEP_REPORT.json`, `docs/AUDIT_A11Y_FIXES_PLAN.md`, `docs/a11y-baseline.json`, `scripts/audit-a11y-deep.js`

**Entregáveis**

| Arquivo                            | Descrição               |
| ---------------------------------- | ----------------------- |
| `scripts/audit-a11y-deep.js`       | Script de auditoria     |
| `scripts/check-a11y-baseline.js`   | Verificação baseline CI |
| `docs/AUDIT_A11Y_DEEP_REPORT.json` | Relatório estruturado   |
| `docs/AUDIT_A11Y_DEEP_REPORT.md`   | Relatório legível       |
| `docs/a11y-baseline.json`          | Baseline atualizado     |
| `docs/AUDIT_A11Y_FIXES_PLAN.md`    | Plano/andamento         |

**Métricas (antes → depois)**

| Métrica    | Antes |        Depois | Delta |
| ---------- | ----: | ------------: | ----: |
| P0/BLOCKER |   125 |            57 |   -68 |
| Labels     |   36% | 51% (137/271) | +15pp |
| Imagens    |   11% |   64% (23/36) | +53pp |
| Inputs     |   31% |    54% (7/13) | +23pp |
| Roles      |     — | 87% (236/271) |     — |
| P1/MAJOR   |     — |            38 |     — |
| P2/MINOR   |     — |           312 |     — |

Obs.: "Antes" de Roles/P1/P2 não documentado no baseline anterior.

**Whitelist (25):** AnimatedPressable, AppPressable, Card, CheckInCard, CommunityPostCard, ConcernCard, CTAButton, DailyLogCard, DateTimePicker, EmailInput, FeatureCard, GlassButton, HabitCard, HeroCard, IconButton, Input, NathIACenterButton, PremiumCard, PressableScale, ProgressSection, QuickComposerCard, SocialButton, StageCard, Text, ThemedText

**Como reproduzir**

```bash
npm run audit:a11y
npm run audit:a11y:baseline
npm run audit:a11y:check
npm run audit:a11y:ci
npm run typecheck
npm run lint
```

**Top 10 P0**

| #   | Arquivo                                           |  P0 | Regras                          |
| --- | ------------------------------------------------- | --: | ------------------------------- |
| 1   | screens/AffirmationsScreen.tsx                    |   6 | P0-NAME-001: 6                  |
| 2   | components/CommunityComposer.tsx                  |   5 | P0-NAME-001: 4, P0-IMAGE-001: 1 |
| 3   | components/community/CommunityPostCard.tsx        |   4 | P0-NAME-001: 2, P0-IMAGE-001: 2 |
| 4   | components/chat/ChatHistorySidebar.tsx            |   3 | P0-NAME-001: 3                  |
| 5   | components/chat/ChatInputArea.tsx                 |   3 | P0-NAME-001: 2, P0-IMAGE-001: 1 |
| 6   | components/VoiceMessagePlayer.tsx                 |   2 | P0-NAME-001: 2                  |
| 7   | components/chat/VoiceRecordingInput.tsx           |   2 | P0-NAME-001: 2                  |
| 8   | components/community/CommunityPostCardPremium.tsx |   2 | P0-IMAGE-001: 2                 |
| 9   | components/onboarding/ConcernCard.tsx             |   2 | P0-NAME-001: 1, P0-IMAGE-001: 1 |
| 10  | components/ui/AppCard.tsx                         |   2 | P0-NAME-001: 2                  |

**Hash:** `e9d9a91530606db2dd89aac093abdbe4c5bea46143268def45646dcad2a76097`

---

## (3) Riscos objetivos

1. **Whitelist:** 25 componentes isentos; a11y interna não verificada manualmente.
2. **P0-NAME-001 domina:** 44/57 P0.
3. **Imagens abaixo da meta:** 64% vs 90% (gap 26pp).
4. **MINOR concentra em motion:** 267/312 P2 são P2-MOTION-001.
5. **"Antes" incompleto:** P1/P2/Roles sem baseline anterior.
