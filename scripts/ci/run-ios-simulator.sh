#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Run iOS Simulator - Inicia simulador e roda app
# ══════════════════════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

SIMULATOR_NAME=${1:-"iPhone 16e"}

echo ""
echo "${CYAN}📱 Iniciando app no simulador: ${SIMULATOR_NAME}${NC}"
echo ""

# 1. Verificar se simulador existe
SIMULATOR_UUID=$(xcrun simctl list devices available | grep -i "$SIMULATOR_NAME" | head -1 | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/' || echo "")

if [ -z "$SIMULATOR_UUID" ]; then
    echo "${RED}❌ Simulador '${SIMULATOR_NAME}' não encontrado${NC}"
    echo ""
    echo "${CYAN}💡 Simuladores disponíveis:${NC}"
    xcrun simctl list devices available | grep -i "iphone" | head -5 | sed 's/^/   /'
    echo ""
    exit 1
fi

# 2. Iniciar simulador
echo "${BLUE}1. Iniciando simulador...${NC}"
xcrun simctl boot "$SIMULATOR_UUID" 2>/dev/null || {
    echo "${YELLOW}⚠️  Simulador já está rodando${NC}"
}

# 3. Abrir app Simulator
open -a Simulator 2>/dev/null || true

# 4. Aguardar simulador iniciar
echo "${BLUE}2. Aguardando simulador iniciar...${NC}"
sleep 3

# 5. Rodar app no simulador
echo "${BLUE}3. Rodando app no simulador...${NC}"
echo ""

# Expo aceita -d ou --device para especificar simulador
npx expo run:ios -d "$SIMULATOR_NAME"
