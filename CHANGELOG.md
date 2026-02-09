# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Remediation Total (Janeiro 31, 2026)

#### 🔒 Segurança

- **Atualizações críticas de dependências** (Supabase, React Navigation, RN core libs, tooling).
- **Override de segurança:** `markdown-it` atualizado para `^14.1.0`.
- **Status do audit:** permanece alerta HIGH em `tar` via `@expo/cli` (ferramenta de dev).
  - **Mitigação:** não aplicar `npm audit fix --force` pois faria downgrade para Expo 44 (quebra SDK 54).
  - **Plano:** monitorar atualização do `@expo/cli` com `tar` corrigido e aplicar upgrade seguro quando disponível.

#### ✅ Testes e Qualidade

- **Testes:** 419/419 passando (0 skipped), com mock abortável determinístico em `fetch-utils`.
- **Warnings de act()** eliminados em onboarding com mock de ícones em testes.
- **Quality Gate:** TypeScript + ESLint + Build readiness + Logger ✅.

#### 🧰 Confiabilidade de Fetch

- Testes de timeout/cancelamento estabilizados com timers fake e abort via `AbortSignal`.
- Sem dependência de timers reais (melhor consistência no CI).

### Atualização Completa de Dependências (Janeiro 30, 2026)

#### 🔒 Segurança

- **Resolvido:** Todas as vulnerabilidades de segurança (0 vulnerabilities)
  - Vulnerabilidade de markdown-it (moderate) - atualizado para v14.1.0 via override
  - Vulnerabilidade de hono (moderate) - corrigido via npm audit fix

#### 📦 Dependências Principais Atualizadas

- `@supabase/supabase-js`: 2.87.0 → 2.93.3
- `@react-navigation/native-stack`: 7.3.2 → 7.11.0
- `@react-navigation/bottom-tabs`: 7.3.10 → 7.3.11
- `@react-navigation/drawer`: 7.3.2 → 7.3.3
- `react-native-purchases`: 9.6.10 → 9.7.5
- `react-native-purchases-ui`: 9.6.10 → 9.7.5
- `lightningcss`: 1.30.2 → 1.31.1
- `lucide-react-native`: 0.561.0 → 0.563.0

#### 🎨 UI & Navegação

- `react-native-gesture-handler`: 2.28.0 → 2.30.0
- `react-native-screens`: 4.16.0 → 4.20.0
- `react-native-svg`: 15.12.1 → 15.15.1
- `react-native-webview`: 13.15.0 → 13.16.0
- `@shopify/flash-list`: 2.0.2 → 2.2.0
- `react-native-keyboard-controller`: 1.18.5 → 1.20.7

#### 🧩 React Native Community

- `@nandorojo/galeria`: 2.0.0-rc.4 → 2.0.0
- `@react-native-community/datetimepicker`: 8.4.4 → 8.6.0
- `@react-native-community/slider`: 5.0.1 → 5.1.2
- `@react-native-picker/picker`: 2.11.1 → 2.11.4

#### 🛠️ DevDependencies

- `@typescript-eslint/eslint-plugin`: 8.50.0 → 8.54.0
- `@typescript-eslint/parser`: 8.50.0 → 8.54.0
- `prettier-plugin-tailwindcss`: 0.6.9 → 0.7.2

#### 🔧 Configuração

- Adicionado override de `markdown-it` para forçar versão segura (^14.1.0)
- Adicionado exclusões de npm cache no .gitignore (previne commits acidentais)

#### ✅ Validação

- TypeScript check: ✅ Sem erros
- ESLint: ✅ Apenas warnings de design system (não-bloqueantes)
- npm audit: ✅ 0 vulnerabilities
- Quality gate: ✅ Passou

### TestFlight Fix + Navigation + Reanimated (Janeiro 20, 2026)

#### 🔥 Correção Crítica: TestFlight App Hang (Anti-Hang Pattern)

- **Problema:** App travava na splash screen em TestFlight quando RevenueCat estava lento/offline
- **Solução:** Implementado `Promise.race()` timeout pattern com fail-open
  - `Purchases.configure()` com timeout de 5s
  - `Purchases.getCustomerInfo()` com timeout de 5s
  - Modo degradado: app funciona em free tier se RevenueCat indisponível
- **Resultado:** Cold start < 3s mesmo sem rede; app não trava indefinidamente
- **Arquivos:**
  - ✅ `src/utils/withTimeout.ts` (NOVO) - Generic timeout utility
  - ✅ `src/utils/bootLogger.ts` (NOVO) - Boot sequence breadcrumbs
  - ✅ `src/services/revenuecat.ts` (MODIFICADO) - 3 pontos: configure + 2x getCustomerInfo
  - ✅ `App.tsx` (MODIFICADO) - RevenueCat init fire-and-forget (não-bloqueante)

#### 🧭 Navigation Fix: Duplicate Screen Name Warning

- **Problema:** Console warning - Stack screen "Assistant" duplicado com Tab screen
- **Solução:** Renomeado Stack screen para "AssistantChat"
- **Arquivos:**
  - ✅ `src/navigation/NathIAStackNavigator.tsx` - Rename + types
  - ✅ `src/types/navigation.ts` - Type definitions

#### 🎨 Reanimated Transform Conflicts Fix (7 componentes)

- **Problema:** Reanimated 2+ warnings - conflito entre `entering`/`exiting` + `transform` no mesmo Animated.View
- **Solução:** Wrapper pattern - separar layout animation (outer) de transform (inner)
- **Arquivos:**
  - ✅ `src/components/community/CommunityPostCard.tsx`
  - ✅ `src/components/community/PostCard.tsx`
  - ✅ `src/components/home/BelongingCard.tsx`
  - ✅ `src/components/home/NathiaAdviceCard.tsx`
  - ✅ `src/components/home/NathIAFloCard.tsx`
  - ✅ `src/components/paywall/PlanCard.tsx`
  - ✅ `src/components/home/HealthInsightCard.tsx`

#### 🎨 Design System Cleanup (23 cores hardcoded → Tokens)

- **Problema:** Cores hardcoded (`#xxx`, `rgba(...)`) espalhadas pela UI
- **Solução:** Centralizar com design system `Tokens`
- **Arquivos:**
  - ✅ `src/screens/HomeScreen.tsx` - 13 replacements
  - ✅ `src/screens/AssistantScreen.tsx` - 8 replacements (gradients + overlays)
  - ✅ `src/components/ui/FloHeader.tsx` - 2 replacements

#### 📚 Documentation

- ✅ `docs/ROLLBACK_PROCEDURES.md` (NOVO) - Emergency procedures + monitoring metrics
- ✅ `CHANGELOG.md` - This entry documenting all phases

#### 📊 Success Metrics

- **Before:** TestFlight hangs/freezes, 2 console warnings, hardcoded colors
- **After:** < 5s cold start, 0 warnings, design system consistent
- **Quality-gate:** PASS (TypeScript + ESLint + build)

### Nova Tela PREMIUM - MeusCuidadosPremiumScreen (Janeiro 2026)

**Inspirada nos melhores apps do mercado:** Flo, Calm, Headspace, Apple Health, Duolingo

#### Features Principais

- **Header Premium:** Avatar com indicador online, badge de streak animado com pulse effect
- **Progress Ring:** Anel de progresso circular com gradiente mostrando % do dia completo
- **Mood Tracker:** 5 emojis interativos (Ótimo/Bem/Ok/Baixo/Difícil) com animações de seleção
- **Quick Trackers:** Rastreadores de Sono, Água e Exercício com incremento/decremento e barra de progresso
- **Gráfico Semanal:** Visualização de 7 dias com destaque para "hoje"
- **Afirmação Premium:** Card com gradiente, aspas decorativas e citação da Nathalia Valente
- **Sistema de Conquistas:** Badges desbloqueáveis com progresso visual (First Check-in, Week Streak, Hydration Master, Self Care Queen)
- **Dicas Personalizadas:** Conteúdo dinâmico baseado na fase (Tentando/Grávida/Pós-parto)
- **Hábitos Premium:** Lista com checkbox animado, strike-through e emoji
- **Quick Actions:** Grid 2x2 com gradientes coloridos (Respira, Sentimentos, Descanso, Comunidade)
- **NathIA CTA Premium:** Card flutuante animado com gradiente accent

#### Design & UX

- **Micro-interações:** Haptic feedback em todas as ações
- **Animações fluidas:** Reanimated com FadeIn, SlideIn, pulse, float effects
- **Glassmorphism:** Cards com bordas sutis e shadows premium
- **Dark mode:** Suporte completo com paleta cuidadosamente ajustada
- **Acessibilidade:** Labels semânticos para screen readers

### Correções Técnicas

- **TypeScript:** Erros corrigidos (0 errors, 0 type warnings)
- **ESLint:** Rules of hooks corrigidos (MoodButton extraído para componente separado)
- **Performance:** Componentes memorizados com React.memo

### Otimizações (Janeiro 2026)

- **Limpeza de código:** Removidos arquivos temporários e protótipos HTML
- **TypeScript:** 100% sem erros (strict mode)
- **ESLint:** Código limpo sem warnings
- **Testes:** 300 testes passando (16 suites)

### Performance

- **Chat:** Lista de mensagens virtualizada com FlashList (melhor estabilidade de FPS em conversas longas)
- **Community:** Feed virtualizado com FlashList + memoização completa (header, empty, renderItem)
- **Imagens:** Migração ampla para `expo-image` (cache em disco + memória, transições configuradas)

### Segurança

- **Moderation:** `isBlocked()` agora é fail-safe (erro => assume bloqueado) com logging centralizado
- **CORS:** Edge Function `community-feed` com CORS restrito por allowlist (`ALLOWED_ORIGINS`), sem `*`

### Confiabilidade

- **Premium:** `checkPremiumStatus()` com cache local (AsyncStorage) com TTL de 7 dias para resiliência offline

### Infraestrutura

- **Supabase:** Helper centralizado `_shared/cors.ts` para CORS em Edge Functions
- **Docs:** Playbook de deploy para Edge Functions com instruções de Secrets

## [1.0.0] - Em desenvolvimento

### Adicionado

- Sistema de comunidade com moderação de conteúdo
- Assistente NathIA com chat inteligente
- Tracker de ciclo menstrual
- Sistema de assinaturas premium (RevenueCat)
- Onboarding personalizado
- Notificações push
- Afirmações diárias
- Sons de relaxamento
- Exercícios de respiração

### Técnico

- Expo SDK 54 + React Native
- NativeWind v4 para estilos
- Supabase (Auth, Database, Storage, Edge Functions)
- TypeScript strict mode
- FlashList para listas virtualizadas
- expo-image para imagens otimizadas
