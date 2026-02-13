#!/bin/bash
# Otimiza memória do Cursor IDE
# Uso: npm run optimize:cursor

set -e

echo "⌨️  Otimizando Cursor IDE..."
echo ""

# Limpar caches do Cursor (macOS)
if [[ "$(uname)" == "Darwin" ]]; then
  CURSOR_CACHE="$HOME/Library/Application Support/Cursor"
  if [ -d "$CURSOR_CACHE" ]; then
    echo "🗑️  Limpando cache do Cursor..."
    rm -rf "$CURSOR_CACHE/Cache"/* 2>/dev/null || true
    rm -rf "$CURSOR_CACHE/CachedData"/* 2>/dev/null || true
    rm -rf "$CURSOR_CACHE/Code Cache"/* 2>/dev/null || true
    echo "✅ Cache do Cursor limpo"
  fi
fi

# Limpar caches do projeto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"
rm -rf .expo .metro-cache node_modules/.cache 2>/dev/null || true
rm -rf ~/.metro-cache 2>/dev/null || true

echo ""
echo "✅ Concluído!"
echo ""
echo "📝 Para liberar ~2GB:"
echo "   1. Salve todos os arquivos (Cmd+S)"
echo "   2. Feche o Cursor completamente"
echo "   3. Reabra o Cursor"
echo ""
echo "   Use npm run start:memory para Expo com menos workers"
