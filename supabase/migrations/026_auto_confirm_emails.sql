-- ============================================
-- NOSSA MATERNIDADE - Migration 026: Auto Confirm Emails
-- ============================================
-- Cria um trigger para confirmar emails automaticamente
-- IMPORTANTE: Isso é para desenvolvimento/MVP
-- Em produção, considere usar confirmação de email real
-- ============================================

-- Criar função que confirma email automaticamente após signup
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  -- Confirmar email automaticamente para novos usuários
  IF NEW.email_confirmed_at IS NULL THEN
    UPDATE auth.users
    SET email_confirmed_at = NOW()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Alterar owner para postgres
ALTER FUNCTION public.auto_confirm_email() OWNER TO postgres;

-- Criar trigger que roda APÓS o insert
-- Usamos AFTER para não interferir com o insert original
CREATE OR REPLACE TRIGGER on_auth_user_auto_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_email();

-- Confirmar emails de todos os usuários existentes
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Comentário
COMMENT ON FUNCTION public.auto_confirm_email() IS 'Confirma email automaticamente após signup (para MVP)';
