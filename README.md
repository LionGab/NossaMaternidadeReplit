# Nossa Maternidade

[![CI](https://github.com/LionGab/NossaMaternidade/actions/workflows/ci.yml/badge.svg)](https://github.com/LionGab/NossaMaternidade/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/LionGab/NossaMaternidade/graph/badge.svg)](https://codecov.io/gh/LionGab/NossaMaternidade)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25%20Strict-blue?logo=typescript)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)
![Tests](https://img.shields.io/badge/Tests-300%2B%20passing-brightgreen)
![License](https://img.shields.io/badge/License-Proprietary-red)

Aplicativo de saude materna para gravidas e maes no pos-parto no Brasil. Criado por **Nathalia Valente**.

> **Comecar?** [QUICKSTART.md](QUICKSTART.md) (10min) | Setup: [docs/SETUP_WINDOWS.md](docs/SETUP_WINDOWS.md) ou `docs/SETUP_MAC.md`

## Sobre

Nossa Maternidade oferece:

- **NathIA**: Assistente de IA personalizada (Gemini 2.0)
- **Comunidade Maes Valente**: Rede social moderada para maes
- **Mundo da Nath**: Conteudo exclusivo da Nathalia Valente
- **Meus Cuidados**: Rastreamento de humor, habitos e bem-estar
- **Ciclo Menstrual**: Calendario com previsao de fertilidade
- **Premium**: Assinatura via RevenueCat (mensal/anual)

## Stack Tecnica

| Categoria  | Tecnologia                                   |
| ---------- | -------------------------------------------- |
| Framework  | Expo SDK 54 + React Native 0.81              |
| Linguagem  | TypeScript (strict mode)                     |
| Backend    | Supabase (Auth, DB, Edge Functions, Storage) |
| Estilos    | NativeWind v4 (TailwindCSS)                  |
| Estado     | Zustand + AsyncStorage                       |
| Navegacao  | React Navigation 7                           |
| Animacoes  | Reanimated v3 + Gesture Handler              |
| Pagamentos | RevenueCat                                   |
| IA         | Google Gemini 2.0 Flash                      |

## Navegacao (5 Tabs)

```
┌─────────────────────────────────────────────────┐
│  Home  │  Comunidade  │  NathIA  │  Nath  │  Cuidados  │
└─────────────────────────────────────────────────┘
```

1. **Home** - Tela inicial com saudacao, dicas e acesso rapido
2. **Comunidade** - Feed social Maes Valente com posts e grupos
3. **NathIA** - Chat com IA (central, avatar destacado)
4. **Mundo da Nath** - Conteudo exclusivo da criadora
5. **Meus Cuidados** - Rastreadores de humor, agua, sono, habitos

### Fluxo de Navegacao

```
Auth → Notification Permission → Onboarding (9 telas) → MainTabs
```

**Onboarding**: Welcome → Stage → Date → Concerns → EmotionalState → CheckIn → Season → Summary → Paywall

## Estrutura do Projeto

```
src/
├── api/           # Clients (supabase, chat, transcribe, image-gen)
├── ai/            # Prompts e config da NathIA
├── components/    # Componentes React (ui/ para atomos)
├── config/        # Feature flags, constantes
├── hooks/         # Hooks customizados
├── navigation/    # React Navigation
├── screens/       # Telas do app
├── services/      # Logica de negocio
├── state/         # Stores Zustand
├── theme/         # Design tokens (Calm FemTech)
├── types/         # Tipos TypeScript
└── utils/         # Utilitarios (logger, validation, error-handler)

supabase/
├── functions/     # Edge Functions (ai, transcribe, moderate-content, etc)
└── migrations/    # SQL migrations
```

## Design System: Calm FemTech

Paleta hibrida Azul + Rosa focada em calma e acolhimento:

- **Azul Pastel** (primary): Estrutura, navegacao
- **Rosa Vibrante** (accent): CTAs, destaques (10-15%)
- **Lilas Suave** (secondary): Apoio, meditacao
- **Teal** (health): Indicadores de saude

**Fonte**: `src/theme/tokens.ts`

- WCAG AAA (contraste 7:1)
- Grid 8pt
- Tokens semanticos: error, warning, info, success

## Seguranca

| Feature        | Implementacao                        |
| -------------- | ------------------------------------ |
| Tokens de Auth | SecureStore + MMKV criptografado     |
| Validacao      | Schemas Zod em todas as APIs         |
| Error Handling | Sistema centralizado com AppError    |
| Dados Pessoais | LGPD compliance, sessao compactada   |
| Moderacao      | Edge function com fail-safe          |
| CORS           | Allowlist restrita em Edge Functions |

## Premium (RevenueCat)

- **Produtos**: `nossa_maternidade_monthly`, `nossa_maternidade_yearly`
- **Entitlement**: `premium`
- **Free tier**: 6 mensagens IA/dia (reset meia-noite)
- **Premium**: Ilimitado

## Comandos

### Desenvolvimento

```bash
npm start              # Expo dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm test -- --watch    # Testes em watch mode
```

### Quality Gate (OBRIGATORIO antes de PR)

```bash
npm run quality-gate   # TypeScript + ESLint + Build check
npm run typecheck      # So TypeScript
npm run lint:fix       # Auto-fix ESLint
```

### Build & Deploy

```bash
# TestFlight (iOS)
eas build --platform ios --profile ios_testflight
eas submit --platform ios --profile ios_testflight --latest

# Production
npm run build:prod:ios      # Build producao iOS
npm run build:prod:android  # Build producao Android
npm run submit:prod:ios     # Submit App Store
```

**📱 TestFlight Guide:** [docs/release/TESTFLIGHT_BUILD_GUIDE.md](docs/release/TESTFLIGHT_BUILD_GUIDE.md)

### Supabase

```bash
npm run generate-types      # Regenerar tipos apos schema change
npm run deploy-functions    # Deploy todas edge functions
```

## Release Gates

```
G0 (Diagnose) → G1 (Quality) → G2 (Auth) → G3 (RLS) → G4 (RevenueCat) → G5 (NathIA) → G6 (Build) → G7 (Submit)
```

Ver: [docs/release/TESTFLIGHT_GATES_v1.md](docs/release/TESTFLIGHT_GATES_v1.md)

## Testes

- **Framework**: Jest
- **Cobertura**: 300+ testes
- **Localizacao**: `src/**/__tests__/*.test.ts(x)`

Modulos com alta cobertura:

- `error-handler.ts`: 31 testes
- `supabaseAuthStorage.ts`: 21 testes
- `validation.ts`: 75 testes

```bash
npm test                    # Todos os testes
npm run test:coverage       # Relatorio de cobertura
```

## Constantes Imutaveis

| Constante           | Valor                      |
| ------------------- | -------------------------- |
| Bundle ID           | `app.nossamaternidade.app` |
| Apple Team ID       | `KZPW4S77UH`               |
| ASC App ID          | `6756980888`               |
| RevenueCat Product  | `premium`                  |
| RevenueCat Offering | `default`                  |

## Documentacao

| Doc                                                                        | Descricao                  |
| -------------------------------------------------------------------------- | -------------------------- |
| [QUICKSTART.md](QUICKSTART.md)                                             | Setup em 10min             |
| [CLAUDE.md](CLAUDE.md)                                                     | Regras para AI/Claude Code |
| [docs/DESIGN_SYSTEM_CALM_FEMTECH.md](docs/DESIGN_SYSTEM_CALM_FEMTECH.md)   | Design system              |
| [docs/release/TESTFLIGHT_GATES_v1.md](docs/release/TESTFLIGHT_GATES_v1.md) | Release gates              |
| [docs/PREMIUM_IAP_SETUP.md](docs/PREMIUM_IAP_SETUP.md)                     | RevenueCat setup           |

---

**Desenvolvido para mulheres que buscam acompanhar sua saude com carinho**

# NossaMaternidadeSLC
=======
# 👶 Nossa Maternidade

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
[![Code Quality](https://img.shields.io/badge/code_quality-A+-brightgreen)](#)

**Aplicativo de saúde materna para grávidas e mães no pós-parto no Brasil.**

[Features](#-features) • [Quick Start](#-quick-start) • [Docs](#-documentação) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🤖 **NathIA**
Assistente de IA personalizada powered by Gemini 2.0 Flash

### 👥 **Comunidade Mães Valente**
Rede social moderada para mães

### 🎥 **Mundo da Nath**
Conteúdo exclusivo da Nathalia Valente

### 💖 **Meus Cuidados**
Rastreamento de humor, hábitos e bem-estar

### 📅 **Ciclo Menstrual**
Calendário com previsão de fertilidade

### 💎 **Premium**
Assinatura via RevenueCat (mensal/anual)

---

## 🚀 Quick Start
```bash
# Clone o repositório
git clone https://github.com/LionGab/NossaMaternidadeReplit.git

# Entre na pasta
cd NossaMaternidadeReplit

# Instale as dependências
npm install

# Inicie o Expo
npm start
```

📚 **Setup Completo**: Ver `QUICKSTART.md` (10min)

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [QUICKSTART.md](QUICKSTART.md) | Setup em 10 minutos |
| [CLAUDE.md](CLAUDE.md) | Regras para AI/Claude Code |
| [Design System](docs/DESIGN_SYSTEM_CALM_FEMTECH.md) | Calm FemTech UI/UX |
| [TestFlight Guide](docs/release/TESTFLIGHT_BUILD_GUIDE.md) | Build & Release iOS |
| [Gates](docs/release/TESTFLIGHT_GATES_v1.md) | Release Gates |
| [Premium Setup](docs/PREMIUM_IAP_SETUP.md) | RevenueCat Config |

---

## 🛠️ Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Expo SDK 54 + React Native 0.81 |
| Linguagem | TypeScript (strict mode) |
| Backend | Supabase (Auth, DB, Edge Functions, Storage) |
| Estilos | NativeWind v4 (TailwindCSS) |
| Estado | Zustand + AsyncStorage |
| Navegação | React Navigation 7 |
| Animações | Reanimated v3 + Gesture Handler |
| Pagamentos | RevenueCat |
| IA | Google Gemini 2.0 Flash |

---

## 🤝 Contributing

Contributions are welcome! Por favor, leia nosso [Contributing Guide](CONTRIBUTING.md) antes de submeter PRs.

### Quality Gate ✅
```bash
npm run quality-gate
```

Antes de criar um PR, certifique-se de que:
- ✅ TypeScript sem erros
- ✅ ESLint sem warnings
- ✅ Testes passando
- ✅ Build funcionando

---

## 📄 Licença

Este projeto é privado e confidencial.

---

<div align="center">

**Desenvolvido com ❤️ para mulheres que buscam acompanhar sua saúde com carinho**

</div>
>>>>>>> 99fb501 (chore: adiciona templates de issue/PR, workflows CI e CONTRIBUTING)
