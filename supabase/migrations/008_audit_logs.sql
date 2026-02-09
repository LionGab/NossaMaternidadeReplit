-- ============================================
-- NOSSA MATERNIDADE - Migration 008: Audit Logs
-- ============================================
-- Tabela de auditoria para LGPD/GDPR compliance
-- Registra ações críticas de forma anônima
-- ============================================

-- ============================================
-- TABELA: audit_logs
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Evento
  event_type TEXT NOT NULL, -- 'account_deleted_soft', 'account_deleted_hard', 'data_export', etc.

  -- Identificação anônima (hash do user_id para privacidade)
  user_id_hash TEXT NOT NULL,

  -- Metadados do evento (JSONB para flexibilidade)
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_audit_logs_event ON audit_logs(event_type, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id_hash, created_at DESC);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at DESC);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas service role pode inserir/ler (Edge Functions)
-- Nenhuma política para usuários comuns = sem acesso

-- Policy para service role (opcional - service_role bypass RLS por padrão)
-- CREATE POLICY "Service can manage audit logs"
--   ON audit_logs FOR ALL
--   USING (auth.role() = 'service_role');

-- ============================================
-- FUNÇÃO: Limpar logs antigos (GDPR - retenção limitada)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  -- Manter apenas últimos 90 dias
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE audit_logs IS 'Logs de auditoria para LGPD/GDPR compliance - dados anônimos';
COMMENT ON COLUMN audit_logs.user_id_hash IS 'Hash do user_id para privacidade - não permite identificar usuário';
COMMENT ON COLUMN audit_logs.metadata IS 'Dados adicionais do evento (nunca PII)';
COMMENT ON FUNCTION cleanup_old_audit_logs IS 'Remove logs com mais de 90 dias (GDPR compliance)';
