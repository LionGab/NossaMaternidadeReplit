#!/bin/bash

# =============================================================================
# Nossa Maternidade - Backend Readiness Verification (1-Shot)
# =============================================================================
# Verifica se o backend está pronto para TestFlight/Production
# Execute antes de qualquer build de produção
#
# Uso: ./scripts/verify-backend-readiness.sh [--verbose]
# =============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

VERBOSE=false
if [[ "$1" == "--verbose" ]]; then
    VERBOSE=true
fi

# Contadores
PASSED=0
FAILED=0
WARNINGS=0

print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}  $1${NC}"
    echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${CYAN}── $1 ──${NC}"
}

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    if [[ -n "$2" ]]; then
        echo -e "   ${YELLOW}💡 $2${NC}"
    fi
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    if [[ -n "$2" ]]; then
        echo -e "   ${CYAN}ℹ️  $2${NC}"
    fi
    ((WARNINGS++))
}

print_header "🚀 Backend Readiness Verification"
echo "Verificando se o backend está pronto para produção..."
echo ""

# =============================================================================
# 1. VERIFICAR .ENV.LOCAL (CLIENT SECRETS)
# =============================================================================
print_section "1. Client Environment Variables (.env.local)"

if [[ ! -f ".env.local" ]]; then
    check_fail ".env.local não encontrado" "Copie .env.example para .env.local"
else
    # Verificar variáveis obrigatórias
    REQUIRED_VARS=(
        "EXPO_PUBLIC_SUPABASE_URL"
        "EXPO_PUBLIC_SUPABASE_ANON_KEY"
        "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL"
    )

    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env.local && ! grep -q "^${var}=$" .env.local && ! grep -q "^${var}=your-" .env.local; then
            check_pass "$var configurado"
        else
            check_fail "$var não configurado ou vazio"
        fi
    done

    # Verificar variáveis opcionais importantes
    OPTIONAL_VARS=(
        "EXPO_PUBLIC_REVENUECAT_IOS_KEY"
        "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY"
        "EXPO_PUBLIC_SENTRY_DSN"
    )

    for var in "${OPTIONAL_VARS[@]}"; do
        if grep -q "^${var}=" .env.local && ! grep -q "^${var}=$" .env.local; then
            check_pass "$var configurado"
        else
            check_warn "$var não configurado" "Recomendado para produção"
        fi
    done
fi

# =============================================================================
# 2. VERIFICAR SUPABASE CLI + PROJETO LINKADO
# =============================================================================
print_section "2. Supabase CLI & Project"

if ! command -v supabase &> /dev/null; then
    check_fail "Supabase CLI não instalado" "npm install -g supabase"
else
    check_pass "Supabase CLI disponível"

    # Verificar autenticação
    if supabase projects list &> /dev/null 2>&1; then
        check_pass "Supabase autenticado"
    else
        check_warn "Supabase não autenticado" "Execute: supabase login"
    fi
fi

# Verificar project ref
PROJECT_REF="lqahkqfpynypbmhtffyi"
if [[ -f "supabase/config.toml" ]]; then
    check_pass "supabase/config.toml existe"
else
    check_fail "supabase/config.toml não encontrado"
fi

# =============================================================================
# 3. VERIFICAR SECRETS DO SUPABASE (SERVER-SIDE)
# =============================================================================
print_section "3. Supabase Edge Function Secrets"

if command -v supabase &> /dev/null && supabase projects list &> /dev/null 2>&1; then
    echo "Verificando secrets configurados..."

    SECRETS_OUTPUT=$(supabase secrets list --project-ref "$PROJECT_REF" 2>/dev/null || echo "")

    # Secrets obrigatórios para AI
    REQUIRED_SECRETS=(
        "GEMINI_API_KEY"
        "OPENAI_API_KEY"
        "ANTHROPIC_API_KEY"
    )

    for secret in "${REQUIRED_SECRETS[@]}"; do
        if echo "$SECRETS_OUTPUT" | grep -q "$secret"; then
            check_pass "$secret configurado"
        else
            check_fail "$secret não configurado" "supabase secrets set $secret=xxx --project-ref $PROJECT_REF"
        fi
    done

    # Secrets opcionais
    OPTIONAL_SECRETS=(
        "ELEVENLABS_API_KEY"
        "REVENUECAT_WEBHOOK_SECRET"
        "UPSTASH_REDIS_REST_URL"
        "UPSTASH_REDIS_REST_TOKEN"
    )

    for secret in "${OPTIONAL_SECRETS[@]}"; do
        if echo "$SECRETS_OUTPUT" | grep -q "$secret"; then
            check_pass "$secret configurado"
        else
            check_warn "$secret não configurado" "Opcional mas recomendado"
        fi
    done
else
    check_warn "Não foi possível verificar secrets" "Supabase CLI não autenticado"
fi

# =============================================================================
# 4. VERIFICAR EDGE FUNCTIONS EXISTEM
# =============================================================================
print_section "4. Edge Functions"

EXPECTED_FUNCTIONS=(
    "ai"
    "analytics"
    "community-feed"
    "delete-account"
    "elevenlabs-tts"
    "export-data"
    "moderate-content"
    "mundo-nath-feed"
    "notifications"
    "transcribe"
    "upload-image"
    "webhook"
)

FUNCTIONS_FOUND=0
FUNCTIONS_MISSING=0

for func in "${EXPECTED_FUNCTIONS[@]}"; do
    if [[ -f "supabase/functions/$func/index.ts" ]]; then
        if $VERBOSE; then
            check_pass "Edge Function /$func existe"
        fi
        ((FUNCTIONS_FOUND++))
    else
        check_fail "Edge Function /$func não encontrada"
        ((FUNCTIONS_MISSING++))
    fi
done

if [[ $FUNCTIONS_MISSING -eq 0 ]]; then
    check_pass "Todas as $FUNCTIONS_FOUND Edge Functions encontradas"
else
    check_fail "$FUNCTIONS_MISSING Edge Functions faltando"
fi

# =============================================================================
# 5. VERIFICAR MIGRATIONS
# =============================================================================
print_section "5. Database Migrations"

MIGRATION_COUNT=$(find supabase/migrations -name "*.sql" -type f 2>/dev/null | wc -l | tr -d ' ')

if [[ $MIGRATION_COUNT -gt 0 ]]; then
    check_pass "$MIGRATION_COUNT migrations encontradas"

    # Verificar migration de RLS fix
    if ls supabase/migrations/*fix_rls*.sql 1>/dev/null 2>&1 || ls supabase/migrations/*complete_rls*.sql 1>/dev/null 2>&1; then
        check_pass "Migration de RLS policies encontrada"
    else
        check_warn "Migration de RLS policies não identificada" "Verifique se RLS está configurado"
    fi
else
    check_fail "Nenhuma migration encontrada"
fi

# =============================================================================
# 6. TESTAR PING DAS EDGE FUNCTIONS (SE URL DISPONÍVEL)
# =============================================================================
print_section "6. Edge Functions Health Check"

# Obter URL das functions do .env.local
if [[ -f ".env.local" ]]; then
    FUNCTIONS_URL=$(grep "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    ANON_KEY=$(grep "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")

    if [[ -n "$FUNCTIONS_URL" && -n "$ANON_KEY" ]]; then
        echo "Testando conectividade com Edge Functions..."

        # Testar webhook/health (não precisa de auth)
        WEBHOOK_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FUNCTIONS_URL/webhook/health" 2>/dev/null || echo "000")

        if [[ "$WEBHOOK_RESPONSE" == "200" ]]; then
            check_pass "Webhook Edge Function respondendo (HTTP $WEBHOOK_RESPONSE)"
        elif [[ "$WEBHOOK_RESPONSE" == "000" ]]; then
            check_warn "Não foi possível conectar às Edge Functions" "Verifique se estão deployadas"
        else
            check_warn "Webhook Edge Function retornou HTTP $WEBHOOK_RESPONSE"
        fi
    else
        check_warn "URL das Edge Functions não configurada" "Configure EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL"
    fi
else
    check_warn "Não foi possível testar Edge Functions" ".env.local não encontrado"
fi

# =============================================================================
# 7. VERIFICAR CIRCUIT BREAKER SHARED CODE
# =============================================================================
print_section "7. Shared Code"

if [[ -f "supabase/functions/_shared/circuit-breaker.ts" ]]; then
    check_pass "Circuit Breaker utility encontrado"
else
    check_warn "Circuit Breaker utility não encontrado" "AI fallback pode não funcionar corretamente"
fi

# =============================================================================
# 8. VERIFICAR SCRIPTS DE DEPLOY
# =============================================================================
print_section "8. Deploy Scripts"

DEPLOY_SCRIPTS=(
    "scripts/deploy-edge-functions.sh"
    "scripts/setup-supabase-secrets.sh"
)

for script in "${DEPLOY_SCRIPTS[@]}"; do
    if [[ -f "$script" ]]; then
        if [[ -x "$script" ]]; then
            check_pass "$(basename $script) (executável)"
        else
            check_warn "$(basename $script) não executável" "chmod +x $script"
        fi
    else
        check_fail "$(basename $script) não encontrado"
    fi
done

# =============================================================================
# RESUMO FINAL
# =============================================================================
print_header "📊 Resumo da Verificação"

echo -e "${GREEN}✅ Passou:${NC}    $PASSED"
echo -e "${YELLOW}⚠️  Avisos:${NC}   $WARNINGS"
echo -e "${RED}❌ Falhou:${NC}    $FAILED"
echo ""

TOTAL=$((PASSED + WARNINGS + FAILED))
if [[ $TOTAL -gt 0 ]]; then
    SCORE=$((PASSED * 100 / TOTAL))
    echo -e "Score: ${BOLD}${SCORE}%${NC}"
    echo ""
fi

if [[ $FAILED -eq 0 ]]; then
    if [[ $WARNINGS -eq 0 ]]; then
        echo -e "${GREEN}🎉 Backend 100% pronto para produção!${NC}"
        echo ""
        echo "Próximos passos:"
        echo "  1. npm run quality-gate"
        echo "  2. npm run build:prod"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Backend quase pronto ($WARNINGS avisos)${NC}"
        echo ""
        echo "Recomendações:"
        echo "  1. Revise os avisos acima"
        echo "  2. Configure secrets faltantes (opcional)"
        echo "  3. Execute: npm run quality-gate"
        exit 0
    fi
else
    echo -e "${RED}❌ Backend NÃO está pronto para produção!${NC}"
    echo ""
    echo "Ações necessárias:"
    echo "  1. Corrija os $FAILED erros acima"
    echo "  2. Execute este script novamente"
    echo "  3. NÃO faça build de produção até resolver"
    exit 1
fi
