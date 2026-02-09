# State Management — CLAUDE.md

> Regras específicas para `src/state/`

---

## Regra de Ouro

| Tipo de Dado      | Solução        |
| ----------------- | -------------- |
| Dados do servidor | TanStack Query |
| UI/estado local   | Zustand        |

```typescript
// CORRETO - Separação de concerns
const { data: posts } = usePosts(); // Servidor → Query
const { filter, setFilter } = usePostsFilter(); // UI → Zustand

// ERRADO - Fetch dentro de Zustand
const useStore = create((set) => ({
  posts: [],
  fetchPosts: async () => {
    /* API call */
  }, // NÃO!
}));
```

---

## Stores Disponíveis

| Store                | Propósito                                 |
| -------------------- | ----------------------------------------- |
| `app-store.ts`       | Auth, user, theme, settings globais       |
| `chat-store.ts`      | Estado de conversação AI                  |
| `cycle-store.ts`     | Ciclo menstrual                           |
| `habits-store.ts`    | Hábitos                                   |
| `community-store.ts` | Posts, grupos                             |
| `premium-store.ts`   | IAP/subscription                          |
| ~~`store.ts`~~       | **DEPRECATED** - Remover até 1 Abril 2026 |

---

## Seletores (CRÍTICO)

```typescript
// CORRETO - Seletor individual (re-render apenas quando value muda)
const user = useAppStore((s) => s.user);
const theme = useAppStore((s) => s.theme);

// ERRADO - Cria nova referência todo render = loop infinito
const { user, theme } = useAppStore((s) => ({ user: s.user, theme: s.theme }));

// ERRADO - Re-render em qualquer mudança do store
const store = useAppStore();
```

---

## Imutabilidade

```typescript
// CORRETO - Imutável
set((state) => ({
  items: [...state.items, newItem],
}));

// ERRADO - Mutação direta
set((state) => {
  state.items.push(newItem); // NUNCA!
  return state;
});
```

---

## TanStack Query

### Query Keys Factory

```typescript
// CORRETO - Usar factory
import { queryKeys } from "@/api/queryKeys";
useQuery({ queryKey: queryKeys.posts.list() });

// ERRADO - Strings hardcoded
useQuery({ queryKey: ["posts", "list"] });
```

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateAPI,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, newData);
    return { previous };
  },
  onError: (err, data, context) => {
    queryClient.setQueryData(queryKey, context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey });
  },
});
```

---

## Imports

```typescript
// CORRETO - Feature stores
import { useAppStore } from "@/state/app-store";
import { useChatStore } from "@/state/chat-store";

// ERRADO - Store legado
import { useAppStore } from "@/state/store"; // DEPRECATED
```

---

## Checklist

- [ ] Dados servidor → TanStack Query
- [ ] UI/local → Zustand
- [ ] Seletores individuais (não destructuring)
- [ ] Query keys via factory
- [ ] Mutations com optimistic updates
- [ ] Nenhum import de `store.ts`
