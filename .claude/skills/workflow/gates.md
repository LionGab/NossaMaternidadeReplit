---
name: gates
description: Gestão de Release Gates (G1-G7) para validação de qualidade
agent: general-purpose
model: sonnet
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
---

# Release Gates

Sistema de validação de qualidade para releases.

## Sequência de Gates

```
G1 (Quality) → G2 (Auth) → G3 (RLS) → G4 (RevenueCat) → G5 (NathIA) → G6 (Build) → G7 (Submit)
```

## Comandos Rápidos

| Gate | Comando                   | Descrição         |
| ---- | ------------------------- | ----------------- |
| G1   | `npm run quality-gate`    | TypeCheck + Lint  |
| G2   | `npm run test:oauth`      | Auth providers    |
| G3   | Manual                    | RLS Supabase      |
| G4   | Manual                    | RevenueCat IAP    |
| G5   | `npm run test:gemini`     | NathIA chat       |
| G6   | `npm run build:prod:ios`  | Build produção    |
| G7   | `npm run submit:prod:ios` | Submit TestFlight |

## Detalhes por Gate

@.claude/skills/workflow/gates-detail.md

## Scoreboard Template

```markdown
## Gate Scoreboard

| Gate | Status   | Data       | Validador | Notas |
| ---- | -------- | ---------- | --------- | ----- |
| G1   | ✅/❌/⏳ | YYYY-MM-DD | -         | -     |
| G2   | ⏳       | -          | -         | -     |
| G3   | ⏳       | -          | -         | -     |
| G4   | ⏳       | -          | -         | -     |
| G5   | ⏳       | -          | -         | -     |
| G6   | ⏳       | -          | -         | -     |
| G7   | ⏳       | -          | -         | -     |

**Próximo**: G?
**Bloqueios**: Nenhum
```

## Regras Críticas

1. **NUNCA** pular gate que falhou
2. **SEMPRE** documentar resultado
3. **PARAR** se gate falhar 3+ vezes
4. **REUTILIZAR** build de dev para G2-G5

## Timeline Target

| Dia | Gates        | Tempo |
| --- | ------------ | ----- |
| 1   | G1 + G2 + G3 | 2h    |
| 2   | G4 + G5      | 2h    |
| 3   | G6 + G7      | 1h    |

**Total**: ~5h em 2-3 dias
