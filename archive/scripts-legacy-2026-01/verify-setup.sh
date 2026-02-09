#!/bin/bash

# ===========================================
# Nossa Maternidade - Script de Verificação Completa
# Verifica instalação de dependências, MCPs, autenticação, etc.
# ===========================================

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verificação Completa do Setup${NC}"
echo "=========================================="
echo ""

# Contadores
PASSED=0
FAILED=0
WARNINGS=0

# Função para verificar e reportar
check() {
    local name="$1"
    local command="$2"
    local expected="$3"
    
    echo -n "Verificando $name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        ((PASSED++))
        return 0
    else
        if [ "$expected" = "required" ]; then
            echo -e "${RED}❌${NC}"
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}⚠️${NC}"
            ((WARNINGS++))
            return 1
        fi
    fi
}

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script da raiz do projeto${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Dependências do Projeto${NC}"
echo "---------------------------"

# Verificar node_modules
check "Dependências instaladas" "[ -d 'node_modules' ]" "required"

# Verificar TypeScript
echo -n "Verificando TypeScript... "
if bun run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌${NC}"
    echo "  Execute: bun run typecheck"
    ((FAILED++))
fi

# Verificar ESLint
echo -n "Verificando ESLint... "
if bun run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC}"
    echo "  Execute: bun run lint"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}🔧 Ferramentas e CLIs${NC}"
echo "---------------------------"

# Verificar Bun
check "Bun instalado" "command -v bun" "required"

# Verificar Node.js
check "Node.js instalado" "command -v node" "required"

# Verificar Supabase CLI
check "Supabase CLI instalado" "command -v supabase" "required"

# Verificar Cursor CLI
check "Cursor CLI instalado" "command -v cursor" "optional"

# Verificar Playwright
echo -n "Verificando Playwright... "
if [ -d "$HOME/Library/Caches/ms-playwright/chromium-1200" ] || command -v playwright > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC}"
    echo "  Execute: npx playwright install chromium"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}🔐 Autenticação${NC}"
echo "---------------------------"

# Verificar Expo
echo -n "Verificando autenticação Expo... "
if npx expo whoami > /dev/null 2>&1; then
    EXPO_USER=$(npx expo whoami 2>/dev/null || echo "desconhecido")
    echo -e "${GREEN}✅ (usuário: $EXPO_USER)${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC}"
    echo "  Execute: npx expo login"
    ((WARNINGS++))
fi

# Verificar Supabase (não podemos verificar login sem interação)
echo -n "Verificando Supabase CLI... "
if supabase --version > /dev/null 2>&1; then
    SUPABASE_VERSION=$(supabase --version 2>/dev/null || echo "desconhecido")
    echo -e "${GREEN}✅ (versão: $SUPABASE_VERSION)${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌${NC}"
    ((FAILED++))
fi

echo ""
echo -e "${BLUE}⚙️  Configuração MCPs${NC}"
echo "---------------------------"

# Verificar settings.json do Cursor
CURSOR_SETTINGS="$HOME/Library/Application Support/Cursor/User/settings.json"

if [ -f "$CURSOR_SETTINGS" ]; then
    echo -n "Verificando settings.json... "
    
    # Verificar se tem mcpServers
    if grep -q "mcpServers" "$CURSOR_SETTINGS" 2>/dev/null; then
        echo -e "${GREEN}✅${NC}"
        ((PASSED++))
        
        # Verificar MCPs específicos
        echo "  MCPs configurados:"
        
        if grep -q "expo-mcp" "$CURSOR_SETTINGS" 2>/dev/null; then
            echo -e "    ${GREEN}✅${NC} expo-mcp"
            ((PASSED++))
        else
            echo -e "    ${RED}❌${NC} expo-mcp"
            ((FAILED++))
        fi
        
        if grep -q "context7" "$CURSOR_SETTINGS" 2>/dev/null; then
            echo -e "    ${GREEN}✅${NC} context7"
            ((PASSED++))
        else
            echo -e "    ${RED}❌${NC} context7"
            ((FAILED++))
        fi
        
        if grep -q "memory-keeper" "$CURSOR_SETTINGS" 2>/dev/null; then
            echo -e "    ${GREEN}✅${NC} memory-keeper"
            ((PASSED++))
        else
            echo -e "    ${RED}❌${NC} memory-keeper"
            ((FAILED++))
        fi
        
        if grep -q "playwright" "$CURSOR_SETTINGS" 2>/dev/null; then
            echo -e "    ${GREEN}✅${NC} playwright"
            ((PASSED++))
        else
            echo -e "    ${RED}❌${NC} playwright"
            ((FAILED++))
        fi
        
        if grep -q "figma-devmode" "$CURSOR_SETTINGS" 2>/dev/null; then
            echo -e "    ${GREEN}✅${NC} figma-devmode"
            ((PASSED++))
        else
            echo -e "    ${YELLOW}⚠️${NC}  figma-devmode (opcional)"
            ((WARNINGS++))
        fi
        
    else
        echo -e "${RED}❌${NC}"
        echo "  Execute: bash scripts/setup-mcps-mac.sh"
        ((FAILED++))
    fi
else
    echo -e "${RED}❌${NC} settings.json não encontrado"
    echo "  Execute: bash scripts/setup-mcps-mac.sh"
    ((FAILED++))
fi

echo ""
echo -e "${BLUE}📊 Resumo${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Passou:${NC} $PASSED"
echo -e "${YELLOW}⚠️  Avisos:${NC} $WARNINGS"
echo -e "${RED}❌ Falhou:${NC} $FAILED"
echo "=========================================="
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 Tudo configurado perfeitamente!${NC}"
        echo ""
        echo -e "${BLUE}⚠️  LEMBRE-SE:${NC}"
        echo "  Reinicie o Cursor completamente para os MCPs funcionarem!"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Configuração completa com alguns avisos${NC}"
        echo "  Revise os avisos acima se necessário"
        exit 0
    fi
else
    echo -e "${RED}❌ Algumas verificações falharam${NC}"
    echo "  Revise os erros acima e corrija antes de continuar"
    exit 1
fi

