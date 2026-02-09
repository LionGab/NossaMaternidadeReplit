-- ============================================
-- NOSSA MATERNIDADE - Migration 012: Webhooks & Subscriptions
-- ============================================
-- Infraestrutura para webhooks e assinaturas
-- - webhook_transactions: Log de todos webhooks recebidos
-- - Campos de subscription no profiles
-- ============================================

-- ============================================
-- TABELA: webhook_transactions
-- ============================================
-- Log de todos os webhooks recebidos para auditoria e idempotencia

CREATE TABLE IF NOT EXISTS webhook_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Fonte e identificacao
  source TEXT NOT NULL, -- 'revenuecat', 'stripe', etc.
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL,

  -- Usuario relacionado (pode ser null se nao encontrado)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Payload completo para debug
  payload JSONB NOT NULL DEFAULT '{}',

  -- Status de processamento
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'failed'
  error TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Constraint para prevenir duplicatas
  UNIQUE(source, event_id)
);

-- Indices
CREATE INDEX idx_webhook_transactions_source ON webhook_transactions(source, created_at DESC);
CREATE INDEX idx_webhook_transactions_user ON webhook_transactions(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_webhook_transactions_status ON webhook_transactions(status, created_at DESC);
CREATE INDEX idx_webhook_transactions_event ON webhook_transactions(source, event_id);

-- ============================================
-- ADICIONAR CAMPOS DE SUBSCRIPTION AO PROFILES
-- ============================================

-- Verificar se colunas existem antes de adicionar
DO $$
BEGIN
  -- is_premium
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
  END IF;

  -- subscription_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'free';
    -- Valores: 'free', 'active', 'cancelled', 'expired', 'billing_issue', 'paused', 'lifetime', 'non_renewing'
  END IF;

  -- subscription_product_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_product_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_product_id TEXT;
  END IF;

  -- subscription_expires_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_expires_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_expires_at TIMESTAMPTZ;
  END IF;

  -- subscription_store
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_store'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_store TEXT;
    -- Valores: 'APP_STORE', 'PLAY_STORE', 'STRIPE', 'PROMOTIONAL'
  END IF;

  -- subscription_updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_updated_at TIMESTAMPTZ;
  END IF;
END $$;

-- Indice para buscar usuarios premium
CREATE INDEX IF NOT EXISTS idx_profiles_premium ON profiles(is_premium) WHERE is_premium = TRUE;
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_expires ON profiles(subscription_expires_at) WHERE subscription_expires_at IS NOT NULL;

-- ============================================
-- RLS POLICIES
-- ============================================

-- webhook_transactions: Apenas service role pode acessar
ALTER TABLE webhook_transactions ENABLE ROW LEVEL SECURITY;
-- Nenhuma policy = apenas service role tem acesso

-- Usuarios podem ver seu proprio status de subscription
-- (ja coberto pelas policies existentes de profiles)

-- ============================================
-- FUNCOES
-- ============================================

-- Funcao para verificar se usuario e premium (considera expiracao)
CREATE OR REPLACE FUNCTION is_user_premium(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = p_user_id
      AND is_premium = TRUE
      AND (
        subscription_status = 'lifetime'
        OR subscription_expires_at IS NULL
        OR subscription_expires_at > NOW()
      )
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Funcao para atualizar status de subscriptions expiradas (cron job)
CREATE OR REPLACE FUNCTION update_expired_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE profiles
  SET
    is_premium = FALSE,
    subscription_status = 'expired',
    subscription_updated_at = NOW()
  WHERE is_premium = TRUE
    AND subscription_status NOT IN ('lifetime', 'expired')
    AND subscription_expires_at IS NOT NULL
    AND subscription_expires_at < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funcao para limpar webhook transactions antigas (mais de 90 dias)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_transactions()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM webhook_transactions
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND status = 'processed';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEW: Metricas de subscriptions
-- ============================================

CREATE OR REPLACE VIEW subscription_metrics AS
SELECT
  subscription_status,
  subscription_product_id,
  COUNT(*) as user_count,
  COUNT(*) FILTER (WHERE subscription_expires_at > NOW()) as active_count,
  COUNT(*) FILTER (WHERE subscription_expires_at <= NOW()) as expired_count
FROM profiles
WHERE subscription_status != 'free'
GROUP BY subscription_status, subscription_product_id
ORDER BY user_count DESC;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE webhook_transactions IS 'Log de webhooks recebidos para auditoria e idempotencia';
COMMENT ON COLUMN webhook_transactions.source IS 'Origem do webhook (revenuecat, stripe, etc)';
COMMENT ON COLUMN webhook_transactions.event_id IS 'ID unico do evento na origem';
COMMENT ON COLUMN webhook_transactions.status IS 'Status: pending, processed, failed';

COMMENT ON COLUMN profiles.is_premium IS 'Se usuario tem acesso premium ativo';
COMMENT ON COLUMN profiles.subscription_status IS 'Status: free, active, cancelled, expired, billing_issue, paused, lifetime';
COMMENT ON COLUMN profiles.subscription_product_id IS 'ID do produto no RevenueCat/Store';
COMMENT ON COLUMN profiles.subscription_expires_at IS 'Data de expiracao da subscription (null para lifetime)';
COMMENT ON COLUMN profiles.subscription_store IS 'Loja: APP_STORE, PLAY_STORE, STRIPE, PROMOTIONAL';

COMMENT ON FUNCTION is_user_premium IS 'Verifica se usuario tem premium ativo (considera expiracao)';
COMMENT ON FUNCTION update_expired_subscriptions IS 'Atualiza subscriptions expiradas - rodar via cron';
