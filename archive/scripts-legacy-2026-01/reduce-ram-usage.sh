#!/bin/bash
# Script para reduzir uso de RAM no MacBook M1 8GB
# Foca em processos que podem ser otimizados ou fechados
# Uso: npm run reduce:ram

set -e

echo "🧠 Redução de Uso de RAM - MacBook M1 8GB"
echo "==========================================="
echo ""

# Verificar swap atual
SWAP_INFO=$(sysctl vm.swapusage 2>/dev/null || echo "")
if [ -n "$SWAP_INFO" ]; then
  SWAP_USED_RAW=$(echo "$SWAP_INFO" | awk '{print $7}' | sed 's/M//')
  SWAP_TOTAL_RAW=$(echo "$SWAP_INFO" | awk '{print $9}' | sed 's/M//')
  # Converter para inteiro (remover decimais)
  SWAP_USED=${SWAP_USED_RAW%.*}
  SWAP_TOTAL=${SWAP_TOTAL_RAW%.*}

  echo "📊 Estado Atual da Memória"
  echo "---------------------------"
  echo "   Swap usado: ${SWAP_USED}MB / ${SWAP_TOTAL}MB"
  echo ""

  if [ "$SWAP_USED" -gt 3000 ]; then
    echo "🚨 CRÍTICO: Swap > 3GB - Sistema muito lento!"
    echo "   Ação imediata: Reinicie o Cursor IDE ou o Mac"
    echo ""
  elif [ "$SWAP_USED" -gt 2000 ]; then
    echo "⚠️  ALERTA: Swap > 2GB - Considere reiniciar Cursor"
    echo ""
  elif [ "$SWAP_USED" -gt 1000 ]; then
    echo "⚠️  ALERTA: Swap > 1GB - Sistema pode estar lento"
    echo ""
  else
    echo "✅ Swap aceitável (< 1GB)"
    echo ""
  fi
else
  echo "⚠️  Não foi possível verificar swap"
  echo ""
fi

echo "🔍 Processos Consumindo Mais RAM"
echo "---------------------------------"
ps aux | awk '{print $2, $4, $11}' | sort -k2 -rn | head -10 | awk '{printf "   PID: %-6s %5s%% %s\n", $1, $2, $3}'

echo ""
echo "💡 Ações Recomendadas (Manual)"
echo "-------------------------------"
echo ""
echo "1. 🚫 FECHAR PROCESSOS DESNECESSÁRIOS:"
echo "   - Google Chrome (270MB+)"
echo "   - Apps não utilizados"
echo "   - Abas não utilizadas no Cursor"
echo ""
echo "2. 🔄 REINICIAR CURSOR:"
echo "   - Fecha todos os processos Cursor Helper"
echo "   - Libera ~2GB de RAM"
echo "   - Comando: killall 'Cursor Helper' (cuidado!)"
echo ""
echo "3. 🛑 PARAR PROCESSOS DO PROJETO:"
echo "   - Expo dev server (node expo start)"
echo "   - Simulador iOS (se não estiver usando)"
echo ""

# Verificar processos específicos
echo "📋 Processos do Projeto"
echo "-----------------------"

# Expo dev server
EXPO_PID=$(ps aux | grep "expo start" | grep -v grep | awk '{print $2}' | head -1)
if [ -n "$EXPO_PID" ]; then
  EXPO_MEM=$(ps -p "$EXPO_PID" -o rss= | awk '{printf "%.0f", $1/1024}')
  echo "   ✅ Expo dev server rodando (PID: $EXPO_PID, ~${EXPO_MEM}MB)"
  echo "      Para parar: kill $EXPO_PID ou Ctrl+C no terminal"
else
  echo "   ℹ️  Expo dev server não está rodando"
fi

# Simulador iOS
SIMULATOR_PID=$(ps aux | grep "NossaMaternidade.app" | grep -v grep | awk '{print $2}' | head -1)
if [ -n "$SIMULATOR_PID" ]; then
  SIM_MEM=$(ps -p "$SIMULATOR_PID" -o rss= | awk '{printf "%.0f", $1/1024}')
  echo "   ✅ Simulador iOS rodando (PID: $SIMULATOR_PID, ~${SIM_MEM}MB)"
  echo "      Para parar: Feche o simulador ou kill $SIMULATOR_PID"
else
  echo "   ℹ️  Simulador iOS não está rodando"
fi

# Cursor Helpers
CURSOR_HELPERS=$(ps aux | grep "Cursor Helper" | grep -v grep | wc -l | tr -d ' ')
if [ "$CURSOR_HELPERS" -gt 0 ]; then
  echo "   ⚠️  $CURSOR_HELPERS processos Cursor Helper ativos"
  echo "      Estes processos consomem muita RAM"
  echo "      Solução: Reinicie o Cursor IDE"
else
  echo "   ✅ Nenhum Cursor Helper ativo"
fi

echo ""
echo "🎯 Otimizações Automáticas"
echo "--------------------------"

# Limpar memória comprimida (purge)
echo "💾 Limpando memória comprimida do sistema..."
if command -v purge &> /dev/null; then
  echo "   Executando: sudo purge"
  echo "   ⚠️  Requer senha de administrador"
  read -p "   Executar purge agora? (s/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    sudo purge
    echo "   ✅ Memória limpa"
  else
    echo "   ⏭️  Pulando purge"
  fi
else
  echo "   ⚠️  Comando purge não disponível"
fi

echo ""
echo "📝 Recomendações Finais"
echo "-----------------------"
echo ""
echo "✅ AÇÕES IMEDIATAS:"
echo "   1. Feche o Google Chrome (se não estiver usando)"
echo "   2. Feche abas não utilizadas no Cursor"
echo "   3. Pare o Expo dev server se não estiver desenvolvendo agora"
echo "   4. Feche o simulador iOS se não estiver testando"
echo ""
echo "🔄 SE AINDA ESTIVER LENTO:"
echo "   1. Reinicie o Cursor IDE (libera ~2GB)"
echo "   2. Execute: sudo purge (limpa memória comprimida)"
echo "   3. Feche outros apps pesados (Slack, Discord, etc.)"
echo ""
echo "💡 DICA: Com 8GB RAM, mantenha apenas:"
echo "   - Cursor IDE"
echo "   - Terminal"
echo "   - Expo dev server (quando desenvolvendo)"
echo "   - Simulador iOS (quando testando)"
echo ""
echo "   Evite: Chrome + Slack + Discord + outros apps pesados simultaneamente"
