# API Layer — CLAUDE.md

> Regras específicas para `src/api/`

---

## Estrutura

```
api/
├── client.ts         # QueryClient config
├── queryKeys.ts      # Query key factory
├── hooks/            # Query hooks (usePosts, useProfile)
├── mutations/        # Mutation hooks (useUpdateProfile)
└── supabase.ts       # Cliente Supabase
```

---

## Query Keys Factory

```typescript
// queryKeys.ts
export const queryKeys = {
  posts: {
    all: () => ["posts"] as const,
    list: (filters?: PostFilters) => [...queryKeys.posts.all(), "list", filters] as const,
    detail: (id: string) => [...queryKeys.posts.all(), "detail", id] as const,
  },
  profile: {
    all: () => ["profile"] as const,
    me: () => [...queryKeys.profile.all(), "me"] as const,
  },
};

// Uso
useQuery({ queryKey: queryKeys.posts.list({ category: "health" }) });
```

---

## QueryClient Defaults

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min fresh
      gcTime: 10 * 60 * 1000, // 10 min cache
      retry: 1,
      throwOnError: false,
    },
  },
});
```

---

## Padrão de Hook

```typescript
// hooks/usePosts.ts
export function usePosts(filters?: PostFilters) {
  return useQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: () => fetchPosts(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// mutations/useCreatePost.ts
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() });
    },
  });
}
```

---

## Supabase

### Padrão de Resposta

```typescript
// Sempre retornar { data, error }
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

  if (error) throw error;
  return data;
}
```

### Tipos Gerados

```bash
# Após mudanças no schema
npm run generate-types
```

```typescript
// Usar tipos gerados
import { Database } from "@/types/supabase";

type User = Database["public"]["Tables"]["users"]["Row"];
```

---

## Autenticação

```typescript
// Sempre verificar sessão antes de operações autenticadas
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new AuthError("Not authenticated");
}
```

---

## Checklist

- [ ] Query keys via factory
- [ ] Hooks em `hooks/` ou `mutations/`
- [ ] Tipos gerados do Supabase
- [ ] Error handling consistente
- [ ] Optimistic updates em mutations
