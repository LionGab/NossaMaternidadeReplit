---
name: pre-commit
description: Validação rápida antes de commits - typecheck, lint, format
agent: general-purpose
model: haiku
allowed-tools:
  - Bash
disable-model-invocation: true
---

# Pre-Commit Check

Validação rápida de qualidade antes de commits.

## Execução

```bash
npm run quality-gate
```

## O Que Verifica

1. **TypeScript** - `tsc --noEmit`
2. **ESLint** - Violações de estilo
3. **Build Check** - Config Expo/EAS
4. **Console Logs** - Busca `console.log` residual

## Uso Rápido

```bash
# Validação completa
npm run quality-gate

# Apenas TypeScript
npm run typecheck

# Apenas Lint
npm run lint

# Fix automático
npm run lint:fix
npm run format
```

## Output Esperado

```
✅ TypeScript: 0 errors
✅ ESLint: passed
✅ Build check: ok
✅ Logs: no console.log found
```

## Se Falhar

1. Corrigir erros indicados
2. Re-executar `npm run quality-gate`
3. Só fazer commit quando passar
