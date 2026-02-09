#!/bin/bash

# Script para listar TODAS as chaves .p8 disponíveis
# Nossa Maternidade - Diagnóstico de credenciais

echo "=================================================="
echo "   🔍 Listando TODAS as chaves .p8 disponíveis"
echo "=================================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOWNLOADS="/c/Users/User/Downloads"

echo -e "${BLUE}📂 Procurando em Downloads e subpastas...${NC}"
echo ""

# Buscar recursivamente todas as .p8 em Downloads
find "$DOWNLOADS" -name "*.p8" -type f 2>/dev/null | while read -r file; do
  filename=$(basename "$file")

  # Identificar tipo
  if [[ $filename == AuthKey_* ]]; then
    TYPE="🔔 Push Key (APNs)"
  elif [[ $filename == ApiKey_* ]]; then
    TYPE="🔑 API Key (App Store Connect)"
  else
    TYPE="❓ Desconhecido"
  fi

  echo -e "${GREEN}✅ Encontrado:${NC} $filename"
  echo -e "   Tipo: $TYPE"
  echo -e "   Caminho: $file"
  echo ""
done

echo "=================================================="
echo "   📋 O que você precisa"
echo "=================================================="
echo ""

echo -e "${YELLOW}Para EAS funcionar:${NC}"
echo "  1. ApiKey_*.p8 (App Store Connect API Key)"
echo "     - Deve começar com 'ApiKey_'"
echo "     - Usado para builds e submissão automática"
echo ""

echo -e "${BLUE}Para notificações push (Supabase):${NC}"
echo "  2. AuthKey_*.p8 (Push Notification Key)"
echo "     - Deve começar com 'AuthKey_'"
echo "     - Usado para APNs (notificações)"
echo ""

echo "=================================================="
echo "   🎯 Próximas ações"
echo "=================================================="
echo ""

# Verificar se encontrou ApiKey
if find "$DOWNLOADS" -name "ApiKey_*.p8" -type f 2>/dev/null | grep -q .; then
  echo -e "${GREEN}✅ Você TEM uma ApiKey! Execute:${NC}"
  echo "   npm run organize-credentials"
else
  echo -e "${YELLOW}⚠️  Você NÃO tem uma ApiKey. Opções:${NC}"
  echo ""
  echo "   A) Baixar ApiKey existente (se já criou antes):"
  echo "      - Siga: docs/BAIXAR_APP_STORE_API_KEY.md"
  echo ""
  echo "   B) Criar nova ApiKey:"
  echo "      1. App Store Connect > Users and Access"
  echo "      2. Integrations > Keys > Generate API Key"
  echo "      3. Name: Nossa Maternidade EAS"
  echo "      4. Access: Admin"
  echo "      5. Download imediatamente (só pode baixar 1x)"
  echo ""
  echo "   C) Usar ApiKey diferente (se tiver outra):"
  echo "      - Me avise o Key ID que eu atualizo o eas.json"
fi
echo ""
