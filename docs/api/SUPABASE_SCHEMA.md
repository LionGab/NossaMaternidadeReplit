# 🗄️ Supabase Database Schema

Este documento descreve a estrutura do banco de dados para o app Nossa Maternidade.

## 📋 Tabelas

### `users`

Armazena os perfis das usuárias completados durante o onboarding.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  stage TEXT NOT NULL, -- 'trying', 'pregnant', 'postpartum'
  age INTEGER NOT NULL,
  location TEXT NOT NULL, -- 'Cidade, Estado'
  goals TEXT[] NOT NULL, -- Array de objetivos selecionados
  challenges TEXT[] NOT NULL, -- Array de desafios
  support_network TEXT[] NOT NULL, -- Rede de apoio
  communication_preference TEXT NOT NULL, -- 'daily', 'weekly', etc
  interests TEXT[] NOT NULL, -- Array de interesses
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_stage ON users(stage);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### `posts`

Posts da comunidade Mães Valente.

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'pregnancy', 'postpartum', 'health', etc
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### `comments`

Comentários nos posts.

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### `likes`

Likes nos posts (relação many-to-many).

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Previne likes duplicados
);

-- Índices
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
```

### `habits`

Hábitos personalizados das usuárias.

```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_created_at ON habits(created_at);
```

### `habit_completions`

Registro de completude dos hábitos por dia.

```sql
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date) -- Previne duplicatas no mesmo dia
);

-- Índices
CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completed_date);
```

## 🔧 Funções PostgreSQL

### Incrementar contador de likes

```sql
CREATE OR REPLACE FUNCTION increment_likes_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET likes_count = likes_count + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### Decrementar contador de likes

```sql
CREATE OR REPLACE FUNCTION decrement_likes_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET likes_count = GREATEST(likes_count - 1, 0),
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### Incrementar contador de comentários

```sql
CREATE OR REPLACE FUNCTION increment_comments_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET comments_count = comments_count + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### Atualizar timestamp automaticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas relevantes
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Row Level Security (RLS)

### Habilitar RLS em todas as tabelas

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
```

### Políticas para `users`

```sql
-- Usuárias podem ler seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Usuárias podem inserir seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Usuárias podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### Políticas para `posts`

```sql
-- Todos podem ler posts
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

-- Usuárias autenticadas podem criar posts
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuárias podem deletar seus próprios posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

### Políticas para `comments`

```sql
-- Todos podem ler comentários
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

-- Usuárias autenticadas podem criar comentários
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Políticas para `likes`

```sql
-- Todos podem ler likes
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

-- Usuárias autenticadas podem criar likes
CREATE POLICY "Authenticated users can create likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuárias podem deletar seus próprios likes
CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);
```

### Políticas para `habits`

```sql
-- Usuárias podem ver apenas seus próprios hábitos
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

-- Usuárias podem criar seus próprios hábitos
CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuárias podem atualizar seus próprios hábitos
CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuárias podem deletar seus próprios hábitos
CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);
```

### Políticas para `habit_completions`

```sql
-- Usuárias podem ver apenas suas próprias completudes
CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

-- Usuárias podem criar suas próprias completudes
CREATE POLICY "Users can create own habit completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuárias podem deletar suas próprias completudes
CREATE POLICY "Users can delete own habit completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);
```

## 🚀 Como aplicar o schema

### Opção 1: Via Supabase Dashboard

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie e cole os comandos SQL acima
5. Execute cada seção separadamente

### Opção 2: Via CLI do Supabase

```bash
# Instale o CLI do Supabase
npm install -g supabase

# Login
supabase login

# Aplique as migrations
supabase db push
```

## 📊 Exemplo de Queries

### Buscar posts com informações de like do usuário

```sql
SELECT
  p.*,
  EXISTS(
    SELECT 1 FROM likes
    WHERE post_id = p.id
    AND user_id = auth.uid()
  ) as user_liked
FROM posts p
ORDER BY created_at DESC;
```

### Calcular streak de hábitos

```sql
SELECT
  h.*,
  COUNT(hc.id) as completions_last_7_days
FROM habits h
LEFT JOIN habit_completions hc
  ON h.id = hc.habit_id
  AND hc.completed_date >= CURRENT_DATE - INTERVAL '7 days'
WHERE h.user_id = auth.uid()
GROUP BY h.id;
```

## 🔄 Sincronização em Tempo Real

Para habilitar real-time nas tabelas:

```sql
-- Habilite real-time para posts
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE likes;
```

No código do app, você pode subscrever mudanças assim:

```typescript
import { supabase } from "./src/api/supabase";

// Escutar novos posts
supabase
  .channel("posts")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
    console.log("Novo post:", payload.new);
  })
  .subscribe();
```

---

**Desenvolvido com ❤️ para mães valentes**
