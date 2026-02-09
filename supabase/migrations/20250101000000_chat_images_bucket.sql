-- ============================================
-- NOSSA MATERNIDADE - Migration: chat-images bucket
-- ============================================
-- Cria bucket para armazenar imagens do chat (NathIA)
-- ============================================

-- Criar bucket chat-images (público para acesso via URL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy para SELECT (público - bucket é público)
DO $$ BEGIN
    CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'chat-images');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Policy para INSERT (apenas service role via edge function)
-- Edge functions usam service role, então não precisamos de policy aqui
-- O upload é feito diretamente pela edge function com service role
