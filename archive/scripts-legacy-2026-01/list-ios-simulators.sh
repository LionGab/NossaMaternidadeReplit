#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# List iOS Simulators - Lista formatada e útil
# ══════════════════════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "${CYAN}📱 Simuladores iOS Disponíveis${NC}"
echo ""

# Listar iPhones
echo "${BLUE}📱 iPhones:${NC}"
IPHONES=$(xcrun simctl list devices | grep -i "iphone" | grep -v "unavailable")
if [ -z "$IPHONES" ]; then
    echo "   ${YELLOW}Nenhum iPhone encontrado${NC}"
else
    echo "$IPHONES" | while IFS= read -r line; do
        if echo "$line" | grep -q "(Booted)"; then
            echo "   ${GREEN}✅${NC} $line"
        else
            echo "   ${CYAN}⚪${NC} $line"
        fi
    done
fi

echo ""

# Listar iPads
echo "${BLUE}📱 iPads:${NC}"
IPADS=$(xcrun simctl list devices | grep -i "ipad" | grep -v "unavailable")
if [ -z "$IPADS" ]; then
    echo "   ${YELLOW}Nenhum iPad encontrado${NC}"
else
    echo "$IPADS" | while IFS= read -r line; do
        if echo "$line" | grep -q "(Booted)"; then
            echo "   ${GREEN}✅${NC} $line"
        else
            echo "   ${CYAN}⚪${NC} $line"
        fi
    done
fi

echo ""

# Estatísticas
BOOTED_COUNT=$(xcrun simctl list devices | grep "(Booted)" | wc -l | tr -d ' ')
TOTAL_COUNT=$(xcrun simctl list devices | grep -E "iPhone|iPad" | grep -v "unavailable" | wc -l | tr -d ' ')

echo "${CYAN}📊 Estatísticas:${NC}"
echo "   Total: $TOTAL_COUNT simuladores"
echo "   Rodando: ${GREEN}$BOOTED_COUNT${NC}"

if [ "$BOOTED_COUNT" -gt 0 ]; then
    echo ""
    echo "${BLUE}🔄 Simuladores rodando:${NC}"
    xcrun simctl list devices | grep "(Booted)" | sed 's/^/   /'
fi

echo ""
echo "${CYAN}💡 Comandos úteis:${NC}"
echo "   ${BLUE}Iniciar:${NC} xcrun simctl boot \"iPhone 17 Pro\""
echo "   ${BLUE}Parar:${NC} xcrun simctl shutdown \"iPhone 17 Pro\""
echo "   ${BLUE}Reset:${NC} bash scripts/reset-ios-simulator.sh"
echo "   ${BLUE}Limpar:${NC} bash scripts/clean-ios-simulator.sh"
echo ""
