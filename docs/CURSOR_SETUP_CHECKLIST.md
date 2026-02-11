# Checklist: Setup Cursor (MacBook Air 8GB)

> Guia rápido para configurar o Cursor IDE no projeto Nossa Maternidade.

---

## ✅ Instalação Básica

- [ ] Cursor IDE instalado (https://cursor.sh/)
- [ ] Cursor CLI configurado (`cursor --version` funciona)
- [ ] Node.js 20+ instalado (`node -v`)
- [ ] Dependências do projeto instaladas (`npm install`)

---

## ✅ Extensões (apenas 3)

Instale via Cursor (Cmd+Shift+X) ou linha de comando:

```bash
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
cursor --install-extension bradlc.vscode-tailwindcss
```

- [ ] **ESLint** — lint em tempo real
- [ ] **Prettier** — formatação automática
- [ ] **Tailwind CSS IntelliSense** — autocomplete NativeWind

**Não instale**:

- ❌ React Native Tools (muito pesada)
- ❌ GitLens (desnecessária)
- ❌ Error Lens (pesada)

---

## ✅ Configurações de Desempenho

Os arquivos `.vscode/settings.json` e `.vscode/extensions.json` já foram criados com:

- [ ] TypeScript memory limit: 1GB
- [ ] Minimap desabilitado
- [ ] File watchers otimizados
- [ ] Prettier como formatador padrão

**Verificar**:

```bash
bash scripts/setup/setup-cursor-mac.sh
```

---

## ✅ MCP Servers

O arquivo `.cursor/mcp.json` está configurado com:

- [ ] `expo-mcp` — EAS Build, docs
- [ ] `context7` — docs de bibliotecas
- [ ] `xcode-mcp` — simuladores iOS
- [ ] `github` — repos, issues, PRs

**Ativar**: Reinicie o Cursor após clonar o repo.

---

## ✅ Variáveis de Ambiente

- [ ] Criar `.env` na raiz (`cp .env.example .env`)
- [ ] Preencher `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Preencher `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Preencher `GEMINI_API_KEY`
- [ ] Adicionar `SUPABASE_DB_URL` ao `~/.zshrc` (para scripts CLI)
- [ ] Adicionar `SUPABASE_ACCESS_TOKEN` ao `~/.zshrc`
- [ ] `source ~/.zshrc`

**Verificar**:

```bash
npm run check-env
```

---

## ✅ Quality Gate

Rode antes de qualquer commit/build:

```bash
npm run quality-gate
```

- [ ] TypeScript: sem erros
- [ ] ESLint: sem warnings bloqueantes
- [ ] Build: `expo export` bem-sucedido

---

## ✅ Executar App

```bash
npm start              # Dev server
npm run ios            # iOS (simulador)
npm run android        # Android (emulador)
npm run web            # Web (preview)
```

- [ ] Dev server inicia sem erros
- [ ] App abre no simulador/emulador
- [ ] Hot reload funciona

---

## ✅ Monitorar Desempenho

### Activity Monitor (macOS)

- [ ] Cursor Helper: <2GB de memória
- [ ] TypeScript server: <1GB de memória

### Extension Monitor (Cursor)

1. Cmd+Shift+P → "Developer: Open Extension Monitor"
2. Verificar que nenhuma extensão está usando >50MB

---

## ⚠️ Troubleshooting

| Problema                   | Solução                                            |
| -------------------------- | -------------------------------------------------- |
| "TypeScript out of memory" | Feche outros projetos, reinicie Cursor             |
| "Module not found @/\*"    | `npm run clean && npm install`                     |
| "Metro bundler failed"     | `npm run start:clear`                              |
| "Prettier not formatting"  | Cmd+Shift+P → "Format Document With..." → Prettier |

---

## 📚 Documentação

- [QUICKSTART.md](../QUICKSTART.md) — Início rápido
- [SETUP_MAC.md](SETUP_MAC.md) — Setup completo macOS
- [CURSOR_EXTENSIONS_8GB.md](CURSOR_EXTENSIONS_8GB.md) — Extensões detalhadas
- [CLAUDE.md](../CLAUDE.md) — Guia para Claude/Cursor Agent

---

**Última atualização**: 2026-02-11  
**Hardware**: MacBook Air 2020, 8GB RAM
