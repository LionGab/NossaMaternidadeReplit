#!/bin/bash
# Limpeza de RAM SEM precisar de sudo
# Foca em ações que você pode fazer sem senha administrativa
# Uso: npm run clean:ram-no-sudo

set -e

echo "🧹 Limpeza de RAM (Sem Sudo)"
echo "============================="
echo ""
echo "✅ Este script faz apenas ações que NÃO requerem senha:"
echo "   - Limpar caches do projeto"
echo "   - Parar processos do projeto"
echo "   - Limpar caches de apps do usuário"
echo "   - Sugerir fechamento de apps pesados"
echo ""

# Verificar swap antes
SWAP_INFO=$(sysctl vm.swapusage 2>/dev/null || echo "")
if [ -n "$SWAP_INFO" ]; then
  SWAP_USED_RAW=$(echo "$SWAP_INFO" | awk '{print $7}' | sed 's/M//')
  SWAP_USED=${SWAP_USED_RAW%.*}
  echo "📊 Swap atual: ${SWAP_USED}MB"
  echo ""
fi

echo "📦 Fase 1: Limpar Caches do Projeto"
echo "------------------------------------"

# Limpar todos os caches do projeto
rm -rf .expo .metro-cache node_modules/.cache 2>/dev/null || true
find . -maxdepth 1 -name "*.log" -type f -delete 2>/dev/null || true
find . -maxdepth 1 -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
rm -rf coverage temp tmp build dist web-build 2>/dev/null || true

echo "✅ Caches do projeto limpos"
echo ""

echo "🔄 Fase 2: Parar Processos do Projeto"
echo "--------------------------------------"

# Parar Expo
EXPO_PIDS=$(ps aux | grep -E "expo start|expo start --clear" | grep -v grep | awk '{print $2}')
if [ -n "$EXPO_PIDS" ]; then
  echo "$EXPO_PIDS" | while read pid; do
    if [ -n "$pid" ]; then
      echo "🛑 Parando Expo (PID: $pid)..."
      kill "$pid" 2>/dev/null || true
    fi
  done
  echo "✅ Expo parado"
else
  echo "ℹ️  Expo não está rodando"
fi

# Verificar simulador (não vamos matar - pode estar em uso)
SIMULATOR_PID=$(ps aux | grep "NossaMaternidade.app" | grep -v grep | awk '{print $2}' | head -1)
if [ -n "$SIMULATOR_PID" ]; then
  echo "ℹ️  Simulador iOS rodando (PID: $SIMULATOR_PID)"
  echo "   💡 Feche manualmente se não estiver usando"
fi

echo ""

echo "💻 Fase 3: Limpar Caches de Apps (Sem Sudo)"
echo "--------------------------------------------"

# Limpar cache do npm (não requer sudo)
if command -v npm &> /dev/null; then
  echo "🗑️  Limpando cache do npm..."
  npm cache clean --force 2>/dev/null || echo "   ⚠️  Não foi possível limpar"
fi

# Limpar cache do Metro global (não requer sudo)
if [ -d "$HOME/.metro-cache" ]; then
  METRO_SIZE=$(du -sh "$HOME/.metro-cache" 2>/dev/null | awk '{print $1}')
  echo "🗑️  Removendo ~/.metro-cache ($METRO_SIZE)..."
  rm -rf "$HOME/.metro-cache" 2>/dev/null || echo "   ⚠️  Não foi possível remover"
fi

# Limpar cache do bun (não requer sudo)
if command -v bun &> /dev/null; then
  echo "🗑️  Limpando cache do bun..."
  bun pm cache rm 2>/dev/null || echo "   ⚠️  Não foi possível limpar"
fi

echo ""

echo "📊 Fase 4: Análise de Processos Pesados"
echo "---------------------------------------"

# Contar processos Cursor Helper
CURSOR_HELPERS=$(ps aux | grep "Cursor Helper" | grep -v grep | wc -l | tr -d ' ')
if [ "$CURSOR_HELPERS" -gt 0 ]; then
  echo "⚠️  $CURSOR_HELPERS processos Cursor Helper ativos"
  echo "   💡 Cada processo consome ~100-200MB"
  echo "   💡 Solução: Reinicie o Cursor IDE (libera ~2GB)"
fi

# Verificar Chrome
CHROME_PROCESSES=$(ps aux | grep -i "Google Chrome" | grep -v grep | wc -l | tr -d ' ')
if [ "$CHROME_PROCESSES" -gt 0 ]; then
  CHROME_MEM=$(ps aux | grep -i "Google Chrome" | grep -v grep | awk '{sum+=$6} END {print int(sum/1024) " MB"}' || echo "0 MB")
  echo "⚠️  Google Chrome rodando: $CHROME_MEM"
  echo "   💡 Feche se não estiver usando (libera ~300MB+)"
fi

# Verificar outros apps pesados
if pgrep -x "Slack" > /dev/null; then
  echo "⚠️  Slack rodando"
  echo "   💡 Feche se não estiver usando"
fi

if pgrep -x "Discord" > /dev/null; then
  echo "⚠️  Discord rodando"
  echo "   💡 Feche se não estiver usando"
fi

echo ""

# Verificar swap depois
SWAP_INFO_AFTER=$(sysctl vm.swapusage 2>/dev/null || echo "")
if [ -n "$SWAP_INFO_AFTER" ]; then
  SWAP_USED_RAW_AFTER=$(echo "$SWAP_INFO_AFTER" | awk '{print $7}' | sed 's/M//')
  SWAP_USED_AFTER=${SWAP_USED_RAW_AFTER%.*}
  echo "📊 Swap depois: ${SWAP_USED_AFTER}MB"

  if [ -n "$SWAP_USED" ] && [ "$SWAP_USED" != "0" ]; then
    SWAP_REDUCED=$((SWAP_USED - SWAP_USED_AFTER))
    if [ "$SWAP_REDUCED" -gt 0 ]; then
      echo "✅ Swap reduzido em ~${SWAP_REDUCED}MB"
    fi
  fi
fi

echo ""
echo "✅ Limpeza concluída (sem sudo)!"
echo ""
echo "📝 AÇÕES MANUAIS RECOMENDADAS (Não requerem senha):"
echo ""
echo "1. 🔄 REINICIAR CURSOR IDE (Mais Importante!)"
echo "   - Salve todos os arquivos (Cmd+S em todos)"
echo "   - Feche completamente o Cursor"
echo "   - Reabra o Cursor"
echo "   - Isso libera ~2GB de RAM"
echo ""
echo "2. 🚫 FECHAR APPS PESADOS"
echo "   - Google Chrome (se não estiver usando)"
echo "   - Slack, Discord (se não estiver usando)"
echo "   - Outros apps não essenciais"
echo ""
echo "3. 📱 FECHAR SIMULADOR iOS"
echo "   - Se não estiver testando agora"
echo "   - Libera ~400MB"
echo ""
echo "4. 🗑️  FECHAR ABAS NÃO UTILIZADAS"
echo "   - No Cursor: feche arquivos não utilizados"
echo "   - No Chrome: feche abas não utilizadas"
echo ""
echo "💡 DICA: Com 8GB RAM, mantenha apenas:"
echo "   - Cursor IDE"
echo "   - Terminal"
echo "   - Expo (quando desenvolvendo)"
echo "   - Simulador (quando testando)"
echo ""
echo "🔄 Para ver estado atual: npm run reduce:ram"
