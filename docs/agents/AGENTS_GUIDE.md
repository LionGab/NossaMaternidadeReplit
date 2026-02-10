Guia rápido: Agentes, MCP e Copilot (correções práticas)

Resumo:

- Este guia esclarece diferenças entre Claude/Cursor e GitHub Copilot/VS Code, e traz práticas oficiais e exemplos acionáveis.

1. Visão geral

- Claude/Cursor tem ferramentas como `claude mcp` e `mcpServers` na sua configuração local.
- GitHub Copilot (VS Code) usa: Agent picker (Copilot Chat), Copilot Studio, e arquivos de agente no repositório (`.github/agents/*.agent.md` ou `AGENTS.md`). Não presuma que comandos `claude`/`runSubagent` funcionam em Copilot.
- Codex Desktop: siga `AGENTS.md` como fonte de verdade e veja `docs/setup/CODEX_DESKTOP_SETUP.md` (quality gate, MCP, Playwright, skills do repo).

2. Agentes personalizados (onde e como)

- Repo-level agents: adicione `.github/agents/*.agent.md` ou `AGENTS.md` para orientar o Copilot coding agent.
- VS Code: abra Copilot Chat → Agent picker → selecione o agente (ou configure via Copilot Studio).

3. Subagents / runSubagent

- Nota: `runSubagent` é um padrão Claude/Anthropic; não é um comando oficial do Copilot.
- Em Copilot, habilite as ferramentas no Agent picker e chame o agente/prompt por nome; para automações, use o Copilot coding agent com `AGENTS.md`.

4. MCP e configuração local

- Arquivos `.mcp` / `mcpServers` são cliente-específicos (Cursor/Claude). Para exemplos locais de desenvolvimento, use `.vscode/mcp.json` (exemplo fornecido no repositório). **Não** armazene segredos ou chaves em arquivos de configuração.

5. Orquestração no GitHub

- Use GitHub Rulesets para habilitar Copilot Code Review automático.
- Para PR automation: Copilot coding agent + `AGENTS.md` e CI (lint/test/typecheck) são o fluxo recomendado. Evite instruir equipes a tentar "orquestrar" Copilot via Actions como substituto da revisão e gates oficiais.

6. Handoffs

- Handoffs entre agentes podem funcionar em alguns clientes; porém, Copilot Code Review não faz merge automático — sempre configure branch protection, checks e revisões humanas.

7. Segurança — checklist curta

- Nunca commite segredos/API keys em arquivos de configuração.
- Use GitHub Actions secrets ou variáveis de ambiente para credenciais.
- Exija branch protection e checks (lint/test/typecheck) antes do merge.
- Ao usar MCP local, documente e valide com um checklist de confiança/approval.

8. Exemplos rápidos (copy-paste)

- "Selecione ‘Testing Specialist’ no Agent dropdown e peça: ‘Run tests and produce a summary’".
- "Abra Copilot Chat → Configure Tools → habilite o toolset de testes; então: ‘Run unit tests and summarize failures’".
- "Para PRs: ative Copilot Code Review em Settings → Rules → Rulesets → ‘Automatically request Copilot code review’".

9. Arquivos de exemplo adicionados

- `.vscode/mcp.json` — exemplo local (sem segredos).
- `.github/agents/testing.agent.md` — agente de exemplo: Testing Specialist.

Se quiser, posso abrir um PR com estas alterações e um conjunto de frases substitutas dentro do manual (pt-BR). Quer que eu gere o PR agora?
