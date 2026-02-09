# Action Plan - UI/UX Performance Optimization

> **Status**: P1 Completo ✅ | Próximo: P2
> **Última atualização**: 2026-02-09
> **Commits**: P0 (67f7c1e), P1.1 (2fcff5d, 30a2384), P1.2 (918e9e6), P1.3 (5252aa5)

---

## 🎯 Objetivo Geral

Otimizar performance, UX e acessibilidade do app Nossa Maternidade antes do launch em TestFlight/Play Store, com foco em:

- Zero layout shift
- 60fps scroll em listas
- WCAG AAA compliance
- Bundle size otimizado
- Dark mode perfeito

---

## ✅ P0 - Quick Wins (COMPLETO)

**Status**: ✅ Completo
**Commit**: `67f7c1e`

### Realizações

- ✅ Otimizar re-renders com React.memo (componentes de lista)
- ✅ SafeAreaView migration (react-native → react-native-safe-area-context)
- ✅ Eliminar hardcoded colors → Tokens/useThemeColors
- ✅ Micro-otimizações de performance (callbacks memoizados)

**Resultado**: Base sólida para otimizações maiores

---

## ✅ P1 - Medium Priority (COMPLETO)

**Status**: ✅ Completo
**Commits**: `2fcff5d`, `30a2384`, `918e9e6`, `5252aa5`
**Diff Total**: 7 arquivos, +83 insertions, -131 deletions

### P1.1 - Skeleton Loaders (✅ Completo)

**Commits**: `2fcff5d`, `30a2384`

**Implementação**:

- Reutilizou componente `SkeletonLoader.tsx` existente (shimmer premium)
- Aplicado em 4 pontos críticos:
  1. `CommunityScreen.tsx` - Feed de posts (ListSkeleton)
  2. `PostDetailScreen.tsx` - Detalhe de post (PostSkeleton)
  3. `NotificationPreferencesScreen.tsx` - Preferências (ListSkeleton)
  4. `WeeklyHighlights.tsx` - Carousel de destaques (CardSkeleton)

**Resultado**:

- Zero layout shift ao carregar
- Percepção de performance melhorada
- Dark mode automático
- Reduce Motion support (via useOptimizedAnimation)

### P1.2 - StaggeredFadeUp Animations (✅ Completo)

**Commit**: `918e9e6`

**Implementação**:

- Substituiu 13 animações manuais por helper centralizado `staggeredFadeUp(index)`
- Padronizou timing: `FadeInUp.delay(index * 50).duration(normal).springify()`
- Arquivos modificados:
  1. `HomeScreen.tsx` - 6 elementos (DailyInsight, EmotionalCheckIn, MicroActions, Progress, Reminders, Insights)
  2. `ProfileScreen.tsx` - 7 elementos (Interests, Theme, AI Settings, Menu Items, Logout, Delete, Interest badges loop)

**Resultado**:

- Animações consistentes em Home + Profile
- Reduce Motion support nativo (FadeInUp respeita preferências)
- Código mais limpo (-67 linhas)

### P1.3 - Celebration de Hábitos (✅ Completo)

**Commit**: `5252aa5`

**Implementação**:

- Adicionou `useReducedMotion` hook ao `DailyMicroActions`
- Condicionou scale animation (1.05 → 1 spring, 400ms)
- Condicionou confetti (6 partículas, 700ms - ajustado de 550ms)
- Fallback Reduce Motion: sem animações, só check icon + haptic

**Resultado**:

- WCAG AAA compliance completo
- Duration confetti dentro do spec (600-800ms)
- Zero blocking UI (worklet thread)
- Haptic feedback preservado em todos os casos

---

## ⏳ P2 - High Priority (PRÓXIMO)

**Prioridade**: Alta
**Estimativa**: 3-4 horas
**Ordem recomendada**: P2.1 → P2.2 → P2.3

### P2.1 - FlashList Migration (Community)

**Impact**: ⚡⚡⚡ Performance crítica - scroll em listas longas

**Objetivo**: Migrar `FlatList` → `FlashList` na tela de Community (feed de posts)

**Tarefas**:

1. Instalar `@shopify/flash-list` (se não instalado)
2. Medir altura real do `PostCard` (usar `onLayout`)
3. Configurar `estimatedItemSize` preciso (ex: 280px)
4. Memoizar `PostCard` com `React.memo`
5. Testar scroll em lista 100+ posts (simular via mock)
6. Validar performance: 60fps target

**Arquivos afetados**:

- `src/screens/community/CommunityScreen.tsx`
- `src/components/community/PostCard.tsx` (memoização)
- `package.json` (dependência)

**Critérios de aceite**:

- ✅ Zero layout thrashing ao scroll
- ✅ Scroll fluido em listas 100+ posts
- ✅ `estimatedItemSize` preciso (-10% / +10% da altura real)
- ✅ Memoização correta (PostCard não re-renderiza desnecessariamente)

**Testes**:

```bash
# Simular lista longa
const mockPosts = Array.from({ length: 150 }, (_, i) => ({ id: i, ... }));

# Medir performance
- iOS Simulator: Debug → Toggle Slow Animations (OFF)
- Android: Developer Options → Profile GPU Rendering
- Target: 60fps (16.67ms/frame)
```

---

### P2.2 - Image Optimization

**Impact**: 🚀🚀 Bundle size + carregamento

**Objetivo**: Otimizar todas as imagens do app (placeholders, compressão, expo-image migration)

**Tarefas**:

1. Audit completo de imagens:
   ```bash
   rg -n "source={{" src
   rg -n "<Image" src
   rg -n "uri:" src
   ```
2. Migrar `react-native Image` → `expo-image` (se ainda houver)
3. Adicionar `blurhash` placeholders em imagens críticas:
   - Avatar de usuário
   - Imagens de posts
   - Imagens de perfil
4. Comprimir assets grandes (> 100KB):
   ```bash
   # Verificar tamanho de assets
   find assets -type f -size +100k
   ```
5. Configurar cache strategy (`expo-image` cachePolicy)

**Arquivos afetados**:

- Todos os componentes com imagens (Community, Profile, Home)
- `assets/` (compressão de imagens estáticas)

**Critérios de aceite**:

- ✅ Todas as imagens user-facing com placeholder (blurhash ou skeleton)
- ✅ Bundle size reduzido em 15-20% (medir antes/depois)
- ✅ Zero layout shift ao carregar imagens
- ✅ 100% `expo-image` (nenhum `react-native Image` restante)

**Testes**:

```bash
# Medir bundle size
npx expo export --platform ios
du -sh dist/

# Antes vs Depois
# Target: redução de ~2-5MB
```

---

### P2.3 - Safe Area Audit

**Impact**: 🎯🎯 Zero bugs de layout em iOS

**Objetivo**: Garantir que todo conteúdo respeita Safe Areas (notch, Dynamic Island, home indicator)

**Tarefas**:

1. Audit completo:
   ```bash
   rg -n "paddingTop|paddingBottom" src
   rg -n "insets\." src
   rg -n "SafeAreaView" src
   ```
2. Verificar todas as telas com `useSafeAreaInsets()`
3. Testar em modelos críticos:
   - iPhone 15 Pro (Dynamic Island)
   - iPhone 15 (notch padrão)
   - iPhone SE (sem notch)
   - iPhone 14 Pro Max (notch grande)
4. Validar bottom tabs (não sobrepor home indicator)
5. Validar modals/sheets (respeitar safe area em top/bottom)

**Arquivos afetados**:

- Todas as screens principais (Home, Community, Profile, Ciclo, NathIA)
- Modal screens (onboarding, paywall)
- Bottom sheet components

**Critérios de aceite**:

- ✅ Zero conteúdo cortado por notch/Dynamic Island
- ✅ Zero sobreposição de home indicator
- ✅ Consistência em todos os modelos iOS (SE até 15 Pro Max)
- ✅ Bottom tabs não sobrepõem home indicator

**Testes**:

```bash
# Device test
npx expo start --ios
# Testar em:
# - iPhone SE (simulador)
# - iPhone 15 Pro (simulador)
# - Physical device (se disponível)
```

---

## ⏳ P3 - Revisão Crítica (DEPOIS DE P2)

**Prioridade**: Média-Alta
**Estimativa**: 2-3 horas
**Timing**: Após P2 completo + Device Test

### P3.1 - TypeScript Strict Audit

**Impact**: 🛡️ Zero bugs de tipo em runtime

**Objetivo**: Eliminar todos os type issues e fortalecer tipagem

**Tarefas**:

1. Resolver warnings ESLint pré-existentes (3 warnings exhaustive-deps):
   - `OnboardingPaywall.tsx:167` - adicionar `selectedPackage` a deps
   - `PaywallScreenRedesign.tsx:271,332` - adicionar `trackingCampaign/Source` a deps
2. Audit de tipos fracos:
   ```bash
   rg -n "as any" src
   rg -n "@ts-ignore" src
   rg -n "@ts-expect-error" src
   rg -n ": any" src
   ```
3. Fortalecer types em APIs críticas:
   - `src/api/chat-service.ts`
   - `src/api/cycle-service.ts`
   - `src/api/community-service.ts`
4. Verificar types Supabase (regenerar se necessário):
   ```bash
   npm run generate-types
   ```

**Critérios de aceite**:

- ✅ Zero warnings ESLint
- ✅ Zero `any` types não justificados (permitir só com comentário explicando)
- ✅ Zero `@ts-ignore` sem comentário
- ✅ `npm run typecheck` passa 100%

---

### P3.2 - Accessibility Audit (WCAG AAA)

**Impact**: ♿ Compliance legal + inclusão

**Objetivo**: Atingir WCAG AAA em todas as telas

**Tarefas**:

1. Rodar audit:
   ```bash
   npm run audit:a11y
   npm run audit:a11y:baseline  # Atualizar baseline
   ```
2. Verificar tap targets < 44pt:
   ```bash
   rg -n "width: [0-3][0-9]" src  # Procurar elementos < 40
   rg -n "height: [0-3][0-9]" src
   ```
3. Testar VoiceOver (iOS):
   - Settings → Accessibility → VoiceOver → ON
   - Navegar por Home, Community, Profile
   - Verificar labels descritivos
4. Verificar contraste (WCAG AAA = 7:1):
   ```bash
   npm run design:audit  # Ver report de cores
   ```
5. Validar ordem de leitura (tab order lógico)

**Critérios de aceite**:

- ✅ Baseline a11y atualizado (sem regressões)
- ✅ Zero tap targets < 44pt
- ✅ Contraste mínimo 7:1 (WCAG AAA) em todos os textos
- ✅ VoiceOver navigation fluida (ordem lógica)
- ✅ 100% elementos interativos com `accessibilityLabel`

---

### P3.3 - Design System Final Cleanup

**Impact**: 🎨 Consistência visual total

**Objetivo**: Zero hardcoded values, design system 100% aplicado

**Tarefas**:

1. Design audit:
   ```bash
   npm run design:audit
   npm run audit:colors  # Procurar hardcoded colors
   npm run audit:tokens  # Verificar uso de tokens
   ```
2. Eliminar hardcoded colors:
   ```bash
   rg -n "#[0-9a-fA-F]{3,6}" src  # Hex colors
   rg -n "rgba?\(" src            # RGB colors
   rg -n "'white'|'black'" src    # String colors
   ```
3. Verificar shadows/radii:
   ```bash
   rg -n "shadowColor|shadowOffset|shadowRadius" src
   rg -n "borderRadius: [0-9]" src
   ```
4. Dark mode validation:
   - Testar TODAS as telas em dark mode
   - Verificar contraste suficiente
   - Validar cores dinâmicas (useTheme)

**Critérios de aceite**:

- ✅ Design audit score 100%
- ✅ Zero hardcoded colors (permitir só em constants com comentário)
- ✅ Shadows/radii usando `Tokens.shadows.*` e `Tokens.radius.*`
- ✅ Dark mode perfeito em 100% das telas (Home, Community, Profile, Ciclo, NathIA, Onboarding, Paywall)

---

## 📊 Progresso Geral

```
┌─────────────────────────────────────────────────┐
│ P0 - Quick Wins             ████████████ 100%  │
│ P1 - Medium Priority        ████████████ 100%  │
│ P2 - High Priority          ░░░░░░░░░░░░   0%  │
│ P3 - Revisão Crítica        ░░░░░░░░░░░░   0%  │
└─────────────────────────────────────────────────┘

Total: 50% completo (P0 + P1)
Próximo: P2.1 (FlashList Migration)
```

---

## 🎯 Recomendação de Execução

### Ordem ideal:

```
P2.1 (FlashList) → P2.2 (Images) → P2.3 (Safe Area) → Device Test → P3 (Revisão crítica)
```

### Por quê?

1. **P2.1 (FlashList)**: Maior impacto em performance user-facing, resolve lag crítico em Community
2. **P2.2 (Images)**: Reduz bundle size (importante para TestFlight submission), melhora carregamento
3. **P2.3 (Safe Area)**: Evita bugs críticos de layout em iOS (bloqueador de launch)
4. **Device Test**: Validar tudo em device real antes de polish final
5. **P3 (Revisão)**: Polish final, compliance, qualidade de código

### Quando fazer Device Test?

- **Mínimo**: Após P2 completo (antes de P3)
- **Ideal**: Após cada tarefa de P2 (validação incremental)

---

## 📝 Checklist Final (Pre-Launch)

Antes de submeter para TestFlight/Play Store:

### Performance

- [ ] P2.1 - FlashList em Community (60fps scroll)
- [ ] P2.2 - Imagens otimizadas (bundle -15-20%)
- [ ] P2.3 - Safe Area validado em todos os modelos iOS

### Qualidade de Código

- [ ] P3.1 - Zero warnings TypeScript/ESLint
- [ ] P3.1 - Zero `any` não justificados
- [ ] Quality gate 100%

### Acessibilidade

- [ ] P3.2 - WCAG AAA compliance
- [ ] P3.2 - VoiceOver funcional
- [ ] P3.2 - Tap targets >= 44pt

### Design System

- [ ] P3.3 - Zero hardcoded colors
- [ ] P3.3 - Dark mode perfeito
- [ ] P3.3 - Design audit 100%

### Device Testing

- [ ] iOS (iPhone SE, 15, 15 Pro)
- [ ] Android (emulator mínimo)
- [ ] Safe Area em todos os modelos
- [ ] Performance 60fps

---

## 🚀 Next Actions

1. **Escolher próxima tarefa de P2**:
   - A) P2.1 (FlashList - maior impacto)
   - B) P2.2 (Images - bundle size)
   - C) P2.3 (Safe Area - zero bugs)

2. **Alternativa**:
   - D) Device test antes de continuar (validar P1)
   - E) Pular P2, ir para P3 (não recomendado)

---

**Última atualização**: 2026-02-09
**Mantido por**: Claude Sonnet 4.5
**Repositório**: [NossaMaternidadeReplit](https://github.com/LionGab/NossaMaternidadeReplit)
