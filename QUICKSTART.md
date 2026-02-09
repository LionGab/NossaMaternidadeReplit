# Quickstart - Nossa Maternidade

Setup em **10 minutos**. Passo a passo completo em [docs/setup/QUICKSTART.md](docs/setup/QUICKSTART.md).

---

## TL;DR

```bash
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Configurar ambiente
cp .env.example .env.local
# Editar .env.local com credenciais reais

# 3. Rodar
npm start

# 4. Validar (antes de PR/build)
npm run quality-gate
```

## Pre-requisitos

- Node.js v20+ ou v22+ ([nodejs.org](https://nodejs.org/))
- Git ([git-scm.com](https://git-scm.com/))
- Expo CLI: `npm install -g expo-cli` (opcional, npx funciona)
- Emulador Android ou Simulador iOS (Mac)

## Comandos essenciais

| Comando | O que faz |
|---------|-----------|
| `npm start` | Expo dev server |
| `npm run quality-gate` | TypeCheck + ESLint + Build check |
| `npm run typecheck` | TypeScript apenas |
| `npm run lint:fix` | Auto-fix ESLint |
| `npm test -- --watch` | Jest em watch mode |
| `npm run clean` | Limpar caches Metro/Expo |
| `npm run clean:all` | Nuclear: rm node_modules + reinstala |

## Build de producao

```bash
npm run build:prod:ios        # iOS -> App Store
npm run build:prod:android    # Android AAB -> Play Store
npm run submit:prod:ios       # Submit para App Store Connect
```

## Troubleshooting rapido

```bash
npm run clean && npm install --legacy-peer-deps   # Build failures
npm start:clear                                    # Metro issues
npm run generate-types                             # Schema changed
```

---

Guia completo: [docs/setup/QUICKSTART.md](docs/setup/QUICKSTART.md) | Windows: [docs/SETUP_WINDOWS.md](docs/SETUP_WINDOWS.md)
