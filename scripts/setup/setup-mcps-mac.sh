#!/bin/bash

# ===========================================
# Nossa Maternidade - MCP Setup Script (macOS)
# Configura MCPs automaticamente no Cursor settings.json
# ===========================================

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Nossa Maternidade - Setup de MCPs (macOS)${NC}"
echo "=========================================="
echo ""

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script da raiz do projeto${NC}"
    exit 1
fi

# Caminho do settings.json do Cursor
CURSOR_SETTINGS="$HOME/Library/Application Support/Cursor/User/settings.json"
CURSOR_SETTINGS_DIR="$HOME/Library/Application Support/Cursor/User"

# Criar diretório se não existir
mkdir -p "$CURSOR_SETTINGS_DIR"

# Backup do settings.json existente
if [ -f "$CURSOR_SETTINGS" ]; then
    BACKUP_FILE="${CURSOR_SETTINGS}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$CURSOR_SETTINGS" "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backup criado: $(basename "$BACKUP_FILE")${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo settings.json não existe, será criado${NC}"
    echo "{}" > "$CURSOR_SETTINGS"
fi

# Ler settings.json atual ou criar novo
if [ -f "$CURSOR_SETTINGS" ]; then
    # Usar node para manipular JSON de forma segura
    NODE_SCRIPT=$(cat << 'EOF'
const fs = require('fs');
const path = process.argv[1];
const settingsFile = process.argv[2];

let settings = {};
try {
    const content = fs.readFileSync(settingsFile, 'utf8');
    settings = JSON.parse(content);
} catch (e) {
    settings = {};
}

// Configuração de MCPs
const mcpServers = {
    "expo-mcp": {
        "description": "Expo MCP Server para builds iOS/Android",
        "transport": "http",
        "url": "https://mcp.expo.dev/mcp"
    },
    "context7": {
        "description": "Documentação atualizada de libraries",
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp"]
    },
    "memory-keeper": {
        "description": "Persistência de contexto entre sessões",
        "command": "npx",
        "args": ["-y", "mcp-memory-keeper"],
        "env": {
            "MCP_MEMORY_DB_PATH": ".claude/context.db"
        }
    },
    "playwright": {
        "description": "Testes visuais automatizados",
        "command": "npx",
        "args": ["-y", "@anthropic/mcp-server-playwright"]
    },
    "figma-devmode": {
        "description": "Figma Dev Mode MCP Server (local)",
        "transport": "sse",
        "url": "http://127.0.0.1:3845/sse"
    }
};

// Mesclar MCPs existentes com novos (novos têm prioridade)
if (!settings.mcpServers) {
    settings.mcpServers = {};
}

// Adicionar/atualizar cada MCP
Object.keys(mcpServers).forEach(key => {
    settings.mcpServers[key] = mcpServers[key];
});

// Configurações otimizadas para MacBook M1 8GB RAM
const optimizations = {
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.expo/**": true,
        "**/ios/Pods/**": true,
        "**/android/.gradle/**": true
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/bun.lock": true,
        "**/.expo": true
    }
};

// Mesclar otimizações
Object.keys(optimizations).forEach(key => {
    if (typeof optimizations[key] === 'object' && !Array.isArray(optimizations[key])) {
        settings[key] = { ...(settings[key] || {}), ...optimizations[key] };
    } else {
        settings[key] = optimizations[key];
    }
});

// Salvar
fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2) + '\n');
console.log('✅ Configuração salva com sucesso');
EOF
)
    
    echo "$NODE_SCRIPT" | node - "$CURSOR_SETTINGS"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ MCPs configurados com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao configurar MCPs${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Não foi possível criar/ler settings.json${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 MCPs Configurados:${NC}"
echo "  ✅ expo-mcp (HTTP)"
echo "  ✅ context7 (npx)"
echo "  ✅ memory-keeper (npx)"
echo "  ✅ playwright (npx)"
echo "  ✅ figma-devmode (SSE - requer Figma Desktop)"
echo ""
echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS OBRIGATÓRIOS:${NC}"
echo ""
echo "1. ${BLUE}Reinicie o Cursor completamente${NC} (fechar e reabrir)"
echo "   Os MCPs só estarão disponíveis após reiniciar!"
echo ""
echo "2. ${BLUE}Autentique no Expo${NC} (para Expo MCP funcionar):"
echo "   npx expo login"
echo "   ou"
echo "   eas login"
echo ""
echo "3. ${BLUE}Verifique Supabase CLI${NC} (se necessário):"
echo "   supabase login"
echo ""
echo "4. ${BLUE}Teste os MCPs${NC} após reiniciar:"
echo "   - Context7: Use mcp_Context7_resolve-library-id"
echo "   - Browser: Use mcp_cursor-browser-extension_browser_navigate"
echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "Documentação completa: docs/MCP_SETUP.md"

