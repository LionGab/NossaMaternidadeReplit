---
name: commit-commands
description: Workflow de commit, push e PR alinhado ao quality gate e commits atômicos
agent: general-purpose
model: sonnet
allowed-tools:
  - Bash
  - mcp_GitKraken_git_status
  - mcp_GitKraken_git_add_or_commit
  - mcp_GitKraken_git_push
  - mcp_GitKraken_git_branch
  - mcp_GitKraken_git_log_or_diff
---

# Commit Commands — Workflow Git HIPER PERFEITO

Fluxo obrigatório para **commit**, **push** e **criação de PR** no Nossa Maternidade. Integra com o plugin "Commit commands" e com o quality gate do projeto.

---

## 1. Antes de QUALQUER commit

1. **Rodar quality gate** (obrigatório):

   ```bash
   npm run quality-gate
   ```

   Se falhar: **NÃO** fazer commit. Corrigir erros e rodar de novo.

2. **Confirmar escopo atômico**:
   - 1 commit = 1 propósito (ex.: só "feat: botão X" ou só "fix: animação Y").
   - Se há mudanças de tema misturadas: fazer **vários commits** (um por tema).

---

## 2. Formato da mensagem de commit

Sempre **imperativo**, **curto** no assunto (< 72 caracteres), em **português**:

| Tipo     | Prefixo     | Exemplo                                      |
| -------- | ----------- | -------------------------------------------- |
| Feature  | `feat:`     | `feat: adiciona PremiumCard na paywall`      |
| Correção | `fix:`      | `fix: corrige animação em FloatingBubbles`   |
| Docs     | `docs:`     | `docs: atualiza CONTRIBUTING.md`             |
| Refactor | `refactor:` | `refactor: extrai hook useCyclePhase`        |
| Estilo   | `style:`    | `style: aplica tokens em MeusCuidadosScreen` |
| Teste    | `test:`     | `test: adiciona testes para messageCount`    |
| Chore    | `chore:`    | `chore: atualiza dependência X`              |

**Regras:**

- Sem ponto final no assunto.
- Corpo opcional: linha em branco + detalhes (se necessário).

---

## 3. Fluxo Commit (passo a passo)

1. **Status**: Ver o que está modificado (`git status` ou MCP GitKraken).
2. **Stage**: Adicionar apenas os arquivos do **mesmo propósito** (atomicidade).
3. **Quality gate**: `npm run quality-gate` (se ainda não rodou nesta sessão).
4. **Commit**: Mensagem no formato acima.
5. **Push** (se for enviar): `git push` ou MCP.

---

## 4. Fluxo Pull Request

Antes de abrir PR:

- [ ] `npm run quality-gate` passou.
- [ ] Branch atualizada com `main`: `git pull origin main --rebase` (ou merge, conforme política).
- [ ] Commits atômicos e mensagens no formato correto.
- [ ] Título do PR: claro e descritivo (pode repetir o tipo: `feat: Descrição`).
- [ ] Descrição: link para issue (se houver), resumo das mudanças, checklist de revisão.

---

## 5. Branches (convenção)

- `main` — produção.
- `dev` — desenvolvimento.
- `feature/nome-da-feature` — nova funcionalidade.
- `fix/nome-do-fix` — correção.
- `docs/assunto` — apenas documentação.

---

## 6. Integração com plugin "Commit commands"

Se você usa o plugin **Commit commands** no Cursor:

- Use os comandos do plugin para **commit**, **push** e **criar PR**.
- **Sempre** rode `/verify` (ou `npm run quality-gate`) **antes** de commitar.
- Ao gerar mensagem de commit via IA: peça **imperativo**, **português**, **prefixo** (feat/fix/docs/refactor/style/test/chore).

Atalhos úteis (já configurados no projeto):

- **Commit**: `Ctrl+Shift+G G` (ou comando do plugin).
- **Push**: `Ctrl+Shift+G P`.
- **Sync**: `Ctrl+Shift+G S`.
- **Quality Gate** (antes de commit): `Ctrl+Shift+Q` (task "✅ Quality Gate") ou `/verify`.

---

## 7. Output esperado

Ao usar esta skill para **commit**:

1. Confirmar que quality gate passou (ou rodar e mostrar resultado).
2. Listar arquivos que serão commitados.
3. Propor mensagem no formato acima (ou usar a do usuário se fornecida).
4. Executar `git add` + `git commit` (ou guiar o usuário).
5. Se for push/PR: executar push e, se pedido, orientar criação do PR.

Nunca commitar com quality gate falho ou com mensagem fora do padrão sem avisar o usuário.
