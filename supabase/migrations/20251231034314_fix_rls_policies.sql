-- ============================================
-- Migration: Fix RLS Policy Gaps
-- Nossa Maternidade - Security Audit Remediation
-- Date: 2025-12-31
-- ============================================
--
-- BACKGROUND:
-- Security audit revealed 4 tables with missing or overly permissive RLS policies:
-- 1. notification_templates - No policies (any user could modify)
-- 2. habit_templates - Missing INSERT/UPDATE/DELETE
-- 3. ai_context_cache - FOR ALL too permissive (should be granular)
-- 4. chat_messages - Missing UPDATE/DELETE (LGPD compliance gap)
--
-- SOLUTION:
-- Add 12 granular policies for proper access control and LGPD compliance
-- ============================================

-- ============================================
-- 1. notification_templates - Public READ, Admin WRITE
-- ============================================

-- Anyone can read templates (needed for app functionality)
CREATE POLICY "Anyone can read notification templates"
  ON notification_templates FOR SELECT
  USING (true);

-- Only service role can modify templates (admin operation)
-- Note: Regular users should never INSERT/UPDATE/DELETE templates
-- This is enforced by app logic, RLS is defense-in-depth
CREATE POLICY "Service role can manage templates"
  ON notification_templates FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 2. habit_templates - Admin-only modifications
-- ============================================

-- SELECT policy already exists (from migration 004)
-- Add admin-only modification policies

CREATE POLICY "Service role can insert habit templates"
  ON habit_templates FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update habit templates"
  ON habit_templates FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can delete habit templates"
  ON habit_templates FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================
-- 3. ai_context_cache - Replace FOR ALL with granular
-- ============================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Service can manage context" ON ai_context_cache;

-- Replace with granular policies
CREATE POLICY "Users can insert own context"
  ON ai_context_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own context"
  ON ai_context_cache FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own context"
  ON ai_context_cache FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. chat_messages - LGPD compliance
-- ============================================

-- Users can update their own messages (edit functionality)
CREATE POLICY "Users can update own messages"
  ON chat_messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages (LGPD right to erasure)
CREATE POLICY "Users can delete own messages"
  ON chat_messages FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify all policies were created:
--
-- SELECT tablename, policyname, cmd, permissive, roles
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN ('notification_templates', 'habit_templates', 'ai_context_cache', 'chat_messages')
-- ORDER BY tablename, cmd;
--
-- Expected: 12 policies total
-- - notification_templates: 2 (SELECT for all, FOR ALL for service_role)
-- - habit_templates: 4 (SELECT for all + INSERT/UPDATE/DELETE for service_role)
-- - ai_context_cache: 4 (SELECT/INSERT/UPDATE/DELETE for own user_id)
-- - chat_messages: 4 (existing SELECT/INSERT + new UPDATE/DELETE)
-- ============================================
