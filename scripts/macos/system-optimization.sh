#!/bin/bash
# Otimizações do sistema macOS para performance
# Uso: bash scripts/macos/system-optimization.sh

set -e

echo "⚙️  Aplicando otimizações do sistema macOS..."

# Desabilitar animações (economiza GPU)
echo "🎬 Desabilitando animações..."
defaults write com.apple.dock expose-animation-duration -float 0.1
defaults write NSGlobalDomain NSWindowResizeTime -float 0.001

# Reduzir transparências (economiza GPU)
echo "🎨 Reduzindo transparências..."
defaults write com.apple.universalaccess reduceTransparency -bool true

# Desabilitar Dashboard
echo "📊 Desabilitando Dashboard..."
defaults write com.apple.dashboard mcx-disabled -bool true

# Desabilitar Spotlight indexing em diretórios de desenvolvimento
echo "🔍 Otimizando Spotlight..."
USER_HOME=$(eval echo ~$USER)
sudo mdutil -i off "$USER_HOME/Documents" 2>/dev/null || true
sudo mdutil -i off "$USER_HOME/Desktop" 2>/dev/null || true

# Otimizar energia para performance
echo "🔋 Otimizando gerenciamento de energia..."
sudo pmset -a highstandbythreshold 0 2>/dev/null || echo "⚠️  Requer sudo para otimização de energia"
sudo pmset -a standbydelay 0 2>/dev/null || true

# Aplicar mudanças
echo "🔄 Reiniciando Dock..."
killall Dock 2>/dev/null || true

echo "✅ Otimizações do sistema aplicadas!"
echo "💡 Algumas mudanças requerem logout/login para ter efeito completo"
