# Screens — CLAUDE.md

> Regras específicas para `src/screens/`

---

## Estrutura de Tela

```typescript
// Padrão recomendado
export function NomeScreen() {
  // 1. Hooks de navegação
  const navigation = useNavigation();
  const route = useRoute();

  // 2. Estado local (Zustand)
  const user = useAppStore((s) => s.user);

  // 3. Dados do servidor (TanStack Query)
  const { data, isLoading } = useQuery(...);

  // 4. Handlers
  const handlePress = useCallback(() => {...}, []);

  // 5. Render
  return (
    <SafeAreaView edges={['top']}>
      ...
    </SafeAreaView>
  );
}
```

---

## SafeAreaView

```typescript
// CORRETO - Sempre usar de react-native-safe-area-context
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']}>
  {/* content */}
</SafeAreaView>

// ERRADO
import { SafeAreaView } from 'react-native';
```

---

## Loading e Error States

```typescript
// SEMPRE tratar estados de loading e erro
if (isLoading) {
  return <LoadingScreen />;
}

if (error) {
  return <ErrorScreen error={error} onRetry={refetch} />;
}

return <Content data={data} />;
```

---

## Navegação

```typescript
// Usar typed navigation
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";

type Props = NativeStackNavigationProp<RootStackParamList, "ScreenName">;
```

---

## Testes

Cada tela deve ter testes em `__tests__/`:

```
screens/
├── HomeScreen.tsx
└── __tests__/
    └── HomeScreen.test.tsx
```

Casos obrigatórios:

- Renderização inicial
- Loading state
- Error state
- Interações principais

---

## Checklist

- [ ] `SafeAreaView` de `react-native-safe-area-context`
- [ ] Loading state tratado
- [ ] Error state tratado
- [ ] Zustand com seletores individuais
- [ ] Navegação tipada
