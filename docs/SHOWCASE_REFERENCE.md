# 🏆 SHOWCASE REFERENCE — React Native + Expo + TypeScript

**Apps de referência para NossaMaternidade**

---

## 📱 APPS EM PRODUÇÃO (Fortune 500 + Unicorns)

### 🔵 META (Facebook)

- **Apps:** Facebook Marketplace, Messenger Desktop, Ads Manager, Meta Quest
- **Tech:** React Native core contributor
- **Escala:** Bilhões de usuários
- **Lição:** RN escala para apps de nível enterprise

### 🟢 SHOPIFY

- **Apps:** Shop App (Arrive), Shopify POS, Shopify Mobile
- **Tech:** 100% React Native para todos os apps mobile
- **Números:**
  - 95% code sharing iOS/Android (Shop App)
  - 99% code sharing (Compass)
  - 2x produtividade vs nativo
- **Blog:** shopify.engineering/topics/mobile
- **Lição:** Migração de nativo para RN vale a pena

### 🟣 MICROSOFT

- **Apps:** Office Mobile, Teams, Xbox, Outlook
- **Tech:** React Native + React Native Windows/macOS
- **Escala:** Apps em todas as plataformas (mobile + desktop)
- **Showcase:** microsoft.github.io/react-native-windows/resources-showcase

### 🟠 AMAZON

- **Apps:** Amazon Shopping, Kindle E-readers
- **Tech:** React Native desde 2016
- **Lição:** Adoção early payer em empresa conservadora

### 🔴 WIX

- **Tech:** Uma das maiores codebases RN do mundo
- **Open Source:** Contribuidor ativo (react-native-navigation, etc)

---

## 🚀 EXPO CUSTOMERS (Cases Documentados)

### ⭐ PARTIFUL (5.0 App Store)

**O que é:** App de eventos/festas sociais
**Resultados:**

- ⭐ 5.0 rating App Store
- 130K+ downloads em 3 meses
- Web → Mobile em 6 meses
- Nunca abriram Xcode

**Stack:**

- Expo Router (deep linking universal)
- EAS Build + Submit + Update
- Notifications, Contacts, Calendar, Crypto

**Lição para NossaMaternidade:**

> "O valor real é que Expo permite que engenheiros foquem em resolver problemas e melhorar o produto para usuários."

**Links:**

- App: apps.apple.com/us/app/partiful/id1662982304
- Site: partiful.com

---

### 🎬 CAMEO

**O que é:** Vídeos personalizados de celebridades
**Resultados:**

- Hiper-crescimento
- 2x tamanho do time de engenharia
- Devs web → mobile no dia 1

**Por que Expo:**

> "Expo tem sido integral para nossa capacidade de lançar features valiosas rapidamente."

**Links:**

- iOS: apps.apple.com/us/app/cameo-personal-celeb-videos/id1258311581
- Android: play.google.com/store/apps/details?id=com.baronapp.cameo

---

### 🏠 FLEXPORT

**O que é:** Logística global
**Quote:**

> "Expo aumentou dramaticamente a alavancagem do nosso time."

---

### 🎁 GOODY

**O que é:** Presentes corporativos
**Quote:**

> "Com Expo, nossa velocidade de iteração disparou, e pessoas elogiam o polish do nosso app."

---

### 🦠 ZOE (COVID Study)

**O que é:** Estudo de saúde com IA
**Resultados:**

- 1M+ usuários
- App construído em 1 SEMANA com Expo

**Lição:** Expo permite MVP extremamente rápido

---

### 📱 OUTROS EXPO CUSTOMERS

- **Brex** - Fintech
- **PrettyLittleThing** - E-commerce moda
- **Codecademy** - EdTech
- **Pizza Hut** - Food delivery
- **DailyPay** - Fintech
- **Front** - Customer communication
- **ShapeShift** - Crypto
- **Spikeball** - Sports

---

## 🛠️ BOILERPLATES & TEMPLATES

### 🔥 IGNITE (Infinite Red)

**Repo:** github.com/infinitered/ignite
**Status:** Boilerplate mais popular (desde 2016)
**Economia:** 2-4 semanas de setup

**Tech Stack:**
| Lib | Versão | Uso |
|-----|--------|-----|
| React Native | 0.81 | Core |
| React | 19 | UI |
| TypeScript | 5 | Tipagem |
| Expo | 54 | SDK |
| React Navigation | 7 | Navegação |
| RN Reanimated | 4 | Animações |
| MMKV | 3 | Storage |
| apisauce | 3 | REST |
| Jest | 29 | Testes |
| date-fns | 4 | Datas |
| Maestro | - | E2E |

**Comando:**

```bash
npx ignite-cli@latest new NossaMaternidade --yes
```

---

## 📊 MÉTRICAS DE REFERÊNCIA (Targets)

### App Store Rating

| App            | Rating  | Reviews |
| -------------- | ------- | ------- |
| Partiful       | ⭐ 5.0  | Elite   |
| Cameo          | ⭐ 4.8  | 100K+   |
| Shop (Shopify) | ⭐ 4.7  | 1M+     |
| **Target NM**  | ⭐ 4.5+ | -       |

### Code Sharing iOS/Android

| App           | % Shared |
| ------------- | -------- |
| Shop (Arrive) | 95%      |
| Compass       | 99%      |
| **Target NM** | 90%+     |

### Performance

| Métrica    | Benchmark |
| ---------- | --------- |
| Cold start | < 2s      |
| TTI        | < 3s      |
| FPS        | 60fps     |
| Crash rate | < 0.1%    |

---

## 🎯 CHECKLIST PARA 4.5+ STARS

### ✅ UX Essenciais

- [ ] Onboarding < 3 telas
- [ ] Deep linking funcional
- [ ] Offline mode básico
- [ ] Push notifications opt-in elegante
- [ ] Loading states (skeletons)
- [ ] Error states amigáveis
- [ ] Haptic feedback

### ✅ Performance

- [ ] FlashList para listas longas
- [ ] Image caching (expo-image)
- [ ] Lazy loading de telas
- [ ] Bundle size otimizado
- [ ] Hermes habilitado

### ✅ Qualidade

- [ ] Crash reporting (Sentry)
- [ ] Analytics (Amplitude/Mixpanel)
- [ ] A/B testing ready
- [ ] Feature flags
- [ ] Error boundaries

### ✅ Store Compliance

- [ ] Privacy manifest (iOS 17+)
- [ ] App Tracking Transparency
- [ ] LGPD/GDPR compliance
- [ ] Accessibility (a11y) labels
- [ ] Screenshots 6.7" + 5.5"

---

## 🔗 RECURSOS

### Documentação Oficial

- reactnative.dev/showcase
- expo.dev/customers
- shopify.engineering/topics/mobile

### Boilerplates

- github.com/infinitered/ignite
- github.com/obytes/react-native-template-obytes

### Bibliotecas Recomendadas

- **UI:** tamagui, gluestack-ui, nativewind
- **Forms:** react-hook-form + zod
- **State:** zustand, jotai, legend-state
- **Navigation:** expo-router, react-navigation
- **Storage:** MMKV, expo-secure-store
- **Network:** tanstack-query, apisauce

### Comunidades

- Infinite Red Slack: community.infinite.red
- Expo Discord: chat.expo.dev
- React Native Directory: reactnative.directory

---

## 📝 APLICAR EM NOSSAMATERNIDADE

### Inspirações Diretas

1. **Partiful** → Onboarding flow, deep linking
2. **Cameo** → Scaling team, feature velocity
3. **ZOE** → Health app, rapid MVP
4. **Shop** → Code sharing, performance

### Quick Wins

```bash
# Adicionar expo-image (melhor que Image nativo)
npx expo install expo-image

# Adicionar MMKV (10x mais rápido que AsyncStorage)
npx expo install react-native-mmkv

# Adicionar Sentry (crash reporting)
npx expo install @sentry/react-native
```

### Target Architecture

```
NossaMaternidade/
├── app/                 # Expo Router (file-based)
├── src/
│   ├── components/      # UI components
│   ├── features/        # Feature modules
│   ├── services/        # API clients
│   ├── stores/          # Zustand stores
│   └── utils/           # Helpers
├── assets/              # Static assets
└── __tests__/           # Jest tests
```

---

_Documento criado em 2026-01-27 | Atualizar trimestralmente_
