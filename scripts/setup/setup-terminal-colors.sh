#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Setup Terminal Colors - Clean & Intuitive Professional Theme
# ══════════════════════════════════════════════════════════════════════════════
#
# Sistema de cores otimizado para Terminal.app do macOS
# Cores precisas, alto contraste e legibilidade perfeita
#

set -e

# Cores para output do script (ansi)
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${CYAN}║${NC}     ${MAGENTA}🎨 Terminal Colors - Clean & Intuitive${NC}     ${CYAN}║${NC}"
echo "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está no macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "${YELLOW}⚠️  Este script é apenas para macOS${NC}"
    exit 1
fi

echo "${BLUE}Escolha um tema profissional:${NC}"
echo ""
echo "  ${GREEN}1)${NC} Dracula Pro (Vibrante e popular)"
echo "  ${GREEN}2)${NC} One Dark Pro (VS Code style)"
echo "  ${GREEN}3)${NC} Nord Pro (Frio e minimalista)"
echo "  ${GREEN}4)${NC} Solarized Dark (Clássico testado)"
echo "  ${GREEN}5)${NC} Gruvbox Dark (Quente e confortável)"
echo "  ${GREEN}6)${NC} Tokyo Night (Moderno e elegante)"
echo "  ${GREEN}7)${NC} Catppuccin Mocha (Suave e clean)"
echo "  ${GREEN}8)${NC} Nossa Maternidade (Blue Clean theme)"
echo ""
read -p "Opção [1-8]: " choice

# Função para converter hex para RGB 0-65535 (formato Terminal.app)
hex_to_terminal_rgb() {
    local hex=$1
    # Remove #
    hex=${hex#\#}
    # Converte para decimal
    local r=$((16#${hex:0:2}))
    local g=$((16#${hex:2:2}))
    local b=$((16#${hex:4:2}))
    # Converte para 0-65535
    echo $((r * 256 + r))
    echo $((g * 256 + g))
    echo $((b * 256 + b))
}

# Função para converter hex para RGB 0.0-1.0 (formato AppleScript)
hex_to_float_rgb() {
    local hex=$1
    hex=${hex#\#}
    local r=$((16#${hex:0:2}))
    local g=$((16#${hex:2:2}))
    local b=$((16#${hex:4:2}))
    printf "%.6f %.6f %.6f" $(echo "scale=6; $r/255" | bc) $(echo "scale=6; $g/255" | bc) $(echo "scale=6; $b/255" | bc)
}

# Cores por tema - Valores hex precisos convertidos corretamente
declare -A THEMES_HEX

# Dracula Pro - Cores oficiais precisas
THEMES_HEX[dracula_bg]="#282A36"
THEMES_HEX[dracula_fg]="#F8F8F2"
THEMES_HEX[dracula_black]="#21222C"
THEMES_HEX[dracula_red]="#FF5555"
THEMES_HEX[dracula_green]="#50FA7B"
THEMES_HEX[dracula_yellow]="#F1FA8C"
THEMES_HEX[dracula_blue]="#BD93F9"
THEMES_HEX[dracula_magenta]="#FF79C6"
THEMES_HEX[dracula_cyan]="#8BE9FD"
THEMES_HEX[dracula_white]="#F8F8F2"

# One Dark Pro - Cores oficiais VS Code
THEMES_HEX[onedark_bg]="#282C34"
THEMES_HEX[onedark_fg]="#ABB2BF"
THEMES_HEX[onedark_black]="#282C34"
THEMES_HEX[onedark_red]="#E06C75"
THEMES_HEX[onedark_green]="#98C379"
THEMES_HEX[onedark_yellow]="#E5C07B"
THEMES_HEX[onedark_blue]="#61AFEF"
THEMES_HEX[onedark_magenta]="#C678DD"
THEMES_HEX[onedark_cyan]="#56B6C2"
THEMES_HEX[onedark_white]="#ABB2BF"

# Nord Pro - Cores oficiais precisas
THEMES_HEX[nord_bg]="#2E3440"
THEMES_HEX[nord_fg]="#ECEFF4"
THEMES_HEX[nord_black]="#3B4252"
THEMES_HEX[nord_red]="#BF616A"
THEMES_HEX[nord_green]="#A3BE8C"
THEMES_HEX[nord_yellow]="#EBCB8B"
THEMES_HEX[nord_blue]="#81A1C1"
THEMES_HEX[nord_magenta]="#B48EAD"
THEMES_HEX[nord_cyan]="#88C0D0"
THEMES_HEX[nord_white]="#ECEFF4"

# Solarized Dark - Cores oficiais
THEMES_HEX[solarized_bg]="#002B36"
THEMES_HEX[solarized_fg]="#839496"
THEMES_HEX[solarized_black]="#073642"
THEMES_HEX[solarized_red]="#DC322F"
THEMES_HEX[solarized_green]="#859900"
THEMES_HEX[solarized_yellow]="#B58900"
THEMES_HEX[solarized_blue]="#268BD2"
THEMES_HEX[solarized_magenta]="#D33682"
THEMES_HEX[solarized_cyan]="#2AA198"
THEMES_HEX[solarized_white]="#EEE8D5"

# Gruvbox Dark - Cores oficiais
THEMES_HEX[gruvbox_bg]="#282828"
THEMES_HEX[gruvbox_fg]="#EBDBB2"
THEMES_HEX[gruvbox_black]="#282828"
THEMES_HEX[gruvbox_red]="#CC241D"
THEMES_HEX[gruvbox_green]="#98971A"
THEMES_HEX[gruvbox_yellow]="#D79921"
THEMES_HEX[gruvbox_blue]="#458588"
THEMES_HEX[gruvbox_magenta]="#B16286"
THEMES_HEX[gruvbox_cyan]="#689D6A"
THEMES_HEX[gruvbox_white]="#A89984"

# Tokyo Night - Cores oficiais
THEMES_HEX[tokyo_bg]="#1A1B26"
THEMES_HEX[tokyo_fg]="#C0CAF5"
THEMES_HEX[tokyo_black]="#15161E"
THEMES_HEX[tokyo_red]="#F7768E"
THEMES_HEX[tokyo_green]="#9ECE6A"
THEMES_HEX[tokyo_yellow]="#E0AF68"
THEMES_HEX[tokyo_blue]="#7AA2F7"
THEMES_HEX[tokyo_magenta]="#BB9AF7"
THEMES_HEX[tokyo_cyan]="#7DCFFF"
THEMES_HEX[tokyo_white]="#C0CAF5"

# Catppuccin Mocha - Cores oficiais
THEMES_HEX[mocha_bg]="#1E1E2E"
THEMES_HEX[mocha_fg]="#CDD6F4"
THEMES_HEX[mocha_black]="#11111B"
THEMES_HEX[mocha_red]="#F38BA8"
THEMES_HEX[mocha_green]="#A6E3A1"
THEMES_HEX[mocha_yellow]="#F9E2AF"
THEMES_HEX[mocha_blue]="#89B4FA"
THEMES_HEX[mocha_magenta]="#F5C2E7"
THEMES_HEX[mocha_cyan]="#94E2D5"
THEMES_HEX[mocha_white]="#BAC2DE"

# Nossa Maternidade - Blue Clean theme (baseado no design system)
THEMES_HEX[nossa_bg]="#0F172A"      # Neutral 900 - Background escuro
THEMES_HEX[nossa_fg]="#F0F9FF"     # Brand 50 - Texto claro
THEMES_HEX[nossa_black]="#1E293B"  # Neutral 800
THEMES_HEX[nossa_red]="#EF4444"     # Error red
THEMES_HEX[nossa_green]="#10B981"   # Success green
THEMES_HEX[nossa_yellow]="#F59E0B"  # Warning yellow
THEMES_HEX[nossa_blue]="#38BDF8"    # Brand 400 - Sky blue
THEMES_HEX[nossa_magenta]="#EC4899" # Accent pink
THEMES_HEX[nossa_cyan]="#06B6D4"    # Info cyan
THEMES_HEX[nossa_white]="#F0F9FF"   # Brand 50

# Selecionar tema
case $choice in
    1) THEME="dracula"; THEME_NAME="Dracula Pro" ;;
    2) THEME="onedark"; THEME_NAME="One Dark Pro" ;;
    3) THEME="nord"; THEME_NAME="Nord Pro" ;;
    4) THEME="solarized"; THEME_NAME="Solarized Dark" ;;
    5) THEME="gruvbox"; THEME_NAME="Gruvbox Dark" ;;
    6) THEME="tokyo"; THEME_NAME="Tokyo Night" ;;
    7) THEME="mocha"; THEME_NAME="Catppuccin Mocha" ;;
    8) THEME="nossa"; THEME_NAME="Nossa Maternidade" ;;
    *) echo "${YELLOW}⚠️  Opção inválida${NC}"; exit 1 ;;
esac

echo ""
echo "${BLUE}🎨 Aplicando tema: ${THEME_NAME}${NC}"

# Função para converter hex para RGB float (0.0-1.0)
hex_to_float() {
    local hex=$1
    hex=${hex#\#}
    local r=$((16#${hex:0:2}))
    local g=$((16#${hex:2:2}))
    local b=$((16#${hex:4:2}))
    # Usar bc para precisão ou awk como fallback
    if command -v bc >/dev/null 2>&1; then
        printf "%.6f %.6f %.6f" \
            $(echo "scale=6; $r/255" | bc) \
            $(echo "scale=6; $g/255" | bc) \
            $(echo "scale=6; $b/255" | bc)
    else
        awk "BEGIN {printf \"%.6f %.6f %.6f\", $r/255, $g/255, $b/255}"
    fi
}

# Converter cores hex para RGB float
BG_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_bg]}")
FG_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_fg]}")
BLACK_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_black]}")
RED_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_red]}")
GREEN_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_green]}")
YELLOW_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_yellow]}")
BLUE_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_blue]}")
MAGENTA_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_magenta]}")
CYAN_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_cyan]}")
WHITE_RGB=$(hex_to_float "${THEMES_HEX[${THEME}_white]}")

# Aplicar usando osascript (mais confiável)
echo "${CYAN}📝 Aplicando cores...${NC}"
osascript <<EOF
tell application "Terminal"
    set default settings to settings set "${THEME_NAME}"

    -- Background e texto
    set background color of default settings to {$BG_RGB}
    set normal text color of default settings to {$FG_RGB}
    set bold text color of default settings to {$WHITE_RGB}

    -- Cores ANSI
    set ANSI black color of default settings to {$BLACK_RGB}
    set ANSI red color of default settings to {$RED_RGB}
    set ANSI green color of default settings to {$GREEN_RGB}
    set ANSI yellow color of default settings to {$YELLOW_RGB}
    set ANSI blue color of default settings to {$BLUE_RGB}
    set ANSI magenta color of default settings to {$MAGENTA_RGB}
    set ANSI cyan color of default settings to {$CYAN_RGB}
    set ANSI white color of default settings to {$WHITE_RGB}

    -- Cores bright
    set ANSI bright black color of default settings to {$BLACK_RGB}
    set ANSI bright red color of default settings to {$RED_RGB}
    set ANSI bright green color of default settings to {$GREEN_RGB}
    set ANSI bright yellow color of default settings to {$YELLOW_RGB}
    set ANSI bright blue color of default settings to {$BLUE_RGB}
    set ANSI bright magenta color of default settings to {$MAGENTA_RGB}
    set ANSI bright cyan color of default settings to {$CYAN_RGB}
    set ANSI bright white color of default settings to {$WHITE_RGB}
end tell
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo "${GREEN}║${NC}                    ${MAGENTA}✅ Concluído!${NC}                    ${GREEN}║${NC}"
    echo "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "${CYAN}💡 Dicas:${NC}"
    echo "   • Recarregue o Terminal.app para ver as mudanças"
    echo "   • Configure como padrão: Terminal > Preferências > Padrão"
    echo "   • Ajuste transparência: Terminal > Preferências > Janela"
    echo ""
    echo "${BLUE}🎨 Tema ${THEME_NAME} aplicado!${NC}"
else
    echo ""
    echo "${YELLOW}⚠️  Aplicação automática falhou${NC}"
    echo ""
    echo "${CYAN}📝 Aplicação Manual:${NC}"
    echo "   1. Abra Terminal > Preferências > Perfis"
    echo "   2. Selecione 'Pro' ou crie novo perfil"
    echo "   3. Aba 'Texto' > Clique em 'Cores'"
    echo "   4. Use as cores hex do tema ${THEME_NAME}:"
    echo ""
    echo "   Background: ${THEMES_HEX[${THEME}_bg]}"
    echo "   Text:       ${THEMES_HEX[${THEME}_fg]}"
    echo "   Black:     ${THEMES_HEX[${THEME}_black]}"
    echo "   Red:        ${THEMES_HEX[${THEME}_red]}"
    echo "   Green:      ${THEMES_HEX[${THEME}_green]}"
    echo "   Yellow:     ${THEMES_HEX[${THEME}_yellow]}"
    echo "   Blue:       ${THEMES_HEX[${THEME}_blue]}"
    echo "   Magenta:    ${THEMES_HEX[${THEME}_magenta]}"
    echo "   Cyan:       ${THEMES_HEX[${THEME}_cyan]}"
    echo "   White:      ${THEMES_HEX[${THEME}_white]}"
    echo ""
fi
