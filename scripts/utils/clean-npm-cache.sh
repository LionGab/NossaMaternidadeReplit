#!/bin/bash
# Script para limpar cache do npm (pode liberar 1-2GB)
# Uso: npm run clean:npm-cache

set -e

echo "🧹 Limpeza de Cache do npm"
echo "=========================="
echo ""

# Verificar tamanho atual do cache
if [ -d "$HOME/.npm" ]; then
  CURRENT_SIZE=$(du -sh "$HOME/.npm" 2>/dev/null | awk '{print $1}')
  echo "📊 Tamanho atual do cache: $CURRENT_SIZE"
  echo ""
fi

# Limpar cache do npm
if command -v npm &> /dev/null; then
  echo "🗑️  Limpando cache do npm..."
  npm cache clean --force

  # Verificar tamanho após limpeza
  if [ -d "$HOME/.npm" ]; then
    NEW_SIZE=$(du -sh "$HOME/.npm" 2>/dev/null | awk '{print $1}')
    echo "✅ Cache limpo! Novo tamanho: $NEW_SIZE"
  else
    echo "✅ Cache removido completamente"
  fi
else
  echo "⚠️  npm não encontrado no PATH"
fi

echo ""
echo "💡 Dica: O cache será reconstruído conforme você instala pacotes"
echo "   Isso é normal e ajuda a acelerar instalações futuras"
