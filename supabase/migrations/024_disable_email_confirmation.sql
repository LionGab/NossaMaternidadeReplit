-- ============================================
-- NOSSA MATERNIDADE - Migration 024: Configure Auth Settings
-- ============================================
-- Confirmar emails de usuários existentes
-- NOTA: Para desabilitar confirmação de email em produção,
--       vá em Supabase Dashboard → Authentication → Email Templates → Confirm signup → Disable
-- ============================================

-- Confirmar email de todos os usuários existentes que não estão confirmados
-- NOTA: confirmed_at é uma coluna gerada automaticamente a partir de email_confirmed_at
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Comentário sobre como desabilitar confirmação de email
-- IMPORTANTE: A confirmação de email deve ser desabilitada no Supabase Dashboard:
-- 1. Acesse https://app.supabase.com/project/[PROJECT_ID]/auth/templates
-- 2. Em "Confirm signup", desmarque "Enable email confirmations"
-- 3. Salve as alterações
