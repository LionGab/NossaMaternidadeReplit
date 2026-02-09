-- ============================================
-- NOSSA MATERNIDADE - Migration 025: Fix Trigger Permissions
-- ============================================
-- Corrige permissões do trigger para criar perfis
-- ============================================

-- Garantir que a tabela profiles existe com as colunas corretas
-- (não recria se já existir)
DO $$
BEGIN
  -- Verificar se a coluna name existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN name TEXT NOT NULL DEFAULT 'Usuária';
  END IF;
END $$;

-- Dropar trigger e função existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Criar função no schema public com SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuária'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = COALESCE(EXCLUDED.email, profiles.email);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro mas não falha
    RAISE LOG 'handle_new_user error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Alterar owner da função para postgres (para ter permissões completas)
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Criar trigger no schema auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Criar perfis para usuários que não têm perfil ainda
INSERT INTO public.profiles (id, name, email)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', 'Usuária'),
  u.email
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Comentário
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil automaticamente quando usuário se registra';
