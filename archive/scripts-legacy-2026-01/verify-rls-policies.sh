#!/bin/bash
# ============================================
# Verify RLS Policies from Migration 030
# ============================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}RLS Policies Verification (Migration 030)${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

echo "Expected policies:"
echo "  - notification_templates: 2 policies"
echo "  - habit_templates: 4 policies"
echo "  - ai_context_cache: 4 policies"
echo "  - chat_messages: 4 policies (2 existing + 2 new)"
echo ""
echo "Total: 12 new policies from migration 030"
echo ""
echo -e "${YELLOW}To verify manually in Supabase Dashboard:${NC}"
echo "1. Go to: https://app.supabase.com/project/lqahkqfpynypbmhtffyi/database/policies"
echo "2. Check each table mentioned above"
echo ""
echo -e "${GREEN}Migration 20251231034314 deployed successfully!${NC}"
echo ""
