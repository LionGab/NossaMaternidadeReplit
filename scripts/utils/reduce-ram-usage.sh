#!/bin/bash
# Reduz uso de RAM - orquestra limpezas seguras
# Uso: npm run reduce:ram

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧹 Reduzindo uso de RAM..."
echo ""

# 1. Limpeza sem sudo (sempre segura)
bash "$SCRIPT_DIR/clean-ram-no-sudo.sh"

# 2. Se macOS e modo interativo, oferecer purge
if [[ "$(uname)" == "Darwin" ]] && [ -f "$SCRIPT_DIR/../macos/memory-optimization.sh" ] && [ -t 0 ]; then
  echo ""
  read -p "Executar purge do sistema? (libera mais RAM, requer sudo) [y/N]: " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    bash "$SCRIPT_DIR/../macos/memory-optimization.sh"
  fi
fi

echo ""
echo "✅ Concluído! Reinicie o Cursor para liberar ~2GB."
echo "   npm run start:memory  → Expo com menos workers"
