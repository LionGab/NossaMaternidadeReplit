#!/usr/bin/env bash
#
# Test Edge Functions usando Vitest
# Executa todos os testes em supabase/functions/__tests__/
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Edge Functions Test Suite${NC}"
echo ""

# Check if Vitest is installed
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Install Node.js first.${NC}"
    exit 1
fi

# Run Vitest with edge config
echo -e "${YELLOW}Running Vitest with edge runtime config...${NC}"
echo ""

# Parse arguments
COVERAGE=false
WATCH=false
FILE=""

for arg in "$@"; do
    case $arg in
        --coverage)
            COVERAGE=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        *.test.ts)
            FILE="$arg"
            shift
            ;;
    esac
done

# Build Vitest command
VITEST_CMD="npx vitest run --config vitest.config.edge.js"

if [ "$WATCH" = true ]; then
    VITEST_CMD="npx vitest --config vitest.config.edge.js"
fi

if [ "$COVERAGE" = true ]; then
    VITEST_CMD="$VITEST_CMD --coverage"
fi

if [ -n "$FILE" ]; then
    VITEST_CMD="$VITEST_CMD $FILE"
fi

# Execute
$VITEST_CMD

# Show results
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    if [ "$COVERAGE" = true ]; then
        echo -e "${BLUE}📊 Coverage report: coverage/index.html${NC}"
    fi
else
    echo ""
    echo -e "${RED}❌ Tests failed.${NC}"
    exit 1
fi
