-- Growth Attribution + Paywall Experiment Contracts
-- Influencer-led growth foundation for creator source tracking and monetization experiments.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;
END;
$$;

-- ============================================================================
-- User Attribution (first-touch + last-touch source tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  source TEXT NOT NULL,
  medium TEXT NOT NULL DEFAULT '',
  campaign TEXT NOT NULL DEFAULT '',
  content_id TEXT NOT NULL DEFAULT '',
  creator_cta_id TEXT NOT NULL DEFAULT '',
  referrer_url TEXT NOT NULL DEFAULT '',
  landing_path TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL DEFAULT 'unknown',
  first_touch_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_touch_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_touch_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  last_touch_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_attribution_touch
    UNIQUE (user_id, source, campaign, content_id, creator_cta_id)
);

CREATE INDEX IF NOT EXISTS idx_user_attribution_user_id ON user_attribution(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attribution_source_campaign
  ON user_attribution(source, campaign, content_id, creator_cta_id);
CREATE INDEX IF NOT EXISTS idx_user_attribution_last_touch ON user_attribution(last_touch_at DESC);

DROP TRIGGER IF EXISTS trigger_user_attribution_updated_at ON user_attribution;
CREATE TRIGGER trigger_user_attribution_updated_at
  BEFORE UPDATE ON user_attribution
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE user_attribution ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own attribution touches" ON user_attribution;
CREATE POLICY "Users can read own attribution touches"
  ON user_attribution FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own attribution touches" ON user_attribution;
CREATE POLICY "Users can create own attribution touches"
  ON user_attribution FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attribution touches" ON user_attribution;
CREATE POLICY "Users can update own attribution touches"
  ON user_attribution FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Creator Content Performance (daily source/campaign/content aggregates)
-- ============================================================================

CREATE TABLE IF NOT EXISTS creator_content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL,
  campaign TEXT NOT NULL DEFAULT '',
  content_id TEXT NOT NULL DEFAULT '',
  creator_cta_id TEXT NOT NULL DEFAULT '',
  impressions INTEGER NOT NULL DEFAULT 0 CHECK (impressions >= 0),
  clicks INTEGER NOT NULL DEFAULT 0 CHECK (clicks >= 0),
  installs INTEGER NOT NULL DEFAULT 0 CHECK (installs >= 0),
  trials INTEGER NOT NULL DEFAULT 0 CHECK (trials >= 0),
  paid_conversions INTEGER NOT NULL DEFAULT 0 CHECK (paid_conversions >= 0),
  revenue_cents BIGINT NOT NULL DEFAULT 0 CHECK (revenue_cents >= 0),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_creator_content_performance
    UNIQUE (day_date, source, campaign, content_id, creator_cta_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_content_performance_day_source
  ON creator_content_performance(day_date DESC, source, campaign);
CREATE INDEX IF NOT EXISTS idx_creator_content_performance_content
  ON creator_content_performance(content_id, creator_cta_id, day_date DESC);

DROP TRIGGER IF EXISTS trigger_creator_content_performance_updated_at ON creator_content_performance;
CREATE TRIGGER trigger_creator_content_performance_updated_at
  BEFORE UPDATE ON creator_content_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE creator_content_performance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read creator content performance" ON creator_content_performance;
CREATE POLICY "Authenticated users can read creator content performance"
  ON creator_content_performance FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- Paywall Experiment Tracking Contracts
-- ============================================================================

CREATE TABLE IF NOT EXISTS paywall_exposures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL DEFAULT '',
  experiment_name TEXT NOT NULL,
  variant TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'unknown',
  campaign TEXT NOT NULL DEFAULT '',
  content_id TEXT NOT NULL DEFAULT '',
  creator_cta_id TEXT NOT NULL DEFAULT '',
  screen_name TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  displayed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paywall_exposures_user_id ON paywall_exposures(user_id);
CREATE INDEX IF NOT EXISTS idx_paywall_exposures_experiment
  ON paywall_exposures(experiment_name, variant, displayed_at DESC);
CREATE INDEX IF NOT EXISTS idx_paywall_exposures_source
  ON paywall_exposures(source, campaign, content_id, creator_cta_id, displayed_at DESC);

ALTER TABLE paywall_exposures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own paywall exposures" ON paywall_exposures;
CREATE POLICY "Users can read own paywall exposures"
  ON paywall_exposures FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own paywall exposures" ON paywall_exposures;
CREATE POLICY "Users can insert own paywall exposures"
  ON paywall_exposures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS paywall_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL DEFAULT '',
  experiment_name TEXT NOT NULL,
  variant TEXT NOT NULL,
  outcome_type TEXT NOT NULL CHECK (
    outcome_type IN (
      'trial_started',
      'purchase_success',
      'purchase_failed',
      'restore_success',
      'restore_failed',
      'dismissed',
      'skip_free'
    )
  ),
  source TEXT NOT NULL DEFAULT 'unknown',
  campaign TEXT NOT NULL DEFAULT '',
  content_id TEXT NOT NULL DEFAULT '',
  creator_cta_id TEXT NOT NULL DEFAULT '',
  outcome_value_cents BIGINT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paywall_outcomes_user_id ON paywall_outcomes(user_id);
CREATE INDEX IF NOT EXISTS idx_paywall_outcomes_experiment
  ON paywall_outcomes(experiment_name, variant, outcome_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_paywall_outcomes_source
  ON paywall_outcomes(source, campaign, content_id, creator_cta_id, occurred_at DESC);

ALTER TABLE paywall_outcomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own paywall outcomes" ON paywall_outcomes;
CREATE POLICY "Users can read own paywall outcomes"
  ON paywall_outcomes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own paywall outcomes" ON paywall_outcomes;
CREATE POLICY "Users can insert own paywall outcomes"
  ON paywall_outcomes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Daily reporting views (for source/campaign dashboards)
-- ============================================================================

CREATE OR REPLACE VIEW v_growth_creator_daily AS
SELECT
  day_date,
  source,
  campaign,
  content_id,
  creator_cta_id,
  SUM(impressions) AS impressions,
  SUM(clicks) AS clicks,
  SUM(installs) AS installs,
  SUM(trials) AS trials,
  SUM(paid_conversions) AS paid_conversions,
  SUM(revenue_cents) AS revenue_cents,
  CASE WHEN SUM(clicks) > 0
    THEN ROUND((SUM(trials)::DECIMAL / SUM(clicks)::DECIMAL) * 100, 2)
    ELSE 0
  END AS trial_rate_pct,
  CASE WHEN SUM(trials) > 0
    THEN ROUND((SUM(paid_conversions)::DECIMAL / SUM(trials)::DECIMAL) * 100, 2)
    ELSE 0
  END AS paid_rate_pct
FROM creator_content_performance
GROUP BY day_date, source, campaign, content_id, creator_cta_id;

CREATE OR REPLACE VIEW v_paywall_variant_daily AS
WITH exposures AS (
  SELECT
    DATE(displayed_at) AS day_date,
    experiment_name,
    variant,
    source,
    campaign,
    COUNT(*) AS exposures_count
  FROM paywall_exposures
  GROUP BY DATE(displayed_at), experiment_name, variant, source, campaign
),
outcomes AS (
  SELECT
    DATE(occurred_at) AS day_date,
    experiment_name,
    variant,
    source,
    campaign,
    COUNT(*) FILTER (WHERE outcome_type = 'trial_started') AS trials_count,
    COUNT(*) FILTER (WHERE outcome_type = 'purchase_success') AS paid_count,
    COUNT(*) FILTER (WHERE outcome_type = 'purchase_failed') AS failed_count,
    COUNT(*) FILTER (WHERE outcome_type = 'dismissed') AS dismissed_count
  FROM paywall_outcomes
  GROUP BY DATE(occurred_at), experiment_name, variant, source, campaign
)
SELECT
  e.day_date,
  e.experiment_name,
  e.variant,
  e.source,
  e.campaign,
  e.exposures_count,
  COALESCE(o.trials_count, 0) AS trials_count,
  COALESCE(o.paid_count, 0) AS paid_count,
  COALESCE(o.failed_count, 0) AS failed_count,
  COALESCE(o.dismissed_count, 0) AS dismissed_count,
  CASE WHEN e.exposures_count > 0
    THEN ROUND((COALESCE(o.trials_count, 0)::DECIMAL / e.exposures_count::DECIMAL) * 100, 2)
    ELSE 0
  END AS trial_rate_pct,
  CASE WHEN COALESCE(o.trials_count, 0) > 0
    THEN ROUND((COALESCE(o.paid_count, 0)::DECIMAL / o.trials_count::DECIMAL) * 100, 2)
    ELSE 0
  END AS paid_rate_pct
FROM exposures e
LEFT JOIN outcomes o
  ON o.day_date = e.day_date
 AND o.experiment_name = e.experiment_name
 AND o.variant = e.variant
 AND o.source = e.source
 AND o.campaign = e.campaign;

COMMIT;
