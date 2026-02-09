#!/bin/bash

# Script para verificar configuração do Cursor (macOS)
# Uso: bash scripts/verify-cursor-setup.sh

set -e

echo "🔍 Verificando configuração do Cursor (macOS)..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se estamos no macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo -e "${YELLOW}⚠️${NC} Este script é otimizado para macOS"
fi

ALL_OK=true

# Verificar arquivos críticos
FILES=(
  ".vscode/settings.json"
  ".vscode/keybindings.json"
  ".vscode/extensions.json"
  ".cursorrules"
  ".mcp.json"
  ".claude/settings.json"
  ".claude/statusline.sh"
)

echo -e "${BLUE}📁 Verificando arquivos de configuração...${NC}"

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $file existe"
  else
    echo -e "${RED}❌${NC} $file não encontrado"
    ALL_OK=false
  fi
done

echo ""

# Verificar configurações críticas
if [ -f ".vscode/settings.json" ]; then
  echo -e "${BLUE}📋 Verificando configurações críticas...${NC}"

  # Verificar otimizações de memória M1
  if grep -q '"typescript.tsserver.maxTsServerMemory": 1536' ".vscode/settings.json"; then
    echo -e "${GREEN}✅${NC} TypeScript memory limit: 1.5GB (M1 8GB)"
  else
    echo -e "${YELLOW}⚠️${NC} TypeScript memory limit não configurado para 1.5GB"
  fi

  # Verificar file watchers
  if grep -q '"files.watcherExclude"' ".vscode/settings.json"; then
    echo -e "${GREEN}✅${NC} File watchers otimizados"
  else
    echo -e "${YELLOW}⚠️${NC} File watchers não configurados"
  fi

  # Verificar layout fixo
  if grep -q '"workbench.editor.enablePreview": false' ".vscode/settings.json"; then
    echo -e "${GREEN}✅${NC} Layout fixo configurado"
  else
    echo -e "${YELLOW}⚠️${NC} Layout fixo não encontrado"
  fi

  # Verificar minimap desabilitado
  if grep -q '"editor.minimap.enabled": false' ".vscode/settings.json"; then
    echo -e "${GREEN}✅${NC} Minimap desabilitado (economiza GPU)"
  fi
fi

echo ""

# Verificar formato macOS
echo -e "${BLUE}🍎 Verificando formato macOS...${NC}"

if [ -f ".mcp.json" ]; then
  if grep -q '"command": "cmd"' .mcp.json; then
    echo -e "${RED}❌${NC} .mcp.json ainda usa 'cmd' (Windows). Precisa usar 'npx' para macOS"
    ALL_OK=false
  else
    echo -e "${GREEN}✅${NC} .mcp.json configurado para macOS (npx)"
  fi
fi

if [ -f ".claude/settings.json" ]; then
  if grep -q "powershell" .claude/settings.json; then
    echo -e "${RED}❌${NC} .claude/settings.json ainda usa 'powershell'. Precisa usar 'bash' para macOS"
    ALL_OK=false
  else
    echo -e "${GREEN}✅${NC} .claude/settings.json configurado para macOS (bash)"
  fi
fi

if [ -f ".claude/statusline.sh" ]; then
  if [ -x ".claude/statusline.sh" ]; then
    echo -e "${GREEN}✅${NC} .claude/statusline.sh é executável"
  else
    echo -e "${YELLOW}⚠️${NC} .claude/statusline.sh não é executável (execute: chmod +x .claude/statusline.sh)"
  fi
fi

echo ""

# Verificar regras .mdc
echo -e "${BLUE}📜 Verificando regras .mdc...${NC}"

MDC_FILES=(
  ".claude/rules/always/typescript-strict.mdc"
  ".claude/rules/always/logging.mdc"
  ".claude/rules/always/design-system.mdc"
  ".claude/rules/always/accessibility.mdc"
  ".claude/rules/always/build-standards.mdc"
)

MDC_COUNT=0
for file in "${MDC_FILES[@]}"; do
  if [ -f "$file" ]; then
    MDC_COUNT=$((MDC_COUNT + 1))
  fi
done

if [ "$MDC_COUNT" -eq 5 ]; then
  echo -e "${GREEN}✅${NC} 5/5 regras .mdc ativas"
else
  echo -e "${YELLOW}⚠️${NC} $MDC_COUNT/5 regras .mdc encontradas"
fi

echo ""

# Verificar MCP Servers
echo -e "${BLUE}🔌 Verificando MCP Servers...${NC}"

if [ -f ".mcp.json" ]; then
  MCP_COUNT=$(grep -c '"command": "npx"' .mcp.json 2>/dev/null || echo "0")
  HTTP_COUNT=$(grep -c '"transport": "http"' .mcp.json 2>/dev/null || echo "0")
  TOTAL=$((MCP_COUNT + HTTP_COUNT))
  echo -e "${GREEN}✅${NC} $TOTAL MCP servers configurados"
fi

echo ""

# Verificar código
echo -e "${BLUE}🔍 Verificando código...${NC}"

# Verificar console.log (deve estar apenas em comentários ou logger.ts)
CONSOLE_LOGS=$(grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "//" | grep -v "logger.ts" | wc -l | tr -d ' ')
if [ "$CONSOLE_LOGS" -eq 0 ]; then
  echo -e "${GREEN}✅${NC} Nenhum console.log encontrado em src/"
else
  echo -e "${YELLOW}⚠️${NC} $CONSOLE_LOGS console.log encontrados (devem ser substituídos por logger.*)"
fi

# Verificar any types
ANY_TYPES=$(grep -r ": any" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "//" | wc -l | tr -d ' ')
if [ "$ANY_TYPES" -eq 0 ]; then
  echo -e "${GREEN}✅${NC} Nenhum tipo 'any' encontrado"
else
  echo -e "${YELLOW}⚠️${NC} $ANY_TYPES tipos 'any' encontrados (devem ser substituídos por 'unknown' + type guards)"
fi

echo ""

if [ "$ALL_OK" = true ]; then
  echo -e "${GREEN}✨ Configuração do Cursor está completa!${NC}"
  echo ""
  echo "📖 Documentação: docs/CURSOR_SETUP_MAC.md"
  echo "🔄 Para aplicar: Feche e reabra o Cursor"
else
  echo -e "${YELLOW}⚠️${NC} Algumas configurações precisam ser ajustadas"
  echo ""
  echo "Execute: bash scripts/setup-cursor-mac.sh"
  exit 1
fi
