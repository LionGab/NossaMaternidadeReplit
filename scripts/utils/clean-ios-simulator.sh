#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Clean iOS Simulator - Deixar apenas o básico
# ══════════════════════════════════════════════════════════════════════════════
#
# Remove apps desnecessários e deixa apenas o essencial no simulador
#

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "${CYAN}🧹 Limpando Simulador iOS - Deixando apenas o básico${NC}"
echo ""

# Verificar se há simulador rodando
BOOTED_DEVICE=$(xcrun simctl list devices | grep "(Booted)" | head -1 | sed -E 's/.*\(([^)]+)\).*/\1/' || echo "")

if [ -z "$BOOTED_DEVICE" ]; then
    echo "${YELLOW}⚠️  Nenhum simulador está rodando${NC}"
    echo "${CYAN}💡 Iniciando iPhone 17 Pro...${NC}"
    xcrun simctl boot "iPhone 17 Pro" 2>/dev/null || {
        echo "${RED}❌ Erro ao iniciar simulador${NC}"
        exit 1
    }
    BOOTED_DEVICE=$(xcrun simctl list devices | grep "(Booted)" | head -1 | sed -E 's/.*\(([^)]+)\).*/\1/')
    sleep 2
fi

echo "${BLUE}📱 Simulador: ${BOOTED_DEVICE}${NC}"
echo ""

# Apps essenciais que NÃO devem ser removidos
ESSENTIAL_APPS=(
    "com.apple.Preferences"           # Settings
    "com.apple.mobilesafari"          # Safari
    "com.apple.camera"                # Camera
    "com.apple.Photos"                 # Photos
    "com.apple.MobileSMS"             # Messages
    "com.apple.mobilephone"            # Phone
    "com.apple.mobilemail"             # Mail
    "com.apple.calculator"             # Calculator
    "com.apple.mobilecal"              # Calendar
    "com.apple.clock"                  # Clock
    "com.apple.mobiletimer"            # Timer
    "com.apple.mobilenotes"            # Notes
    "com.apple.reminders"              # Reminders
    "com.apple.mobileipod"             # Music
    "com.apple.AppStore"                # App Store
)

# Função para verificar se app é essencial
is_essential() {
    local app_id=$1
    for essential in "${ESSENTIAL_APPS[@]}"; do
        if [[ "$app_id" == "$essential" ]]; then
            return 0
        fi
    done
    return 1
}

# Listar todos os apps instalados
echo "${BLUE}📋 Analisando apps instalados...${NC}"
ALL_APPS=$(xcrun simctl listapps "$BOOTED_DEVICE" 2>/dev/null | grep -E '"CFBundleIdentifier"' | sed -E 's/.*"CFBundleIdentifier" : "([^"]+)".*/\1/' || echo "")

if [ -z "$ALL_APPS" ]; then
    echo "${YELLOW}⚠️  Não foi possível listar apps${NC}"
    echo "${CYAN}💡 Tentando método alternativo...${NC}"
    exit 0
fi

# Contar apps
TOTAL_APPS=$(echo "$ALL_APPS" | wc -l | tr -d ' ')
ESSENTIAL_COUNT=0
REMOVABLE_COUNT=0

echo ""
echo "${CYAN}📊 Estatísticas:${NC}"
echo "   Total de apps: $TOTAL_APPS"

# Separar apps removíveis
REMOVABLE_APPS=()
while IFS= read -r app_id; do
    if [ -n "$app_id" ]; then
        if is_essential "$app_id"; then
            ((ESSENTIAL_COUNT++))
        else
            REMOVABLE_APPS+=("$app_id")
            ((REMOVABLE_COUNT++))
        fi
    fi
done <<< "$ALL_APPS"

echo "   Apps essenciais: $ESSENTIAL_COUNT"
echo "   Apps removíveis: $REMOVABLE_COUNT"
echo ""

if [ ${#REMOVABLE_APPS[@]} -eq 0 ]; then
    echo "${GREEN}✅ Simulador já está limpo!${NC}"
    exit 0
fi

# Mostrar apps que serão removidos (primeiros 10)
echo "${YELLOW}🗑️  Apps que serão removidos (primeiros 10):${NC}"
for i in "${!REMOVABLE_APPS[@]}"; do
    if [ $i -lt 10 ]; then
        echo "   ${REMOVABLE_APPS[$i]}"
    fi
done
if [ ${#REMOVABLE_APPS[@]} -gt 10 ]; then
    echo "   ... e mais $(( ${#REMOVABLE_APPS[@]} - 10 )) apps"
fi

echo ""
read -p "${CYAN}Continuar e remover ${#REMOVABLE_APPS[@]} apps? (s/N): ${NC}" confirm

if [[ ! "$confirm" =~ ^[sS]$ ]]; then
    echo "${YELLOW}❌ Cancelado${NC}"
    exit 0
fi

echo ""
echo "${BLUE}🗑️  Removendo apps...${NC}"

REMOVED=0
FAILED=0

for app_id in "${REMOVABLE_APPS[@]}"; do
    if xcrun simctl uninstall "$BOOTED_DEVICE" "$app_id" 2>/dev/null; then
        ((REMOVED++))
        echo "   ${GREEN}✅${NC} Removido: $app_id"
    else
        ((FAILED++))
        echo "   ${YELLOW}⚠️${NC} Falhou: $app_id"
    fi
done

echo ""
echo "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${GREEN}║${NC}                    ${CYAN}✅ Concluído!${NC}                    ${GREEN}║${NC}"
echo "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "${CYAN}📊 Resultado:${NC}"
echo "   ${GREEN}Removidos:${NC} $REMOVED apps"
echo "   ${YELLOW}Falharam:${NC} $FAILED apps"
echo "   ${BLUE}Mantidos:${NC} $ESSENTIAL_COUNT apps essenciais"
echo ""
echo "${CYAN}💡 O simulador agora tem apenas o básico!${NC}"
echo ""
