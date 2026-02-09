#!/bin/bash

# Script para configurar secrets do RevenueCat no Supabase
# Nossa Maternidade

set -e

echo "=================================================="
echo "   🔐 Configurando RevenueCat Secrets - Supabase"
echo "=================================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não encontrado${NC}"
    echo -e "${YELLOW}📦 Instale com: npm install -g supabase${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Verificando login no Supabase...${NC}"

# Verificar se está logado
if ! npx supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você não está logado no Supabase${NC}"
    echo -e "${BLUE}🔐 Fazendo login...${NC}"
    npx supabase login
fi

echo -e "${GREEN}✅ Login verificado${NC}"
echo ""

# Link para o projeto (se não estiver linkado)
echo -e "${BLUE}🔗 Linkando ao projeto Supabase...${NC}"
npx supabase link --project-ref lqahkqfpynypbmhtffyi || true
echo ""

echo -e "${BLUE}📝 Configurando secrets...${NC}"
echo ""

# 1. RevenueCat API Key (Bearer) - REMOVIDO
# NOTA: O código da Edge Function webhook/index.ts usa apenas REVENUECAT_WEBHOOK_SECRET
# para autenticar webhooks (Bearer token). A REVENUECAT_API_KEY não é necessária.
# Se você precisar da API Key do RevenueCat para outros fins, configure manualmente:
#   npx supabase secrets set REVENUECAT_API_KEY=<sua-key> --project-ref lqahkqfpynypbmhtffyi
echo "1️⃣  Verificando configuração existente..."
echo -e "${BLUE}   NOTA: O webhook usa apenas REVENUECAT_WEBHOOK_SECRET${NC}"
echo ""

# 2. Gerar RevenueCat Webhook Secret
echo "2️⃣  REVENUECAT_WEBHOOK_SECRET"
echo -e "${YELLOW}   Gerando secret aleatório para validação de webhook...${NC}"

# Gerar secret de 32 bytes em hex
WEBHOOK_SECRET=$(openssl rand -hex 32)

npx supabase secrets set REVENUECAT_WEBHOOK_SECRET="$WEBHOOK_SECRET"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ REVENUECAT_WEBHOOK_SECRET gerado e configurado${NC}"
    echo ""
    echo -e "${BLUE}📋 IMPORTANTE: Configure esse secret no RevenueCat Dashboard:${NC}"
    echo -e "${YELLOW}   $WEBHOOK_SECRET${NC}"
    echo ""
    echo -e "${BLUE}   Onde configurar:${NC}"
    echo "   1. Acesse: https://app.revenuecat.com/projects/6d2ee223/webhooks"
    echo "   2. Clique em: Add Webhook"
    echo "   3. URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook"
    echo "   4. Authorization: Bearer $WEBHOOK_SECRET"
    echo "   5. Events: Selecione todos os eventos de assinatura"
    echo ""
else
    echo -e "${RED}   ❌ Erro ao configurar REVENUECAT_WEBHOOK_SECRET${NC}"
fi
echo ""

# 3. RevenueCat Project ID (informativo)
echo "3️⃣  REVENUECAT_PROJECT_ID (informativo)"
echo -e "${BLUE}   Project ID: 6d2ee223${NC}"
echo -e "${BLUE}   Não precisa ser configurado como secret (usado no frontend)${NC}"
echo ""

echo "=================================================="
echo "   ✅ Configuração Concluída"
echo "=================================================="
echo ""

echo -e "${GREEN}Secrets configurados no Supabase:${NC}"
echo "  ✅ REVENUECAT_WEBHOOK_SECRET (para autenticar webhooks do RevenueCat)"
echo ""

echo -e "${BLUE}Próximos passos:${NC}"
echo "  1. Configure o webhook no RevenueCat Dashboard"
echo "  2. URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook"
echo "  3. Authorization: Bearer [copie o secret acima]"
echo "  4. Teste o webhook enviando um evento de teste"
echo ""

echo -e "${YELLOW}💡 Webhook Secret (copie para o RevenueCat):${NC}"
echo -e "${GREEN}$WEBHOOK_SECRET${NC}"
echo ""
