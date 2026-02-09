# 🚀 Performance Audit - Nossa Maternidade

**Data:** 2025-01-27  
**Projeto:** React Native / Expo SDK 54  
**Total de linhas:** ~106K

---

## 📊 Resumo Executivo

| Categoria    | Status     | Impacto                        |
| ------------ | ---------- | ------------------------------ |
| Bundle Size  | ⚠️ Atenção | node_modules: 437MB (@shopify) |
| Lazy Loading | ✅ Bom     | 20+ telas lazy-loaded          |
| FlashList    | ⚠️ Parcial | Falta estimatedItemSize        |
| Imagens      | ✅ Ótimo   | expo-image em uso              |
| Console Logs | ✅ Bom     | Apenas 7 em produção           |

---

## 🔥 Quick Wins (Alto Impacto, Baixo Esforço)

### 1. ⚡ FlashList sem `estimatedItemSize` (CRÍTICO)

**Problema:** Nenhum FlashList tem `estimatedItemSize` configurado.  
**Impacto:** Performance degradada em listas longas, scroll janky.

**Arquivos afetados:**

- `src/screens/assistant/AssistantScreen.tsx`
- `src/screens/mundo/MundoDaNathScreen.tsx`
- `src/screens/mvp/TasksScreen.tsx`
- `src/screens/community/CommunityScreen.tsx`
- `src/screens/community/CommunityScreenNathia.tsx`

**Fix recomendado:**

```tsx
<FlashList
  data={posts}
  estimatedItemSize={200} // Altura aproximada do item em pixels
  // ... outros props
/>
```

**Valores sugeridos:**
| Tela | estimatedItemSize |
|------|------------------|
| AssistantScreen (chat) | 80 |
| CommunityScreen (posts) | 350 |
| MundoDaNathScreen | 400 |
| TasksScreen | 72 |

---

### 2. 🔄 Substituir FlatList por FlashList (MÉDIO)

**Problema:** 2 telas ainda usam FlatList ao invés de FlashList.

**Arquivos para migrar:**

```
src/screens/care/HabitsEnhancedScreen.tsx (linha 24, 895)
src/screens/community/MyPostsScreen.tsx (linha 14, 289)
```

**Fix para HabitsEnhancedScreen.tsx:**

```diff
- import { View, Text, Pressable, FlatList, ListRenderItem } from "react-native";
+ import { View, Text, Pressable } from "react-native";
+ import { FlashList, ListRenderItem } from "@shopify/flash-list";

// Na linha 895:
- <FlatList
+ <FlashList
+   estimatedItemSize={88}
    data={habits}
    renderItem={renderHabitItem}
    // ...
```

**Fix para MyPostsScreen.tsx:**

```diff
- import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
+ import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
+ import { FlashList } from "@shopify/flash-list";

// Na linha 289:
- <FlatList
+ <FlashList
+   estimatedItemSize={200}
```

---

### 3. 📦 Onboarding Screens não Lazy-Loaded (MÉDIO)

**Problema:** 24 telas de onboarding são importadas estaticamente no RootNavigator.

**Impacto:** Bundle inicial maior, slower cold start.

**Arquivos:** `src/navigation/RootNavigator.tsx` (linhas 28-60)

**Screens para lazy-load (sugestão):**

```tsx
// Converter imports estáticos para lazy:
const OnboardingCheckIn = withSuspense(
  lazy(() => import("../screens/onboarding/OnboardingCheckIn"))
);
const OnboardingCheckInNathia = withSuspense(
  lazy(() => import("../screens/onboarding/OnboardingCheckInNathia"))
);
// ... repetir para todas as 24 telas de onboarding
```

**Trade-off:** Onboarding é crítico no primeiro uso, então pode-se lazy-load apenas telas após as 2-3 primeiras.

---

### 4. 🖼️ Imagens - Verificar Cache Policy

**Status:** ✅ Já usa expo-image (30+ arquivos)

**Recomendação adicional:** Verificar se `cachePolicy` está configurado:

```tsx
<Image
  source={source}
  cachePolicy="memory-disk" // Recomendado para imagens frequentes
  placeholder={blurhash} // Para UX melhorada
  transition={200} // Smooth loading
/>
```

---

## 📈 Análise Detalhada

### Bundle Size - Dependências Pesadas

| Pacote                    | Tamanho | Necessário?    |
| ------------------------- | ------- | -------------- |
| @shopify (skia+flashlist) | 437MB   | ✅ Sim         |
| react-native              | 84MB    | ✅ Core        |
| expo-sqlite               | 73MB    | Verificar uso  |
| @sentry                   | 44MB    | ✅ Produção    |
| date-fns                  | 38MB    | ✅ Tree-shaked |
| lucide-react-native       | 34MB    | ⚠️ Verificar   |

**Recomendação lucide-react-native:**

```tsx
// ❌ Evitar import geral
import { Heart, Star, Home } from "lucide-react-native";

// ✅ Preferir imports específicos (se suportado)
import Heart from "lucide-react-native/dist/esm/icons/heart";
```

### Lazy Loading Atual (✅ Bem Implementado)

```
20 telas já usam lazy loading:
├── Care: 5 telas
├── Community: 3 telas
├── Profile: 1 tela
├── Shared: 4 telas
├── Wellness: 4 telas
├── Mundo: 2 telas
└── Admin: 2 telas
```

### React Hooks Usage

| Métrica             | Quantidade           | Status |
| ------------------- | -------------------- | ------ |
| useEffect           | 92                   | Normal |
| useCallback/useMemo | 16+ por tela         | ✅ Bom |
| memo()              | Usado em componentes | ✅ Bom |

---

## 📋 Checklist de Implementação

### Prioridade Alta (Fazer Agora)

- [ ] Adicionar `estimatedItemSize` em todos FlashLists
- [ ] Migrar `HabitsEnhancedScreen.tsx` para FlashList
- [ ] Migrar `MyPostsScreen.tsx` para FlashList

### Prioridade Média (Próximo Sprint)

- [ ] Lazy-load telas de onboarding (exceto Welcome e JourneySelect)
- [ ] Revisar uso de expo-sqlite (73MB)
- [ ] Adicionar `cachePolicy` em componentes Image críticos

### Prioridade Baixa (Backlog)

- [ ] Investigar tree-shaking de lucide-react-native
- [ ] Adicionar React DevTools profiler em DEV
- [ ] Configurar metro bundler com hermes otimizado

---

## 🧪 Como Validar Melhorias

### 1. Medir TTI (Time to Interactive)

```bash
# Expo start com --no-dev para simular produção
npx expo start --no-dev --minify
```

### 2. FlashList Performance

Adicione este log temporário para verificar se estimatedItemSize está correto:

```tsx
<FlashList
  onBlankArea={(event) => {
    console.log("Blank area:", event.blankArea);
    // Se > 0 frequentemente, ajuste estimatedItemSize
  }}
/>
```

### 3. Bundle Analysis

```bash
# Gerar source-map para análise
npx expo export --platform ios --source-maps
npx source-map-explorer ./dist/bundles/ios*.js
```

---

## ✅ O que já está bom

1. **expo-image** em vez de Image nativo (30+ arquivos)
2. **FlashList** nas telas principais de lista
3. **Lazy loading** em 20+ telas secundárias
4. **date-fns** com tree-shaking correto
5. **useMemo/useCallback** bem utilizados
6. **Console logs** mínimos em produção (7)
7. **Estrutura de navegação** otimizada com stableFlags

---

## 📚 Referências

- [FlashList Performance Guide](https://shopify.github.io/flash-list/docs/performance-troubleshooting)
- [Expo Image Best Practices](https://docs.expo.dev/versions/latest/sdk/image/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

_Gerado automaticamente em 2025-01-27_
