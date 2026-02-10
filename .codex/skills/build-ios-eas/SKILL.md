---
name: build-ios-eas
description: Mandatory /build-ios flow: P0 checks + quality gate + EAS build + persistence to docs/builds/
---

# build-ios-eas

Use esta skill quando o pedido for "build iOS", "TestFlight", "EAS iOS", ou qualquer variante do `/build-ios`.

Fonte de verdade do fluxo:

- `AGENTS.md`
- `.claude/rules/always/build-standards.mdc`

## Quick Commands (sequencia padrao)

1) Instalar deps:

```bash
npm ci
```

2) Criar checkpoint do build:

```bash
bash .codex/skills/build-ios-eas/scripts/create_checkpoint.sh ios_testflight
```

3) P0 scans (antes do quality gate):

```bash
bash .codex/skills/build-ios-eas/scripts/p0_scans.sh
```

4) Preflight / gates:

```bash
npm run validate:pre-build
```

5) Build EAS (exemplos):

```bash
npx eas-cli whoami
npx eas-cli build --platform ios --profile ios_testflight
```

## Persistencia (nao pular)

- Checkpoint: `docs/builds/YYYY-MM-DD-ios-{profile}.md` (base `docs/builds/TEMPLATE.md`)
- Logs (se houver erro): `docs/builds/logs/{build-id}.txt`
- Historico curto: atualizar `docs/builds/NOTES.md` (builds novos no topo)

