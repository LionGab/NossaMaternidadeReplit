-- ============================================
-- NOSSA MATERNIDADE - Migration 014: Create Test User
-- ============================================
-- Criar usuário de teste: igor@attilio.com
-- ============================================

-- Habilitar extensão pgcrypto se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar usuário de teste com senha criptografada
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'igor@attilio.com',
  crypt('1234567', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;

-- Comentário
COMMENT ON TABLE auth.users IS 'Usuário de teste criado: igor@attilio.com';

