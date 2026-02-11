#!/bin/bash
# Script de limpeza rápida de memória - RAM Quick Clean
# Criado: 2026-02-10
# Para MacBook M1 8GB

set -e

echo "🧹 Limpeza Rápida de Memória - MacBook 8GB"
echo "==========================================="
echo ""

# Função para exibir uso de swap
check_swap() {
    echo "📊 Status de Swap ANTES da limpeza:"
    sysctl vm.swapusage | awk '{print $NF}' | grep -oE '[0-9.]+M|[0-9.]+G' | head -1 || echo "N/A"
    echo ""
}

# Função para contar processos
count_processes() {
    local cursor_count=$(ps aux | grep -i cursor | grep -v grep | wc -l | tr -d ' ')
    local node_count=$(ps aux | grep node | grep -v grep | wc -l | tr -d ' ')
    local chrome_count=$(ps aux | grep -i chrome | grep -v grep | wc -l | tr -d ' ')
    
    echo "🔢 Processos rodando:"
    echo "   - Cursor: $cursor_count processos"
    echo "   - Node (MCP): $node_count processos"
    echo "   - Chrome: $chrome_count processos"
    echo ""
}

# 1. Status inicial
check_swap
count_processes

# 2. Matar MCP servers órfãos
echo "🔪 Matando MCP servers órfãos..."
pkill -f "context7-mcp" 2>/dev/null || echo "   ℹ️  Nenhum context7-mcp rodando"
pkill -f "playwright-mcp" 2>/dev/null || echo "   ℹ️  Nenhum playwright-mcp rodando"
pkill -f "mcp-server-sequential-thinking" 2>/dev/null || echo "   ℹ️  Nenhum sequential-thinking rodando"
pkill -f "mcp-server-github" 2>/dev/null || echo "   ℹ️  Nenhum mcp-server-github rodando"
pkill -f "react-native-debugger-mcp" 2>/dev/null || echo "   ℹ️  Nenhum react-native-debugger-mcp rodando"

sleep 2
echo ""

# 3. Contar novamente
echo "🔢 Processos APÓS limpeza de MCP:"
count_processes

# 4. Limpar memória (sem sudo - apenas informatização)
echo "💡 Para liberar memória comprimida, execute manualmente:"
echo "   sudo purge"
echo ""

# 5. Status final
echo "📊 Status de Swap APÓS limpeza:"
sysctl vm.swapusage | awk '{print $NF}' | grep -oE '[0-9.]+M|[0-9.]+G' | head -1 || echo "N/A"
echo ""

echo "✅ Limpeza rápida concluída!"
echo ""
echo "📋 Próximos passos recomendados:"
echo "   1. Execute: sudo purge (liberar memória comprimida)"
echo "   2. Se swap > 2 GB: Reinicie o Cursor"
echo "   3. Se swap > 3 GB: Reinicie o Mac"
