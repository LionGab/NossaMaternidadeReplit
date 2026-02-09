#!/bin/bash
# Script para corrigir problemas de CocoaPods no iOS
# Uso: bash scripts/fix-ios-pods.sh

set -e

echo "🔧 Corrigindo problemas de CocoaPods..."

cd "$(dirname "$0")/.."

# Limpar cache do CocoaPods
echo "🧹 Limpando cache do CocoaPods..."
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/.cocoapods/repos/trunk

# Limpar Pods e Podfile.lock
echo "🗑️  Removendo Pods e Podfile.lock..."
cd ios
rm -rf Pods
rm -f Podfile.lock

# Atualizar repositório de specs (com retry)
echo "📦 Atualizando repositório de specs do CocoaPods..."
if ! pod repo update 2>/dev/null; then
  echo "⚠️  Tentando atualizar repositório alternativo..."
  pod repo update trunk || echo "⚠️  Falha ao atualizar (pode ser problema de rede, continuando...)"
fi

# Instalar pods com --repo-update
echo "📥 Instalando pods (isso pode demorar alguns minutos)..."
if pod install --repo-update; then
  echo "✅ CocoaPods corrigido!"
  echo ""
  echo "Agora você pode executar: npx expo run:ios"
else
  echo "❌ Falha na instalação dos pods"
  echo ""
  echo "Tente executar manualmente:"
  echo "  cd ios"
  echo "  pod install --repo-update"
  echo ""
  echo "Se o problema persistir, pode ser necessário:"
  echo "  1. Verificar conexão com internet"
  echo "  2. Atualizar CocoaPods: sudo gem install cocoapods"
  echo "  3. Verificar se react-native-ios-context-menu é compatível com React Native 0.81"
  exit 1
fi

