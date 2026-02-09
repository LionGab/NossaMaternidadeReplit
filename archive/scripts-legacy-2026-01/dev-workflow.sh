#!/bin/bash

# =============================================================================
# Nossa Maternidade - Development Workflow Script
# Executa verificações de qualidade antes de commit/push
# =============================================================================

set -e  # Parar no primeiro erro

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Our Maternity Dev Workflow${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

# Function para imprimir seção
section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function para imprimir sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function para imprimir erro
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function para imprimir warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# =============================================================================
# 1. TypeScript Check
# =============================================================================
section "Step 1: TypeScript Compilation Check"

if npm run typecheck > /tmp/typecheck.log 2>&1; then
    success "TypeScript: All types are correct"
else
    error "TypeScript errors found:"
    cat /tmp/typecheck.log
    exit 1
fi

# =============================================================================
# 2. ESLint Check & Fix
# =============================================================================
section "Step 2: Linting & Code Quality"

if npm run lint > /tmp/lint.log 2>&1; then
    success "ESLint: No violations found"
else
    warning "ESLint found issues. Attempting auto-fix..."
    npm run lint:fix > /tmp/lint-fix.log 2>&1
    if npm run lint > /tmp/lint-check.log 2>&1; then
        success "ESLint: Fixed automatically"
    else
        error "ESLint still has issues after auto-fix:"
        cat /tmp/lint-check.log
        exit 1
    fi
fi

# =============================================================================
# 3. Code Format Check
# =============================================================================
section "Step 3: Code Formatting"

if npm run format:check > /tmp/format.log 2>&1; then
    success "Prettier: Code is properly formatted"
else
    warning "Code needs formatting. Formatting now..."
    npm run format > /tmp/format.log 2>&1
    success "Prettier: Code formatted"
fi

# =============================================================================
# 4. Build Configuration Validation
# =============================================================================
section "Step 4: Build Configuration"

if expo config 2>/dev/null | grep -q '"name"'; then
    success "app.config.js: Valid configuration"
else
    error "app.config.js: Invalid configuration"
    exit 1
fi

if eas config 2>/dev/null | grep -q '"builds"'; then
    success "eas.json: Valid configuration"
else
    error "eas.json: Invalid configuration"
    exit 1
fi

# =============================================================================
# 5. Environment Check
# =============================================================================
section "Step 5: Environment Variables"

if npm run check-env > /tmp/env-check.log 2>&1; then
    success "Environment: All required variables present"
else
    warning "Some environment variables may be missing"
    cat /tmp/env-check.log
fi

# =============================================================================
# 6. Console.log Scan
# =============================================================================
section "Step 6: Debug Code Detection"

if grep -r "console\\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null; then
    error "console.log statements found in source code"
    echo "  Remove all console.log before committing"
    exit 1
else
    success "No console.log found in code"
fi

# =============================================================================
# 7. Optional: Run Tests (Comment out if slow)
# =============================================================================
section "Step 7: Unit Tests (Optional)"

# Uncomment line below to run tests in workflow
# if npm run test:ci > /tmp/tests.log 2>&1; then
#     success "All tests passed"
# else
#     error "Some tests failed:"
#     cat /tmp/tests.log
#     exit 1
# fi

echo "⏭️  Tests skipped (run: npm run test:watch locally)"

# =============================================================================
# 8. Summary
# =============================================================================
section "✨ Workflow Complete"

echo ""
echo -e "${GREEN}All checks passed! Your code is ready to commit.${NC}"
echo ""
echo "Next steps:"
echo "  1. git add ."
echo "  2. git commit -m \"feat: your message here\""
echo "  3. git push origin feature/branch-name"
echo ""
echo "GitHub Actions will run final CI checks on your PR."
echo ""

# Show any modified files
echo -e "${BLUE}Modified files:${NC}"
git status --porcelain | head -10

exit 0
