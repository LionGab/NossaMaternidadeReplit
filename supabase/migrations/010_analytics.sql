-- ============================================
-- NOSSA MATERNIDADE - Migration 010: Analytics
-- ============================================
-- Sistema de analytics para tracking de eventos
-- Privacy-first: User IDs são hasheados
-- LGPD compliant: Retenção de 90 dias
-- ============================================

-- ============================================
-- TABELA: analytics_events
-- ============================================
-- Eventos de analytics (screen views, actions, etc.)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação anônima
  user_id_hash TEXT NOT NULL, -- Hash do user_id (nunca o ID real)
  session_id TEXT, -- Agrupa eventos da mesma sessão

  -- Dados do evento
  event_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'screen_view', 'user_action', 'feature_use', etc.
  properties JSONB DEFAULT '{}', -- Propriedades do evento (sem PII)
  screen_name TEXT, -- Nome da tela (para screen_view)
  duration_ms INTEGER, -- Duração do evento em ms

  -- Informações do dispositivo
  device_platform TEXT, -- 'ios', 'android', 'web'
  device_model TEXT,
  app_version TEXT,
  os_version TEXT,
  locale TEXT,
  timezone TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: analytics_sessions
-- ============================================
-- Sessões de usuário para analytics
CREATE TABLE analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  user_id_hash TEXT NOT NULL,

  -- Métricas da sessão
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER, -- Calculado no final da sessão

  -- Contadores
  screen_count INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0,

  -- Fonte de entrada
  entry_screen TEXT,
  exit_screen TEXT,
  referrer TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: analytics_conversions
-- ============================================
-- Eventos de conversão para funil tracking
CREATE TABLE analytics_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash TEXT NOT NULL,
  conversion_event TEXT NOT NULL, -- 'onboarding_completed', 'first_check_in', etc.
  properties JSONB DEFAULT '{}',
  is_first_time BOOLEAN DEFAULT TRUE, -- Se é a primeira vez do usuário

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: analytics_feature_usage
-- ============================================
-- Uso agregado de features (para dashboards)
CREATE TABLE analytics_feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL,
  period_date DATE NOT NULL,
  period_type TEXT NOT NULL DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'

  -- Métricas agregadas
  unique_users INTEGER DEFAULT 0,
  total_uses INTEGER DEFAULT 0,
  avg_duration_seconds DECIMAL(10, 2),
  success_rate DECIMAL(5, 2), -- Percentage of successful uses

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(feature_name, period_date, period_type)
);

-- ============================================
-- ÍNDICES
-- ============================================
-- Events
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id_hash, created_at DESC);
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name, created_at DESC);
CREATE INDEX idx_analytics_events_category ON analytics_events(category, created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id, created_at);
CREATE INDEX idx_analytics_events_screen ON analytics_events(screen_name, created_at DESC) WHERE screen_name IS NOT NULL;
CREATE INDEX idx_analytics_events_date ON analytics_events(created_at DESC);

-- Sessions
CREATE INDEX idx_analytics_sessions_user ON analytics_sessions(user_id_hash, started_at DESC);
CREATE INDEX idx_analytics_sessions_date ON analytics_sessions(started_at DESC);

-- Conversions
CREATE INDEX idx_analytics_conversions_user ON analytics_conversions(user_id_hash, conversion_event);
CREATE INDEX idx_analytics_conversions_event ON analytics_conversions(conversion_event, created_at DESC);
CREATE INDEX idx_analytics_conversions_first ON analytics_conversions(conversion_event, is_first_time, created_at DESC);

-- Feature usage
CREATE INDEX idx_analytics_feature_date ON analytics_feature_usage(period_date DESC, feature_name);

-- ============================================
-- FUNÇÕES
-- ============================================

-- Função para atualizar sessão com novos eventos
CREATE OR REPLACE FUNCTION update_analytics_session(
  p_session_id TEXT,
  p_user_id_hash TEXT,
  p_event_count INTEGER DEFAULT 1,
  p_screen_count INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO analytics_sessions (
    session_id,
    user_id_hash,
    started_at,
    last_activity_at,
    event_count,
    screen_count
  ) VALUES (
    p_session_id,
    p_user_id_hash,
    NOW(),
    NOW(),
    p_event_count,
    p_screen_count
  )
  ON CONFLICT (session_id) DO UPDATE SET
    last_activity_at = NOW(),
    event_count = analytics_sessions.event_count + p_event_count,
    screen_count = analytics_sessions.screen_count + p_screen_count,
    duration_seconds = EXTRACT(EPOCH FROM (NOW() - analytics_sessions.started_at))::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para agregar uso de features (para cron job diário)
CREATE OR REPLACE FUNCTION aggregate_feature_usage(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void AS $$
BEGIN
  -- Agregar por feature
  INSERT INTO analytics_feature_usage (
    feature_name,
    period_date,
    period_type,
    unique_users,
    total_uses,
    avg_duration_seconds
  )
  SELECT
    event_name as feature_name,
    p_date as period_date,
    'daily' as period_type,
    COUNT(DISTINCT user_id_hash) as unique_users,
    COUNT(*) as total_uses,
    AVG(duration_ms::DECIMAL / 1000) as avg_duration_seconds
  FROM analytics_events
  WHERE created_at >= p_date
    AND created_at < p_date + INTERVAL '1 day'
    AND category = 'feature_use'
  GROUP BY event_name
  ON CONFLICT (feature_name, period_date, period_type) DO UPDATE SET
    unique_users = EXCLUDED.unique_users,
    total_uses = EXCLUDED.total_uses,
    avg_duration_seconds = EXCLUDED.avg_duration_seconds,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para limpar dados antigos (LGPD - 90 dias)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  -- Eventos > 90 dias
  DELETE FROM analytics_events
  WHERE created_at < NOW() - INTERVAL '90 days';

  -- Sessões > 90 dias
  DELETE FROM analytics_sessions
  WHERE started_at < NOW() - INTERVAL '90 days';

  -- Conversões > 90 dias
  DELETE FROM analytics_conversions
  WHERE created_at < NOW() - INTERVAL '90 days';

  -- Feature usage > 365 dias (agregado, pode manter mais tempo)
  DELETE FROM analytics_feature_usage
  WHERE period_date < CURRENT_DATE - INTERVAL '365 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEWS PARA DASHBOARDS
-- ============================================

-- View: Métricas diárias resumidas
CREATE OR REPLACE VIEW analytics_daily_summary AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_events,
  COUNT(DISTINCT user_id_hash) as unique_users,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(CASE WHEN category = 'screen_view' THEN 1 END) as screen_views,
  COUNT(CASE WHEN category = 'user_action' THEN 1 END) as user_actions,
  COUNT(CASE WHEN category = 'conversion' THEN 1 END) as conversions
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View: Top screens dos últimos 7 dias
CREATE OR REPLACE VIEW analytics_top_screens AS
SELECT
  screen_name,
  COUNT(*) as views,
  COUNT(DISTINCT user_id_hash) as unique_viewers
FROM analytics_events
WHERE category = 'screen_view'
  AND screen_name IS NOT NULL
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY screen_name
ORDER BY views DESC
LIMIT 20;

-- View: Funil de conversão
CREATE OR REPLACE VIEW analytics_conversion_funnel AS
SELECT
  conversion_event,
  COUNT(*) FILTER (WHERE is_first_time) as first_time_conversions,
  COUNT(*) as total_conversions,
  COUNT(DISTINCT user_id_hash) as unique_users
FROM analytics_conversions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY conversion_event
ORDER BY
  CASE conversion_event
    WHEN 'onboarding_started' THEN 1
    WHEN 'onboarding_completed' THEN 2
    WHEN 'first_check_in' THEN 3
    WHEN 'first_habit_completed' THEN 4
    WHEN 'first_affirmation_viewed' THEN 5
    WHEN 'first_ai_chat' THEN 6
    WHEN 'first_community_post' THEN 7
    WHEN 'notification_enabled' THEN 8
    WHEN 'profile_completed' THEN 9
    WHEN 'streak_7_days' THEN 10
    WHEN 'streak_30_days' THEN 11
    ELSE 99
  END;

-- ============================================
-- RLS (Row Level Security)
-- ============================================
-- Analytics tables são write-only para usuários
-- Read é apenas para service role (dashboards)

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_feature_usage ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total (bypass RLS por padrão)
-- Nenhuma policy para usuários = sem acesso direto

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE analytics_events IS 'Eventos de analytics - privacy-first (user_id hasheado)';
COMMENT ON TABLE analytics_sessions IS 'Sessões de usuário para analytics';
COMMENT ON TABLE analytics_conversions IS 'Eventos de conversão para funil tracking';
COMMENT ON TABLE analytics_feature_usage IS 'Dados agregados de uso de features';

COMMENT ON COLUMN analytics_events.user_id_hash IS 'Hash do user_id - NUNCA o ID real';
COMMENT ON COLUMN analytics_events.properties IS 'Propriedades do evento - SEM PII';

COMMENT ON FUNCTION cleanup_old_analytics IS 'Limpa dados com mais de 90 dias (LGPD compliance)';
COMMENT ON FUNCTION aggregate_feature_usage IS 'Agregar uso de features - rodar diariamente via cron';
