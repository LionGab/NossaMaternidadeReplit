# Components — CLAUDE.md

> Regras específicas para `src/components/`

---

## Estrutura

```
components/
├── ui/           # Atoms (Button, Input, Card)
├── [feature]/    # Feature-specific (chat/, profile/)
└── index.ts      # Barrel exports
```

---

## Padrões Obrigatórios

### 1. Cores e Tema

```typescript
// CORRETO
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

const colors = useThemeColors();
<View style={{ backgroundColor: colors.background }} />

// ERRADO - Nunca hardcode
<View style={{ backgroundColor: '#fff' }} />
```

### 2. Touch Targets

```typescript
// CORRETO - Pressable com acessibilidade
<Pressable
  style={{ minHeight: 44 }}
  accessibilityLabel="Ação do botão"
  accessibilityRole="button"
>
  <Text>Label</Text>
</Pressable>

// ERRADO
<TouchableOpacity>...</TouchableOpacity>
```

### 3. Listas

```typescript
// CORRETO - FlashList para performance
<FlashList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  estimatedItemSize={100}
/>

// ERRADO - Causa re-render de toda lista
<ScrollView>
  {items.map(item => <Item key={item.id} />)}
</ScrollView>
```

### 4. Memoização

```typescript
// Componentes de lista DEVEM ser memoizados
const ListItem = memo(({ item }: Props) => {
  return <View>...</View>;
});
```

### 5. Lazy Loading

```typescript
// Componentes > 200 linhas devem ser lazy loaded
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<ActivityIndicator />}>
  <HeavyComponent />
</Suspense>
```

---

## Acessibilidade (WCAG AAA)

| Requisito       | Valor                                             |
| --------------- | ------------------------------------------------- |
| Contraste texto | 7:1 mínimo                                        |
| Touch target    | 44pt (iOS) / 48dp (Android)                       |
| Labels          | Sempre `accessibilityLabel` + `accessibilityRole` |

---

## Checklist Antes de Commit

- [ ] Cores usando `Tokens.*` ou `useThemeColors()`
- [ ] `Pressable` (não `TouchableOpacity`)
- [ ] Listas usando `FlashList`/`FlatList`
- [ ] Componentes de lista memoizados
- [ ] Acessibilidade completa
