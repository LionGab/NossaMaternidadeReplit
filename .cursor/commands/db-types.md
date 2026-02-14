# Generate Database Types

Gerar tipos TypeScript do schema Supabase.

## Comando Principal

```bash
supabase gen types typescript --project-id <PROJECT_REF> > src/types/database.types.ts
```

Ou se o projeto estiver linkado:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

## Uso no Código

Após gerar, usar os tipos assim:

```typescript
import { Database } from "../types/database.types";

type Tables = Database["public"]["Tables"];
type User = Tables["users"]["Row"];
type Post = Tables["posts"]["Row"];
type InsertPost = Tables["posts"]["Insert"];
type UpdatePost = Tables["posts"]["Update"];
```

## Configurar Supabase Client com Tipos

```typescript
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
```

## Quando Regenerar

- Após criar/modificar tabelas
- Após adicionar/remover colunas
- Após mudar tipos de dados
- Após criar novas views ou functions

## Integração com CI/CD

Adicionar ao workflow:

```yaml
- name: Generate types
  run: supabase gen types typescript --linked > src/types/database.types.ts
```

## Troubleshooting

Se os tipos não atualizarem:

1. Verificar se migration foi aplicada: `supabase migration list`
2. Verificar conexão: `supabase projects list`
3. Relinkar projeto: `supabase link --project-ref <REF>`
