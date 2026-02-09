#!/bin/bash

# ============================================
# Nossa Maternidade - Setup Supabase Secrets
# ============================================
# Configura todas as API keys necessárias nas Edge Functions do Supabase
#
# IMPORTANTE: Estas keys NÃO devem ter prefixo EXPO_PUBLIC_*
# Elas ficam APENAS no backend (Supabase) e nunca são expostas no app
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI não está instalado"
    print_info "Instale com: npm install -g supabase"
    exit 1
fi

# Verificar se está logado
if ! supabase projects list &> /dev/null; then
    print_error "Não está autenticado no Supabase"
    print_info "Execute: supabase login"
    exit 1
fi

print_header "Configuração de Secrets do Supabase"

# Project ID do Supabase (hardcoded para evitar erros)
PROJECT_REF="lqahkqfpynypbmhtffyi"
print_info "Projeto Supabase: $PROJECT_REF"

# Função para configurar secret
setup_secret() {
    local name=$1
    local value=$2
    local description=$3

    if [ -z "$value" ]; then
        print_warning "$name não fornecido - pulando"
        return
    fi

    print_info "Configurando $name..."

    if supabase secrets set "$name=$value" --project-ref "$PROJECT_REF" 2>&1 | grep -q "Set\|Updated"; then
        print_success "$name configurado com sucesso"
    else
        print_error "Falha ao configurar $name"
        return 1
    fi
}

# ============================================
# API KEYS DE IA (Obrigatórias)
# ============================================

print_header "1. Configurando API Keys de IA"

# Ler valores das variáveis de ambiente ou pedir ao usuário
if [ -z "$OPENAI_API_KEY" ]; then
    read -p "OPENAI_API_KEY (ou Enter para pular): " OPENAI_API_KEY
fi
setup_secret "OPENAI_API_KEY" "$OPENAI_API_KEY" "OpenAI API Key (GPT-4o)"

if [ -z "$GEMINI_API_KEY" ]; then
    read -p "GEMINI_API_KEY (ou Enter para pular): " GEMINI_API_KEY
fi
setup_secret "GEMINI_API_KEY" "$GEMINI_API_KEY" "Google Gemini API Key (Gemini 2.5 Flash)"

if [ -z "$ANTHROPIC_API_KEY" ]; then
    read -p "ANTHROPIC_API_KEY (ou Enter para pular): " ANTHROPIC_API_KEY
fi
setup_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" "Anthropic API Key (Claude Sonnet)"

# ============================================
# ELEVENLABS (Opcional mas recomendado)
# ============================================

print_header "2. Configurando ElevenLabs (Voz da NathIA)"

if [ -z "$ELEVENLABS_API_KEY" ]; then
    read -p "ELEVENLABS_API_KEY (ou Enter para pular): " ELEVENLABS_API_KEY
fi
setup_secret "ELEVENLABS_API_KEY" "$ELEVENLABS_API_KEY" "ElevenLabs API Key (Text-to-Speech)"

# ============================================
# PERPLEXITY (Opcional)
# ============================================

print_header "3. Configurando Perplexity (Opcional)"

if [ -z "$PERPLEXITY_API_KEY" ]; then
    read -p "PERPLEXITY_API_KEY (ou Enter para pular): " PERPLEXITY_API_KEY
fi
if [ -n "$PERPLEXITY_API_KEY" ]; then
    setup_secret "PERPLEXITY_API_KEY" "$PERPLEXITY_API_KEY" "Perplexity API Key"
fi

# ============================================
# REVENUECAT WEBHOOK SECRET
# ============================================

print_header "4. Configurando RevenueCat Webhook Secret"

if [ -z "$REVENUECAT_WEBHOOK_SECRET" ]; then
    print_info "Gerando webhook secret..."
    REVENUECAT_WEBHOOK_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    print_success "Secret gerado: ${REVENUECAT_WEBHOOK_SECRET:0:20}..."
    print_warning "IMPORTANTE: Use este mesmo valor no RevenueCat Dashboard!"
    echo ""
    echo "Copie este valor para configurar no RevenueCat:"
    echo "$REVENUECAT_WEBHOOK_SECRET"
    echo ""
    read -p "Pressione Enter para continuar..."
fi
setup_secret "REVENUECAT_WEBHOOK_SECRET" "$REVENUECAT_WEBHOOK_SECRET" "RevenueCat Webhook Secret"

# ============================================
# UPSTASH REDIS (Opcional - Rate Limiting)
# ============================================

print_header "5. Configurando Upstash Redis (Opcional - Rate Limiting)"

if [ -z "$UPSTASH_REDIS_REST_URL" ]; then
    read -p "UPSTASH_REDIS_REST_URL (ou Enter para pular): " UPSTASH_REDIS_REST_URL
fi
if [ -n "$UPSTASH_REDIS_REST_URL" ]; then
    setup_secret "UPSTASH_REDIS_REST_URL" "$UPSTASH_REDIS_REST_URL" "Upstash Redis REST URL"

    if [ -z "$UPSTASH_REDIS_REST_TOKEN" ]; then
        read -p "UPSTASH_REDIS_REST_TOKEN: " UPSTASH_REDIS_REST_TOKEN
    fi
    setup_secret "UPSTASH_REDIS_REST_TOKEN" "$UPSTASH_REDIS_REST_TOKEN" "Upstash Redis REST Token"
fi

# ============================================
# VALIDAÇÃO
# ============================================

print_header "6. Validando Secrets Configurados"

print_info "Listando secrets configurados..."
supabase secrets list --project-ref "$PROJECT_REF" || print_warning "Não foi possível listar secrets"

print_header "✅ Configuração Concluída!"

print_success "Secrets configurados no Supabase"
print_info "Próximos passos:"
echo "  1. Deploy das Edge Functions: npm run deploy:functions"
echo "  2. Configurar webhook no RevenueCat Dashboard"
echo "  3. Testar Edge Functions: npm run test:functions"

echo ""
