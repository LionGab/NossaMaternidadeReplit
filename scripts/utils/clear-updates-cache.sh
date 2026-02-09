#!/bin/bash
# Script para limpar cache de updates do Expo
# Útil quando app crasha por causa de update OTA corrompido

set -e

echo "🧹 Limpando cache de updates do Expo..."

# Limpar cache do Metro
if [ -d ".expo" ]; then
  echo "  → Removendo .expo/"
  rm -rf .expo
fi

# Limpar cache do iOS (via Xcode)
echo "  → Limpando cache do iOS..."
if [ -d "ios/build" ]; then
  rm -rf ios/build
  echo "    ✓ ios/build removido"
fi

# Limpar DerivedData (cache do Xcode)
if [ -d "$HOME/Library/Developer/Xcode/DerivedData" ]; then
  echo "  → Limpando DerivedData do Xcode..."
  find "$HOME/Library/Developer/Xcode/DerivedData" -name "*nossamaternidade*" -type d -exec rm -rf {} + 2>/dev/null || true
  echo "    ✓ DerivedData limpo"
fi

# Limpar node_modules/.cache
if [ -d "node_modules/.cache" ]; then
  echo "  → Removendo node_modules/.cache"
  rm -rf node_modules/.cache
fi

echo ""
echo "✅ Cache limpo!"
echo ""
echo "📱 PRÓXIMOS PASSOS:"
echo "   1. Desinstale o app do dispositivo/TestFlight"
echo "   2. Faça um novo build: npm run build:preview:ios"
echo "   3. Reinstale o app"
echo ""
