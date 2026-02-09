# Database Migration

Gerenciar migrations do Supabase.

## Comandos

### Criar Nova Migration

```bash
supabase migration new <nome_da_migration>
```

Exemplo:

```bash
supabase migration new add_user_preferences_table
```

### Aplicar Migrations Localmente

```bash
supabase db push
```

### Ver Status das Migrations

```bash
supabase migration list
```

### Aplicar em Produção

```bash
supabase db push --linked
```

## Fluxo Recomendado

1. **Criar migration**: `supabase migration new <nome>`
2. **Editar SQL**: `supabase/migrations/TIMESTAMP_nome.sql`
3. **Testar localmente**: `supabase db reset` (cuidado: apaga dados!)
4. **Aplicar**: `supabase db push`
5. **Gerar tipos**: Execute `/db-types`

## Estrutura de Arquivos

```
supabase/
├── migrations/
│   ├── 20241216000000_initial.sql
│   └── 20241216000001_add_feature.sql
├── seed.sql (dados iniciais)
└── config.toml
```

## Boas Práticas

- Sempre criar migration para mudanças de schema
- Nunca editar migrations já aplicadas
- Usar nomes descritivos (ex: `add_posts_likes_count`)
- Incluir rollback quando possível (comentado)

## RLS (Row Level Security)

Sempre incluir políticas RLS nas migrations:

```sql
-- Habilitar RLS
ALTER TABLE nova_tabela ENABLE ROW LEVEL SECURITY;

-- Política de leitura
CREATE POLICY "Users can read own data"
ON nova_tabela FOR SELECT
USING (auth.uid() = user_id);
```
