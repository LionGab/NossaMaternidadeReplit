#!/bin/bash
# Limpeza de emergência - máxima liberação de RAM
# Uso: npm run optimize:emergency

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚨 Limpeza de emergência..."
echo ""

# Parar Expo/Metro
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true

# Limpar todos os caches
rm -rf .expo .metro-cache node_modules/.cache 2>/dev/null || true
rm -rf ~/.metro-cache ~/.expo/cache 2>/dev/null || true
rm -rf "$TMPDIR/metro-"* "$TMPDIR/react-"* "$TMPDIR/haste-map-"* 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

# Limpar build iOS/Android
rm -rf ios/build android/build android/.gradle 2>/dev/null || true

# macOS: purge (pede sudo)
if [[ "$(uname)" == "Darwin" ]]; then
  echo "Executando purge do sistema..."
  sudo purge 2>/dev/null || echo "   (pule se não quiser usar sudo)"
fi

echo ""
echo "✅ Limpeza de emergência concluída!"
echo "   Reinicie o Cursor e use: npm run start:memory"
