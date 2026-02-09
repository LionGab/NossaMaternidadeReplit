#!/bin/bash
# Otimizações de memória para macOS M1 8GB
# Uso: bash scripts/macos/memory-optimization.sh

set -e

echo "🧹 Otimizando memória do sistema..."

# Verificar swap atual
echo "📊 Status de swap atual:"
vm_stat | grep -E "Pages free|Pages active|Pages inactive|Pages speculative"

# Limpar caches do sistema
echo "🗑️  Limpando caches do sistema..."
sudo purge

# Limpar cache do Homebrew
if command -v brew &> /dev/null; then
  echo "🍺 Limpando cache do Homebrew..."
  brew cleanup --prune=all
fi

# Limpar cache do npm
if command -v npm &> /dev/null; then
  echo "📦 Limpando cache do npm..."
  npm cache clean --force
fi

# Limpar cache do Metro (React Native)
echo "🚇 Limpando cache do Metro..."
rm -rf ~/.metro-cache 2>/dev/null || true
rm -rf .metro-cache 2>/dev/null || true

# Limpar cache do Expo
echo "📱 Limpando cache do Expo..."
rm -rf ~/.expo 2>/dev/null || true

# Limpar cache do Cursor
echo "⌨️  Limpando cache do Cursor..."
rm -rf ~/Library/Application\ Support/Cursor/Cache/* 2>/dev/null || true
rm -rf ~/Library/Application\ Support/Cursor/CachedData/* 2>/dev/null || true

echo "✅ Otimização de memória concluída!"
