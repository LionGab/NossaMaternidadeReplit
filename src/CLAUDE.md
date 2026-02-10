# Nossa Maternidade - Frontend Guide

## Estrutura

- `api/` - Funcoes de API (fetch puro), `queryClient`, query keys e hooks TanStack Query em `api/hooks/`
- `components/` - Componentes reutilizaveis (`ui/` para primitivos, pastas de dominio para feature components)
- `providers/` - Context providers (Query, Auth, Theme)
- `screens/` - Telas completas (logica + layout)
- `services/` - Logica de negocio nao-UI
- `state/` - Zustand stores para UI state apenas (nunca server state)
- `theme/` - Design tokens, typography, spacing, radii e sombras
- `types/` - Tipos e interfaces TypeScript
- `utils/` - Utilitarios puros

## Padroes Obrigatorios

- Server state -> TanStack Query (`useQuery`/`useMutation`)
- Client state/UI state -> Zustand (modals, filters, selecoes, steps de formulario)
- Listas longas -> `FlashList` com `estimatedItemSize`
- Cores -> `Tokens.*` ou `useThemeColors()` (sem hardcoded colors)
- Componentes renderizados em listas -> `React.memo()`
- Funcoes exportadas -> return type explicito
- Erros tratados explicitamente (sem fail silently)
- Acessibilidade minima:
  - `accessibilityLabel` e `accessibilityRole` em elementos interativos
  - touch targets >= 44pt
  - contraste alvo WCAG AAA (7:1)

## Query Key Convention

- Padrao: `['domain', 'operation', ...params]`
- Exemplos:
  - `['community', 'posts']`
  - `['community', 'posts', { filter: 'recent' }]`
  - `['cycle', 'data', userId]`
  - `['habits', 'list']`
  - `['habits', 'detail', habitId]`

## QueryClient Defaults

- `staleTime`: 5 minutos para dados de leitura padrao
- `gcTime`: 30 minutos (React Query v5)
- `retry`: 2 para queries (ajustar por caso em hooks especificos)
- `refetchOnWindowFocus`: `false` no mobile por padrao

## Hook Pattern (TanStack Query)

- Hooks em `src/api/hooks/`
- API fetch puro em `src/api/*.ts` ou `src/services/*.ts` conforme fronteira atual
- Mutations devem invalidar query keys relacionadas no `onSuccess`
- Evitar query keys hardcoded espalhadas; centralizar convencao

## Screen Pattern

- Ordem recomendada por tela:
  - hooks de navegacao e tema
  - seletores de store (UI state)
  - hooks TanStack Query (server state)
  - handlers memoizados (`useCallback`)
  - render com estados de loading/erro tratados
- `SafeAreaView` deve vir de `react-native-safe-area-context`

## Zustand Selector Pattern

- Correto:
  - `const value = useStore((s) => s.value);`
  - `const setValue = useStore((s) => s.setValue);`
- Incorreto:
  - `const { a, b } = useStore((s) => ({ ...s }));`
  - `const store = useStore();`

## Proibicoes

- Fetch de servidor dentro de store Zustand
- `any` sem necessidade (preferir `unknown` + type guards)
- Imports relativos profundos (`../../../`) quando ha alias `@/`
- `TouchableOpacity` por padrao quando `Pressable` atende
- Hardcoded colors em componentes e telas

## Checklist Rapido Antes de Commit

- Server state fora de `src/state/`
- Sem imports de stores removidos/deprecated
- Sem hardcoded colors
- Listas com `FlashList` quando aplicavel
- Memoizacao aplicada em itens de lista
- `npm run typecheck` e `npm run quality-gate` passando
