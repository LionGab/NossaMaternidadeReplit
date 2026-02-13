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

# Se nenhum nome passado, usa o primeiro iPhone disponível
if [ -z "$1" ]; then
    # Formato: "    iPhone 17 Pro (UUID) (Booted)" - extrair nome antes do primeiro (UUID)
SIMULATOR_NAME=$(xcrun simctl list devices available | grep -i "iphone" | head -1 | awk -F'[()]' '{print $1}' | xargs)
    if [ -z "$SIMULATOR_NAME" ]; then
        echo "${RED}❌ Nenhum simulador iPhone encontrado. Instale o Xcode e crie um simulador.${NC}"
        exit 1
    fi
    echo "${CYAN}📱 Usando primeiro simulador disponível: ${SIMULATOR_NAME}${NC}"
else
    SIMULATOR_NAME="$1"
fi

echo ""
echo "${CYAN}📱 Iniciando app no simulador: ${SIMULATOR_NAME}${NC}"
echo ""

# 1. Verificar se simulador existe
SIMULATOR_UUID=$(xcrun simctl list devices available | grep -i "$SIMULATOR_NAME" | head -1 | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/' || echo "")

if [ -z "$SIMULATOR_UUID" ]; then
    echo "${RED}❌ Simulador '${SIMULATOR_NAME}' não encontrado${NC}"
    echo ""
    echo "${CYAN}💡 Simuladores disponíveis:${NC}"
    xcrun simctl list devices available | grep -i "iphone" | head -10 | sed 's/^/   /'
    echo ""
    echo "${CYAN}   Use: npm run ios:16e ou npm run ios:17pro${NC}"
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

# Usar UUID (não nome) para garantir que Expo não confunda com dispositivo físico conectado
npx expo run:ios -d "$SIMULATOR_UUID"
