#!/bin/bash
# Script para configurar credenciais de lançamento
#
# Uso: bash scripts/setup-launch-credentials.sh
#
# Este script ajuda a configurar os arquivos de credenciais necessários
# para builds de produção e submissão nas lojas.

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "🔐 CONFIGURAÇÃO DE CREDENCIAIS PARA LANÇAMENTO"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Verificar se arquivos já existem
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 já existe${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 não encontrado${NC}"
        return 1
    fi
}

echo -e "${CYAN}📋 Verificando arquivos de credenciais...${NC}\n"

# 1. Google Play Service Account
GOOGLE_PLAY_FILE="google-play-service-account.json"
if check_file "$GOOGLE_PLAY_FILE"; then
    echo "   Arquivo presente ✓"
else
    echo -e "${YELLOW}⚠️  Arquivo necessário para builds Android${NC}"
    echo ""
    echo "   Como obter:"
    echo "   1. Acesse: https://console.cloud.google.com"
    echo "   2. Selecione o projeto do Google Play Console"
    echo "   3. Vá em IAM & Admin → Service Accounts"
    echo "   4. Crie uma nova Service Account ou use existente"
    echo "   5. Baixe o JSON da chave"
    echo "   6. No Google Play Console, vá em Setup → API access"
    echo "   7. Conceda permissões à Service Account"
    echo "   8. Salve o arquivo como: $GOOGLE_PLAY_FILE"
    echo ""
fi

# 2. App Store Connect API Key
API_KEY_FILE="ApiKey_E7IV510UXU7D.p8"
if check_file "$API_KEY_FILE"; then
    echo "   Arquivo presente ✓"
else
    echo -e "${YELLOW}⚠️  Arquivo necessário para builds iOS${NC}"
    echo ""
    echo "   Como obter:"
    echo "   1. Acesse: https://appstoreconnect.apple.com"
    echo "   2. Vá em Users and Access → Keys → App Store Connect API"
    echo "   3. Se a chave E7IV510UXU7D já existe:"
    echo "      - Clique em Download (só pode baixar uma vez!)"
    echo "      - Salve como: $API_KEY_FILE"
    echo "   4. Se não existe:"
    echo "      - Clique em Generate API Key"
    echo "      - Nome: EAS Build Key"
    echo "      - Access: Admin ou App Manager"
    echo "      - Baixe o .p8 e anote Key ID e Issuer ID"
    echo ""
fi

echo ""
echo -e "${CYAN}📋 Verificando configurações do projeto...${NC}\n"

# Verificar Product IDs no código
if grep -q "nossa_maternidade_monthly" src/services/revenuecat.ts && \
   grep -q "nossa_maternidade_yearly" src/services/revenuecat.ts; then
    echo -e "${GREEN}✅ Product IDs corretos no código${NC}"
else
    echo -e "${RED}❌ Product IDs incorretos no código${NC}"
    echo "   Esperado: nossa_maternidade_monthly / nossa_maternidade_yearly"
fi

# Verificar app.config.js
if grep -q 'owner: "nossamaternidade"' app.config.js; then
    echo -e "${GREEN}✅ Owner correto no app.config.js${NC}"
else
    echo -e "${RED}❌ Owner incorreto no app.config.js${NC}"
fi

if grep -q 'projectId: "e7e5a772-e745-4cff-9824-7c8523e78c54"' app.config.js; then
    echo -e "${GREEN}✅ Project ID correto${NC}"
else
    echo -e "${RED}❌ Project ID incorreto${NC}"
fi

echo ""
echo -e "${CYAN}📋 Próximos passos manuais:${NC}\n"
echo "1. Adicionar arquivos de credenciais (se ainda não adicionou)"
echo "2. Criar produtos nas lojas:"
echo "   - App Store Connect: nossa_maternidade_monthly / nossa_maternidade_yearly"
echo "   - Google Play Console: nossa_maternidade_monthly / nossa_maternidade_yearly"
echo "3. Configurar webhook no RevenueCat"
echo "4. Configurar API keys de IA no Supabase"
echo ""
echo -e "${CYAN}📖 Consulte: docs/CHECKLIST_LANCAMENTO_ACOES.md${NC}"
echo ""
