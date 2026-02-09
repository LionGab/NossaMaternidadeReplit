#!/bin/bash

# Script de Verificação de Configurações do Cursor
# Para MacBook M1 8GB RAM

echo "🔍 Verificando configurações do Cursor..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de verificações
PASSED=0
FAILED=0

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

# Função para verificar configuração no arquivo
check_config() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3 configurado"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $3 NÃO configurado"
        ((FAILED++))
        return 1
    fi
}

echo "📁 Verificando arquivos de configuração..."
echo ""

# Verificar .cursorrules
check_file ".cursorrules" "Arquivo .cursorrules"

# Verificar .vscode/settings.json
check_file ".vscode/settings.json" "Arquivo .vscode/settings.json"

echo ""
echo "⚙️  Verificando configurações específicas..."
echo ""

# Verificar configurações no settings.json
if [ -f ".vscode/settings.json" ]; then
    check_config ".vscode/settings.json" "disableHttp2" "HTTP/2 desabilitado"
    check_config ".vscode/settings.json" "maxTsServerMemory" "Limite de memória TypeScript"
    check_config ".vscode/settings.json" "watcherExclude" "File watcher otimizado"
    check_config ".vscode/settings.json" "minimap.enabled.*false" "Minimap desabilitado"
fi

echo ""
echo "💾 Verificando uso de recursos do sistema..."
echo ""

# Verificar espaço em disco
DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}' | sed 's/[^0-9]//g')
if [ "$DISK_SPACE" -gt 20 ]; then
    echo -e "${GREEN}✅${NC} Espaço em disco suficiente (>20GB livre)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC}  Pouco espaço em disco (<20GB livre). Recomendado: >20GB"
    ((FAILED++))
fi

# Verificar CLI do Cursor
if command -v cursor &> /dev/null; then
    echo -e "${GREEN}✅${NC} CLI do Cursor configurado (cursor command disponível)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC}  CLI do Cursor não configurado"
    echo "   Execute: bash scripts/setup-cursor-cli.sh"
fi

# Verificar processos do Cursor (pode falhar em sandbox)
if command -v ps &> /dev/null; then
    CURSOR_PROCESSES=$(ps aux 2>/dev/null | grep -i "cursor" | grep -v grep | wc -l | tr -d ' ' || echo "0")
    if [ "$CURSOR_PROCESSES" -gt 0 ] 2>/dev/null; then
        echo -e "${GREEN}✅${NC} Cursor está em execução ($CURSOR_PROCESSES processo(s))"
        ((PASSED++))
    else
        echo -e "${YELLOW}ℹ️${NC}  Cursor não está em execução (ou não foi possível verificar)"
    fi
fi

echo ""
echo "📊 Resumo:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Passou:${NC} $PASSED"
echo -e "${RED}❌ Falhou:${NC} $FAILED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Todas as configurações estão corretas!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Algumas configurações precisam de atenção.${NC}"
    echo ""
    echo "📖 Consulte: docs/CURSOR_MACBOOK_M1_SETUP.md"
    exit 1
fi

