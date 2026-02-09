#!/bin/bash
# Limpeza automática de caches
# Uso: bash scripts/macos/cleanup-cache.sh

set -e

echo "🧹 Limpando caches do sistema..."

# Cache do sistema (cuidado: pode limpar caches importantes)
echo "🗑️  Limpando cache do sistema (apenas temporários)..."
rm -rf ~/Library/Caches/com.apple.* 2>/dev/null || true

# Cache do Cursor
echo "⌨️  Limpando cache do Cursor..."
rm -rf ~/Library/Application\ Support/Cursor/Cache/* 2>/dev/null || true
rm -rf ~/Library/Application\ Support/Cursor/CachedData/* 2>/dev/null || true

# Cache do Node
echo "📦 Limpando cache do Node..."
rm -rf ~/.npm/_cacache 2>/dev/null || true
rm -rf ~/.node-gyp 2>/dev/null || true

# Cache do Metro
echo "🚇 Limpando cache do Metro..."
rm -rf ~/.metro-cache 2>/dev/null || true
rm -rf .metro-cache 2>/dev/null || true

# Cache do Expo
echo "📱 Limpando cache do Expo..."
rm -rf ~/.expo 2>/dev/null || true

# Logs antigos (mais de 7 dias)
echo "📝 Removendo logs antigos..."
find ~/Library/Logs -name "*.log" -mtime +7 -delete 2>/dev/null || true

# Cache do Homebrew
if command -v brew &> /dev/null; then
  echo "🍺 Limpando cache do Homebrew..."
  brew cleanup --prune=all
fi

echo "✅ Limpeza de caches concluída!"
