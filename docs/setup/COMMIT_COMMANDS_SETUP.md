# Commit Commands — Configuração HIPER PERFEITA

Workflow de **commit**, **push** e **PR** integrado ao quality gate e ao plugin **Commit commands** (Cursor/Claude Code).

---

## O que está configurado

| Item | Onde | Uso |
|------|------|-----|
| **Skill** | `.claude/skills/workflow/commit-commands.md` | `/commit-commands` — fluxo completo commit/push/PR |
| **Comando** | `.claude/commands/commit.md` | `/commit` — verify + guia commit atômico |
| **Regra** | `.claude/rules/always/git-commit-workflow.mdc` | Sempre aplicada em qualquer ação de commit/PR |
| **Task** | `.vscode/tasks.json` | "Safe Commit Flow" — quality gate + lembrete |
| **Atalhos** | `.vscode/keybindings.json` | Git + Safe Commit Flow |

---

## Atalhos de teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+Shift+G G` | Abrir commit (git) |
| `Ctrl+Shift+G P` | Push |
| `Ctrl+Shift+G S` | Sync (pull + push) |
| `Ctrl+Shift+G C` | **Safe Commit Flow** — roda quality gate e mostra lembrete para commit |
| `Ctrl+Shift+Q` | Quality Gate (task) |

---

## Fluxo recomendado

1. **Antes de commitar**: rodar **Safe Commit Flow** (`Ctrl+Shift+G C`) ou `/verify` (ou `npm run quality-gate`).
2. Se o quality gate **passar**: fazer stage, commit com mensagem no padrão (`feat:`, `fix:`, etc.), depois push.
3. Para **PR**: garantir branch atualizada com `main`, título/descrição claros; checklist em CONTRIBUTING.md.

---

## Formato de mensagem de commit

- **Imperativo**, **português**, **sem ponto** no assunto.
- **Prefixos**: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`, `chore:`.
- **Exemplos**: `feat: adiciona PremiumCard`, `fix: corrige animação em FloatingBubbles`.

---

## Plugin "Commit commands"

Se você instalou o plugin **Commit commands** no Cursor:

- Use os comandos do plugin para commit/push/PR.
- **Sempre** rode o quality gate antes (`/verify` ou `Ctrl+Shift+G C`).
- Ao pedir mensagem de commit à IA: peça **imperativo**, **português**, **prefixo convencional**.

A regra `git-commit-workflow.mdc` e a skill `commit-commands` garantem que o agente siga o mesmo padrão ao ajudar em commits.

---

## Referências

- CONTRIBUTING.md — Git Workflow, branches, checklist PR
- AGENTS.md — Quality gate obrigatório antes de PR/build
- `.claude/skills/workflow/commit-commands.md` — Skill completa
