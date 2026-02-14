# Guia Hibrido: MacBook Air 8GB + Windows 32GB

> Estrategia definitiva para usar as duas maquinas no projeto Nossa Maternidade.
> Atualizado: 2026-02-14

---

## Regra de ouro

**Windows = trabalho pesado. Mac = iOS quando necessario. Builds = nuvem (EAS).**

---

## Divisao de responsabilidades

```
WINDOWS 32GB + RTX 4060 Ti            MAC AIR 8GB
━━━━━━━━━━━━━━━━━━━━━━━━━━━           ━━━━━━━━━━━━━━━━━━━━━

Desenvolvimento de features             iOS Simulator (testar UI)
TypeScript, lint, testes                 Expo Go no iPhone (via QR)
Android Emulator (nativo, rapido)        Xcode debugging (crashes)
Claude Code + Cursor (IDE principal)     Validacao final cross-platform
Supabase migrations, NathIA dev
Docker, Playwright, testes E2E

         EAS CLOUD (AMBAS MAQUINAS)
         ━━━━━━━━━━━━━━━━━━━━━━━━━
         eas build --platform ios
         eas build --platform android
         eas submit (App Store + Play Store)
         NAO precisa do Mac para builds!
```

---

## Como sincronizar

A sincronizacao e via **git** — simples e confiavel:

```
Windows (dev)          GitHub            Mac (iOS test)
    |                    |                    |
    +--- git push ------>|                    |
    |                    |<--- git pull ------+
    |                    |                    |
    |   "feat: card X"  |   npm install      |
    |                    |   npm start        |
    |                    |   (testa no iOS)   |
```

### No Windows (apos desenvolver):

```powershell
git add .
git commit -m "feat: novo componente"
git push origin main
```

### No Mac (para testar iOS):

```bash
git pull origin main
npm install        # so se package.json mudou
npm start          # testa no Simulator ou Expo Go
```

---

## Fluxo diario

| Hora       | Maquina     | O que fazer                                                  |
| ---------- | ----------- | ------------------------------------------------------------ |
| Manha      | **Windows** | Desenvolver features, `npm run quality-gate`                 |
| Testar iOS | **Mac**     | `git pull && npm start` → Simulator                          |
| Release    | **Windows** | `eas build --platform all --profile production`              |
| Submit     | **Windows** | `eas submit --platform ios && eas submit --platform android` |

---

## Setup Windows (se nao fez)

Guia completo: **[SETUP_WINDOWS.md](SETUP_WINDOWS.md)**

Resumo em 6 passos:

```powershell
git clone git@github.com:LionGab/NossaMaternidadeReplit.git
cd NossaMaternidadeReplit
npm install
Copy-Item .env.example .env.local   # preencher valores
npm run quality-gate
npm start                            # testar com Expo Go
```

---

## Otimizacao do Mac 8GB

Guia completo: **[OTIMIZACAO_RAM_M1_8GB.md](OTIMIZACAO_RAM_M1_8GB.md)**

Regras criticas:

- **NUNCA** rodar build local no Mac (`eas build --local` mata 8GB)
- **NUNCA** Metro + Simulator + Cursor + Chrome ao mesmo tempo
- **SEMPRE** fechar Simulator quando nao estiver testando
- Usar **Expo Go no iPhone fisico** em vez de Simulator (consome menos RAM)
- `sudo purge` a cada 2-3 horas

---

## SSH entre maquinas (opcional)

Guia completo: **[SSH_MACBOOK_WINDOWS_BIDIRECIONAL.md](SSH_MACBOOK_WINDOWS_BIDIRECIONAL.md)**

Permite rodar comandos remotamente:

```powershell
# No Windows, rodar iOS no Mac:
ssh macbook "cd ~/NossaMaternidadeReplit && npm start"

# No Mac, rodar quality gate no Windows:
ssh windows-remoto "cd ~/NossaMaternidadeReplit && npm run quality-gate"
```

---

## Claude Code em ambas maquinas

### Windows

```powershell
npm install -g @anthropic-ai/claude-code
claude                          # abre sessao
# Skills, hooks, MCP — tudo carrega automaticamente do repo
```

### Mac

```bash
npm install -g @anthropic-ai/claude-code
claude                          # abre sessao
# Mesma config, mesmos skills
```

A configuracao esta TODA no repositorio (`.claude/`, `.mcp.json`). Ao fazer `git pull`, ambas as maquinas tem o mesmo setup.

---

## Cursor em ambas maquinas

A config tambem esta no repositorio:

- `.cursor/rules/*.mdc` — 6 regras (core, TS, design, NathIA, Supabase, builds)
- `.cursor/mcp.json` — 11 MCP servers

Basta abrir o projeto no Cursor em qualquer maquina.

---

## Builds — SEMPRE na nuvem

Voce ja tem tudo configurado no `eas.json`. Do Windows ou Mac:

```bash
# Build iOS para TestFlight (NAO precisa do Mac!):
eas build --platform ios --profile ios_testflight

# Build Android para Play Store:
eas build --platform android --profile production

# Submit para as lojas:
eas submit --platform ios --profile ios_testflight --latest
eas submit --platform android --profile production --latest
```

---

## Checklist: esta tudo funcionando?

### Windows

- [ ] `git clone` feito
- [ ] `npm install` passou
- [ ] `.env.local` configurado
- [ ] `npm run quality-gate` passou
- [ ] `npm start` funciona (QR code aparece)
- [ ] Android Emulator roda o app
- [ ] Claude Code instalado e funciona

### Mac

- [ ] `git pull` atualizado
- [ ] `npm start` funciona
- [ ] iOS Simulator roda o app
- [ ] Expo Go no iPhone funciona

### Ambas

- [ ] `eas login` configurado
- [ ] SSH entre maquinas (opcional)

---

## Docs relacionados

| Doc                                                                        | Conteudo                   |
| -------------------------------------------------------------------------- | -------------------------- |
| [SETUP_WINDOWS.md](SETUP_WINDOWS.md)                                       | Setup Windows do zero      |
| [OTIMIZACAO_RAM_M1_8GB.md](OTIMIZACAO_RAM_M1_8GB.md)                       | Sobreviver com 8GB         |
| [SSH_MACBOOK_WINDOWS_BIDIRECIONAL.md](SSH_MACBOOK_WINDOWS_BIDIRECIONAL.md) | SSH entre maquinas         |
| [KIT-WINDOWS-E-MELHORES-PRATICAS.md](KIT-WINDOWS-E-MELHORES-PRATICAS.md)   | Praticas Windows           |
| [CLAUDE_CODE_GUIDE_2026.md](CLAUDE_CODE_GUIDE_2026.md)                     | Best practices Claude Code |
