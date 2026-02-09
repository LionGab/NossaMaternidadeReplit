#!/bin/bash
# Script de teste para Edge Functions do Supabase
# Valida funcionamento de todas as funções críticas
#
# IMPORTANTE:
# - A maioria das funções aceita anon key
# - A função /ai REQUER JWT de usuário autenticado
# - Para testar /ai, defina SUPABASE_TEST_JWT com um access token válido

echo "🧪 Teste de Edge Functions - Nossa Maternidade"
echo "=============================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
SUPABASE_URL="${EXPO_PUBLIC_SUPABASE_URL}"
SUPABASE_ANON_KEY="${EXPO_PUBLIC_SUPABASE_ANON_KEY}"
TEST_JWT="${SUPABASE_TEST_JWT:-}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo -e "${RED}❌ Erro: Variáveis de ambiente não configuradas${NC}"
  echo "Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

FUNCTIONS_URL="${SUPABASE_URL}/functions/v1"

# Contador de testes
TOTAL=0
PASSED=0
FAILED=0
SKIPPED=0

# Função auxiliar para testar endpoint com anon key
test_function() {
  local name=$1
  local endpoint=$2
  local method=$3
  local data=$4

  TOTAL=$((TOTAL + 1))
  echo -n "Testing $name... "

  response=$(curl -s -X "$method" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "$data" \
    "$FUNCTIONS_URL/$endpoint")

  if echo "$response" | grep -q '"error"'; then
    echo -e "${RED}❌ FAILED${NC}"
    echo "Response: $response"
    FAILED=$((FAILED + 1))
  else
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
  fi
}

# Função auxiliar para testar endpoint com JWT de usuário
test_function_with_jwt() {
  local name=$1
  local endpoint=$2
  local method=$3
  local data=$4

  if [ -z "$TEST_JWT" ]; then
    echo -e "${YELLOW}⚠️  SKIPPED${NC} (requer SUPABASE_TEST_JWT)"
    SKIPPED=$((SKIPPED + 1))
    return
  fi

  TOTAL=$((TOTAL + 1))
  echo -n "Testing $name... "

  response=$(curl -s -X "$method" \
    -H "Authorization: Bearer $TEST_JWT" \
    -H "Content-Type: application/json" \
    -d "$data" \
    "$FUNCTIONS_URL/$endpoint")

  if echo "$response" | grep -q '"error"'; then
    echo -e "${RED}❌ FAILED${NC}"
    echo "Response: $response"
    FAILED=$((FAILED + 1))
  else
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
  fi
}

# Função para testar health check (com anon key - Supabase requer auth em todas as funções)
test_health() {
  local name=$1
  local endpoint=$2

  TOTAL=$((TOTAL + 1))
  echo -n "Testing $name... "

  response=$(curl -s -H "Authorization: Bearer $SUPABASE_ANON_KEY" "$FUNCTIONS_URL/$endpoint")

  if echo "$response" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Response: $response"
    FAILED=$((FAILED + 1))
  fi
}

echo "🔍 Testando Edge Functions..."
echo ""

# 0. Webhook Health Check (sem auth)
echo "0️⃣  Webhook Health Check"
test_health "Webhook Health" "webhook/health"
echo ""

# 1. AI Function (REQUER JWT de usuário)
echo "1️⃣  AI Chat Function"
echo -e "${BLUE}   NOTA: Requer JWT de usuário autenticado (SUPABASE_TEST_JWT)${NC}"
test_function_with_jwt "AI Chat" "ai" "POST" '{
  "messages": [{"role": "user", "content": "Olá!"}],
  "provider": "gemini"
}'
echo ""

# 2. Transcribe Function
echo "2️⃣  Transcribe Audio Function"
echo -e "${YELLOW}⚠️  Requer arquivo de áudio - teste manual necessário${NC}"
SKIPPED=$((SKIPPED + 1))
echo ""

# 3. Upload Image Function
echo "3️⃣  Upload Image Function"
echo -e "${YELLOW}⚠️  Requer imagem - teste manual necessário${NC}"
SKIPPED=$((SKIPPED + 1))
echo ""

# 4. Notifications Function
echo "4️⃣  Notifications Function"
test_function "Notifications" "notifications" "POST" '{
  "userId": "test-user",
  "title": "Teste",
  "body": "Mensagem de teste",
  "type": "test"
}'
echo ""

# 5. Analytics Function
echo "5️⃣  Analytics Function"
test_function "Analytics" "analytics" "POST" '{
  "event": "test_event",
  "properties": {"source": "test"}
}'
echo ""

# Resumo
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumo dos Testes:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Skipped: $SKIPPED${NC}"
echo ""

if [ -z "$TEST_JWT" ]; then
  echo -e "${BLUE}💡 Dica: Para testar a função /ai, defina SUPABASE_TEST_JWT:${NC}"
  echo "   export SUPABASE_TEST_JWT='<seu-access-token-jwt>'"
  echo ""
fi

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Todos os testes executados passaram!${NC}"
  exit 0
else
  echo -e "${RED}❌ Alguns testes falharam. Verifique os logs acima.${NC}"
  exit 1
fi
