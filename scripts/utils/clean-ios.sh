#!/bin/bash
# Script para limpar build artifacts do iOS (pode liberar ~1GB)
# Uso: npm run clean:ios
# ATENÇÃO: Você precisará rodar 'pod install' depois se quiser buildar iOS novamente

set -e

echo "🧹 Limpeza de Build Artifacts iOS"
echo "=================================="
echo ""

# Verificar tamanho atual
if [ -d "ios/Pods" ]; then
  PODS_SIZE=$(du -sh ios/Pods 2>/dev/null | awk '{print $1}')
  echo "📊 Tamanho atual de ios/Pods: $PODS_SIZE"
fi

if [ -d "ios/build" ]; then
  BUILD_SIZE=$(du -sh ios/build 2>/dev/null | awk '{print $1}')
  echo "📊 Tamanho atual de ios/build: $BUILD_SIZE"
fi

echo ""
echo "⚠️  Este script vai remover:"
echo "   - ios/Pods/ (dependências CocoaPods - ~960MB)"
echo "   - ios/build/ (artifacts de build - ~1.7MB)"
echo ""
echo "💡 Você pode reinstalar depois com:"
echo "   cd ios && pod install && cd .."
echo ""

read -p "Continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Cancelado."
  exit 0
fi

echo ""
echo "🗑️  Removendo ios/Pods..."
rm -rf ios/Pods 2>/dev/null || true

echo "🗑️  Removendo ios/build..."
rm -rf ios/build 2>/dev/null || true

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "📝 Para reinstalar dependências iOS:"
echo "   cd ios && pod install && cd .."
echo ""
echo "💡 Dica: Se não estiver desenvolvendo para iOS, você pode manter isso limpo"
