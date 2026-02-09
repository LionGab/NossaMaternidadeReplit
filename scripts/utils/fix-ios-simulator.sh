#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Fix iOS Simulator - Resolve Invalid Device Error
# ══════════════════════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "${CYAN}🔧 Corrigindo simulador iOS...${NC}"
echo ""

# 1. Limpar dispositivos inválidos
echo "${BLUE}1. Limpando dispositivos inválidos...${NC}"
xcrun simctl delete unavailable 2>/dev/null || true
echo "${GREEN}✅ Dispositivos inválidos removidos${NC}"

# 2. Listar simuladores disponíveis
echo ""
echo "${BLUE}2. Simuladores disponíveis:${NC}"
xcrun simctl list devices available | grep -i "iphone" | head -5

# 3. Escolher simulador padrão (iPhone 17 Pro ou primeiro disponível)
DEFAULT_SIMULATOR=$(xcrun simctl list devices available | grep -i "iphone" | head -1 | sed -E 's/.*\(([^)]+)\).*/\1/' || echo "")

if [ -z "$DEFAULT_SIMULATOR" ]; then
    echo "${YELLOW}⚠️  Nenhum simulador iPhone encontrado${NC}"
    echo "${CYAN}💡 Abra o Xcode e crie um simulador:${NC}"
    echo "   Xcode > Window > Devices and Simulators > + > iPhone"
    exit 1
fi

echo ""
echo "${BLUE}3. Usando simulador: ${DEFAULT_SIMULATOR}${NC}"

# 4. Limpar cache do Expo
echo ""
echo "${BLUE}4. Limpando cache do Expo...${NC}"
rm -rf ~/.expo/cache 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
echo "${GREEN}✅ Cache limpo${NC}"

# 5. Iniciar simulador
echo ""
echo "${BLUE}5. Iniciando simulador...${NC}"
xcrun simctl boot "$DEFAULT_SIMULATOR" 2>/dev/null || {
    echo "${YELLOW}⚠️  Simulador já está rodando ou não pode ser iniciado${NC}"
}

# 6. Abrir Simulator.app
open -a Simulator 2>/dev/null || true

echo ""
echo "${GREEN}✅ Simulador configurado!${NC}"
echo ""
echo "${CYAN}💡 Agora execute:${NC}"
echo "   npm run ios"
echo ""
echo "${CYAN}Ou escolha um simulador específico:${NC}"
echo "   npm run ios -- --simulator=\"iPhone 17 Pro\""
echo ""
