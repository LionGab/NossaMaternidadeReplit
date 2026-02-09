#!/bin/bash
# Script de Limpeza Segura de RAM - MacBook M1 8GB
# Apenas ações seguras que não causam perda de dados
# Uso: npm run clean:ram-safe

set -e

echo "🧹 Limpeza Segura de RAM"
echo "========================="
echo ""
echo "⚠️  Este script vai executar apenas ações seguras:"
echo "   ✅ Limpar caches do projeto"
echo "   ✅ Limpar memória comprimida do sistema"
echo "   ✅ Parar Expo dev server (se rodando)"
echo "   ❌ NÃO vai fechar Cursor (pode causar perda de trabalho)"
echo ""

# Verificar swap antes
SWAP_INFO=$(sysctl vm.swapusage 2>/dev/null || echo "")
if [ -n "$SWAP_INFO" ]; then
  SWAP_USED_RAW=$(echo "$SWAP_INFO" | awk '{print $7}' | sed 's/M//')
  SWAP_USED=${SWAP_USED_RAW%.*}
  echo "📊 Swap antes: ${SWAP_USED}MB"
  echo ""
fi

echo "📦 Fase 1: Limpeza de Caches do Projeto"
echo "----------------------------------------"

# Limpar caches do projeto
CACHES_CLEANED=0

if [ -d ".expo" ]; then
  EXPO_SIZE=$(du -sk .expo 2>/dev/null | awk '{print $1}')
  echo "🗑️  Removendo .expo (~$((EXPO_SIZE/1024))MB)..."
  rm -rf .expo 2>/dev/null && CACHES_CLEANED=$((CACHES_CLEANED + EXPO_SIZE/1024))
fi

if [ -d ".metro-cache" ]; then
  METRO_SIZE=$(du -sk .metro-cache 2>/dev/null | awk '{print $1}')
  echo "🗑️  Removendo .metro-cache (~$((METRO_SIZE/1024))MB)..."
  rm -rf .metro-cache 2>/dev/null && CACHES_CLEANED=$((CACHES_CLEANED + METRO_SIZE/1024))
fi

if [ -d "node_modules/.cache" ]; then
  NODE_CACHE_SIZE=$(du -sk node_modules/.cache 2>/dev/null | awk '{print $1}')
  echo "🗑️  Removendo node_modules/.cache (~$((NODE_CACHE_SIZE/1024))MB)..."
  rm -rf node_modules/.cache 2>/dev/null && CACHES_CLEANED=$((CACHES_CLEANED + NODE_CACHE_SIZE/1024))
fi

# Limpar arquivos temporários
echo "🗑️  Removendo arquivos temporários..."
find . -maxdepth 1 -name "*.log" -type f -delete 2>/dev/null || true
find . -maxdepth 1 -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

echo "✅ Caches do projeto limpos (~${CACHES_CLEANED}MB liberados)"
echo ""

echo "🔄 Fase 2: Parar Processos do Projeto (Seguro)"
echo "-----------------------------------------------"

# Parar Expo dev server (seguro - pode reiniciar depois)
EXPO_PID=$(ps aux | grep -E "expo start|expo start --clear" | grep -v grep | awk '{print $2}' | head -1)
if [ -n "$EXPO_PID" ]; then
  EXPO_MEM=$(ps -p "$EXPO_PID" -o rss= 2>/dev/null | awk '{printf "%.0f", $1/1024}' || echo "0")
  echo "🛑 Parando Expo dev server (PID: $EXPO_PID, ~${EXPO_MEM}MB)..."
  kill "$EXPO_PID" 2>/dev/null && echo "   ✅ Expo parado" || echo "   ⚠️  Não foi possível parar Expo"
else
  echo "ℹ️  Expo dev server não está rodando"
fi

# Verificar simulador iOS (não vamos matar automaticamente - muito perigoso)
SIMULATOR_PID=$(ps aux | grep "NossaMaternidade.app" | grep -v grep | awk '{print $2}' | head -1)
if [ -n "$SIMULATOR_PID" ]; then
  SIM_MEM=$(ps -p "$SIMULATOR_PID" -o rss= 2>/dev/null | awk '{printf "%.0f", $1/1024}' || echo "0")
  echo "ℹ️  Simulador iOS rodando (PID: $SIMULATOR_PID, ~${SIM_MEM}MB)"
  echo "   💡 Feche manualmente se não estiver usando (seguro)"
else
  echo "ℹ️  Simulador iOS não está rodando"
fi

echo ""

echo "💾 Fase 3: Limpar Memória Comprimida do Sistema"
echo "------------------------------------------------"
echo "   Executando: sudo purge"
echo "   ⚠️  Requer senha de administrador"
echo ""

# Tentar executar purge (pode falhar se não tiver sudo)
if sudo -n true 2>/dev/null; then
  # Já tem sudo ativo
  sudo purge
  echo "✅ Memória comprimida limpa"
else
  echo "⚠️  Precisa de senha para executar purge"
  echo "   Execute manualmente: sudo purge"
  echo "   Ou forneça senha quando solicitado"
  read -p "   Tentar executar purge agora? (s/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    sudo purge && echo "✅ Memória comprimida limpa" || echo "⚠️  Falhou ao executar purge"
  else
    echo "⏭️  Pulando purge"
  fi
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
    elif [ "$SWAP_REDUCED" -lt 0 ]; then
      echo "⚠️  Swap aumentou (pode ser temporário)"
    fi
  fi
fi

echo ""
echo "✅ Limpeza segura concluída!"
echo ""
echo "📝 Próximos Passos Recomendados:"
echo "   1. Se swap ainda estiver alto (>2GB): Reinicie o Cursor IDE manualmente"
echo "   2. Feche Chrome se não estiver usando"
echo "   3. Feche abas não utilizadas no Cursor"
echo "   4. Para reiniciar Expo: npm start"
echo ""
echo "💡 Para ver estado atual: npm run reduce:ram"
