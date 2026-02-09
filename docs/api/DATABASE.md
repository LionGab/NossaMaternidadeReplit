# Database Schema - Nossa Maternidade

> Schema Supabase para onboarding e dados do usuario

---

## Tabela: user_onboarding

**Migration:** `028_nath_journey_onboarding.sql`

### Colunas

| Coluna            | Tipo        | Nullable | Default           | Descricao          |
| ----------------- | ----------- | -------- | ----------------- | ------------------ |
| id                | UUID        | NO       | gen_random_uuid() | PK                 |
| user_id           | UUID        | NO       | -                 | FK auth.users      |
| stage             | TEXT        | NO       | -                 | Momento de vida    |
| last_menstruation | DATE        | YES      | -                 | DUM (tentante)     |
| due_date          | DATE        | YES      | -                 | DPP (gravida)      |
| birth_date        | DATE        | YES      | -                 | Nascimento (mae)   |
| concerns          | TEXT[]      | NO       | {}                | Max 3 preocupacoes |
| emotional_state   | TEXT        | NO       | -                 | Estado emocional   |
| daily_check_in    | BOOLEAN     | YES      | false             | Lembretes ativos   |
| check_in_time     | TIME        | YES      | -                 | Horario lembrete   |
| season_name       | TEXT        | NO       | -                 | Nome temporada     |
| is_founder        | BOOLEAN     | YES      | false             | Badge D1           |
| needs_extra_care  | BOOLEAN     | YES      | false             | Cuidado extra      |
| completed_at      | TIMESTAMPTZ | YES      | now()             | Data conclusao     |
| created_at        | TIMESTAMPTZ | YES      | now()             | Criacao            |
| updated_at        | TIMESTAMPTZ | YES      | now()             | Atualizacao        |

### Constraints

```sql
-- Stage valido
CHECK (stage IN ('TENTANTE','GRAVIDA_T1','GRAVIDA_T2',
                 'GRAVIDA_T3','PUERPERIO_0_40D','MAE_RECENTE_ATE_1ANO'))

-- Emotional state valido
CHECK (emotional_state IN ('BEM_EQUILIBRADA','UM_POUCO_ANSIOSA',
                           'MUITO_ANSIOSA','TRISTE_ESGOTADA',
                           'PREFIRO_NAO_RESPONDER'))

-- Max 3 concerns
CHECK (array_length(concerns, 1) <= 3)

-- Season name max 40 chars
CHECK (char_length(season_name) <= 40)

-- Um usuario = um onboarding
UNIQUE(user_id)
```

### Indices

```sql
idx_user_onboarding_user_id          -- Busca principal
idx_user_onboarding_stage            -- Filtro por momento
idx_user_onboarding_emotional_state  -- Filtro emocional
idx_user_onboarding_is_founder       -- Identificar D1
idx_user_onboarding_needs_extra_care -- Cuidado especial
```

---

## RLS Policies

| Operacao | Policy               | Condicao               |
| -------- | -------------------- | ---------------------- |
| SELECT   | Users can view own   | `auth.uid() = user_id` |
| INSERT   | Users can insert own | `auth.uid() = user_id` |
| UPDATE   | Users can update own | `auth.uid() = user_id` |
| DELETE   | Users can delete own | `auth.uid() = user_id` |

**RLS Habilitado:** Sim

---

## Exemplo de Payload

```json
{
  "user_id": "uuid-do-usuario",
  "stage": "GRAVIDA_T2",
  "due_date": "2026-06-15",
  "concerns": ["ANSIEDADE_MEDO", "SINTOMAS_FISICOS"],
  "emotional_state": "UM_POUCO_ANSIOSA",
  "daily_check_in": true,
  "check_in_time": "20:00",
  "season_name": "Minha Primavera",
  "is_founder": true,
  "needs_extra_care": false
}
```

---

## Queries Comuns

### Buscar onboarding do usuario

```typescript
const { data } = await supabase
  .from("user_onboarding")
  .select("*")
  .eq("user_id", userId)
  .maybeSingle();
```

### Salvar/Atualizar (upsert)

```typescript
const { error } = await supabase.from("user_onboarding").upsert(payload, { onConflict: "user_id" });
```

### Usuarios que precisam de cuidado extra

```typescript
const { data } = await supabase
  .from("user_onboarding")
  .select("user_id, emotional_state")
  .eq("needs_extra_care", true);
```

---

## Trigger

```sql
-- Atualiza updated_at automaticamente
CREATE TRIGGER update_user_onboarding_updated_at
BEFORE UPDATE ON user_onboarding
FOR EACH ROW
EXECUTE FUNCTION update_user_onboarding_updated_at();
```

---

## Relacionamentos

```
auth.users (1) -----> (1) user_onboarding
              user_id
```

**ON DELETE CASCADE:** Sim (remove onboarding se usuario deletado)

---

_Ultima atualizacao: 2026-01-05_
