---
name: verify
description: Quality gate completo - TypeScript, ESLint, Build check e Console log scan
agent: general-purpose
model: haiku
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# Quality Gate

Verificação completa de qualidade antes de commits, PRs ou builds.

## Quick Run

```bash
npm run quality-gate
```

## O Que Verifica

### 1. TypeScript

```bash
npx tsc --noEmit
```

Erros comuns:

- `any` types → usar `unknown` + type guards
- Missing types → adicionar interface/type
- Import errors → verificar path alias `@/*`

### 2. ESLint

```bash
npx eslint src/ --max-warnings 0
```

Auto-fix:

```bash
npm run lint:fix
```

### 3. Console Log Scan

```bash
grep -r "console.log" src/ --include="*.ts" --include="*.tsx" | grep -v "logger"
```

Usar `logger.*` do `@/utils/logger` ao invés de `console.log`.

### 4. Build Check

```bash
npx expo-doctor
```

## Quando Usar

| Momento          | Obrigatório? |
| ---------------- | ------------ |
| Antes de commit  | Sim          |
| Antes de PR      | Sim          |
| Antes de build   | Sim          |
| Após refatoração | Recomendado  |
| Debug            | Opcional     |

## Output Esperado

```
✅ TypeScript: nenhum erro
✅ ESLint: passou
✅ Build check: ok
✅ Logs: nenhum console.log encontrado
```

## Se Falhar

1. **TypeScript errors** → `/fix-types`
2. **ESLint errors** → `npm run lint:fix`
3. **Console.log** → Substituir por `logger.*`
4. **Build errors** → Verificar `app.json` e dependências
