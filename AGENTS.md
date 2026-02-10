# AGENTS.md

Este repositório contém o app Expo/React Native "Nossa Maternidade".

O objetivo deste arquivo é orientar agentes (Copilot/Codex/etc.) com regras operacionais do repo, com foco em builds EAS.

## Comandos Úteis

- Instalar deps: `npm ci`
- Quality gate (obrigatório antes de PR/build): `npm run quality-gate`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Testes: `npm test`
- Expo dev server: `npm start`

## Non-negotiables (P0)

- Nunca deixar `console.log` em `src/` (use `logger.*`).
- Evitar `: any` (use `unknown` + type guards).
- Não hardcode cores: `#...`, `rgba(...)`, `'white'`, `'black'` (use `Tokens.*` e/ou `useThemeColors()`).
- Em builds: seguir o fluxo obrigatório em `.claude/rules/always/build-standards.mdc`.

## /build-ios (Fluxo Obrigatório)

Qualquer execução do comando/solicitação de build iOS deve seguir o padrão do arquivo:

- `.claude/rules/always/build-standards.mdc`

Referências de persistência:

- `docs/builds/TEMPLATE.md`
- `docs/builds/NOTES.md`
- `docs/builds/logs/`

### 1) Regra dos 70% (Contexto)

- No início do fluxo, verificar uso de contexto.
- Se `>= 70%`: criar um checkpoint vazio em `docs/builds/YYYY-MM-DD-ios-{profile}.md`, depois executar compactação (`/compact` ou equivalente do seu cliente) e só então continuar.

### 2) Entrevista (Antes de qualquer ação/comando)

Registrar as respostas no checkpoint:

1. Plataforma: iOS
2. Profile (EAS): `development` / `ios_preview` / `ios_testflight` (ou `testflight`) / `production`
3. Auto-submit: Sim/Não (apenas para builds `store`)
4. Branch + objetivo do build

Mapeamento rápido (EAS):

| Profile                         | Distribuição | Uso                      |
| ------------------------------- | ------------ | ------------------------ |
| `development`                   | internal     | Dev client               |
| `ios_preview`                   | internal     | Testes internos (Ad-hoc) |
| `ios_testflight` / `testflight` | store        | TestFlight               |
| `production`                    | store        | App Store                |

### 3) Mostrar evidência P0 (Depois da entrevista)

Antes de rodar qualquer gate/build, explicitar os 3 itens P0 que serão verificados:

```text
P0 Checklist que será verificado:
1. Nenhum console.log em src/
2. Copy correto: "Quando você começou a tentar?"
3. Nenhuma cor hardcoded (#xxx, rgba, 'white', 'black')
```

### 4) Validar Copy/UI P0 (Antes do quality-gate)

Se algum item P0 falhar: interromper e listar cada violação como `arquivo:linha` (sem prosseguir para `quality-gate`).

Comandos de apoio (ajuste conforme necessário, mas mantenha output legível):

- `console.log` (espelhar exclusões do quality gate):
  - `rg -n "console\\.log" src -g"*.ts" -g"*.tsx" --glob '!**/logger.ts' --glob '!**/logger.tsx' --glob '!**/Toast.tsx' --glob '!**/useToast.ts' | rg -v ":\\s*\\*" || true`
- `: any`:
  - `rg -n ": any\\b" src || true`
- Cores hardcoded:
  - `rg -n "#[0-9a-fA-F]{3,8}|rgba?\\(|'white'|'black'" src -g"*.ts" -g"*.tsx" || true`
- Copy "tentando":
  - Buscar manualmente por `Quando você começou a tentar?` (onboarding/ciclo/fertilidade).
- Copy "mês":
  - Garantir copy `cada mês` (e não `ciclo`) onde aplicável.
- Emoji/ícones:
  - Confirmar que renderizam como ícones, não como texto (idealmente via screenshots).

### 5) Quality Gate

Rodar:

- `npm run quality-gate`

Se falhar:

- Mostrar apenas o trecho mínimo (erro + ~20 linhas).
- Não colar log completo no chat (ver "Anti-Log-Poluição").

### 6) Build EAS (iOS)

Pré-checks:

- Autenticação: `npx eas-cli whoami`
- Credenciais iOS (se necessário): `npx eas-cli credentials --platform ios`

Build:

- `development`: `npx eas-cli build --platform ios --profile development`
- `ios_preview`: `npx eas-cli build --platform ios --profile ios_preview`
- `ios_testflight`: `npx eas-cli build --platform ios --profile ios_testflight`
- `production`: `npx eas-cli build --platform ios --profile production`

### 7) Auto-submit (Opcional)

Somente se o usuário confirmou na entrevista e o profile for `store`:

- `npx eas-cli submit --platform ios --profile {profile} --latest`

### 8) Persistência (Evidências e histórico)

Para cada build, criar/atualizar:

1. Checkpoint: `docs/builds/YYYY-MM-DD-ios-{profile}.md` (basear em `docs/builds/TEMPLATE.md`)
2. Histórico: atualizar `docs/builds/NOTES.md` com apenas 3 bullets + links (sempre inserir builds novos no topo)
3. Se houver erro: salvar log completo em `docs/builds/logs/{build-id}.txt` e referenciar no checkpoint

### 9) Anti-Log-Poluição (Obrigatório)

- Nunca colar logs completos no chat.
- Sempre:
  - Trecho mínimo (erro + ~20 linhas acima/abaixo)
  - Log completo salvo em `docs/builds/logs/` e linkado no checkpoint
