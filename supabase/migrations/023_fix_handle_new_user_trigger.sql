-- ============================================
-- NOSSA MATERNIDADE - Migration 015: Fix handle_new_user trigger
-- ============================================
-- Corrige o trigger que cria perfil quando usuário se registra
-- O trigger anterior falhava silenciosamente causando erro 500
-- ============================================

-- Dropar o trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Dropar a função existente
DROP FUNCTION IF EXISTS handle_new_user();

-- Recriar a função com melhor tratamento de erros
-- SECURITY DEFINER permite que a função execute com privilégios elevados
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir perfil básico para o novo usuário
  -- Usa INSERT ... ON CONFLICT para evitar erros de duplicação
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuária'),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro mas não falha o signup
    RAISE WARNING 'handle_new_user: Erro ao criar perfil para %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que a função pode ser executada pelo auth
GRANT EXECUTE ON FUNCTION handle_new_user() TO supabase_auth_admin;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Comentários
COMMENT ON FUNCTION handle_new_user() IS 'Cria perfil automaticamente quando usuário se registra (com fallback para erros)';
