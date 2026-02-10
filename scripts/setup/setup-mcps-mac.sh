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
const settingsFile = process.argv[2];

function stripJsonComments(input) {
    let out = '';
    let inString = false;
    let quote = '"';
    let escaped = false;
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = 0; i < input.length; i++) {
        const c = input[i];
        const n = input[i + 1];

        if (inLineComment) {
            if (c === '\n') {
                inLineComment = false;
                out += c;
            }
            continue;
        }

        if (inBlockComment) {
            if (c === '*' && n === '/') {
                inBlockComment = false;
                i++;
            } else if (c === '\n') {
                // Preserve newlines to keep error locations roughly stable
                out += '\n';
            }
            continue;
        }

        if (inString) {
            out += c;
            if (escaped) {
                escaped = false;
            } else if (c === '\\\\') {
                escaped = true;
            } else if (c === quote) {
                inString = false;
            }
            continue;
        }

        if (c === '"' || c === "'") {
            inString = true;
            quote = c;
            out += c;
            continue;
        }

        if (c === '/' && n === '/') {
            inLineComment = true;
            i++;
            continue;
        }

        if (c === '/' && n === '*') {
            inBlockComment = true;
            i++;
            continue;
        }

        out += c;
    }

    return out;
}

function removeTrailingCommas(input) {
    let out = '';
    let inString = false;
    let quote = '"';
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
        const c = input[i];

        if (inString) {
            out += c;
            if (escaped) {
                escaped = false;
            } else if (c === '\\\\') {
                escaped = true;
            } else if (c === quote) {
                inString = false;
            }
            continue;
        }

        if (c === '"' || c === "'") {
            inString = true;
            quote = c;
            out += c;
            continue;
        }

        if (c === ',') {
            // If the next non-whitespace char closes the container, drop the comma.
            let j = i + 1;
            while (j < input.length && /\\s/.test(input[j])) j++;
            if (j < input.length && (input[j] === '}' || input[j] === ']')) {
                continue;
            }
        }

        out += c;
    }

    return out;
}

function parseJsonOrJsonc(content, fileLabel) {
    try {
        return JSON.parse(content);
    } catch (e1) {
        try {
            const stripped = stripJsonComments(content);
            const cleaned = removeTrailingCommas(stripped);
            return JSON.parse(cleaned);
        } catch (e2) {
            const msg = e2 && e2.message ? e2.message : String(e2);
            console.error(`❌ settings.json inválido (${fileLabel}). Corrija o JSON/JSONC e rode o script novamente.`);
            console.error(`   Detalhe: ${msg}`);
            process.exit(1);
        }
    }
}

let settings = {};
try {
    const content = fs.readFileSync(settingsFile, 'utf8');
    if (content.trim().length > 0) {
        settings = parseJsonOrJsonc(content, settingsFile);
    }
} catch (e) {
    settings = {};
}

// Configuração de MCPs (espelha .claude/mcp-config.json)
const mcpServers = {
    "expo": {
        "description": "Expo MCP — EAS Build, submit, docs",
        "transport": "http",
        "url": "https://mcp.expo.dev/mcp"
    },
    "xcode": {
        "transport": "stdio",
        "description": "Xcode — simuladores e ferramentas iOS",
        "command": "npx",
        "args": ["-y", "xcodebuildmcp@latest"]
    },
    "react-native-guide": {
        "transport": "stdio",
        "description": "Guia MCP para fluxos React Native",
        "command": "npx",
        "args": ["-y", "@mrnitro360/react-native-mcp-guide@1.1.0"]
    },
    "rn-debugger": {
        "transport": "stdio",
        "description": "Depuração MCP para React Native",
        "command": "npx",
        "args": ["-y", "@twodoorsdev/react-native-debugger-mcp"]
    },
    "sequential-thinking": {
        "transport": "stdio",
        "description": "Raciocínio sequencial para tarefas complexas",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "context7": {
        "transport": "stdio",
        "description": "Documentação atualizada de bibliotecas",
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "github-readonly": {
        "transport": "stdio",
        "description": "GitHub MCP em modo read-only por padrão",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "${COPILOT_MCP_GITHUB_TOKEN}"
        }
    },
    "memory-keeper": {
        "transport": "stdio",
        "description": "Persistência de contexto entre sessões",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-memory"],
        "env": {
            "MCP_MEMORY_DB_PATH": ".claude/context.db"
        }
    },
    "playwright": {
        "transport": "stdio",
        "description": "Automação de browser para testes visuais",
        "command": "npx",
        "args": ["-y", "@playwright/mcp@latest"]
    },
    "figma-devmode": {
        "description": "Figma Dev Mode MCP (opcional)",
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
echo "  ✅ expo (HTTP)"
echo "  ✅ xcode (npx)"
echo "  ✅ react-native-guide (npx)"
echo "  ✅ rn-debugger (npx)"
echo "  ✅ sequential-thinking (npx)"
echo "  ✅ context7 (npx)"
echo "  ✅ github-readonly (npx)"
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
echo "3. ${BLUE}Configure token GitHub read-only${NC}:"
echo "   export COPILOT_MCP_GITHUB_TOKEN=<seu_token_read_only>"
echo ""
echo "4. ${BLUE}Teste os MCPs${NC} após reiniciar:"
echo "   - Context7: execute um lookup de documentação"
echo "   - Sequential Thinking: execute um plano curto"
echo "   - GitHub (read-only): faça uma leitura de issue/PR"
echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "Documentação completa: docs/setup/MCP_SETUP.md"
