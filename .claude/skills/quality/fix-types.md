---
name: fix-types
description: Diagnosticar e corrigir erros de TypeScript mantendo tipagem estrita
agent: general-purpose
model: sonnet
allowed-tools:
  - Bash
  - Read
  - Edit
  - Grep
  - Glob
---

# Fix TypeScript Errors

Resolver erros de TypeScript mantendo zero `any` e zero `@ts-ignore`.

## Diagnóstico

```bash
npm run typecheck
```

## Patterns de Correção

@.claude/skills/quality/typescript-patterns.md

## Workflow

```
1. npm run typecheck     → Lista erros
2. Agrupar por tipo      → Priorizar críticos
3. Corrigir mínimo       → Preservar lógica
4. npm run typecheck     → Validar fix
```

## Regras Críticas

| Evitar                | Usar                   |
| --------------------- | ---------------------- |
| `any`                 | `unknown` + type guard |
| `@ts-ignore`          | Corrigir raiz          |
| `as Type` sem validar | Type guard primeiro    |
| `!` excessivo         | Optional chaining `?.` |

## Comandos de Busca

```bash
# Buscar any types
grep -r ": any" src/ --include="*.ts" --include="*.tsx"

# Buscar ts-ignore
grep -r "@ts-ignore" src/ --include="*.ts" --include="*.tsx"
```

## Tipos do Supabase

```bash
# Regenerar após mudança de schema
npm run generate-types
```

```typescript
import { Database } from "@/types/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];
```
