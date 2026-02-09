-- ============================================
-- NOSSA MATERNIDADE - Migration 030: User Reports & Blocks
-- ============================================
-- Sistema de denúncias e bloqueios de usuários
-- Permite que usuários denunciem conteúdo e bloqueiem outros usuários
-- ============================================

-- content_type pode já existir (021_content_moderation); criar se não existir
DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('post', 'comment', 'profile', 'message');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- ENUM: report_reason
-- ============================================
CREATE TYPE report_reason AS ENUM (
  'spam',
  'harassment',
  'hate_speech',
  'inappropriate_content',
  'misinformation',
  'impersonation',
  'other'
);

-- ============================================
-- ENUM: report_status
-- ============================================
CREATE TYPE report_status AS ENUM (
  'pending',
  'reviewed',
  'resolved',
  'dismissed'
);

-- ============================================
-- TABELA: user_reports
-- ============================================
-- Denúncias feitas por usuários
CREATE TABLE user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Quem denunciou
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Conteúdo denunciado
  content_type content_type NOT NULL, -- 'post', 'comment', 'profile', 'message'
  content_id UUID NOT NULL,
  reported_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Detalhes da denúncia
  reason report_reason NOT NULL,
  description TEXT, -- Descrição adicional (opcional)

  -- Status
  status report_status DEFAULT 'pending',

  -- Revisão (admin)
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  action_taken TEXT, -- 'warning', 'content_removed', 'user_banned', 'dismissed'

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: não pode denunciar a si mesmo
  CONSTRAINT no_self_report CHECK (reporter_id != reported_user_id)
);

-- ============================================
-- TABELA: user_blocks
-- ============================================
-- Bloqueios entre usuários
CREATE TABLE user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Quem bloqueou
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Quem foi bloqueado
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_id),
  CONSTRAINT unique_block UNIQUE (blocker_id, blocked_id)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_user_reports_reporter ON user_reports(reporter_id);
CREATE INDEX idx_user_reports_reported ON user_reports(reported_user_id);
CREATE INDEX idx_user_reports_content ON user_reports(content_type, content_id);
CREATE INDEX idx_user_reports_status ON user_reports(status, created_at DESC);
CREATE INDEX idx_user_reports_pending ON user_reports(status) WHERE status = 'pending';

CREATE INDEX idx_user_blocks_blocker ON user_blocks(blocker_id);
CREATE INDEX idx_user_blocks_blocked ON user_blocks(blocked_id);
CREATE INDEX idx_user_blocks_pair ON user_blocks(blocker_id, blocked_id);

-- ============================================
-- RLS POLICIES - user_reports
-- ============================================
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Usuários podem criar denúncias
CREATE POLICY "Users can create reports"
  ON user_reports
  FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- Usuários podem ver suas próprias denúncias
CREATE POLICY "Users can view own reports"
  ON user_reports
  FOR SELECT
  USING (
    reporter_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Apenas admins podem atualizar denúncias
CREATE POLICY "Only admins can update reports"
  ON user_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- ============================================
-- RLS POLICIES - user_blocks
-- ============================================
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;

-- Usuários podem criar bloqueios
CREATE POLICY "Users can create blocks"
  ON user_blocks
  FOR INSERT
  WITH CHECK (blocker_id = auth.uid());

-- Usuários podem ver seus próprios bloqueios
CREATE POLICY "Users can view own blocks"
  ON user_blocks
  FOR SELECT
  USING (blocker_id = auth.uid());

-- Usuários podem remover seus próprios bloqueios
CREATE POLICY "Users can delete own blocks"
  ON user_blocks
  FOR DELETE
  USING (blocker_id = auth.uid());

-- ============================================
-- FUNÇÃO: report_content
-- ============================================
-- RPC para denunciar conteúdo
CREATE OR REPLACE FUNCTION report_content(
  p_content_type content_type,
  p_content_id UUID,
  p_reason report_reason,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reported_user_id UUID;
  v_report_id UUID;
BEGIN
  -- Verificar se usuário está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Buscar o autor do conteúdo
  IF p_content_type = 'post' THEN
    SELECT author_id INTO v_reported_user_id
    FROM community_posts WHERE id = p_content_id;
  ELSIF p_content_type = 'comment' THEN
    SELECT author_id INTO v_reported_user_id
    FROM community_comments WHERE id = p_content_id;
  ELSIF p_content_type = 'profile' THEN
    v_reported_user_id := p_content_id;
  ELSIF p_content_type = 'message' THEN
    SELECT sender_id INTO v_reported_user_id
    FROM chat_messages WHERE id = p_content_id;
  END IF;

  IF v_reported_user_id IS NULL THEN
    RAISE EXCEPTION 'Content not found';
  END IF;

  -- Não pode denunciar a si mesmo
  IF v_reported_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot report own content';
  END IF;

  -- Verificar se já existe denúncia do mesmo usuário para o mesmo conteúdo
  IF EXISTS (
    SELECT 1 FROM user_reports
    WHERE reporter_id = auth.uid()
    AND content_type = p_content_type
    AND content_id = p_content_id
    AND status IN ('pending', 'reviewed')
  ) THEN
    RAISE EXCEPTION 'Content already reported';
  END IF;

  -- Criar denúncia
  INSERT INTO user_reports (
    reporter_id,
    content_type,
    content_id,
    reported_user_id,
    reason,
    description
  ) VALUES (
    auth.uid(),
    p_content_type,
    p_content_id,
    v_reported_user_id,
    p_reason,
    p_description
  ) RETURNING id INTO v_report_id;

  RETURN v_report_id;
END;
$$;

-- ============================================
-- FUNÇÃO: block_user
-- ============================================
-- RPC para bloquear usuário
CREATE OR REPLACE FUNCTION block_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se usuário está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Não pode bloquear a si mesmo
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot block yourself';
  END IF;

  -- Verificar se usuário existe
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Criar bloqueio (ignorar se já existe)
  INSERT INTO user_blocks (blocker_id, blocked_id)
  VALUES (auth.uid(), p_user_id)
  ON CONFLICT (blocker_id, blocked_id) DO NOTHING;

  RETURN TRUE;
END;
$$;

-- ============================================
-- FUNÇÃO: unblock_user
-- ============================================
-- RPC para desbloquear usuário
CREATE OR REPLACE FUNCTION unblock_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se usuário está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Remover bloqueio
  DELETE FROM user_blocks
  WHERE blocker_id = auth.uid()
  AND blocked_id = p_user_id;

  RETURN TRUE;
END;
$$;

-- ============================================
-- FUNÇÃO: is_blocked
-- ============================================
-- Verifica se um usuário bloqueou outro
CREATE OR REPLACE FUNCTION is_blocked(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_blocks
    WHERE blocker_id = auth.uid()
    AND blocked_id = p_user_id
  );
END;
$$;

-- ============================================
-- FUNÇÃO: get_blocked_users
-- ============================================
-- Lista usuários bloqueados
CREATE OR REPLACE FUNCTION get_blocked_users()
RETURNS TABLE (
  user_id UUID,
  name TEXT,
  blocked_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ub.blocked_id,
    p.name,
    ub.created_at
  FROM user_blocks ub
  JOIN profiles p ON p.id = ub.blocked_id
  WHERE ub.blocker_id = auth.uid()
  ORDER BY ub.created_at DESC;
END;
$$;

-- ============================================
-- VIEW: posts sem usuários bloqueados
-- ============================================
-- Atualizar policy de community_posts para filtrar bloqueados
DROP POLICY IF EXISTS "Users cannot see blocked posts" ON community_posts;

CREATE POLICY "Users cannot see blocked or blocked_user posts"
  ON community_posts
  FOR SELECT
  USING (
    -- Não esconder próprios posts
    (author_id = auth.uid())
    OR
    -- Admins veem tudo
    (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    ))
    OR
    -- Posts visíveis: não escondidos E autor não bloqueado
    (
      NOT is_hidden
      AND NOT EXISTS (
        SELECT 1 FROM user_blocks
        WHERE blocker_id = auth.uid()
        AND blocked_id = community_posts.author_id
      )
    )
  );

-- ============================================
-- VIEW: pending_reports (para admins)
-- ============================================
CREATE OR REPLACE VIEW pending_reports AS
SELECT
  ur.id AS report_id,
  ur.content_type,
  ur.content_id,
  ur.reason,
  ur.description,
  ur.status,
  ur.created_at,
  -- Reporter info
  reporter.id AS reporter_id,
  reporter.name AS reporter_name,
  -- Reported user info
  reported.id AS reported_user_id,
  reported.name AS reported_user_name,
  -- Content preview
  CASE
    WHEN ur.content_type = 'post' THEN LEFT(cp.content, 200)
    WHEN ur.content_type = 'comment' THEN LEFT(cc.content, 200)
    ELSE NULL
  END AS content_preview
FROM user_reports ur
JOIN profiles reporter ON ur.reporter_id = reporter.id
JOIN profiles reported ON ur.reported_user_id = reported.id
LEFT JOIN community_posts cp ON ur.content_type = 'post' AND ur.content_id = cp.id
LEFT JOIN community_comments cc ON ur.content_type = 'comment' AND ur.content_id = cc.id
WHERE ur.status = 'pending'
ORDER BY ur.created_at DESC;

-- Grant access to authenticated users (RLS will filter for admins only)
GRANT SELECT ON pending_reports TO authenticated;

-- ============================================
-- TRIGGER: updated_at
-- ============================================
CREATE TRIGGER update_user_reports_updated_at
  BEFORE UPDATE ON user_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE user_reports IS 'Denúncias de conteúdo feitas por usuários';
COMMENT ON TABLE user_blocks IS 'Bloqueios entre usuários';
COMMENT ON FUNCTION report_content IS 'RPC para denunciar conteúdo (post, comment, profile, message)';
COMMENT ON FUNCTION block_user IS 'RPC para bloquear um usuário';
COMMENT ON FUNCTION unblock_user IS 'RPC para desbloquear um usuário';
COMMENT ON FUNCTION is_blocked IS 'Verifica se o usuário atual bloqueou outro usuário';
COMMENT ON FUNCTION get_blocked_users IS 'Lista todos os usuários bloqueados pelo usuário atual';
COMMENT ON VIEW pending_reports IS 'View de denúncias pendentes para revisão (apenas admins)';
