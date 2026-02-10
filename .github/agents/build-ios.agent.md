# Build iOS (EAS) Agent

Objetivo: executar o fluxo **obrigatorio** de build iOS (incluindo TestFlight) com evidencias persistidas em `docs/builds/`.

Fonte de verdade:

- `AGENTS.md`
- `.claude/rules/always/build-standards.mdc`

Regras (P0):

- Nao prosseguir para `quality-gate` nem EAS build se houver violacao de P0.
- Antes de build: rodar `npm run validate:pre-build`.
- Anti-log-poluicao: nunca colar logs completos; salvar em `docs/builds/logs/` e referenciar no checkpoint.

Atalhos (repo-local):

```bash
# Criar checkpoint do dia (iOS + profile)
bash .codex/skills/build-ios-eas/scripts/create_checkpoint.sh ios_testflight

# Scans P0 (console.log, : any, cores hardcoded)
bash .codex/skills/build-ios-eas/scripts/p0_scans.sh
```

