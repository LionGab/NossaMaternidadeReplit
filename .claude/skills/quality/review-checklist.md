# Review Checklist Completo

## TypeScript

- [ ] No `any` types (usar `unknown` + type guards)
- [ ] No `@ts-ignore` sem justificativa
- [ ] Strict mode compliant
- [ ] Tipos exportados em `src/types/`

## Design System

- [ ] Cores: `Tokens.*` ou `useThemeColors()`
- [ ] No inline styles (usar `className`)
- [ ] Spacing: grid 8pt (`Tokens.spacing.*`)
- [ ] Typography: `Tokens.typography.*`
- [ ] Shadows: `Tokens.neutral[900]` como shadowColor

## Logging

- [ ] Usar `logger.*` de `src/utils/logger.ts`
- [ ] Pattern: `logger.info('msg', 'context', metadata?)`
- [ ] No `console.log`

## Performance

- [ ] Listas: `FlatList` ou `FlashList` (não `ScrollView + map()`)
- [ ] Componentes pesados: `React.memo()`
- [ ] Lazy loading: `React.lazy()`

## Accessibility

- [ ] Tap targets ≥ 44pt (`Tokens.accessibility.minTapTarget`)
- [ ] Contraste WCAG AAA (7:1)
- [ ] `accessibilityLabel` em interativos
- [ ] `accessibilityRole` especificado

## React Native Patterns

- [ ] Usar `Pressable` (não `TouchableOpacity`)
- [ ] Usar `SafeAreaView` de `react-native-safe-area-context`
- [ ] Usar `Ionicons` de `@expo/vector-icons`
- [ ] Camera: `CameraView` (não `Camera` deprecated)

## Zustand

- [ ] Selectors individuais

```typescript
// ✅ Correto
const user = useAppStore((s) => s.user);

// ❌ Errado (cria nova ref cada render)
const { user } = useAppStore((s) => ({ user: s.user }));
```

## Organização

- [ ] Arquivos > 250 LOC devem ser refatorados
- [ ] API functions em `src/api/`
- [ ] Componentes em `src/components/`
- [ ] Tipos em `src/types/`
- [ ] Utils em `src/utils/`

## Segurança

- [ ] No API keys em código
- [ ] No modificações `.env*` sem aprovação
- [ ] RLS habilitado em tabelas Supabase
- [ ] Validação de input nas fronteiras

## Arquivos Críticos (Review Extra)

- `app.config.js` - bundle IDs
- `src/types/premium.ts` - product IDs
- `src/theme/tokens.ts` - design system
- `eas.json` - build config
