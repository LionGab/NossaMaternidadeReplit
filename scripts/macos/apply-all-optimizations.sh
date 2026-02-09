#!/bin/bash
# Aplica todas as otimizações de uma vez
# Uso: bash scripts/macos/apply-all-optimizations.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🚀 Aplicando todas as otimizações..."
echo ""

# 1. Otimização de memória
echo "1️⃣  Otimizando memória..."
bash "$SCRIPT_DIR/memory-optimization.sh"
echo ""

# 2. Otimização do sistema
echo "2️⃣  Otimizando sistema macOS..."
bash "$SCRIPT_DIR/system-optimization.sh"
echo ""

# 3. Limpeza de caches
echo "3️⃣  Limpando caches..."
bash "$SCRIPT_DIR/cleanup-cache.sh"
echo ""

# 4. Otimização de DNS
echo "4️⃣  Otimizando DNS..."
bash "$SCRIPT_DIR/optimize-dns.sh"
echo ""

# 5. Verificar memória atual
echo "5️⃣  Verificando status de memória..."
bash "$SCRIPT_DIR/monitor-memory.sh"
echo ""

echo "✅ Todas as otimizações aplicadas!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Reinicie o Cursor IDE"
echo "   2. Execute 'bash scripts/macos/monitor-memory.sh --daemon' para monitoramento contínuo"
echo "   3. Configure Launch Agent (opcional):"
echo "      cp scripts/macos/com.nossamaternidade.optimization.plist ~/Library/LaunchAgents/"
echo "      # Edite o arquivo e substitua __PROJECT_ROOT__ e __HOME__"
echo "      launchctl load ~/Library/LaunchAgents/com.nossamaternidade.optimization.plist"
