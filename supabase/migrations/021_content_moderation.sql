-- ============================================
-- NOSSA MATERNIDADE - Migration 013: Content Moderation
-- ============================================
-- Sistema de moderação automática de conteúdo
-- Integração com OpenAI Moderation API via Edge Function
-- ============================================

-- ============================================
-- ENUM: moderation_status
-- ============================================
CREATE TYPE moderation_status AS ENUM (
  'safe',
  'flagged',
  'blocked'
);

-- ============================================
-- ENUM: moderation_action
-- ============================================
CREATE TYPE moderation_action AS ENUM (
  'published',
  'quarantined',
  'rejected'
);

-- ============================================
-- ENUM: content_type
-- ============================================
CREATE TYPE content_type AS ENUM (
  'post',
  'comment',
  'profile',
  'message'
);

-- ============================================
-- TABELA: moderation_logs
-- ============================================
-- Log de todas as decisões de moderação
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação do conteúdo
  content_type content_type NOT NULL,
  content_id UUID, -- ID do post/comment/etc (pode ser NULL se ainda não criado)
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Resultado da moderação
  status moderation_status NOT NULL,
  confidence DECIMAL(3, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasons TEXT[] DEFAULT '{}', -- Array de categorias flagged (e.g., ['harassment', 'hate'])
  action_taken moderation_action NOT NULL,

  -- Detalhes completos da API (JSON)
  details JSONB,

  -- Revisão manual (se aplicável)
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_decision TEXT CHECK (review_decision IN ('approved', 'rejected', 'edited')),
  review_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADICIONAR CAMPOS DE MODERAÇÃO EM COMMENTS
-- ============================================
-- community_posts já tem is_hidden e hidden_reason
-- Adicionar campos similares em community_comments

ALTER TABLE community_comments
  ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS hidden_reason TEXT,
  ADD COLUMN IF NOT EXISTS moderation_status moderation_status DEFAULT 'safe';

ALTER TABLE community_posts
  ADD COLUMN IF NOT EXISTS moderation_status moderation_status DEFAULT 'safe';

-- ============================================
-- FUNÇÃO: moderate_content_rpc
-- ============================================
-- Função RPC para chamar Edge Function de moderação
-- Usada por triggers automáticos

CREATE OR REPLACE FUNCTION moderate_content_rpc(
  p_content TEXT,
  p_type content_type,
  p_author_id UUID,
  p_content_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_edge_function_url TEXT;
  v_service_key TEXT;
BEGIN
  -- Get Supabase service key from config (stored securely)
  v_service_key := current_setting('app.settings.supabase_service_key', true);

  -- Build Edge Function URL
  v_edge_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/moderate-content';

  -- Call Edge Function via HTTP
  -- Note: This requires pg_net extension
  SELECT
    content::jsonb INTO v_result
  FROM
    net.http_post(
      url := v_edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key,
        'x-service-key', v_service_key
      ),
      body := jsonb_build_object(
        'content', p_content,
        'type', p_type,
        'author_id', p_author_id,
        'content_id', p_content_id
      )
    );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    -- On error, return safe status (fail open)
    RAISE WARNING 'Moderation API error: %', SQLERRM;
    RETURN jsonb_build_object(
      'status', 'safe',
      'reasons', '[]',
      'confidence', 0.0,
      'action_taken', 'published'
    );
END;
$$;

-- ============================================
-- FUNÇÃO: auto_moderate_post
-- ============================================
-- Trigger function para moderar posts automaticamente

CREATE OR REPLACE FUNCTION auto_moderate_post()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_moderation_result JSONB;
BEGIN
  -- Skip if content is empty
  IF NEW.content IS NULL OR char_length(trim(NEW.content)) = 0 THEN
    RETURN NEW;
  END IF;

  -- Call moderation function (async, non-blocking)
  -- Use pg_background or pg_cron for true async
  -- For now, we'll do it synchronously
  BEGIN
    v_moderation_result := moderate_content_rpc(
      p_content := NEW.content,
      p_type := 'post',
      p_author_id := NEW.author_id,
      p_content_id := NEW.id
    );

    -- Update post based on moderation result
    IF v_moderation_result->>'status' = 'blocked' THEN
      NEW.is_hidden := TRUE;
      NEW.hidden_reason := 'Conteúdo bloqueado automaticamente: ' || (v_moderation_result->>'reasons');
      NEW.moderation_status := 'blocked';
    ELSIF v_moderation_result->>'status' = 'flagged' THEN
      NEW.is_hidden := TRUE;
      NEW.hidden_reason := 'Conteúdo em revisão: ' || (v_moderation_result->>'reasons');
      NEW.moderation_status := 'flagged';
    ELSE
      NEW.moderation_status := 'safe';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      -- On error, allow content (fail open)
      RAISE WARNING 'Auto-moderation failed: %', SQLERRM;
      NEW.moderation_status := 'safe';
  END;

  RETURN NEW;
END;
$$;

-- ============================================
-- FUNÇÃO: auto_moderate_comment
-- ============================================
-- Trigger function para moderar comentários automaticamente

CREATE OR REPLACE FUNCTION auto_moderate_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_moderation_result JSONB;
BEGIN
  -- Skip if content is empty
  IF NEW.content IS NULL OR char_length(trim(NEW.content)) = 0 THEN
    RETURN NEW;
  END IF;

  -- Call moderation function
  BEGIN
    v_moderation_result := moderate_content_rpc(
      p_content := NEW.content,
      p_type := 'comment',
      p_author_id := NEW.author_id,
      p_content_id := NEW.id
    );

    -- Update comment based on moderation result
    IF v_moderation_result->>'status' = 'blocked' THEN
      NEW.is_hidden := TRUE;
      NEW.hidden_reason := 'Conteúdo bloqueado automaticamente: ' || (v_moderation_result->>'reasons');
      NEW.moderation_status := 'blocked';
    ELSIF v_moderation_result->>'status' = 'flagged' THEN
      NEW.is_hidden := TRUE;
      NEW.hidden_reason := 'Conteúdo em revisão: ' || (v_moderation_result->>'reasons');
      NEW.moderation_status := 'flagged';
    ELSE
      NEW.moderation_status := 'safe';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      -- On error, allow content (fail open)
      RAISE WARNING 'Auto-moderation failed: %', SQLERRM;
      NEW.moderation_status := 'safe';
  END;

  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGERS: Auto-moderação
-- ============================================

-- Trigger para posts (BEFORE INSERT para modificar antes de salvar)
CREATE TRIGGER trigger_auto_moderate_post
  BEFORE INSERT ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_moderate_post();

-- Trigger para comentários
CREATE TRIGGER trigger_auto_moderate_comment
  BEFORE INSERT ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION auto_moderate_comment();

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_moderation_logs_author ON moderation_logs(author_id);
CREATE INDEX idx_moderation_logs_content ON moderation_logs(content_type, content_id);
CREATE INDEX idx_moderation_logs_status ON moderation_logs(status, created_at DESC);
CREATE INDEX idx_moderation_logs_review ON moderation_logs(reviewed_by, reviewed_at);

CREATE INDEX idx_posts_moderation_status ON community_posts(moderation_status) WHERE moderation_status != 'safe';
CREATE INDEX idx_comments_moderation_status ON community_comments(moderation_status) WHERE moderation_status != 'safe';

-- ============================================
-- RLS POLICIES
-- ============================================

-- Apenas admins podem ver logs de moderação
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view moderation logs"
  ON moderation_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "System can insert moderation logs"
  ON moderation_logs
  FOR INSERT
  WITH CHECK (TRUE); -- Edge Function usa service key

-- Usuários não veem posts/comentários bloqueados (exceto admins)
CREATE POLICY "Users cannot see blocked posts"
  ON community_posts
  FOR SELECT
  USING (
    NOT is_hidden
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "Users cannot see hidden comments"
  ON community_comments
  FOR SELECT
  USING (
    NOT is_hidden
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- ============================================
-- FUNÇÃO: review_moderated_content
-- ============================================
-- Função para admins revisarem conteúdo flagged

CREATE OR REPLACE FUNCTION review_moderated_content(
  p_log_id UUID,
  p_decision TEXT, -- 'approved', 'rejected', 'edited'
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log RECORD;
BEGIN
  -- Verificar se usuário é admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = TRUE
  ) THEN
    RAISE EXCEPTION 'Only admins can review moderated content';
  END IF;

  -- Buscar log
  SELECT * INTO v_log FROM moderation_logs WHERE id = p_log_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Moderation log not found';
  END IF;

  -- Atualizar log
  UPDATE moderation_logs
  SET
    reviewed_by = auth.uid(),
    reviewed_at = NOW(),
    review_decision = p_decision,
    review_notes = p_notes
  WHERE id = p_log_id;

  -- Atualizar conteúdo baseado na decisão
  IF p_decision = 'approved' THEN
    -- Publicar conteúdo
    IF v_log.content_type = 'post' THEN
      UPDATE community_posts
      SET
        is_hidden = FALSE,
        hidden_reason = NULL,
        moderation_status = 'safe'
      WHERE id = v_log.content_id;
    ELSIF v_log.content_type = 'comment' THEN
      UPDATE community_comments
      SET
        is_hidden = FALSE,
        hidden_reason = NULL,
        moderation_status = 'safe'
      WHERE id = v_log.content_id;
    END IF;
  ELSIF p_decision = 'rejected' THEN
    -- Manter bloqueado ou deletar
    IF v_log.content_type = 'post' THEN
      UPDATE community_posts
      SET
        is_deleted = TRUE,
        deleted_at = NOW()
      WHERE id = v_log.content_id;
    ELSIF v_log.content_type = 'comment' THEN
      UPDATE community_comments
      SET
        is_deleted = TRUE,
        deleted_at = NOW()
      WHERE id = v_log.content_id;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$;

-- ============================================
-- VIEW: pending_moderation
-- ============================================
-- View para admins verem conteúdo pendente de revisão

CREATE OR REPLACE VIEW pending_moderation AS
SELECT
  ml.id AS log_id,
  ml.content_type,
  ml.content_id,
  ml.author_id,
  p.name AS author_name,
  p.email AS author_email,
  ml.status,
  ml.confidence,
  ml.reasons,
  ml.action_taken,
  ml.created_at,
  CASE
    WHEN ml.content_type = 'post' THEN cp.content
    WHEN ml.content_type = 'comment' THEN cc.content
    ELSE NULL
  END AS content_text
FROM
  moderation_logs ml
  JOIN profiles p ON ml.author_id = p.id
  LEFT JOIN community_posts cp ON ml.content_type = 'post' AND ml.content_id = cp.id
  LEFT JOIN community_comments cc ON ml.content_type = 'comment' AND ml.content_id = cc.id
WHERE
  ml.status = 'flagged'
  AND ml.reviewed_at IS NULL
ORDER BY
  ml.created_at DESC;

-- Grant access to authenticated users (RLS will filter for admins only)
GRANT SELECT ON pending_moderation TO authenticated;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE moderation_logs IS 'Log de todas as decisões de moderação automática';
COMMENT ON FUNCTION moderate_content_rpc IS 'Chama Edge Function /moderate-content para moderar conteúdo';
COMMENT ON FUNCTION auto_moderate_post IS 'Trigger para moderar posts automaticamente ao criar';
COMMENT ON FUNCTION auto_moderate_comment IS 'Trigger para moderar comentários automaticamente ao criar';
COMMENT ON FUNCTION review_moderated_content IS 'Função para admins revisarem conteúdo flagged';
COMMENT ON VIEW pending_moderation IS 'View de conteúdo pendente de revisão manual (apenas admins)';
