#!/bin/bash
# Reseta simulador iOS (apaga conteúdo e configurações)
# Uso: npm run simulator:reset [nome_do_simulador]

SIMULATOR_NAME=${1:-""}

if [ -z "$SIMULATOR_NAME" ]; then
  # Usar primeiro iPhone disponível
  SIMULATOR_NAME=$(xcrun simctl list devices available | grep -i "iphone" | head -1 | awk -F'[()]' '{print $1}' | xargs)
fi

if [ -z "$SIMULATOR_NAME" ]; then
  echo "❌ Nenhum simulador encontrado"
  exit 1
fi

echo "🔄 Resetando simulador: $SIMULATOR_NAME"
xcrun simctl erase "$SIMULATOR_NAME"
echo "✅ Simulador resetado"
