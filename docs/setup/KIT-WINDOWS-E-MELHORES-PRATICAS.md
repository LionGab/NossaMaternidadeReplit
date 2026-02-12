# Kit Windows + Melhores Práticas — Nossa Maternidade

> Guia rápido após **git pull**: limpeza do repo, uso no Windows e melhores práticas do projeto.

---

## 1. O que foi feito (pull)

- **Stash** das suas alterações locais (`antes-pull-expo-sdk-55`)
- **Pull com rebase** de `origin/chore/expo-sdk-55` (histórico linear)
- **Stash pop** — suas modificações voltaram (arquivos modificados + `web/README.md` untracked)
- Branch **atualizada** com `origin/chore/expo-sdk-55`

---

## 2. Limpeza do repositório (recomendado)

O Git avisou sobre muitos “loose objects”. Para otimizar e limpar:

```bash
# Git Bash ou WSL (no diretório do projeto)
git prune
# ou mais agressivo (objetos com mais de 2 semanas):
git gc --prune=now
```

---

## 3. Melhores práticas no Windows

### 3.1 Qual comando usar onde

| Objetivo              | Onde rodar              | Comando / script                      |
|-----------------------|-------------------------|---------------------------------------|
| Quality gate          | **PowerShell**          | `npm run quality-gate:win`            |
| Typecheck + lint      | Qualquer                | `npm run typecheck`, `npm run lint`   |
| Scripts `.sh`         | **Git Bash** ou **WSL** | `./scripts/quality-gate.sh` etc.      |
| Expo / Metro          | PowerShell ou Git Bash  | `npm start`                           |
| EAS Build             | PowerShell ou Git Bash  | `npx eas build ...`                   |

### 3.2 Quality gate (obrigatório antes de PR/build)

No **Windows** use a variante PowerShell:

```powershell
npm run quality-gate:win
```

No Git Bash (se preferir):

```bash
npm run quality-gate
```

### 3.3 iOS no Windows

- **Simulador iOS não roda no Windows.** Para testar/buildar iOS use:
  - Mac local, ou
  - **EAS Build** na nuvem: `npx eas build --platform ios --profile <profile>`

### 3.4 Documentação de setup Windows

Guia completo: **[docs/setup/SETUP_WINDOWS.md](SETUP_WINDOWS.md)**  
Inclui: Git, Node, Bun, Android Studio/SDK, variáveis de ambiente, WSL (opcional).

---

## 4. Melhores práticas do projeto (não negociáveis)

### 4.1 Código

| Regra           | Fazer                         | Evitar                    |
|-----------------|-------------------------------|----------------------------|
| TypeScript      | `unknown` + type guards       | `any`, `@ts-ignore`       |
| Logging         | `logger.*` (de `@/utils/logger`) | `console.log` em `src/` |
| Cores           | `Tokens.*`, `useThemeColors()` | `#xxx`, `'white'`, `rgba` |
| Listas          | `FlashList` / `FlatList`      | `ScrollView` + `map()`    |
| Toques          | `Pressable`                   | `TouchableOpacity`        |
| Zustand         | `useStore(s => s.valor)`      | `useStore(s => ({ ... }))` |

### 4.2 Workflow

1. **Antes de PR ou build:** sempre rodar o quality gate (`quality-gate` ou `quality-gate:win`).
2. **Explore → Plan → Implement → Verify** (verificar com quality gate no final).
3. **Commits atômicos:** um tema por commit, mensagem clara.
4. **Não avançar para o próximo Gate** sem o anterior ter passado (G1 → G2 → … → G7).

### 4.3 Constantes imutáveis (não alterar)

- Bundle ID iOS: `br.com.nossamaternidade.app`
- Bundle ID Android: `com.liongab.nossamaternidade`
- Apple Team ID: `KZPW4S77UH`
- RevenueCat: produto `premium`, offering `default`
- Supabase project: `lqahkqfpynypbmhtffyi`

---

## 5. Comandos mais usados (referência rápida)

```powershell
# Desenvolvimento
npm start                    # Expo dev server
npm start:clear              # Limpar cache e iniciar
npm run android              # Rodar no emulador/device Android (se configurado)

# Qualidade (Windows)
npm run quality-gate:win     # Gate completo (TypeCheck + Lint + Build)
npm run typecheck            # Só TypeScript
npm run lint                 # Só ESLint
npm run lint:fix             # ESLint com auto-fix

# Testes
npm test                     # Jest
npm test -- --watch          # Watch mode
npm run test:ci              # Modo CI

# Ambiente
npm run check-env            # Validar .env
npm run validate-secrets     # Validar secrets EAS

# Builds (iOS só via EAS no Windows)
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```

---

## 6. Estrutura do projeto (resumo)

```
src/
├── api/          # Supabase, chat, transcribe
├── ai/            # nathiaPrompt.ts
├── components/    # UI (ui/ = atoms)
├── hooks/
├── navigation/
├── screens/
├── state/        # Zustand
├── theme/        # Tokens
└── utils/        # logger, cn

.claude/skills/   # Skills 2026 (deploy-testflight, pre-commit, verify, etc.)
docs/             # Documentação (este guia em docs/setup/)
```

---

## 7. Próximos passos sugeridos

1. Rodar **`git prune`** (ou `git gc --prune=now`) no Git Bash para limpar o repo.
2. Rodar **`npm run quality-gate:win`** no PowerShell para validar o estado atual.
3. Decidir o que fazer com as alterações locais (commit em branch, ou continuar editando).
4. Consultar **CLAUDE.md** e **AGENTS.md** na raiz para regras detalhadas e fluxo de build (ex.: build iOS).

---

*Atualizado após pull em `chore/expo-sdk-55` — ambiente Windows.*
