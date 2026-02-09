-- ============================================
-- NOSSA MATERNIDADE - Migration 011: Analytics Dashboard
-- ============================================
-- Views e funcoes avancadas para dashboard de analytics
-- - DAU/MAU (Daily/Monthly Active Users)
-- - Retention rate
-- - Funnel detalhado
-- - Feature usage por periodo
-- ============================================

-- ============================================
-- FUNCOES PARA METRICAS
-- ============================================

-- Funcao: Calcular DAU (Daily Active Users)
CREATE OR REPLACE FUNCTION get_dau(p_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT user_id_hash)
    FROM analytics_events
    WHERE DATE(created_at) = p_date
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Funcao: Calcular WAU (Weekly Active Users)
CREATE OR REPLACE FUNCTION get_wau(p_week_start DATE DEFAULT DATE_TRUNC('week', CURRENT_DATE)::DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT user_id_hash)
    FROM analytics_events
    WHERE created_at >= p_week_start
      AND created_at < p_week_start + INTERVAL '7 days'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Funcao: Calcular MAU (Monthly Active Users)
CREATE OR REPLACE FUNCTION get_mau(p_month_start DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT user_id_hash)
    FROM analytics_events
    WHERE created_at >= p_month_start
      AND created_at < p_month_start + INTERVAL '1 month'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Funcao: Calcular DAU/MAU ratio (stickiness)
CREATE OR REPLACE FUNCTION get_stickiness(p_date DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_dau INTEGER;
  v_mau INTEGER;
BEGIN
  v_dau := get_dau(p_date);
  v_mau := get_mau(DATE_TRUNC('month', p_date)::DATE);

  IF v_mau = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((v_dau::DECIMAL / v_mau) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Funcao: Calcular retention rate (cohort-based)
-- Retorna % de usuarios que voltaram apos N dias
CREATE OR REPLACE FUNCTION get_retention_rate(
  p_cohort_date DATE,
  p_days_after INTEGER
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_cohort_users INTEGER;
  v_retained_users INTEGER;
BEGIN
  -- Usuarios que apareceram pela primeira vez na data do cohort
  SELECT COUNT(DISTINCT user_id_hash) INTO v_cohort_users
  FROM analytics_events ae
  WHERE DATE(ae.created_at) = p_cohort_date
    AND NOT EXISTS (
      SELECT 1 FROM analytics_events ae2
      WHERE ae2.user_id_hash = ae.user_id_hash
        AND DATE(ae2.created_at) < p_cohort_date
    );

  IF v_cohort_users = 0 THEN
    RETURN 0;
  END IF;

  -- Usuarios do cohort que voltaram apos N dias
  SELECT COUNT(DISTINCT ae.user_id_hash) INTO v_retained_users
  FROM analytics_events ae
  WHERE DATE(ae.created_at) = p_cohort_date + p_days_after
    AND EXISTS (
      SELECT 1 FROM analytics_events ae2
      WHERE ae2.user_id_hash = ae.user_id_hash
        AND DATE(ae2.created_at) = p_cohort_date
    );

  RETURN ROUND((v_retained_users::DECIMAL / v_cohort_users) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Funcao: Obter metricas de retention para ultimos N dias
CREATE OR REPLACE FUNCTION get_retention_metrics(p_days INTEGER DEFAULT 30)
RETURNS TABLE(
  cohort_date DATE,
  cohort_size INTEGER,
  day1_retention DECIMAL(5,2),
  day7_retention DECIMAL(5,2),
  day14_retention DECIMAL(5,2),
  day30_retention DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH cohorts AS (
    SELECT
      DATE(ae.created_at) as first_seen_date,
      ae.user_id_hash
    FROM analytics_events ae
    WHERE ae.created_at >= CURRENT_DATE - p_days
    GROUP BY DATE(ae.created_at), ae.user_id_hash
    HAVING NOT EXISTS (
      SELECT 1 FROM analytics_events ae2
      WHERE ae2.user_id_hash = ae.user_id_hash
        AND DATE(ae2.created_at) < DATE(ae.created_at)
    )
  ),
  cohort_sizes AS (
    SELECT
      first_seen_date,
      COUNT(*) as size
    FROM cohorts
    GROUP BY first_seen_date
  )
  SELECT
    cs.first_seen_date as cohort_date,
    cs.size::INTEGER as cohort_size,
    COALESCE(get_retention_rate(cs.first_seen_date, 1), 0) as day1_retention,
    COALESCE(get_retention_rate(cs.first_seen_date, 7), 0) as day7_retention,
    COALESCE(get_retention_rate(cs.first_seen_date, 14), 0) as day14_retention,
    COALESCE(get_retention_rate(cs.first_seen_date, 30), 0) as day30_retention
  FROM cohort_sizes cs
  WHERE cs.first_seen_date <= CURRENT_DATE - 1
  ORDER BY cs.first_seen_date DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- VIEWS AVANCADAS
-- ============================================

-- View: DAU/WAU/MAU por dia (ultimos 30 dias)
CREATE OR REPLACE VIEW analytics_active_users AS
WITH dates AS (
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE,
    '1 day'
  )::DATE as date
),
daily_users AS (
  SELECT
    DATE(created_at) as date,
    COUNT(DISTINCT user_id_hash) as dau
  FROM analytics_events
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(created_at)
),
weekly_users AS (
  SELECT
    d.date,
    COUNT(DISTINCT ae.user_id_hash) as wau
  FROM dates d
  LEFT JOIN analytics_events ae ON ae.created_at >= d.date - INTERVAL '7 days'
                                 AND ae.created_at < d.date + INTERVAL '1 day'
  GROUP BY d.date
),
monthly_users AS (
  SELECT
    d.date,
    COUNT(DISTINCT ae.user_id_hash) as mau
  FROM dates d
  LEFT JOIN analytics_events ae ON ae.created_at >= d.date - INTERVAL '30 days'
                                 AND ae.created_at < d.date + INTERVAL '1 day'
  GROUP BY d.date
)
SELECT
  d.date,
  COALESCE(du.dau, 0) as dau,
  COALESCE(wu.wau, 0) as wau,
  COALESCE(mu.mau, 0) as mau,
  CASE WHEN mu.mau > 0
    THEN ROUND((du.dau::DECIMAL / mu.mau) * 100, 2)
    ELSE 0
  END as stickiness_percent
FROM dates d
LEFT JOIN daily_users du ON d.date = du.date
LEFT JOIN weekly_users wu ON d.date = wu.date
LEFT JOIN monthly_users mu ON d.date = mu.date
ORDER BY d.date DESC;

-- View: Funil de onboarding detalhado
CREATE OR REPLACE VIEW analytics_onboarding_funnel AS
WITH funnel_steps AS (
  SELECT
    'onboarding_started' as step,
    1 as step_order
  UNION ALL SELECT 'onboarding_completed', 2
  UNION ALL SELECT 'first_check_in', 3
  UNION ALL SELECT 'first_habit_completed', 4
  UNION ALL SELECT 'first_affirmation_viewed', 5
  UNION ALL SELECT 'first_ai_chat', 6
  UNION ALL SELECT 'notification_enabled', 7
  UNION ALL SELECT 'profile_completed', 8
),
conversions AS (
  SELECT
    conversion_event,
    COUNT(DISTINCT user_id_hash) as unique_users
  FROM analytics_conversions
  WHERE is_first_time = TRUE
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY conversion_event
),
first_step AS (
  SELECT unique_users FROM conversions WHERE conversion_event = 'onboarding_started'
)
SELECT
  fs.step,
  fs.step_order,
  COALESCE(c.unique_users, 0) as users_reached,
  CASE WHEN (SELECT unique_users FROM first_step) > 0
    THEN ROUND(
      (COALESCE(c.unique_users, 0)::DECIMAL / (SELECT unique_users FROM first_step)) * 100, 2
    )
    ELSE 0
  END as conversion_rate_from_start,
  CASE WHEN LAG(c.unique_users) OVER (ORDER BY fs.step_order) > 0
    THEN ROUND(
      (COALESCE(c.unique_users, 0)::DECIMAL / LAG(c.unique_users) OVER (ORDER BY fs.step_order)) * 100, 2
    )
    ELSE 100
  END as step_conversion_rate
FROM funnel_steps fs
LEFT JOIN conversions c ON fs.step = c.conversion_event
ORDER BY fs.step_order;

-- View: Feature usage por categoria (ultimos 7 dias)
CREATE OR REPLACE VIEW analytics_feature_breakdown AS
SELECT
  category,
  event_name as feature,
  COUNT(*) as total_uses,
  COUNT(DISTINCT user_id_hash) as unique_users,
  AVG(duration_ms)::INTEGER as avg_duration_ms,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '1 day') as uses_today,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as uses_week
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY category, event_name
ORDER BY total_uses DESC;

-- View: User engagement score (ultimos 30 dias)
CREATE OR REPLACE VIEW analytics_user_engagement AS
SELECT
  user_id_hash,
  COUNT(*) as total_events,
  COUNT(DISTINCT DATE(created_at)) as active_days,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(*) FILTER (WHERE category = 'feature_use') as features_used,
  COUNT(*) FILTER (WHERE category = 'ai_interaction') as ai_chats,
  COUNT(*) FILTER (WHERE category = 'community') as community_actions,
  MAX(created_at) as last_activity,
  -- Engagement score (0-100)
  LEAST(100, (
    (COUNT(DISTINCT DATE(created_at)) * 3) + -- Active days weight
    (COUNT(DISTINCT session_id) * 2) +        -- Sessions weight
    (COUNT(*) FILTER (WHERE category = 'feature_use')) + -- Feature usage
    (COUNT(*) FILTER (WHERE category = 'ai_interaction') * 2) + -- AI usage
    (COUNT(*) FILTER (WHERE category = 'community') * 2) -- Community
  )) as engagement_score
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id_hash
ORDER BY engagement_score DESC;

-- View: Hourly usage pattern
CREATE OR REPLACE VIEW analytics_hourly_pattern AS
SELECT
  EXTRACT(HOUR FROM created_at) as hour_of_day,
  EXTRACT(DOW FROM created_at) as day_of_week,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id_hash) as unique_users
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM created_at), EXTRACT(DOW FROM created_at)
ORDER BY day_of_week, hour_of_day;

-- View: Error tracking (ultimos 7 dias)
CREATE OR REPLACE VIEW analytics_errors AS
SELECT
  properties->>'error_type' as error_type,
  properties->>'screen' as screen,
  properties->>'message' as error_message,
  COUNT(*) as occurrences,
  COUNT(DISTINCT user_id_hash) as affected_users,
  MIN(created_at) as first_seen,
  MAX(created_at) as last_seen
FROM analytics_events
WHERE category = 'error'
  AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY
  properties->>'error_type',
  properties->>'screen',
  properties->>'message'
ORDER BY occurrences DESC;

-- View: Session metrics
CREATE OR REPLACE VIEW analytics_session_metrics AS
SELECT
  DATE(started_at) as date,
  COUNT(*) as total_sessions,
  ROUND(AVG(duration_seconds)::DECIMAL / 60, 2) as avg_session_minutes,
  ROUND(AVG(screen_count)::DECIMAL, 1) as avg_screens_per_session,
  ROUND(AVG(event_count)::DECIMAL, 1) as avg_events_per_session,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_seconds) as median_duration_seconds,
  COUNT(*) FILTER (WHERE duration_seconds >= 300) as sessions_5min_plus,
  COUNT(*) FILTER (WHERE duration_seconds < 30) as bounce_sessions
FROM analytics_sessions
WHERE started_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- ============================================
-- STORED PROCEDURE: Dashboard completo
-- ============================================

-- Funcao que retorna todas as metricas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_period INTEGER DEFAULT 30)
RETURNS TABLE(
  metric_name TEXT,
  metric_value DECIMAL,
  metric_type TEXT,
  comparison_value DECIMAL,
  comparison_percent DECIMAL
) AS $$
BEGIN
  -- DAU atual
  RETURN QUERY
  SELECT
    'dau'::TEXT,
    get_dau()::DECIMAL,
    'count'::TEXT,
    get_dau(CURRENT_DATE - 1)::DECIMAL,
    CASE WHEN get_dau(CURRENT_DATE - 1) > 0
      THEN ROUND(((get_dau()::DECIMAL - get_dau(CURRENT_DATE - 1)) / get_dau(CURRENT_DATE - 1)) * 100, 2)
      ELSE 0
    END;

  -- MAU atual
  RETURN QUERY
  SELECT
    'mau'::TEXT,
    get_mau()::DECIMAL,
    'count'::TEXT,
    get_mau(DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE)::DECIMAL,
    CASE WHEN get_mau(DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE) > 0
      THEN ROUND(((get_mau()::DECIMAL - get_mau(DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE)) /
           get_mau(DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE)) * 100, 2)
      ELSE 0
    END;

  -- Stickiness
  RETURN QUERY
  SELECT
    'stickiness'::TEXT,
    get_stickiness()::DECIMAL,
    'percent'::TEXT,
    get_stickiness(CURRENT_DATE - 7)::DECIMAL,
    get_stickiness() - get_stickiness(CURRENT_DATE - 7);

  -- Total events hoje
  RETURN QUERY
  SELECT
    'events_today'::TEXT,
    (SELECT COUNT(*) FROM analytics_events WHERE DATE(created_at) = CURRENT_DATE)::DECIMAL,
    'count'::TEXT,
    (SELECT COUNT(*) FROM analytics_events WHERE DATE(created_at) = CURRENT_DATE - 1)::DECIMAL,
    CASE WHEN (SELECT COUNT(*) FROM analytics_events WHERE DATE(created_at) = CURRENT_DATE - 1) > 0
      THEN ROUND((((SELECT COUNT(*) FROM analytics_events WHERE DATE(created_at) = CURRENT_DATE)::DECIMAL -
           (SELECT COUNT(*) FROM analytics_events WHERE DATE(created_at) = CURRENT_DATE - 1)) /
           (SELECT COUNT(*) FROM analytics_events WHERE DATE(created_at) = CURRENT_DATE - 1)) * 100, 2)
      ELSE 0
    END;

  -- Sessions hoje
  RETURN QUERY
  SELECT
    'sessions_today'::TEXT,
    (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = CURRENT_DATE)::DECIMAL,
    'count'::TEXT,
    (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = CURRENT_DATE - 1)::DECIMAL,
    CASE WHEN (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = CURRENT_DATE - 1) > 0
      THEN ROUND((((SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = CURRENT_DATE)::DECIMAL -
           (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = CURRENT_DATE - 1)) /
           (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = CURRENT_DATE - 1)) * 100, 2)
      ELSE 0
    END;

  -- Day 1 retention (ontem)
  RETURN QUERY
  SELECT
    'd1_retention'::TEXT,
    get_retention_rate(CURRENT_DATE - 1, 1)::DECIMAL,
    'percent'::TEXT,
    get_retention_rate(CURRENT_DATE - 8, 1)::DECIMAL,
    get_retention_rate(CURRENT_DATE - 1, 1) - get_retention_rate(CURRENT_DATE - 8, 1);

  -- Day 7 retention
  RETURN QUERY
  SELECT
    'd7_retention'::TEXT,
    get_retention_rate(CURRENT_DATE - 7, 7)::DECIMAL,
    'percent'::TEXT,
    get_retention_rate(CURRENT_DATE - 14, 7)::DECIMAL,
    get_retention_rate(CURRENT_DATE - 7, 7) - get_retention_rate(CURRENT_DATE - 14, 7);

  -- Conversoes onboarding (ultimos 7 dias)
  RETURN QUERY
  SELECT
    'onboarding_completions'::TEXT,
    (SELECT COUNT(*) FROM analytics_conversions
     WHERE conversion_event = 'onboarding_completed'
     AND is_first_time = TRUE
     AND created_at >= CURRENT_DATE - INTERVAL '7 days')::DECIMAL,
    'count'::TEXT,
    (SELECT COUNT(*) FROM analytics_conversions
     WHERE conversion_event = 'onboarding_completed'
     AND is_first_time = TRUE
     AND created_at >= CURRENT_DATE - INTERVAL '14 days'
     AND created_at < CURRENT_DATE - INTERVAL '7 days')::DECIMAL,
    NULL::DECIMAL;

  RETURN;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- INDICES ADICIONAIS
-- ============================================

-- Indices para otimizar as views
CREATE INDEX IF NOT EXISTS idx_analytics_events_date_user
  ON analytics_events(DATE(created_at), user_id_hash);

CREATE INDEX IF NOT EXISTS idx_analytics_events_category_date
  ON analytics_events(category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_date
  ON analytics_sessions(DATE(started_at));

CREATE INDEX IF NOT EXISTS idx_analytics_conversions_event_first
  ON analytics_conversions(conversion_event, is_first_time, created_at DESC);

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON FUNCTION get_dau IS 'Retorna DAU (Daily Active Users) para uma data';
COMMENT ON FUNCTION get_mau IS 'Retorna MAU (Monthly Active Users) para um mes';
COMMENT ON FUNCTION get_stickiness IS 'Retorna DAU/MAU ratio (stickiness) em %';
COMMENT ON FUNCTION get_retention_rate IS 'Retorna retention rate para um cohort apos N dias';
COMMENT ON FUNCTION get_dashboard_metrics IS 'Retorna todas as metricas do dashboard';

COMMENT ON VIEW analytics_active_users IS 'DAU/WAU/MAU diario dos ultimos 30 dias';
COMMENT ON VIEW analytics_onboarding_funnel IS 'Funil de onboarding com conversoes';
COMMENT ON VIEW analytics_feature_breakdown IS 'Uso de features por categoria';
COMMENT ON VIEW analytics_user_engagement IS 'Score de engajamento por usuario';
COMMENT ON VIEW analytics_hourly_pattern IS 'Padrao de uso por hora/dia da semana';
COMMENT ON VIEW analytics_errors IS 'Erros agrupados dos ultimos 7 dias';
COMMENT ON VIEW analytics_session_metrics IS 'Metricas de sessao por dia';
