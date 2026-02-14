# Brand archive

Arquivos de marca (logos, identidades, avatares) arquivados do repositório.

Contexto
- A pasta `NossaMaternidadeReplit/` não está presente nem rastreada no repositório (org/local-only).
- Nesta PR arquivei apenas `logos` e imagens de marca — **não** incluí fotos pessoais ou arquivos que possam conter PII.

Arquivos movidos (resumo)
- `logo1_1770126226754.png`
- `logo_1770096248551.png`
- `logo_1770126172033.png`
- `logo_1770126180894.png`
- `nathia-avatar_1770096186401.jpg`
- `maesvalente_-_Editado_1770111776391.png`

Why
- Limpar ruído (pasta órfã não rastreada) e centralizar ativos de marca versionados sob `docs/brand-archive/`.

How to validate
1. `git show --name-only HEAD` — confirma arquivos movidos.
2. `npm run typecheck && npm run lint && npm test` — validação de qualidade.

Risk & rollback
- Risco: baixo — apenas arquivos estáticos movidos com `git mv` (histórico preservado).
- Rollback: `git revert <commit>` ou reverter o PR.

Closes: #11
