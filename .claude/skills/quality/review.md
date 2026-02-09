---
name: review
description: Code review focado em qualidade, design system e boas práticas
agent: general-purpose
model: sonnet
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Code Review

Review focado em qualidade, design system e padrões do projeto.

## Checklist Rápido

### TypeScript

- [ ] Zero `any` types
- [ ] Zero `@ts-ignore`
- [ ] Tipos em `src/types/`

### Design System

- [ ] Cores: `Tokens.*` ou `useThemeColors()`
- [ ] Spacing: grid 8pt (`Tokens.spacing.*`)
- [ ] Typography: `Tokens.typography.*`

### Logging

- [ ] Usar `logger.*` (não `console.log`)

### Performance

- [ ] Listas: `FlatList` ou `FlashList`
- [ ] Memos em componentes pesados

### Accessibility

- [ ] Tap targets ≥ 44pt
- [ ] `accessibilityLabel` em interativos
- [ ] Contraste WCAG AAA (7:1)

## Checklist Completo

@.claude/skills/quality/review-checklist.md

## Formato de Output

```markdown
## Review: [arquivo]

### Críticos

- ❌ [linha]: [problema] → [fix]

### Warnings

- ⚠️ [linha]: [problema] → [sugestão]

### Info

- ℹ️ [linha]: [melhoria opcional]

### Resumo

- Críticos: X
- Warnings: Y
- Passou: [Sim/Não]
```

## Buscar Problemas Comuns

```bash
# Cores hardcoded
grep -r "#[0-9a-fA-F]" src/ --include="*.tsx"

# Console.log
grep -r "console.log" src/ --include="*.ts" --include="*.tsx"

# any types
grep -r ": any" src/ --include="*.ts" --include="*.tsx"
```
