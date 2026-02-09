-- Migration: Nath Journey Onboarding
-- Tabela para armazenar dados do onboarding "Jornada da Nath"
-- Criado em: 2025-01-XX

-- Tabela user_onboarding
CREATE TABLE IF NOT EXISTS user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Tela 1: Stage
  stage TEXT NOT NULL CHECK (stage IN (
    'GENERAL',
    'TENTANTE',
    'GRAVIDA_T1',
    'GRAVIDA_T2',
    'GRAVIDA_T3',
    'PUERPERIO_0_40D',
    'MAE_RECENTE_ATE_1ANO'
  )),

  -- Tela 2: Date (branching baseado no stage)
  last_menstruation DATE,
  due_date DATE,
  birth_date DATE,

  -- Tela 3: Concerns (array de até 3)
  concerns TEXT[] NOT NULL DEFAULT '{}',

  -- Tela 4: Emotional State
  emotional_state TEXT NOT NULL CHECK (emotional_state IN (
    'BEM_EQUILIBRADA',
    'UM_POUCO_ANSIOSA',
    'MUITO_ANSIOSA',
    'TRISTE_ESGOTADA',
    'PREFIRO_NAO_RESPONDER'
  )),

  -- Tela 5: Daily Check-in
  daily_check_in BOOLEAN DEFAULT false,
  check_in_time TIME,

  -- Tela 6: Season Name
  season_name TEXT NOT NULL CHECK (char_length(season_name) <= 40),

  -- Metadata
  completed_at TIMESTAMPTZ DEFAULT now(),
  is_founder BOOLEAN DEFAULT false,
  needs_extra_care BOOLEAN DEFAULT false,

  -- Constraints
  CONSTRAINT valid_date_for_stage CHECK (
    (stage IN ('GRAVIDA_T1', 'GRAVIDA_T2', 'GRAVIDA_T3') AND due_date IS NOT NULL)
    OR (stage = 'TENTANTE' AND (last_menstruation IS NOT NULL OR true))
    OR (stage IN ('PUERPERIO_0_40D', 'MAE_RECENTE_ATE_1ANO') AND birth_date IS NOT NULL)
    OR (stage = 'GENERAL' AND last_menstruation IS NULL AND due_date IS NULL AND birth_date IS NULL)
  ),

  CONSTRAINT max_3_concerns CHECK (array_length(concerns, 1) <= 3),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Um usuário só pode ter um onboarding completo
  UNIQUE(user_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_stage ON user_onboarding(stage);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_emotional_state ON user_onboarding(emotional_state);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_is_founder ON user_onboarding(is_founder);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_needs_extra_care ON user_onboarding(needs_extra_care);

-- RLS Policies
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert own onboarding
CREATE POLICY "Users can insert own onboarding"
ON user_onboarding FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view own onboarding
CREATE POLICY "Users can view own onboarding"
ON user_onboarding FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update own onboarding
CREATE POLICY "Users can update own onboarding"
ON user_onboarding FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete own onboarding
CREATE POLICY "Users can delete own onboarding"
ON user_onboarding FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_onboarding_updated_at
BEFORE UPDATE ON user_onboarding
FOR EACH ROW
EXECUTE FUNCTION update_user_onboarding_updated_at();

-- Comentários para documentação
COMMENT ON TABLE user_onboarding IS 'Dados do onboarding "Jornada da Nath" - 8 telas de personalização';
COMMENT ON COLUMN user_onboarding.stage IS 'Estágio da jornada: TENTANTE, GRAVIDA_T1/T2/T3, PUERPERIO_0_40D, MAE_RECENTE_ATE_1ANO';
COMMENT ON COLUMN user_onboarding.concerns IS 'Array de até 3 preocupações selecionadas';
COMMENT ON COLUMN user_onboarding.emotional_state IS 'Estado emocional atual da usuária';
COMMENT ON COLUMN user_onboarding.season_name IS 'Nome da temporada escolhida (máx 40 caracteres)';
COMMENT ON COLUMN user_onboarding.is_founder IS 'Badge para usuárias que completaram onboarding em 06-08/jan/2026';
COMMENT ON COLUMN user_onboarding.needs_extra_care IS 'Flag para usuárias que precisam de cuidado extra (MUITO_ANSIOSA ou TRISTE_ESGOTADA)';
