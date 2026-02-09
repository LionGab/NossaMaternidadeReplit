#!/bin/bash

# Script Auxiliar: Configuração SSH Completa com Detecção Automática de Chave
# Este script detecta automaticamente a chave SSH mais recente e configura tudo

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_SCRIPT="$SCRIPT_DIR/configurar-ssh-macbook.sh"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "================================================"
echo -e "${CYAN}Configuração SSH Completa - MacBook${NC}"
echo "================================================"
echo ""

# Procurar chave SSH mais recente
SSH_KEYS=(
    "$HOME/.ssh/id_ed25519.pub"
    "$HOME/.ssh/id_rsa.pub"
    "$HOME/.ssh/id_ecdsa.pub"
    "$HOME/.ssh/id_dsa.pub"
)

CHAVE_ENCONTRADA=""
for key in "${SSH_KEYS[@]}"; do
    if [[ -f "$key" ]]; then
        CHAVE_ENCONTRADA="$key"
        break
    fi
done

if [[ -n "$CHAVE_ENCONTRADA" ]]; then
    echo -e "${GREEN}✓ Chave SSH encontrada: $CHAVE_ENCONTRADA${NC}"
    CHAVE_PUBLICA=$(cat "$CHAVE_ENCONTRADA")
    echo ""
    echo "Executando configuração com chave pública..."
    echo ""
    "$CONFIG_SCRIPT" --chave-publica "$CHAVE_PUBLICA"
else
    echo -e "${YELLOW}⚠ Nenhuma chave SSH pública encontrada${NC}"
    echo ""
    echo "Executando configuração básica (sem chave pública)..."
    echo "Você pode adicionar uma chave depois executando:"
    echo "  $CONFIG_SCRIPT --chave-publica \"\$(cat ~/.ssh/id_ed25519.pub)\""
    echo ""
    "$CONFIG_SCRIPT"
fi
