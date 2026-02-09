-- 1. Enums para status e tipos
DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'needs_changes');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('text', 'image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Coluna Admin em Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 3. Mundo Nath (Premium Content)
CREATE TABLE IF NOT EXISTS public.mundo_nath_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type media_type NOT NULL DEFAULT 'text',
  text TEXT,
  media_path TEXT, -- Caminho no bucket privado
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Mundo Nath
ALTER TABLE public.mundo_nath_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Leitura pública para Mundo Nath" ON public.mundo_nath_posts
        FOR SELECT USING (is_published = true); -- Filtragem premium será via Edge Function ou Client, aqui libera a leitura básica do registro
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins gerenciam Mundo Nath" ON public.mundo_nath_posts
        FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Comunidade (MãesValente)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  text TEXT,
  media_path TEXT,
  media_type media_type DEFAULT 'text',
  tags TEXT[],
  status post_status DEFAULT 'submitted',
  review_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- RLS Comunidade
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    -- Select: Usuário vê seus próprios posts OU posts aprovados
    CREATE POLICY "Ver posts aprovados ou proprios" ON public.community_posts
      FOR SELECT USING (
        status = 'approved' OR
        auth.uid() = author_id
      );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    -- Insert: Qualquer autenticado cria posts
    CREATE POLICY "Criar posts" ON public.community_posts
      FOR INSERT WITH CHECK (auth.uid() = author_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    -- Update: Autor só altera se não estiver aprovado/rejeitado final (draft ou needs_changes)
    CREATE POLICY "Autor edita rascunho" ON public.community_posts
      FOR UPDATE USING (
        auth.uid() = author_id AND
        status IN ('draft', 'needs_changes')
      );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    -- Admins: Acesso total para moderação
    CREATE POLICY "Admins moderam posts" ON public.community_posts
      FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 5. Moderação e Segurança
CREATE TABLE IF NOT EXISTS public.community_post_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id), -- Quem bloqueou
  blocked_user_id UUID REFERENCES auth.users(id), -- Quem foi bloqueado
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_rules_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.community_post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_rules_acceptance ENABLE ROW LEVEL SECURITY;

-- Policies Reports
DO $$ BEGIN
    CREATE POLICY "Criar report" ON public.community_post_reports
        FOR INSERT WITH CHECK (auth.uid() = reporter_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins ver reports" ON public.community_post_reports
        FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Policies Blocks
DO $$ BEGIN
    CREATE POLICY "Gerenciar meus blocks" ON public.community_user_blocks
        FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Policies Rules
DO $$ BEGIN
    CREATE POLICY "Ler meu aceite" ON public.community_rules_acceptance
        FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Registrar aceite" ON public.community_rules_acceptance
        FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 6. Índices para Performance
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_published ON public.mundo_nath_posts(is_published);


-- 7. Storage Setup (Buckets e Policies)
-- Nota: Criação de buckets via SQL pode variar dependendo da versão da extensão storage, mas policies funcionam.

INSERT INTO storage.buckets (id, name, public) VALUES ('community-media', 'community-media', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('mundo-nath-media', 'mundo-nath-media', false) ON CONFLICT DO NOTHING;

-- Policy: Authenticated users can upload to their own folder in community-media
-- Folder structure: uid/filename
DO $$ BEGIN
    CREATE POLICY "Upload proprio community" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'community-media' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Ver proprios objetos community" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'community-media' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin ver tudo community" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'community-media' AND (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
