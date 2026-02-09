#!/bin/bash

# Script para verificar extensões do Cursor
# Ajuda a identificar extensões que podem ser desabilitadas para economizar memória

echo "🔍 Verificando extensões do Cursor..."
echo ""

# Verificar se cursor CLI está disponível
if ! command -v cursor &> /dev/null; then
    echo "❌ CLI do Cursor não está configurado"
    echo "   Execute: bash scripts/setup-cursor-cli.sh"
    exit 1
fi

echo "📦 Extensões instaladas:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cursor --list-extensions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "💡 Dicas para otimização:"
echo ""
echo "1. Abra o Extension Monitor no Cursor:"
echo "   Cmd + Shift + P → Developer: Open Extension Monitor"
echo ""
echo "2. Ative o Beta (requer restart):"
echo "   Settings > Cursor Settings > Beta > Extension RPC Tracer"
echo ""
echo "3. Identifique extensões pesadas (>50MB):"
echo "   - Procure por extensões usando muita memória"
echo "   - Verifique uso de CPU"
echo ""
echo "4. Desabilite extensões não essenciais:"
echo "   - Temas não utilizados"
echo "   - Formatação duplicada"
echo "   - Linting redundante"
echo ""
echo "5. Teste sem extensões:"
echo "   cursor --disable-extensions"
echo ""
echo "📚 Mais informações: docs/CURSOR_MEMORY_OPTIMIZATION.md"

