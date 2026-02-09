#!/bin/bash

# Script para organizar credenciais iOS e Android
# Nossa Maternidade - Expo EAS Build

set -e

echo "=================================================="
echo "   📁 Organizando Credenciais - Nossa Maternidade"
echo "=================================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretórios
DOWNLOADS="/c/Users/User/Downloads"
PROJECT_ROOT="$(pwd)"
CREDS_DIR="$PROJECT_ROOT/credentials"

echo -e "${BLUE}📂 Verificando estrutura de pastas...${NC}"

# Criar pasta de credenciais (não versionada)
mkdir -p "$CREDS_DIR"

echo -e "${GREEN}✅ Pasta credentials/ criada${NC}"
echo ""

echo -e "${BLUE}🔍 Procurando credenciais iOS...${NC}"
echo ""

# 1. App Store Connect API Key (CRÍTICO para EAS)
echo "1️⃣  App Store Connect API Key:"
API_KEY_SOURCE="$DOWNLOADS/ApiKey_E7IV510UXU7D.p8"
API_KEY_DEST="$PROJECT_ROOT/ApiKey_E7IV510UXU7D.p8"

if [ -f "$API_KEY_SOURCE" ]; then
  cp "$API_KEY_SOURCE" "$API_KEY_DEST"
  echo -e "   ${GREEN}✅ ApiKey_E7IV510UXU7D.p8 copiado para raiz do projeto${NC}"
else
  echo -e "   ${RED}❌ ApiKey_E7IV510UXU7D.p8 NÃO encontrado em Downloads${NC}"
  echo -e "   ${YELLOW}⚠️  AÇÃO: Baixar de App Store Connect > Users and Access > Integrations > Keys${NC}"
  echo -e "   ${YELLOW}⚠️  Key ID deve ser: E7IV510UXU7D${NC}"
fi
echo ""

# 2. Push Key (APNs) - para Supabase
echo "2️⃣  Push Key (APNs):"
PUSH_KEY_SOURCE1="$DOWNLOADS/AuthKey_CJBW78QU27.p8"
PUSH_KEY_SOURCE2="$DOWNLOADS/PushKey_CJBW78QU27/AuthKey_CJBW78QU27.p8"
PUSH_KEY_DEST="$CREDS_DIR/AuthKey_CJBW78QU27.p8"

if [ -f "$PUSH_KEY_SOURCE1" ]; then
  cp "$PUSH_KEY_SOURCE1" "$PUSH_KEY_DEST"
  echo -e "   ${GREEN}✅ AuthKey_CJBW78QU27.p8 copiado para credentials/${NC}"
elif [ -f "$PUSH_KEY_SOURCE2" ]; then
  cp "$PUSH_KEY_SOURCE2" "$PUSH_KEY_DEST"
  echo -e "   ${GREEN}✅ AuthKey_CJBW78QU27.p8 copiado para credentials/${NC}"
else
  echo -e "   ${YELLOW}⚠️  AuthKey_CJBW78QU27.p8 não encontrado${NC}"
fi
echo ""

# 3. Distribution Certificate - EAS gerencia automaticamente
echo "3️⃣  Distribution Certificate:"
DIST_CERT_SOURCE="$DOWNLOADS/DistCert_YPN2RWAKJ2/DistCert_YPN2RWAKJ2.p12"
DIST_CERT_DEST="$CREDS_DIR/DistCert_YPN2RWAKJ2.p12"

if [ -f "$DIST_CERT_SOURCE" ]; then
  cp "$DIST_CERT_SOURCE" "$DIST_CERT_DEST"
  echo -e "   ${GREEN}✅ DistCert_YPN2RWAKJ2.p12 copiado para credentials/${NC}"
  echo -e "   ${BLUE}ℹ️  EAS gerencia isso automaticamente (não precisa configurar manualmente)${NC}"
else
  echo -e "   ${YELLOW}⚠️  DistCert_YPN2RWAKJ2.p12 não encontrado${NC}"
fi
echo ""

echo -e "${BLUE}🔍 Procurando credenciais Android...${NC}"
echo ""

# 4. Google Play Service Account
echo "4️⃣  Google Play Service Account:"
GOOGLE_KEY_SOURCE="$DOWNLOADS/google-play-service-account.json"
GOOGLE_KEY_DEST="$PROJECT_ROOT/google-play-service-account.json"

if [ -f "$GOOGLE_KEY_SOURCE" ]; then
  cp "$GOOGLE_KEY_SOURCE" "$GOOGLE_KEY_DEST"
  echo -e "   ${GREEN}✅ google-play-service-account.json copiado para raiz do projeto${NC}"
else
  echo -e "   ${RED}❌ google-play-service-account.json NÃO encontrado${NC}"
  echo -e "   ${YELLOW}⚠️  AÇÃO: Baixar de Google Play Console > Setup > API Access${NC}"
fi
echo ""

echo "=================================================="
echo "   📋 Resumo de Credenciais"
echo "=================================================="
echo ""

# Verificar o que está faltando
MISSING=0

echo "Raiz do projeto (para EAS):"
if [ -f "$PROJECT_ROOT/ApiKey_E7IV510UXU7D.p8" ]; then
  echo -e "  ${GREEN}✅ ApiKey_E7IV510UXU7D.p8${NC}"
else
  echo -e "  ${RED}❌ ApiKey_E7IV510UXU7D.p8${NC}"
  ((MISSING++))
fi

if [ -f "$PROJECT_ROOT/google-play-service-account.json" ]; then
  echo -e "  ${GREEN}✅ google-play-service-account.json${NC}"
else
  echo -e "  ${RED}❌ google-play-service-account.json${NC}"
  ((MISSING++))
fi
echo ""

echo "credentials/ (backup, não versionado):"
if [ -f "$CREDS_DIR/AuthKey_CJBW78QU27.p8" ]; then
  echo -e "  ${GREEN}✅ AuthKey_CJBW78QU27.p8 (Push/APNs)${NC}"
else
  echo -e "  ${YELLOW}⚠️  AuthKey_CJBW78QU27.p8 (Push/APNs)${NC}"
fi

if [ -f "$CREDS_DIR/DistCert_YPN2RWAKJ2.p12" ]; then
  echo -e "  ${GREEN}✅ DistCert_YPN2RWAKJ2.p12 (gerenciado por EAS)${NC}"
else
  echo -e "  ${YELLOW}⚠️  DistCert_YPN2RWAKJ2.p12 (gerenciado por EAS)${NC}"
fi
echo ""

if [ $MISSING -eq 0 ]; then
  echo -e "${GREEN}🎉 TODAS as credenciais críticas estão configuradas!${NC}"
  echo -e "${BLUE}📝 Próximo passo: npm run validate-launch${NC}"
else
  echo -e "${RED}⚠️  FALTAM $MISSING credenciais críticas!${NC}"
  echo -e "${YELLOW}📖 Consulte: docs/CHECKLIST_LANCAMENTO_ACOES.md${NC}"
fi
echo ""
