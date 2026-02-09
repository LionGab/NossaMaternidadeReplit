#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Reset iOS Simulator - Reset completo para estado inicial
# ══════════════════════════════════════════════════════════════════════════════
#
# Reseta o simulador completamente (remove TODOS os apps e dados)
#

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "${CYAN}🔄 Reset Completo do Simulador iOS${NC}"
echo ""

# Verificar se há simulador rodando (pegar UUID)
BOOTED_DEVICE=$(xcrun simctl list devices | grep "(Booted)" | head -1 | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/' || echo "")
BOOTED_NAME=$(xcrun simctl list devices | grep "(Booted)" | head -1 | sed -E 's/^[[:space:]]*([^(]+).*/\1/' | xargs || echo "")

if [ -z "$BOOTED_DEVICE" ]; then
    echo "${YELLOW}⚠️  Nenhum simulador está rodando${NC}"

    # Tentar encontrar simulador padrão (iPhone 17 Pro ou primeiro disponível)
    DEFAULT_SIMULATOR=$(xcrun simctl list devices available | grep -i "iphone" | head -1 | sed -E 's/^[[:space:]]*([^(]+) \(.*/\1/' | xargs || echo "")

    if [ -z "$DEFAULT_SIMULATOR" ]; then
        echo "${RED}❌ Nenhum simulador iPhone encontrado${NC}"
        echo "${CYAN}💡 Crie um simulador no Xcode:${NC}"
        echo "   Xcode > Window > Devices and Simulators > + > iPhone"
        exit 1
    fi

    # Se passou nome como argumento, usar (limpar espaços extras)
    if [ -n "$1" ]; then
        SIMULATOR_NAME=$(echo "$1" | xargs)
    else
        SIMULATOR_NAME="$DEFAULT_SIMULATOR"
    fi

    echo "${CYAN}💡 Simuladores disponíveis:${NC}"
    xcrun simctl list devices available | grep -i "iphone" | head -5 | sed 's/^/   /'
    echo ""

    # Tentar encontrar UUID do simulador pelo nome (buscar exato ou parcial)
    SIMULATOR_UUID=$(xcrun simctl list devices available | grep -i "$SIMULATOR_NAME" | head -1 | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/' || echo "")

    if [ -n "$SIMULATOR_UUID" ]; then
        echo "${BLUE}📱 Resetando: ${SIMULATOR_NAME} (${SIMULATOR_UUID})${NC}"
        xcrun simctl erase "$SIMULATOR_UUID" 2>/dev/null || {
            echo "${RED}❌ Erro ao resetar simulador${NC}"
            exit 1
        }
    else
        # Tentar pelo nome direto
        echo "${BLUE}📱 Resetando: ${SIMULATOR_NAME}${NC}"
        xcrun simctl erase "$SIMULATOR_NAME" 2>/dev/null || {
            echo "${RED}❌ Erro ao resetar simulador: ${SIMULATOR_NAME}${NC}"
            echo "${CYAN}💡 Simuladores disponíveis:${NC}"
            xcrun simctl list devices available | grep -i "iphone" | head -5 | sed 's/^/   /'
            echo ""
            echo "${YELLOW}💡 Use o nome exato do simulador ou o UUID${NC}"
            exit 1
        }
    fi
else
    echo "${YELLOW}⚠️  Simulador está rodando: ${BOOTED_NAME:-$BOOTED_DEVICE}${NC}"
    echo "${CYAN}💡 Desligando antes de resetar...${NC}"
    xcrun simctl shutdown "$BOOTED_DEVICE" 2>/dev/null || true
    sleep 1

    echo ""
    echo "${BLUE}📱 Resetando: ${BOOTED_NAME:-$BOOTED_DEVICE} (${BOOTED_DEVICE})${NC}"
    xcrun simctl erase "$BOOTED_DEVICE" 2>/dev/null || {
        echo "${RED}❌ Erro ao resetar simulador${NC}"
        exit 1
    }
    SIMULATOR_NAME="$BOOTED_NAME"
fi

echo ""
echo "${GREEN}✅ Simulador resetado completamente!${NC}"
echo ""
echo "${CYAN}💡 O simulador agora está no estado inicial (apenas apps do sistema)${NC}"
echo ""
echo "${BLUE}📱 Para iniciar o simulador:${NC}"
echo "   xcrun simctl boot \"${SIMULATOR_NAME:-$BOOTED_DEVICE}\""
echo "   open -a Simulator"
echo ""
