#!/bin/bash
set -e

# ============================================
# Nossa Maternidade - Generate Supabase Types
# ============================================
# Gera tipos TypeScript a partir do schema do Supabase
# Substitui tipos manuais desatualizados
# ============================================

PROJECT_REF="lqahkqfpynypbmhtffyi"
OUTPUT_FILE="src/types/database.types.ts"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
print_info "Generating Supabase types from production database..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not installed"
    echo ""
    echo "Install with: npm install -g supabase"
    echo ""
    exit 1
fi

# Backup old file
if [ -f "$OUTPUT_FILE" ]; then
    cp "$OUTPUT_FILE" "$OUTPUT_FILE.backup"
    print_success "Backed up old types to $OUTPUT_FILE.backup"
fi

# Generate types
print_info "Generating types from project $PROJECT_REF..."

supabase gen types typescript \
  --project-id "$PROJECT_REF" \
  --schema public \
  > "$OUTPUT_FILE.new"

# Replace old file
mv "$OUTPUT_FILE.new" "$OUTPUT_FILE"

print_success "Types generated successfully: $OUTPUT_FILE"
echo ""
print_info "Next steps:"
echo "  1. Review changes: git diff $OUTPUT_FILE"
echo "  2. Add convenience aliases (see plan for details)"
echo "  3. Run: npm run typecheck"
echo ""
