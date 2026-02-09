-- ============================================
-- Migration: Complete RLS Policies
-- Nossa Maternidade - Produção
-- ============================================
-- Adiciona políticas RLS faltantes para garantir
-- que usuários possam editar/deletar seu próprio conteúdo
-- ============================================

-- ============================================
-- POSTS: Políticas de UPDATE e DELETE
-- ============================================

-- Usuários podem atualizar seus próprios posts
CREATE POLICY IF NOT EXISTS "Users can update own posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus próprios posts
CREATE POLICY IF NOT EXISTS "Users can delete own posts"
  ON posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS: Políticas de UPDATE e DELETE
-- ============================================

-- Usuários podem atualizar seus próprios comentários
CREATE POLICY IF NOT EXISTS "Users can update own comments"
  ON comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus próprios comentários
CREATE POLICY IF NOT EXISTS "Users can delete own comments"
  ON comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- USERS/PROFILES: Política de DELETE (LGPD)
-- ============================================

-- Usuários podem deletar seu próprio perfil (LGPD compliance)
CREATE POLICY IF NOT EXISTS "Users can delete own profile"
  ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- LIKES: Políticas completas
-- ============================================

-- Garantir que usuário pode remover seu like
CREATE POLICY IF NOT EXISTS "Users can delete own likes"
  ON likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- DAILY_LOGS: Políticas de UPDATE e DELETE
-- ============================================

-- Usuários podem atualizar seus logs diários
CREATE POLICY IF NOT EXISTS "Users can update own daily logs"
  ON daily_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus logs diários
CREATE POLICY IF NOT EXISTS "Users can delete own daily logs"
  ON daily_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- HABITS: Políticas de UPDATE e DELETE
-- ============================================

-- Usuários podem atualizar seus hábitos
CREATE POLICY IF NOT EXISTS "Users can update own habits"
  ON habits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus hábitos
CREATE POLICY IF NOT EXISTS "Users can delete own habits"
  ON habits
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- HABIT_COMPLETIONS: Políticas de UPDATE e DELETE
-- ============================================

-- Usuários podem atualizar suas completions
CREATE POLICY IF NOT EXISTS "Users can update own habit completions"
  ON habit_completions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar suas completions
CREATE POLICY IF NOT EXISTS "Users can delete own habit completions"
  ON habit_completions
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CHAT_MESSAGES: Políticas de DELETE
-- ============================================

-- Usuários podem deletar suas mensagens de chat
CREATE POLICY IF NOT EXISTS "Users can delete own chat messages"
  ON chat_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- AFFIRMATIONS: Políticas de UPDATE e DELETE
-- ============================================

-- Usuários podem atualizar suas afirmações favoritas
CREATE POLICY IF NOT EXISTS "Users can update own affirmations"
  ON user_affirmations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar suas afirmações favoritas
CREATE POLICY IF NOT EXISTS "Users can delete own affirmations"
  ON user_affirmations
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PUSH_TOKENS: Políticas completas
-- ============================================

-- Usuários podem atualizar seus tokens
CREATE POLICY IF NOT EXISTS "Users can update own push tokens"
  ON push_tokens
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus tokens
CREATE POLICY IF NOT EXISTS "Users can delete own push tokens"
  ON push_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Verificação: Listar todas as policies
-- ============================================
-- Execute: SELECT * FROM pg_policies WHERE tablename IN ('posts', 'comments', 'profiles', 'likes');
