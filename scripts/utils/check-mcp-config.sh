#!/bin/bash

# Script de Verificação de Configuração MCP
# Nossa Maternidade - Validação de servidores MCP

echo "🔍 Verificando configuração MCP..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de verificações
PASSED=0
FAILED=0
WARNINGS=0

MCP_CONFIG=".claude/mcp-config.json"

# Função para verificar arquivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2 existe"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $2 NÃO existe"
        ((FAILED++))
        return 1
    fi
}

# Função para validar JSON
validate_json() {
    if python3 -m json.tool "$1" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} JSON válido"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} JSON inválido"
        echo "   Erro: $(python3 -m json.tool "$1" 2>&1 | head -1)"
        ((FAILED++))
        return 1
    fi
}

# Função para verificar servidor HTTP/SSE
check_server() {
    local url=$1
    local name=$2

    if curl -s --connect-timeout 2 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name está acessível"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠️${NC}  $name não está acessível (pode estar offline)"
        ((WARNINGS++))
        return 1
    fi
}

# Função para verificar processo
check_process() {
    local process=$1
    local name=$2

    if pgrep -f "$process" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name está rodando"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠️${NC}  $name não está rodando"
        ((WARNINGS++))
        return 1
    fi
}

echo "📁 Verificando arquivo de configuração..."
echo ""

# Verificar se o arquivo existe
if ! check_file "$MCP_CONFIG" "Arquivo mcp-config.json"; then
    echo ""
    echo -e "${RED}❌ Arquivo de configuração não encontrado!${NC}"
    exit 1
fi

# Validar JSON
validate_json "$MCP_CONFIG"

echo ""
echo "🔧 Verificando servidores MCP configurados..."
echo ""

# Ler servidores do JSON (usando jq se disponível, senão grep)
if command -v jq &> /dev/null; then
    # Usar jq para parsear JSON
    SERVERS=$(jq -r '.mcpServers | keys[]' "$MCP_CONFIG" 2>/dev/null)

    for server in $SERVERS; do
        echo -e "${BLUE}📡${NC} Verificando: $server"

        # Obter tipo de transporte
        transport=$(jq -r ".mcpServers[\"$server\"].transport // \"unknown\"" "$MCP_CONFIG" 2>/dev/null)
        status=$(jq -r ".mcpServers[\"$server\"].status // \"unknown\"" "$MCP_CONFIG" 2>/dev/null)

        case "$transport" in
            "http"|"sse")
                url=$(jq -r ".mcpServers[\"$server\"].url // \"\"" "$MCP_CONFIG" 2>/dev/null)
                if [ -n "$url" ]; then
                    check_server "$url" "$server"
                else
                    echo -e "${YELLOW}⚠️${NC}  URL não configurada"
                    ((WARNINGS++))
                fi
                ;;
            "stdio")
                command=$(jq -r ".mcpServers[\"$server\"].command // \"\"" "$MCP_CONFIG" 2>/dev/null)
                if [ -n "$command" ]; then
                    echo -e "${GREEN}✅${NC} $server configurado (STDIO)"
                    ((PASSED++))
                else
                    echo -e "${RED}❌${NC} Comando não configurado"
                    ((FAILED++))
                fi
                ;;
            *)
                if [ "$status" != "unknown" ] && [ "$status" != "null" ]; then
                    echo -e "${GREEN}✅${NC} $server: $status"
                    ((PASSED++))
                else
                    echo -e "${YELLOW}ℹ️${NC}  $server: configuração manual necessária"
                    ((WARNINGS++))
                fi
                ;;
        esac
        echo ""
    done
else
    # Fallback: usar grep para detectar servidores
    echo -e "${YELLOW}⚠️${NC}  jq não instalado, usando verificação básica"
    echo ""

    # Verificar servidores conhecidos
    if grep -q "figma-devmode" "$MCP_CONFIG"; then
        echo -e "${BLUE}📡${NC} Figma DevMode"
        check_server "http://127.0.0.1:3845/sse" "Figma DevMode"
        echo ""
    fi

    if grep -q "expo-mcp" "$MCP_CONFIG"; then
        echo -e "${BLUE}📡${NC} Expo MCP"
        check_server "https://mcp.expo.dev/mcp" "Expo MCP"
        echo ""
    fi

    if grep -q "filesystem" "$MCP_CONFIG"; then
        echo -e "${BLUE}📡${NC} Filesystem MCP"
        echo -e "${GREEN}✅${NC} Filesystem MCP configurado (STDIO)"
        ((PASSED++))
        echo ""
    fi
fi

echo ""
echo "🔍 Verificações adicionais..."
echo ""

# Verificar se Figma está rodando (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if pgrep -f "Figma" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Figma Desktop está rodando"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC}  Figma Desktop não está rodando (necessário para Figma MCP)"
        ((WARNINGS++))
    fi
fi

# Verificar se npx está disponível (necessário para alguns MCPs)
if command -v npx &> /dev/null; then
    echo -e "${GREEN}✅${NC} npx disponível"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} npx não encontrado (necessário para alguns MCPs)"
    ((FAILED++))
fi

# Verificar se Node.js está disponível
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅${NC} Node.js disponível ($NODE_VERSION)"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Node.js não encontrado"
    ((FAILED++))
fi

echo ""
echo "📊 Resumo:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Passou:${NC} $PASSED"
echo -e "${RED}❌ Falhou:${NC} $FAILED"
echo -e "${YELLOW}⚠️  Avisos:${NC} $WARNINGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Comandos úteis
echo "💡 Comandos úteis:"
echo ""
echo "  Validar JSON:"
echo "    cat $MCP_CONFIG | python3 -m json.tool"
echo ""
echo "  Testar Filesystem MCP Inspector:"
echo "    npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/lion/Documents/Lion/NossaMaternidade"
echo ""
echo "  Verificar Figma MCP:"
echo "    curl http://127.0.0.1:3845/sse"
echo ""

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Configuração MCP está perfeita!${NC}"
    exit 0
elif [ $FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Configuração OK, mas alguns avisos precisam de atenção.${NC}"
    exit 0
else
    echo -e "${RED}❌ Algumas configurações precisam ser corrigidas.${NC}"
    echo ""
    echo "📖 Consulte: docs/MCP_CONFIGURACAO_COMPLETA.md"
    exit 1
fi
