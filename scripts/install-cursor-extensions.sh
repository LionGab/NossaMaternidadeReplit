#!/bin/bash

# Script para instalar extensões recomendadas do Cursor
# Otimizado para MacBook Air 2020 (8GB RAM)

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}📦 Instalando extensões Cursor (8GB RAM)${NC}"
echo ""

# Verificar se cursor CLI está disponível
if ! command -v cursor &> /dev/null; then
    echo -e "${YELLOW}⚠️  Cursor CLI não encontrado${NC}"
    echo ""
    echo "Por favor, instale o Cursor CLI primeiro:"
    echo "1. Abra o Cursor"
    echo "2. Cmd+Shift+P"
    echo "3. Digite: 'Shell Command: Install cursor command in PATH'"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅${NC} Cursor CLI encontrado"
echo ""

# Lista de extensões recomendadas
EXTENSIONS=(
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "bradlc.vscode-tailwindcss"
)

EXTENSION_NAMES=(
    "ESLint"
    "Prettier"
    "Tailwind CSS IntelliSense"
)

# Instalar cada extensão
for i in "${!EXTENSIONS[@]}"; do
    EXT="${EXTENSIONS[$i]}"
    NAME="${EXTENSION_NAMES[$i]}"
    
    echo -e "${BLUE}📥 Instalando $NAME ($EXT)...${NC}"
    
    if cursor --install-extension "$EXT" --force; then
        echo -e "${GREEN}✅${NC} $NAME instalado com sucesso"
    else
        echo -e "${YELLOW}⚠️${NC} Erro ao instalar $NAME (pode já estar instalado)"
    fi
    echo ""
done

echo ""
echo -e "${GREEN}✨ Instalação concluída!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo "1. Reinicie o Cursor (Cmd+Shift+P → 'Developer: Reload Window')"
echo "2. Verifique que as extensões foram ativadas (Cmd+Shift+X)"
echo "3. Execute: npm run quality-gate"
echo ""
echo -e "${BLUE}📚 Documentação:${NC}"
echo "- docs/CURSOR_EXTENSIONS_8GB.md — Detalhes das extensões"
echo "- docs/CURSOR_SETUP_CHECKLIST.md — Checklist completo"
echo ""
