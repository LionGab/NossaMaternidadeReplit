#!/bin/bash
# Lista simuladores iOS disponíveis
# Uso: npm run simulator:list

echo "📱 Simuladores iOS disponíveis:"
echo ""
xcrun simctl list devices available | grep -i "iphone" | sed 's/^/   /'
echo ""
echo "💡 Use: npm run ios:16e ou npm run ios:17pro para rodar em um específico"
