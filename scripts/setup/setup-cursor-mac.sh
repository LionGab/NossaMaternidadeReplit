#!/bin/bash

# Script de Setup Completo do Cursor para macOS
# Uso: bash scripts/setup-cursor-mac.sh

set -e

echo "🚀 Configurando Cursor para macOS..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se estamos no macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo -e "${RED}❌ Este script é apenas para macOS${NC}"
  exit 1
fi

# Verificar se estamos no diretório do projeto
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Execute este script na raiz do projeto${NC}"
  exit 1
fi

echo -e "${BLUE}📦 Verificando dependências...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js não encontrado. Instale via: brew install node${NC}"
  exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅${NC} Node.js: $NODE_VERSION"

# Verificar npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm não encontrado${NC}"
  exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅${NC} npm: $NPM_VERSION"

# Verificar se Cursor está instalado
if ! command -v cursor &> /dev/null; then
  echo -e "${YELLOW}⚠️${NC} Cursor CLI não encontrado"
  echo -e "${BLUE}💡 Instale via: Cmd+Shift+P → 'Shell Command: Install cursor command in PATH'${NC}"
else
  echo -e "${GREEN}✅${NC} Cursor CLI instalado"
fi

echo ""
echo -e "${BLUE}📁 Verificando arquivos de configuração...${NC}"

# Criar diretórios se não existirem
mkdir -p .vscode
mkdir -p .claude
mkdir -p docs

# Verificar arquivos críticos
FILES=(
  ".cursorrules"
  ".mcp.json"
  ".claude/settings.json"
  ".claude/statusline.sh"
  ".vscode/settings.json"
  ".vscode/keybindings.json"
  ".vscode/extensions.json"
)

MISSING_FILES=()

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
    echo -e "${YELLOW}⚠️${NC} $file não encontrado"
  else
    echo -e "${GREEN}✅${NC} $file existe"
  fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
  echo -e "${YELLOW}⚠️${NC} Alguns arquivos estão faltando. Execute o setup completo primeiro."
fi

echo ""
echo -e "${BLUE}🔧 Verificando configurações macOS...${NC}"

# Verificar .mcp.json usa npx (macOS)
if [ -f ".mcp.json" ]; then
  if grep -q '"command": "cmd"' .mcp.json; then
    echo -e "${RED}❌${NC} .mcp.json ainda usa 'cmd' (Windows). Precisa usar 'npx' para macOS"
  else
    echo -e "${GREEN}✅${NC} .mcp.json configurado para macOS"
  fi
fi

# Verificar .claude/settings.json usa bash
if [ -f ".claude/settings.json" ]; then
  if grep -q "powershell" .claude/settings.json; then
    echo -e "${RED}❌${NC} .claude/settings.json ainda usa 'powershell'. Precisa usar 'bash' para macOS"
  else
    echo -e "${GREEN}✅${NC} .claude/settings.json configurado para macOS"
  fi
fi

# Verificar .claude/statusline.sh existe e é executável
if [ -f ".claude/statusline.sh" ]; then
  chmod +x .claude/statusline.sh
  echo -e "${GREEN}✅${NC} .claude/statusline.sh é executável"
else
  echo -e "${YELLOW}⚠️${NC} .claude/statusline.sh não encontrado"
fi

echo ""
echo -e "${BLUE}📦 Verificando dependências npm...${NC}"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
  echo -e "${RED}❌${NC} node_modules não encontrado!"
  echo -e "${YELLOW}⚠️${NC} É necessário instalar as dependências primeiro:"
  echo -e "${BLUE}💡 Execute: npm install${NC}"
  echo ""
  echo -e "${YELLOW}⚠️${NC} Sem node_modules, as seguintes extensões não funcionarão:"
  echo -e "   - Tailwind CSS IntelliSense"
  echo -e "   - ESLint"
  echo -e "   - TypeScript (pode ter problemas)"
  echo ""
  read -p "Deseja instalar as dependências agora? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📦 Instalando dependências...${NC}"
    npm install
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✅${NC} Dependências instaladas com sucesso!"
    else
      echo -e "${RED}❌${NC} Erro ao instalar dependências. Execute manualmente: npm install"
    fi
  else
    echo -e "${YELLOW}⚠️${NC} Pule a instalação. Lembre-se de executar 'npm install' depois."
  fi
else
  echo -e "${GREEN}✅${NC} node_modules existe"
fi

echo ""
echo -e "${BLUE}🔌 Verificando MCP Servers...${NC}"

# Verificar se os MCP servers estão configurados
if [ -f ".mcp.json" ]; then
  MCP_COUNT=$(grep -c '"command": "npx"' .mcp.json || echo "0")
  echo -e "${GREEN}✅${NC} $MCP_COUNT MCP servers configurados"
fi

echo ""
echo -e "${BLUE}📋 Verificando regras .mdc...${NC}"

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

echo -e "${GREEN}✅${NC} $MDC_COUNT/5 regras .mdc encontradas"

echo ""
echo -e "${BLUE}⚡ Verificando otimizações M1 8GB...${NC}"

if [ -f ".vscode/settings.json" ]; then
  # Verificar TypeScript memory limit (1GB para 8GB RAM)
  if grep -q '"typescript.tsserver.maxTsServerMemory": 1024' .vscode/settings.json; then
    echo -e "${GREEN}✅${NC} TypeScript memory limit: 1GB (otimizado para 8GB RAM)"
  elif grep -q '"typescript.tsserver.maxTsServerMemory": 1536' .vscode/settings.json; then
    echo -e "${GREEN}✅${NC} TypeScript memory limit: 1.5GB"
  else
    echo -e "${YELLOW}⚠️${NC} TypeScript memory limit não configurado"
  fi

  # Verificar file watchers
  if grep -q '"files.watcherExclude"' .vscode/settings.json; then
    echo -e "${GREEN}✅${NC} File watchers otimizados"
  else
    echo -e "${YELLOW}⚠️${NC} File watchers não configurados"
  fi

  # Verificar minimap desabilitado
  if grep -q '"editor.minimap.enabled": false' .vscode/settings.json; then
    echo -e "${GREEN}✅${NC} Minimap desabilitado (economiza GPU)"
  fi
fi

echo ""
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
echo -e "${BLUE}📝 Verificando variáveis de ambiente...${NC}"

# Verificar se SUPABASE_DB_URL está configurado
if [ -z "$SUPABASE_DB_URL" ]; then
  echo -e "${YELLOW}⚠️${NC} SUPABASE_DB_URL não configurado"
  echo -e "${BLUE}💡 Adicione ao ~/.zshrc: export SUPABASE_DB_URL='sua-url-aqui'${NC}"
else
  echo -e "${GREEN}✅${NC} SUPABASE_DB_URL configurado"
fi

# Verificar se SUPABASE_ACCESS_TOKEN está configurado
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo -e "${YELLOW}⚠️${NC} SUPABASE_ACCESS_TOKEN não configurado"
  echo -e "${BLUE}💡 Adicione ao ~/.zshrc: export SUPABASE_ACCESS_TOKEN='seu-token-aqui'${NC}"
else
  echo -e "${GREEN}✅${NC} SUPABASE_ACCESS_TOKEN configurado"
fi

echo ""
echo -e "${GREEN}✨ Setup verificado!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo "1. Instale o Cursor CLI:"
echo "   Cmd+Shift+P → 'Shell Command: Install cursor command in PATH'"
echo ""
echo "2. Configure variáveis no ~/.zshrc:"
echo "   export SUPABASE_DB_URL='sua-url-aqui'"
echo "   export SUPABASE_ACCESS_TOKEN='seu-token-aqui'"
echo "   source ~/.zshrc"
echo ""
echo "3. Ative os MCP Servers:"
echo "   Cmd+Shift+P → 'MCP: Enable Servers'"
echo ""
echo "4. Reinicie o Cursor:"
echo "   Cmd+Shift+P → 'Developer: Reload Window'"
echo ""
echo -e "${GREEN}🍼 Pronto para desenvolver!${NC}"
