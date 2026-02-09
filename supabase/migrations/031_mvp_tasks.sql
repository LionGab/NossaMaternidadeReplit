-- ============================================
-- Migration: MVP Tasks Table
-- Nossa Maternidade - MVP TestFlight Ready
-- ============================================
-- Tabela simples para demonstração de CRUD completo
-- com sincronização offline-first
-- ============================================

-- ============================================
-- TABLE: mvp_tasks
-- ============================================
CREATE TABLE IF NOT EXISTS mvp_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT title_not_empty CHECK (char_length(trim(title)) > 0)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_mvp_tasks_user_id ON mvp_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_mvp_tasks_created_at ON mvp_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mvp_tasks_completed ON mvp_tasks(completed);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_mvp_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_mvp_tasks_updated_at ON mvp_tasks;
CREATE TRIGGER trigger_update_mvp_tasks_updated_at
  BEFORE UPDATE ON mvp_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_mvp_tasks_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Habilitar RLS
ALTER TABLE mvp_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own tasks
CREATE POLICY IF NOT EXISTS "Users can view own tasks"
  ON mvp_tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY IF NOT EXISTS "Users can insert own tasks"
  ON mvp_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY IF NOT EXISTS "Users can update own tasks"
  ON mvp_tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY IF NOT EXISTS "Users can delete own tasks"
  ON mvp_tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE mvp_tasks IS 'MVP Tasks table for TestFlight demo - simple CRUD with offline-first sync';
COMMENT ON COLUMN mvp_tasks.id IS 'Primary key UUID';
COMMENT ON COLUMN mvp_tasks.user_id IS 'Foreign key to auth.users';
COMMENT ON COLUMN mvp_tasks.title IS 'Task title (required, non-empty)';
COMMENT ON COLUMN mvp_tasks.description IS 'Optional task description';
COMMENT ON COLUMN mvp_tasks.completed IS 'Task completion status';
COMMENT ON COLUMN mvp_tasks.created_at IS 'Timestamp when task was created';
COMMENT ON COLUMN mvp_tasks.updated_at IS 'Timestamp when task was last updated';
