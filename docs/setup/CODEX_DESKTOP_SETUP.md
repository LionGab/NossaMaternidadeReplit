# Codex Desktop (v5.x) Setup e Operacao no Repo

Este guia e para usar o **Codex Desktop** com o repo `NossaMaternidadeReplit/` (Expo/React Native).

## Onde trabalhar

- Abra e rode comandos **dentro** de `NossaMaternidadeReplit/` (nao na pasta pai).
- Regras operacionais e fluxo de build iOS: `AGENTS.md`

## "Quality Gate" (obrigatorio antes de build/PR)

```bash
npm ci
npm run quality-gate
```

Preflight rapido (inclui MCP + quality gate):

```bash
npm run validate:pre-build
```

## MCPs (o que importa aqui)

Este repo ja possui configuracoes MCP para outros clientes (Cursor/Claude/Copilot):

- `.claude/mcp-config.json` (fonte usada por `npm run check-mcp`)
- `.mcp.json` (schema Claude)
- `.cursor/mcp.json` (Cursor)

Para validar rapidamente:

```bash
npm run check-mcp
```

Notas praticas:

- `expo` (HTTP): deve responder em `https://mcp.expo.dev/mcp`
- `figma-devmode` (SSE): requer Figma Desktop rodando (localhost `:3845`)

## Playwright (auditoria visual / screenshots)

Recomendacao: salvar artefatos em `output/playwright/` e manter os logs/snapshots junto do report.

Se o cliente estiver usando `playwright-cli`, evite criar/commitar `.playwright-cli/` no root do repo.
Este repo ja ignora `/.playwright-cli/` por padrao (mas **nao** ignora `.playwright-cli/` dentro de `output/playwright/...`).

## Skills do repo (Codex)

Skills versionadas (repo-local) ficam em:

- `.codex/skills/`

Skill relevante para build iOS:

- `.codex/skills/build-ios-eas/SKILL.md`

