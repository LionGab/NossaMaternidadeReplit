# Setup Master — Nossa Maternidade

> Guia único e definitivo: Mac (8GB) + Windows (32GB) + Claude Code + Cursor
> Versão: 1.0 | 2026-02-14

---

## Visão geral

**Regra de ouro:** Windows = trabalho pesado. Mac = iOS quando necessário. Builds = nuvem (EAS).

| Máquina | Papel |
| ------- | ----- |
| **Windows 32GB + RTX** | Desenvolvimento, TypeScript, Android Emulator, Claude Code, Cursor (IDE principal) |
| **Mac Air 8GB** | iOS Simulator, validação UI, Expo Go no iPhone |
| **EAS Cloud** | Builds iOS/Android — **não precisa do Mac** para builds |

---

## Setup Windows (4 passos)

### 1. Clone

```powershell
git clone git@github.com:LionGab/NossaMaternidadeReplit.git
cd NossaMaternidadeReplit
```

### 2. Env vars

```powershell
Copy-Item .env.example .env.local
# Preencher: SUPABASE_*, GITHUB_TOKEN (se usar MCP GitHub)
npm run check-env
```

### 3. Cursor

- Abrir projeto no Cursor
- Config já vem do repo: `.cursor/rules/*.mdc` (11 regras), `.cursor/mcp.json` (11 MCP servers)
- Tudo carrega automaticamente

### 4. Claude Code (opcional)

```powershell
npm install -g @anthropic-ai/claude-code
claude   # abre sessão
```

**Primeiro acesso no Windows:**
1. `git clone` feito
2. `npm install`
3. `.env.local` configurado
4. `npm start` → QR code aparece
5. Desenvolver

---

## Setup Mac (4 passos + RAM)

### 1. Clone / pull

```bash
git clone git@github.com:LionGab/NossaMaternidadeReplit.git
# ou: git pull origin main (se já clonou)
cd NossaMaternidadeReplit
```

### 2. Env vars

```bash
cp .env.example .env.local
# Preencher valores (mesmos do Windows)
```

### 3. Cursor + Claude Code

- Abrir projeto no Cursor — mesma config do repo
- `claude` para sessões Claude Code (skills, hooks, MCP idênticos)

### 4. Otimização RAM (8GB) — **OBRIGATÓRIO**

| Evitar | Fazer |
| ------ | ----- |
| Build local no Mac (`eas build --local`) | Sempre EAS cloud |
| Metro + Simulator + Cursor + Chrome juntos | Fechar o que não está usando |
| Simulator aberto quando não testando | Fechar Simulator |
| — | `sudo purge` a cada 2–3 horas |
| — | Preferir Expo Go no iPhone (menos RAM) |

Guia completo: [OTIMIZACAO_RAM_M1_8GB.md](OTIMIZACAO_RAM_M1_8GB.md)

---

## Workflow diário

| Hora | Máquina | Ação |
| ---- | ------- | ---- |
| Manhã | **Windows** | Desenvolver, `npm run quality-gate` |
| Teste iOS | **Mac** | `git pull && npm start` → Simulator |
| Release | **Windows** | `eas build --platform all --profile production` |
| Submit | **Windows** | `eas submit --platform ios --latest` (e Android) |

### Sincronização via Git

```
Windows (dev)     →  git push  →  GitHub
                                 ↓
Mac (iOS test)    ←  git pull  ←  GitHub
```

---

## Ferramentas (já no repo)

### Skills (11)

| Skill | Comando | Uso |
| ----- | ------- | --- |
| Deploy iOS | `/deploy-testflight` | TestFlight |
| Deploy Android | `/deploy-android` | Play Store |
| Pre-commit | `/pre-commit` | Quality gate rápido |
| Fix Types | `/fix-types` | Erros TypeScript |
| Verify | `/verify` | Quality gate completo |
| Review | `/review` | Code review |
| NathIA | `/nathia` | Especialista IA |
| Gates | `/gates` | Release G1–G7 |
| Commit | `/commit` | Quality gate + commit atômico |
| Superdesign | `/superdesign` | UI/UX design |
| UI/UX Pro Max | `/ui-ux-pro-max` | Design intelligence |

### Regras Cursor (11)

- `.cursor/rules/00-react-native-expo.mdc`
- `.cursor/rules/01-app-store-play-store.mdc`
- `.cursor/rules/02-typescript-strict.mdc`
- `.cursor/rules/03-design-system.mdc`
- `.cursor/rules/04-nathia.mdc`
- `.cursor/rules/05-supabase.mdc`
- `.cursor/rules/10-skill-quality.mdc` até `14-skill-typescript.mdc`

### MCP servers (11)

- supabase, expo, xcode, react-native-guide, rn-debugger
- sequential-thinking, context7, github-readonly, memory-keeper
- playwright, figma-devmode

Config: `.claude/mcp-config.json` (Claude) e `.cursor/mcp.json` (Cursor)

---

## Troubleshooting

### MCP não conecta

- Windows: ver [MCP_SETUP_WINDOWS.md](MCP_SETUP_WINDOWS.md), [MCP_WINDOWS_FIX.md](MCP_WINDOWS_FIX.md)
- Validar `GITHUB_TOKEN`, `SUPABASE_*` em variáveis de ambiente
- Reiniciar Cursor após alterar config

### Rules não carregam

- Confirmar `.cursor/rules/*.mdc` no repo
- Abrir projeto pela pasta raiz (não subpasta)

### Mac travando (8GB)

- `sudo purge` para liberar memória
- Fechar Simulator, Chrome, abas desnecessárias
- Reiniciar Cursor se consumir >2GB
- Nunca rodar build local (`eas build` na nuvem)

---

## Checklist — validação completa

### Windows

- [ ] `git clone` feito
- [ ] `npm install` passou
- [ ] `.env.local` configurado
- [ ] `npm run quality-gate` passou
- [ ] `npm start` funciona (QR code)
- [ ] Android Emulator roda o app
- [ ] Cursor abre o projeto
- [ ] Claude Code instalado (opcional)

### Mac

- [ ] `git pull` atualizado
- [ ] `npm start` funciona
- [ ] iOS Simulator roda o app
- [ ] Expo Go no iPhone funciona
- [ ] `sudo purge` aplicado periodicamente

### Ambas

- [ ] `eas login` configurado
- [ ] SSH entre máquinas (opcional): [SSH_MACBOOK_WINDOWS_BIDIRECIONAL.md](SSH_MACBOOK_WINDOWS_BIDIRECIONAL.md)

---

## Best practices

- **Git:** commits atômicos, mensagem convencional (`feat:`, `fix:`)
- **Quality gate:** `npm run quality-gate` antes de PR/build
- **Builds:** sempre EAS cloud; não buildar local no Mac 8GB
- **Performance:** fechar Simulator/Chrome quando não usar; `sudo purge` no Mac

---

## Docs relacionados

| Doc | Conteúdo |
| --- | -------- |
| [SETUP_WINDOWS.md](SETUP_WINDOWS.md) | Setup Windows detalhado |
| [GUIA_HIBRIDO_MAC_WINDOWS.md](GUIA_HIBRIDO_MAC_WINDOWS.md) | Estratégia híbrida |
| [OTIMIZACAO_RAM_M1_8GB.md](OTIMIZACAO_RAM_M1_8GB.md) | Mac 8GB |
| [CURSOR_CLAUDE_SETUP_PRAGMATICO.md](CURSOR_CLAUDE_SETUP_PRAGMATICO.md) | O que realmente funciona |
| [CLAUDE_CODE_GUIDE_2026.md](CLAUDE_CODE_GUIDE_2026.md) | Best practices Claude Code |
