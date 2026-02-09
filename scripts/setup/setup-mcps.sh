#!/bin/bash

# ===========================================
# Nossa Maternidade - MCP Setup Script
# Dezembro 2025
# ===========================================

echo "🚀 Nossa Maternidade - Setup de MCPs"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}Erro: Execute este script da raiz do projeto${NC}"
    exit 1
fi

echo -e "${YELLOW}1. Supabase MCP${NC}"
echo "----------------"
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✓ Supabase CLI instalado ($(supabase --version))${NC}"
    echo ""
    echo "Para linkar seu projeto, execute:"
    echo "  supabase login"
    echo "  supabase link --project-ref <SEU_PROJECT_REF>"
    echo ""
else
    echo -e "${RED}✗ Supabase CLI não encontrado${NC}"
    echo "Instale com: brew install supabase/tap/supabase"
fi
echo ""

echo -e "${YELLOW}2. Playwright${NC}"
echo "--------------"
if [ -d "node_modules/playwright-core" ]; then
    echo -e "${GREEN}✓ Playwright instalado${NC}"
else
    echo "Instalando Playwright..."
    npx playwright install chromium
fi
echo ""

echo -e "${YELLOW}3. Context7 MCP${NC}"
echo "----------------"
echo "Para documentação atualizada de libraries, adicione ao seu ~/.claude/settings.json:"
echo ""
cat << 'EOF'
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
EOF
echo ""

echo -e "${YELLOW}4. Memory MCP (Persistência)${NC}"
echo "-----------------------------"
echo "Para manter contexto entre sessões, adicione:"
echo ""
cat << 'EOF'
{
  "mcpServers": {
    "memory-keeper": {
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"],
      "env": {
        "MCP_MEMORY_DB_PATH": "./claude/context.db"
      }
    }
  }
}
EOF
echo ""

echo -e "${YELLOW}5. Expo MCP${NC}"
echo "------------"
echo "Para builds EAS e OTA, execute:"
echo "  claude mcp add --transport http expo-mcp https://mcp.expo.dev/mcp"
echo ""

echo -e "${YELLOW}6. GitHub MCP${NC}"
echo "--------------"
echo "Para PRs e code review, adicione:"
echo ""
cat << 'EOF'
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<SEU_TOKEN>"
      }
    }
  }
}
EOF
echo ""

echo -e "${YELLOW}7. Figma MCP${NC}"
echo "-------------"
echo "Para sync com design system:"
echo "1. Abra Figma Desktop"
echo "2. Vá em: Figma > Preferences > Developer"
echo "3. Habilite: Enable Dev Mode MCP Server"
echo "4. O MCP estará disponível em: http://127.0.0.1:3845/sse"
echo ""

echo "====================================="
echo -e "${GREEN}Setup concluído!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Execute: supabase login"
echo "2. Execute: supabase link --project-ref <PROJECT_REF>"
echo "3. Adicione os MCPs desejados ao ~/.claude/settings.json"
echo ""
echo "Documentação completa: docs/MCP_SETUP.md"
