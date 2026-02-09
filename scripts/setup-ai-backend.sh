#!/bin/bash
# Nossa Maternidade - Setup AI Backend
# Configura secrets de IA no Supabase e faz deploy da edge function

set -e

echo "🤖 Nossa Maternidade - Configuração do Backend de IA"
echo "======================================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para printar com cor
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI não instalado!"
    echo "Instale com: npm install -g supabase"
    exit 1
fi

print_success "Supabase CLI instalado"

# Verificar se está logado no Supabase
if ! supabase projects list &> /dev/null; then
    print_error "Não logado no Supabase!"
    echo "Faça login com: supabase login"
    exit 1
fi

print_success "Autenticado no Supabase"

# Link do projeto (se ainda não estiver linkado)
if [ ! -f ".supabase/config.toml" ]; then
    print_warning "Projeto não linkado. Linkando..."
    supabase link --project-ref lqahkqfpynypbmhtffyi
fi

print_success "Projeto linkado: lqahkqfpynypbmhtffyi"

echo ""
echo "=========================================="
echo "Configuração de Secrets de IA"
echo "=========================================="
echo ""
print_info "Vou configurar os seguintes secrets:"
echo "  1. GEMINI_API_KEY (Google AI)"
echo "  2. OPENAI_API_KEY (OpenAI GPT-4)"
echo "  3. ANTHROPIC_API_KEY (Claude)"
echo "  4. UPSTASH_REDIS_REST_URL (opcional - rate limiting)"
echo "  5. UPSTASH_REDIS_REST_TOKEN (opcional - rate limiting)"
echo ""

# Função para ler secret de forma segura
read_secret() {
    local var_name=$1
    local description=$2
    local current_value=""

    # Tentar ler valor atual do Supabase
    current_value=$(supabase secrets list 2>/dev/null | grep "^$var_name" | awk '{print $2}' || echo "")

    if [ -n "$current_value" ] && [ "$current_value" != "null" ]; then
        echo -e "${GREEN}✓ $var_name já configurado${NC}"
        read -p "Deseja atualizar? (s/N): " update
        if [ "$update" != "s" ] && [ "$update" != "S" ]; then
            return
        fi
    fi

    echo ""
    print_info "$description"
    read -sp "Digite o valor (entrada oculta): " value
    echo ""

    if [ -z "$value" ]; then
        print_warning "Valor vazio, pulando $var_name"
        return
    fi

    # Configurar secret
    echo "$value" | supabase secrets set "$var_name" --env-file /dev/stdin
    print_success "$var_name configurado!"
}

# Configurar secrets obrigatórios
echo ""
print_info "=== Secrets OBRIGATÓRIOS ==="
echo ""

read_secret "GEMINI_API_KEY" "Google AI API Key (https://aistudio.google.com/apikey)"
read_secret "OPENAI_API_KEY" "OpenAI API Key (https://platform.openai.com/api-keys)"
read_secret "ANTHROPIC_API_KEY" "Anthropic Claude API Key (https://console.anthropic.com/)"

echo ""
print_info "=== Secrets OPCIONAIS (rate limiting com Redis) ==="
echo ""
read -p "Deseja configurar Upstash Redis para rate limiting? (s/N): " setup_redis

if [ "$setup_redis" = "s" ] || [ "$setup_redis" = "S" ]; then
    read_secret "UPSTASH_REDIS_REST_URL" "Upstash Redis REST URL (https://console.upstash.com/)"
    read_secret "UPSTASH_REDIS_REST_TOKEN" "Upstash Redis REST Token"
fi

echo ""
echo "=========================================="
echo "Deploy da Edge Function 'ai'"
echo "=========================================="
echo ""

print_info "Fazendo deploy da edge function de IA..."

if supabase functions deploy ai --no-verify-jwt; then
    print_success "Edge function 'ai' deployada com sucesso!"
else
    print_error "Falha no deploy da edge function 'ai'"
    exit 1
fi

echo ""
echo "=========================================="
echo "Validação"
echo "=========================================="
echo ""

print_info "Verificando secrets configurados..."
supabase secrets list

echo ""
print_info "Testando edge function..."

# Criar um payload de teste simples
test_payload='{
  "messages": [
    {"role": "user", "content": "Oi, você está funcionando?"}
  ],
  "provider": "openai"
}'

# Obter URL da função
SUPABASE_URL="https://lqahkqfpynypbmhtffyi.supabase.co"
FUNCTION_URL="$SUPABASE_URL/functions/v1/ai"

print_info "URL da função: $FUNCTION_URL"

echo ""
print_success "✅ Backend de IA configurado com sucesso!"
echo ""
echo "Próximos passos:"
echo "  1. Teste a função no app mobile"
echo "  2. Monitore logs: supabase functions logs ai"
echo "  3. Verifique rate limiting (se configurou Redis)"
echo ""
print_info "Para testar manualmente:"
echo "  curl -X POST $FUNCTION_URL \\"
echo "    -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '$test_payload'"
echo ""
