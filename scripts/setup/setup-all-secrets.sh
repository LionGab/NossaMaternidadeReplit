#!/bin/bash

# ============================================
# Nossa Maternidade - Setup Completo de Secrets
# ============================================
# Script master que configura TODOS os secrets necessários:
# 1. Supabase Edge Functions (API keys de IA)
# 2. EAS Build (variáveis públicas)
# 3. RevenueCat Webhook
# ============================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
# VALORES DAS API KEYS (fornecidos pelo usuário)
# ============================================

print_header "Configuração Completa de Secrets"

# API Keys fornecidas via variáveis de ambiente
OPENAI_API_KEY="${OPENAI_API_KEY}"
GEMINI_API_KEY="${GEMINI_API_KEY}"
ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"
ELEVENLABS_API_KEY="${ELEVENLABS_API_KEY}"
PERPLEXITY_API_KEY="${PERPLEXITY_API_KEY}"

# Validação de API keys obrigatórias
if [ -z "$OPENAI_API_KEY" ] || [ -z "$GEMINI_API_KEY" ] || [ -z "$ANTHROPIC_API_KEY" ]; then
    print_error "Missing required API keys"
    print_info "Please export keys before running this script:"
    echo ""
    echo "  export OPENAI_API_KEY='sk-proj-...'"
    echo "  export GEMINI_API_KEY='AIzaSy...'"
    echo "  export ANTHROPIC_API_KEY='sk-ant-api03-...'"
    echo "  export ELEVENLABS_API_KEY='...'"
    echo "  export PERPLEXITY_API_KEY='pplx-...'"
    echo ""
    exit 1
fi

# Project ID do Supabase
PROJECT_REF="lqahkqfpynypbmhtffyi"

# ============================================
# PARTE 1: SUPABASE SECRETS (Backend-only)
# ============================================

print_header "PARTE 1: Configurando Supabase Secrets (Backend)"

if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI não está instalado"
    print_info "Instale com: npm install -g supabase"
    exit 1
fi

print_info "Configurando API keys nas Edge Functions do Supabase..."

# Função para configurar secret no Supabase
setup_supabase_secret() {
    local name=$1
    local value=$2

    if [ -z "$value" ]; then
        print_warning "$name não fornecido - pulando"
        return
    fi

    print_info "Configurando $name no Supabase..."

    if supabase secrets set "$name=$value" --project-ref "$PROJECT_REF" 2>&1 | grep -q "Set\|Updated"; then
        print_success "$name configurado"
    else
        print_error "Falha ao configurar $name"
        return 1
    fi
}

# Configurar todas as API keys
setup_supabase_secret "OPENAI_API_KEY" "$OPENAI_API_KEY"
setup_supabase_secret "GEMINI_API_KEY" "$GEMINI_API_KEY"
setup_supabase_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
setup_supabase_secret "ELEVENLABS_API_KEY" "$ELEVENLABS_API_KEY"

# Perplexity (opcional)
if [ -n "$PERPLEXITY_API_KEY" ]; then
    setup_supabase_secret "PERPLEXITY_API_KEY" "$PERPLEXITY_API_KEY"
fi

# Gerar e configurar RevenueCat Webhook Secret
print_info "Gerando RevenueCat Webhook Secret..."
REVENUECAT_WEBHOOK_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
setup_supabase_secret "REVENUECAT_WEBHOOK_SECRET" "$REVENUECAT_WEBHOOK_SECRET"

print_success "✅ Supabase Secrets configurados!"
print_warning "⚠️  IMPORTANTE: RevenueCat Webhook Secret gerado:"
echo "   $REVENUECAT_WEBHOOK_SECRET"
echo ""
print_info "Use este valor ao configurar o webhook no RevenueCat Dashboard"

# ============================================
# PARTE 2: EAS SECRETS (Variáveis públicas)
# ============================================

print_header "PARTE 2: Verificando EAS Secrets (Variáveis Públicas)"

if ! command -v eas &> /dev/null; then
    print_warning "EAS CLI não está instalado - pulando verificação"
else
    print_info "Verificando secrets do EAS..."
    eas secret:list 2>/dev/null || print_warning "Não foi possível listar secrets do EAS"

    print_info "Secrets necessários no EAS (já devem estar configurados):"
    echo "  - EXPO_PUBLIC_SUPABASE_URL"
    echo "  - EXPO_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL"
    echo "  - EXPO_PUBLIC_REVENUECAT_IOS_KEY"
    echo "  - EXPO_PUBLIC_REVENUECAT_ANDROID_KEY"
fi

# ============================================
# RESUMO
# ============================================

print_header "✅ Configuração Completa!"

print_success "Todas as API keys foram configuradas no Supabase"
print_success "RevenueCat Webhook Secret foi gerado"

print_info "Próximos passos:"
echo ""
echo "1. Deploy das Edge Functions:"
echo "   npm run deploy:functions"
echo ""
echo "2. Configurar Webhook no RevenueCat:"
echo "   - URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook"
echo "   - Secret: $REVENUECAT_WEBHOOK_SECRET"
echo ""
echo "3. Testar Edge Functions:"
echo "   npm run test:functions"
echo ""
echo "4. Verificar secrets configurados:"
echo "   supabase secrets list --project-ref $PROJECT_REF"
echo ""
