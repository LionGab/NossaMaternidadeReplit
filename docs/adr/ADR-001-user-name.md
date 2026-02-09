# ADR-001: Tipo User e acesso ao nome

## Status

Resolvido (2026-01-03)

## Contexto

Erro reportado: `Property 'userName' does not exist on type 'User'`.

Durante a investigacao, identificamos que:

1. O tipo `User` do projeto e derivado da tabela `profiles` do Supabase
2. O campo correto e `name`, nao `userName`
3. O tipo do Supabase Auth (`supabaseUser`) usa `user_metadata.name`, que e diferente

## Decisao

- O tipo `User` usado no projeto possui o campo `name: string | null`
- O acesso correto e `user?.name` com optional chaining
- Nao existe campo `userName` neste contexto
- Quando `name` vier vazio ou null, usar fallback: `user?.name || "Usuaria"`

### Padrao de acesso ao nome

```typescript
// Correto
user?.name || "Usuaria";

// Tambem correto (seletor de store)
const userName = useAppStore((s) => s.user?.name);

// Incorreto - nao existe
user?.userName; // TS Error
```

### Porque usar `||` ao inves de `??`

```typescript
// || trata: null, undefined, ""
user?.name || "Usuaria"; // string vazia = fallback

// ?? trata: apenas null, undefined
user?.name ?? "Usuaria"; // string vazia = ""
```

Para nomes, string vazia deve ser tratada como ausencia de nome, logo `||` e preferivel.

## Consequencias

- Padrao de acesso ao nome: `user?.name || "Usuaria"`
- Evitar confusao com o tipo de usuario do Supabase Auth
- Todos os arquivos devem seguir este padrao

## Arquivos afetados

- `src/screens/ProfileScreen.tsx`
- `src/screens/ProfileScreenRedesign.tsx`
- `src/screens/HomeScreen.tsx`
- `src/screens/HomeScreenRedesign.tsx`
- `src/screens/MyCareScreen.tsx`
- `src/components/community/QuickComposerCard.tsx`
- `src/hooks/useCommunity.ts`

## Referencias

- Commits: `908e1d0`, `af0c53a`
- Tipo definido em: `src/types/database.types.ts:2715`
- Campo `name` definido em: `src/types/database.types.ts:1787`
