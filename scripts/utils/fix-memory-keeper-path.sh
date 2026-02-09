#!/bin/bash
# =============================================================================
# Script para corrigir caminho do Memory Keeper no settings.json global
# =============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Caminhos
CURSOR_SETTINGS="$HOME/Library/Application Support/Cursor/User/settings.json"
PROJECT_DIR="/Users/lion/NossaMaternidade"
DB_PATH="$PROJECT_DIR/.claude/context.db"

echo -e "${GREEN}🔧 Corrigindo caminho do Memory Keeper...${NC}"
echo ""

# Verificar se o arquivo existe
if [ ! -f "$CURSOR_SETTINGS" ]; then
    echo -e "${RED}❌ Arquivo não encontrado: $CURSOR_SETTINGS${NC}"
    exit 1
fi

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq não está instalado. Instalando...${NC}"
    brew install jq
fi

# Backup
BACKUP_FILE="${CURSOR_SETTINGS}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$CURSOR_SETTINGS" "$BACKUP_FILE"
echo -e "${GREEN}✅ Backup criado: $BACKUP_FILE${NC}"

# Atualizar caminho do Memory Keeper
echo -e "${YELLOW}📝 Atualizando caminho do Memory Keeper...${NC}"

# Usar jq para atualizar o caminho
jq --arg db_path "$DB_PATH" \
   '.mcpServers."memory-keeper".env.MCP_MEMORY_DB_PATH = $db_path' \
   "$CURSOR_SETTINGS" > "${CURSOR_SETTINGS}.tmp" && \
   mv "${CURSOR_SETTINGS}.tmp" "$CURSOR_SETTINGS"

echo -e "${GREEN}✅ Caminho atualizado para: $DB_PATH${NC}"
echo ""
echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS:${NC}"
echo "1. Recarregue o Cursor: Cmd + Shift + P → 'Reload Window'"
echo "2. Ou feche e reabra o Cursor completamente"
echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}"
