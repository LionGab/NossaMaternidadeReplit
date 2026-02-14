---
description: "Quality gate + guia de commit atômico com mensagem convencional (feat/fix/docs/...). Use antes de commit ou com o plugin Commit commands."
---

# Commit (fluxo seguro)

Executa o **quality gate** e em seguida guia o **commit atômico** com mensagem no padrão do projeto. Use com o plugin **Commit commands** ou sozinho.

## O que faz

1. **Roda** `npm run quality-gate` (TypeScript + ESLint + build check + scan de console.log).
2. Se passar: mostra **status** do git e arquivos staged/modified.
3. **Orienta** (ou executa via MCP):
   - `git add` apenas dos arquivos do mesmo propósito.
   - Mensagem no formato: `tipo: descrição` (feat, fix, docs, refactor, style, test, chore).
4. **Não** faz commit com quality gate falho.

## Uso

```
/commit
```

Ou com mensagem já definida:

```
/commit feat: adiciona PremiumCard na paywall
```

## Regras (resumo)

- **Atômico**: 1 commit = 1 propósito.
- **Mensagem**: imperativo, português, sem ponto final no assunto.
- **Antes de PR**: rodar `/verify` e garantir branch atualizada com `main`.

## Atalhos úteis

- Quality Gate: `Ctrl+Shift+Q` (task) ou `/verify`.
- Git Commit (IDE): `Ctrl+Shift+G G`.
- Git Push: `Ctrl+Shift+G P`.

Skill completa: `/commit-commands` ou `.claude/skills/workflow/commit-commands.md`.
