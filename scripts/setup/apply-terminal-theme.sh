#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Apply Terminal Theme - Clean & Intuitive Colors
# ══════════════════════════════════════════════════════════════════════════════
#
# Aplica tema de cores ao Terminal.app usando valores RGB precisos
#

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

THEME=${1:-dracula}

echo ""
echo "${CYAN}🎨 Aplicando tema: ${THEME}${NC}"
echo ""

# Função para converter hex para RGB float (0.0-1.0)
hex_to_float_rgb() {
    local hex=$1
    hex=${hex#\#}
    local r=$((16#${hex:0:2}))
    local g=$((16#${hex:2:2}))
    local b=$((16#${hex:4:2}))
    awk "BEGIN {printf \"%.6f %.6f %.6f\", $r/255, $g/255, $b/255}"
}

# Definir cores hex por tema (valores oficiais precisos)
case $THEME in
    dracula)
        BG_HEX="#282A36"
        FG_HEX="#F8F8F2"
        BLACK_HEX="#21222C"
        RED_HEX="#FF5555"
        GREEN_HEX="#50FA7B"
        YELLOW_HEX="#F1FA8C"
        BLUE_HEX="#BD93F9"
        MAGENTA_HEX="#FF79C6"
        CYAN_HEX="#8BE9FD"
        WHITE_HEX="#F8F8F2"
        THEME_NAME="Dracula Pro"
        ;;
    onedark)
        BG_HEX="#282C34"
        FG_HEX="#ABB2BF"
        BLACK_HEX="#282C34"
        RED_HEX="#E06C75"
        GREEN_HEX="#98C379"
        YELLOW_HEX="#E5C07B"
        BLUE_HEX="#61AFEF"
        MAGENTA_HEX="#C678DD"
        CYAN_HEX="#56B6C2"
        WHITE_HEX="#ABB2BF"
        THEME_NAME="One Dark Pro"
        ;;
    nord)
        BG_HEX="#2E3440"
        FG_HEX="#ECEFF4"
        BLACK_HEX="#3B4252"
        RED_HEX="#BF616A"
        GREEN_HEX="#A3BE8C"
        YELLOW_HEX="#EBCB8B"
        BLUE_HEX="#81A1C1"
        MAGENTA_HEX="#B48EAD"
        CYAN_HEX="#88C0D0"
        WHITE_HEX="#ECEFF4"
        THEME_NAME="Nord Pro"
        ;;
    solarized)
        BG_HEX="#002B36"
        FG_HEX="#839496"
        BLACK_HEX="#073642"
        RED_HEX="#DC322F"
        GREEN_HEX="#859900"
        YELLOW_HEX="#B58900"
        BLUE_HEX="#268BD2"
        MAGENTA_HEX="#D33682"
        CYAN_HEX="#2AA198"
        WHITE_HEX="#EEE8D5"
        THEME_NAME="Solarized Dark"
        ;;
    gruvbox)
        BG_HEX="#282828"
        FG_HEX="#EBDBB2"
        BLACK_HEX="#282828"
        RED_HEX="#CC241D"
        GREEN_HEX="#98971A"
        YELLOW_HEX="#D79921"
        BLUE_HEX="#458588"
        MAGENTA_HEX="#B16286"
        CYAN_HEX="#689D6A"
        WHITE_HEX="#A89984"
        THEME_NAME="Gruvbox Dark"
        ;;
    tokyo)
        BG_HEX="#1A1B26"
        FG_HEX="#C0CAF5"
        BLACK_HEX="#15161E"
        RED_HEX="#F7768E"
        GREEN_HEX="#9ECE6A"
        YELLOW_HEX="#E0AF68"
        BLUE_HEX="#7AA2F7"
        MAGENTA_HEX="#BB9AF7"
        CYAN_HEX="#7DCFFF"
        WHITE_HEX="#C0CAF5"
        THEME_NAME="Tokyo Night"
        ;;
    mocha)
        BG_HEX="#1E1E2E"
        FG_HEX="#CDD6F4"
        BLACK_HEX="#11111B"
        RED_HEX="#F38BA8"
        GREEN_HEX="#A6E3A1"
        YELLOW_HEX="#F9E2AF"
        BLUE_HEX="#89B4FA"
        MAGENTA_HEX="#F5C2E7"
        CYAN_HEX="#94E2D5"
        WHITE_HEX="#BAC2DE"
        THEME_NAME="Catppuccin Mocha"
        ;;
    nossa)
        BG_HEX="#0F172A"
        FG_HEX="#F0F9FF"
        BLACK_HEX="#1E293B"
        RED_HEX="#EF4444"
        GREEN_HEX="#10B981"
        YELLOW_HEX="#F59E0B"
        BLUE_HEX="#38BDF8"
        MAGENTA_HEX="#EC4899"
        CYAN_HEX="#06B6D4"
        WHITE_HEX="#F0F9FF"
        THEME_NAME="Nossa Maternidade"
        ;;
    *)
        echo "${YELLOW}⚠️  Tema desconhecido: $THEME${NC}"
        echo "Temas disponíveis: dracula, onedark, nord, solarized, gruvbox, tokyo, mocha, nossa"
        exit 1
        ;;
esac

# Converter para RGB float
BG=$(hex_to_float_rgb "$BG_HEX")
FG=$(hex_to_float_rgb "$FG_HEX")
BLACK=$(hex_to_float_rgb "$BLACK_HEX")
RED=$(hex_to_float_rgb "$RED_HEX")
GREEN=$(hex_to_float_rgb "$GREEN_HEX")
YELLOW=$(hex_to_float_rgb "$YELLOW_HEX")
BLUE=$(hex_to_float_rgb "$BLUE_HEX")
MAGENTA=$(hex_to_float_rgb "$MAGENTA_HEX")
CYAN=$(hex_to_float_rgb "$CYAN_HEX")
WHITE=$(hex_to_float_rgb "$WHITE_HEX")

# Aplicar usando osascript (mais confiável no macOS)
osascript <<EOF
tell application "Terminal"
    -- Criar ou usar perfil do tema
    set default settings to settings set "${THEME_NAME}"

    -- Background e texto
    set background color of default settings to {$BG}
    set normal text color of default settings to {$FG}
    set bold text color of default settings to {$WHITE}

    -- Cores ANSI
    set ANSI black color of default settings to {$BLACK}
    set ANSI red color of default settings to {$RED}
    set ANSI green color of default settings to {$GREEN}
    set ANSI yellow color of default settings to {$YELLOW}
    set ANSI blue color of default settings to {$BLUE}
    set ANSI magenta color of default settings to {$MAGENTA}
    set ANSI cyan color of default settings to {$CYAN}
    set ANSI white color of default settings to {$WHITE}

    -- Cores bright (usar mesmas cores para consistência)
    set ANSI bright black color of default settings to {$BLACK}
    set ANSI bright red color of default settings to {$RED}
    set ANSI bright green color of default settings to {$GREEN}
    set ANSI bright yellow color of default settings to {$YELLOW}
    set ANSI bright blue color of default settings to {$BLUE}
    set ANSI bright magenta color of default settings to {$MAGENTA}
    set ANSI bright cyan color of default settings to {$CYAN}
    set ANSI bright white color of default settings to {$WHITE}
end tell
EOF

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Tema ${THEME_NAME} aplicado com sucesso!${NC}"
    echo ""
    echo "${CYAN}💡 Recarregue o Terminal.app para ver as mudanças${NC}"
else
    echo "${YELLOW}⚠️  Aplicação automática falhou${NC}"
    echo ""
    echo "${CYAN}📝 Aplicação Manual:${NC}"
    echo "   1. Terminal > Preferências > Perfis"
    echo "   2. Selecione 'Pro' ou crie novo perfil"
    echo "   3. Aba 'Texto' > Clique em 'Cores'"
    echo "   4. Use as cores hex do tema ${THEME_NAME}:"
    echo ""
    echo "   Background: ${BG_HEX}"
    echo "   Text:       ${FG_HEX}"
    echo "   Black:     ${BLACK_HEX}"
    echo "   Red:        ${RED_HEX}"
    echo "   Green:      ${GREEN_HEX}"
    echo "   Yellow:     ${YELLOW_HEX}"
    echo "   Blue:       ${BLUE_HEX}"
    echo "   Magenta:    ${MAGENTA_HEX}"
    echo "   Cyan:       ${CYAN_HEX}"
    echo "   White:      ${WHITE_HEX}"
fi
