-- ============================================
-- RLS FIXES - Nossa Maternidade
-- Data: 2025-12-17
-- Baseado na auditoria: docs/RLS_AUDIT_REPORT.md
-- ============================================

-- V1: Users DELETE policy (LGPD compliance)
-- Permite que usuários deletem suas próprias contas
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
CREATE POLICY "Users can delete own profile"
  ON users FOR DELETE
  USING (auth.uid() = id);

-- V2: Posts UPDATE policy
-- Permite que usuários editem suas próprias publicações
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- V3: Comments UPDATE policy
-- Permite que usuários editem seus próprios comentários
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- V3: Comments DELETE policy
-- Permite que usuários deletem seus próprios comentários
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute esta query para verificar todas as políticas:

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
