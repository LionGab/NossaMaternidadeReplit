-- ============================================
-- NOSSA MATERNIDADE - Migration 012: Premium Subscriptions
-- ============================================
-- Sistema de assinaturas premium via RevenueCat
-- Integração com webhook para eventos de compra/renovação/cancelamento
-- ============================================

-- ============================================
-- ENUM: Subscription Status
-- ============================================
CREATE TYPE subscription_status AS ENUM (
  'active',        -- Assinatura ativa
  'trialing',      -- Em período de teste
  'past_due',      -- Pagamento atrasado
  'paused',        -- Assinatura pausada
  'canceled',      -- Cancelada (ainda ativa até fim do período)
  'expired'        -- Expirada (não renovou)
);

-- ============================================
-- ENUM: Transaction Type
-- ============================================
CREATE TYPE transaction_type AS ENUM (
  'initial_purchase',  -- Compra inicial
  'renewal',           -- Renovação automática
  'cancellation',      -- Cancelamento
  'refund',            -- Reembolso
  'billing_issue',     -- Problema de cobrança
  'subscription_paused', -- Assinatura pausada
  'trial_started',     -- Trial iniciado
  'trial_converted',   -- Trial convertido em paga
  'trial_canceled'     -- Trial cancelado
);

-- ============================================
-- ALTER TABLE: profiles (adicionar campos premium)
-- ============================================
ALTER TABLE profiles
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN premium_until TIMESTAMPTZ,
ADD COLUMN subscription_status subscription_status DEFAULT 'expired',
ADD COLUMN revenuecat_subscriber_id TEXT,
ADD COLUMN revenuecat_original_app_user_id TEXT,
ADD COLUMN subscription_product_id TEXT,
ADD COLUMN subscription_expires_at TIMESTAMPTZ,
ADD COLUMN subscription_store TEXT CHECK (subscription_store IN ('app_store', 'play_store', 'stripe', 'promotional')),
ADD COLUMN subscription_updated_at TIMESTAMPTZ;

-- Índice para queries de usuários premium
CREATE INDEX idx_profiles_premium ON profiles(is_premium, premium_until) WHERE is_premium = TRUE;
CREATE INDEX idx_profiles_revenuecat_id ON profiles(revenuecat_subscriber_id) WHERE revenuecat_subscriber_id IS NOT NULL;

-- ============================================
-- TABELA: transactions
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Usuário
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Dados RevenueCat
  revenuecat_subscriber_id TEXT NOT NULL,
  revenuecat_transaction_id TEXT NOT NULL UNIQUE,
  revenuecat_product_id TEXT NOT NULL,

  -- Tipo e status
  transaction_type transaction_type NOT NULL,
  transaction_status TEXT NOT NULL, -- 'success', 'pending', 'failed'

  -- Valores
  price_usd DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',

  -- Assinatura
  subscription_period_start TIMESTAMPTZ,
  subscription_period_end TIMESTAMPTZ,

  -- Metadados
  store TEXT CHECK (store IN ('app_store', 'play_store', 'stripe', 'promotional')),
  environment TEXT DEFAULT 'production' CHECK (environment IN ('production', 'sandbox')),

  -- Payload completo do webhook (para debug)
  webhook_payload JSONB,

  -- Timestamps
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES: transactions
-- ============================================
CREATE INDEX idx_transactions_user ON transactions(user_id, occurred_at DESC);
CREATE INDEX idx_transactions_type ON transactions(transaction_type, occurred_at DESC);
CREATE INDEX idx_transactions_revenuecat_id ON transactions(revenuecat_subscriber_id);
CREATE INDEX idx_transactions_status ON transactions(transaction_status) WHERE transaction_status = 'failed';

-- ============================================
-- TABELA: subscription_events (log de mudanças)
-- ============================================
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Evento
  event_type TEXT NOT NULL,
  old_status subscription_status,
  new_status subscription_status,

  -- Dados
  premium_until TIMESTAMPTZ,

  -- Metadados
  source TEXT DEFAULT 'webhook', -- 'webhook', 'manual', 'system'
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscription_events_user ON subscription_events(user_id, created_at DESC);

-- ============================================
-- TABELA: webhook_transactions (para Edge Function)
-- ============================================
CREATE TABLE webhook_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source of webhook
  source TEXT NOT NULL, -- 'revenuecat', 'stripe', etc.

  -- Event details
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,

  -- User (nullable for events before user mapping)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Payload
  payload JSONB NOT NULL,

  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  error TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_webhook_transactions_event_id ON webhook_transactions(event_id);
CREATE INDEX idx_webhook_transactions_user ON webhook_transactions(user_id, created_at DESC);
CREATE INDEX idx_webhook_transactions_status ON webhook_transactions(status) WHERE status != 'processed';
CREATE INDEX idx_webhook_transactions_source ON webhook_transactions(source, event_type);

-- RLS
ALTER TABLE webhook_transactions ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "Service role can manage webhook transactions"
  ON webhook_transactions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- FUNÇÕES: Premium Management
-- ============================================

/**
 * Ativa assinatura premium
 * Chamado pelo webhook do RevenueCat
 */
CREATE OR REPLACE FUNCTION activate_premium_subscription(
  p_user_id UUID,
  p_revenuecat_subscriber_id TEXT,
  p_premium_until TIMESTAMPTZ,
  p_status subscription_status DEFAULT 'active',
  p_source TEXT DEFAULT 'webhook'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_status subscription_status;
  v_old_premium_until TIMESTAMPTZ;
BEGIN
  -- Pegar status atual
  SELECT subscription_status, premium_until INTO v_old_status, v_old_premium_until
  FROM profiles
  WHERE id = p_user_id;

  -- Atualizar perfil
  UPDATE profiles SET
    is_premium = TRUE,
    premium_until = p_premium_until,
    subscription_status = p_status,
    revenuecat_subscriber_id = p_revenuecat_subscriber_id,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Registrar evento
  INSERT INTO subscription_events (
    user_id,
    event_type,
    old_status,
    new_status,
    premium_until,
    source
  ) VALUES (
    p_user_id,
    'premium_activated',
    v_old_status,
    p_status,
    p_premium_until,
    p_source
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Renova assinatura premium
 */
CREATE OR REPLACE FUNCTION renew_premium_subscription(
  p_user_id UUID,
  p_premium_until TIMESTAMPTZ,
  p_source TEXT DEFAULT 'webhook'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_premium_until TIMESTAMPTZ;
BEGIN
  SELECT premium_until INTO v_old_premium_until
  FROM profiles
  WHERE id = p_user_id;

  UPDATE profiles SET
    is_premium = TRUE,
    premium_until = p_premium_until,
    subscription_status = 'active',
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO subscription_events (
    user_id,
    event_type,
    old_status,
    new_status,
    premium_until,
    source,
    notes
  ) VALUES (
    p_user_id,
    'premium_renewed',
    'active',
    'active',
    p_premium_until,
    p_source,
    'Extended from ' || v_old_premium_until::TEXT || ' to ' || p_premium_until::TEXT
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Cancela assinatura premium (mas mantém ativa até expiração)
 */
CREATE OR REPLACE FUNCTION cancel_premium_subscription(
  p_user_id UUID,
  p_premium_until TIMESTAMPTZ,
  p_source TEXT DEFAULT 'webhook'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles SET
    subscription_status = 'canceled',
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO subscription_events (
    user_id,
    event_type,
    old_status,
    new_status,
    premium_until,
    source,
    notes
  ) VALUES (
    p_user_id,
    'premium_canceled',
    'active',
    'canceled',
    p_premium_until,
    p_source,
    'Premium access will expire at ' || p_premium_until::TEXT
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Expira assinatura premium
 */
CREATE OR REPLACE FUNCTION expire_premium_subscription(
  p_user_id UUID,
  p_source TEXT DEFAULT 'system'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles SET
    is_premium = FALSE,
    subscription_status = 'expired',
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO subscription_events (
    user_id,
    event_type,
    old_status,
    new_status,
    source
  ) VALUES (
    p_user_id,
    'premium_expired',
    'canceled',
    'expired',
    p_source
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Pausa assinatura premium
 */
CREATE OR REPLACE FUNCTION pause_premium_subscription(
  p_user_id UUID,
  p_source TEXT DEFAULT 'webhook'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles SET
    subscription_status = 'paused',
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO subscription_events (
    user_id,
    event_type,
    old_status,
    new_status,
    source
  ) VALUES (
    p_user_id,
    'premium_paused',
    'active',
    'paused',
    p_source
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * Marca assinatura com problema de cobrança
 */
CREATE OR REPLACE FUNCTION mark_billing_issue(
  p_user_id UUID,
  p_source TEXT DEFAULT 'webhook'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles SET
    subscription_status = 'past_due',
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO subscription_events (
    user_id,
    event_type,
    old_status,
    new_status,
    source
  ) VALUES (
    p_user_id,
    'billing_issue',
    'active',
    'past_due',
    p_source
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CRON JOB: Expirar assinaturas vencidas
-- ============================================
-- Esta função deve ser chamada diariamente via cron

CREATE OR REPLACE FUNCTION expire_overdue_subscriptions()
RETURNS TABLE (
  expired_count INTEGER,
  user_ids UUID[]
) AS $$
DECLARE
  v_expired_count INTEGER := 0;
  v_user_ids UUID[] := '{}';
  v_user_record RECORD;
BEGIN
  FOR v_user_record IN
    SELECT id
    FROM profiles
    WHERE is_premium = TRUE
      AND premium_until < NOW()
      AND subscription_status != 'expired'
  LOOP
    PERFORM expire_premium_subscription(v_user_record.id, 'system');
    v_expired_count := v_expired_count + 1;
    v_user_ids := array_append(v_user_ids, v_user_record.id);
  END LOOP;

  RETURN QUERY SELECT v_expired_count, v_user_ids;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver próprias transações
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário pode ver próprios eventos de assinatura
CREATE POLICY "Users can view own subscription events"
  ON subscription_events FOR SELECT
  USING (auth.uid() = user_id);

-- Service role pode inserir/atualizar (webhook)
CREATE POLICY "Service role can manage transactions"
  ON transactions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage subscription events"
  ON subscription_events FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE transactions IS 'Histórico de transações de assinatura (RevenueCat)';
COMMENT ON TABLE subscription_events IS 'Log de mudanças de status de assinatura';

COMMENT ON COLUMN profiles.is_premium IS 'Se usuário tem assinatura premium ativa';
COMMENT ON COLUMN profiles.premium_until IS 'Data de expiração da assinatura premium';
COMMENT ON COLUMN profiles.subscription_status IS 'Status atual da assinatura';
COMMENT ON COLUMN profiles.revenuecat_subscriber_id IS 'ID do subscriber no RevenueCat';

COMMENT ON FUNCTION activate_premium_subscription IS 'Ativa assinatura premium (chamado por webhook)';
COMMENT ON FUNCTION renew_premium_subscription IS 'Renova assinatura premium';
COMMENT ON FUNCTION cancel_premium_subscription IS 'Cancela assinatura (mantém ativa até expiração)';
COMMENT ON FUNCTION expire_premium_subscription IS 'Expira assinatura premium';
COMMENT ON FUNCTION pause_premium_subscription IS 'Pausa assinatura premium';
COMMENT ON FUNCTION mark_billing_issue IS 'Marca problema de cobrança';
COMMENT ON FUNCTION expire_overdue_subscriptions IS 'Expira assinaturas vencidas (cron job diário)';
