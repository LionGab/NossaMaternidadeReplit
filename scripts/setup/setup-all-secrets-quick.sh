#!/bin/bash

# ============================================
# Nossa Maternidade - Setup Rápido de Secrets
# ============================================
# Configura TODAS as API keys automaticamente usando valores fornecidos
# ============================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ============================================
# API KEYS (Valores fornecidos pelo usuário)
# ============================================
# IMPORTANTE: Configure suas API keys aqui antes de executar
# OU use variáveis de ambiente:
#   export OPENAI_API_KEY="sk-proj-..."
#   export GEMINI_API_KEY="AIzaSy..."
#   export ANTHROPIC_API_KEY="sk-ant-..."
#   export ELEVENLABS_API_KEY="..."
#   export PERPLEXITY_API_KEY="pplx-..."

OPENAI_API_KEY="${OPENAI_API_KEY:-}"
GEMINI_API_KEY="${GEMINI_API_KEY:-}"
ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
ELEVENLABS_API_KEY="${ELEVENLABS_API_KEY:-}"
PERPLEXITY_API_KEY="${PERPLEXITY_API_KEY:-}"

PROJECT_REF="lqahkqfpynypbmhtffyi"

print_header "Configuração Rápida de Secrets do Supabase"

# Verificar Supabase CLI
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI não está instalado"
    print_info "Instale com: npm install -g supabase"
    exit 1
fi

# Função para configurar secret
setup_secret() {
    local name=$1
    local value=$2

    if [ -z "$value" ]; then
        print_warning "$name não fornecido - pulando"
        return
    fi

    print_info "Configurando $name..."

    if supabase secrets set "$name=$value" --project-ref "$PROJECT_REF" 2>&1 | grep -q "Set\|Updated"; then
        print_success "$name configurado"
    else
        print_error "Falha ao configurar $name"
        return 1
    fi
}

# Configurar todas as API keys
setup_secret "OPENAI_API_KEY" "$OPENAI_API_KEY"
setup_secret "GEMINI_API_KEY" "$GEMINI_API_KEY"
setup_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
setup_secret "ELEVENLABS_API_KEY" "$ELEVENLABS_API_KEY"
setup_secret "PERPLEXITY_API_KEY" "$PERPLEXITY_API_KEY"

# Gerar RevenueCat Webhook Secret
print_info "Gerando RevenueCat Webhook Secret..."
REVENUECAT_WEBHOOK_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
setup_secret "REVENUECAT_WEBHOOK_SECRET" "$REVENUECAT_WEBHOOK_SECRET"

print_header "✅ Configuração Concluída!"

print_success "Todas as API keys foram configuradas no Supabase"
print_success "RevenueCat Webhook Secret gerado"

echo ""
print_warning "⚠️  IMPORTANTE: RevenueCat Webhook Secret"
echo "   $REVENUECAT_WEBHOOK_SECRET"
echo ""
print_info "Use este valor ao configurar o webhook no RevenueCat Dashboard:"
echo "   URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook"
echo "   Secret: $REVENUECAT_WEBHOOK_SECRET"
echo ""

print_info "Próximos passos:"
echo "  1. Deploy das Edge Functions: npm run deploy-functions"
echo "  2. Configurar webhook no RevenueCat Dashboard"
echo "  3. Testar Edge Functions: npm run test:edge-functions"
echo ""
