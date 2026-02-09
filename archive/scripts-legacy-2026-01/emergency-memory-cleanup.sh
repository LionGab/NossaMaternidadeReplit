#!/bin/bash
# Script de Limpeza de Emergência - MacBook M1
# Uso quando memória está crítica (>5GB swap)
# ATENÇÃO: Fecha processos não essenciais

set -e

echo "🚨 LIMPEZA DE EMERGÊNCIA - MEMÓRIA CRÍTICA"
echo "=========================================="
echo ""
echo "⚠️  Este script vai:"
echo "   1. Limpar todos os caches do projeto"
echo "   2. Limpar cache do sistema (requer sudo)"
echo "   3. Sugerir fechar apps pesados"
echo ""

read -p "Continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Cancelado."
  exit 1
fi

echo ""
echo "📦 Fase 1: Limpeza de Caches do Projeto"
echo "----------------------------------------"

# Limpar caches do projeto
cd "$(dirname "$0")/.." || exit 1

# Executar script de otimização existente
if [ -f "scripts/optimize-macbook.sh" ]; then
  bash scripts/optimize-macbook.sh
else
  echo "⚠️  Script optimize-macbook.sh não encontrado, limpando manualmente..."

  # Limpeza manual básica
  rm -rf .expo .metro-cache node_modules/.cache 2>/dev/null || true
  find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
  rm -rf coverage temp tmp 2>/dev/null || true
fi

echo ""
echo "💻 Fase 2: Limpeza de Cache do Sistema"
echo "--------------------------------------"

# Limpar cache do sistema (sem sudo primeiro)
echo "🗑️  Limpando cache do usuário..."

# Cache do npm/yarn/bun
if command -v npm &> /dev/null; then
  npm cache clean --force 2>/dev/null || true
fi

if command -v yarn &> /dev/null; then
  yarn cache clean 2>/dev/null || true
fi

if command -v bun &> /dev/null; then
  bun pm cache rm 2>/dev/null || true
fi

# Limpar cache do Metro global
rm -rf ~/.metro-cache 2>/dev/null || true

# Limpar cache do Cursor (cuidado - remove algumas configurações temporárias)
echo "🗑️  Limpando cache do Cursor..."
CURSOR_CACHE="$HOME/Library/Application Support/Cursor/Cache"
if [ -d "$CURSOR_CACHE" ]; then
  echo "   Removendo: $CURSOR_CACHE"
  rm -rf "$CURSOR_CACHE" 2>/dev/null || echo "   ⚠️  Não foi possível remover (pode estar em uso)"
fi

# Limpar cache do Chrome (se não estiver em uso)
echo "🗑️  Limpando cache do Chrome..."
CHROME_CACHE="$HOME/Library/Caches/Google/Chrome"
if [ -d "$CHROME_CACHE" ] && ! pgrep -x "Google Chrome" > /dev/null; then
  echo "   Chrome não está rodando, limpando cache..."
  rm -rf "$CHROME_CACHE/Default/Cache" 2>/dev/null || true
  rm -rf "$CHROME_CACHE/Default/Code Cache" 2>/dev/null || true
else
  echo "   Chrome está rodando, pulando limpeza de cache"
fi

echo ""
echo "🔄 Fase 3: Limpeza de Memória do Sistema (requer sudo)"
echo "-------------------------------------------------------"
echo "⚠️  Esta etapa requer senha de administrador"
echo "    Vai executar: sudo purge (limpa memória inativa)"
echo ""

read -p "Executar purge? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  sudo purge
  echo "✅ Memória do sistema limpa"
else
  echo "⏭️  Pulando purge (execute manualmente: sudo purge)"
fi

echo ""
echo "📊 Fase 4: Análise de RAM e Swap"
echo "---------------------------------"

# Verificar swap atual
SWAP_USED=$(sysctl vm.swapusage 2>/dev/null | awk '{print $7}' | sed 's/M//' || echo "0")
SWAP_TOTAL=$(sysctl vm.swapusage 2>/dev/null | awk '{print $9}' | sed 's/M//' || echo "0")

if [ -n "$SWAP_USED" ] && [ "$SWAP_USED" != "0" ]; then
  echo "📊 Swap atual: ${SWAP_USED}MB / ${SWAP_TOTAL}MB"
  if [ "$SWAP_USED" -gt 3000 ]; then
    echo "🚨 CRÍTICO: Swap > 3GB - Sistema muito lento!"
  elif [ "$SWAP_USED" -gt 2000 ]; then
    echo "⚠️  ALERTA: Swap > 2GB - Considere reiniciar Cursor"
  elif [ "$SWAP_USED" -gt 1000 ]; then
    echo "⚠️  Swap > 1GB - Sistema pode estar lento"
  else
    echo "✅ Swap aceitável"
  fi
  echo ""
fi

# Verificar processos pesados
echo "🔍 Processos que podem ser fechados:"
echo ""

# Verificar Chrome
if pgrep -x "Google Chrome" > /dev/null; then
  CHROME_MEM=$(ps aux | grep -i "Google Chrome" | grep -v grep | awk '{sum+=$6} END {print int(sum/1024) " MB"}' || echo "0 MB")
  echo "   🟡 Google Chrome: $CHROME_MEM"
  echo "      → Feche abas não utilizadas ou o app inteiro"
fi

# Verificar Cursor Helpers
CURSOR_HELPERS=$(pgrep -f "Cursor Helper" | wc -l | tr -d ' ')
if [ "$CURSOR_HELPERS" -gt 0 ]; then
  CURSOR_MEM=$(ps aux | grep "Cursor Helper" | grep -v grep | awk '{sum+=$6} END {print int(sum/1024) " MB"}' || echo "0 MB")
  echo "   🟡 Cursor Helper: $CURSOR_HELPERS processos ($CURSOR_MEM)"
  echo "      → Feche abas/arquivos não utilizados no Cursor"
  echo "      → Reinicie o Cursor se possível (libera ~2GB)"
fi

# Verificar Expo dev server
if pgrep -f "expo start" > /dev/null; then
  EXPO_MEM=$(ps aux | grep "expo start" | grep -v grep | awk '{sum+=$6} END {print int(sum/1024) " MB"}' || echo "0 MB")
  echo "   🟡 Expo dev server: $EXPO_MEM"
  echo "      → Pare se não estiver desenvolvendo agora (Ctrl+C)"
fi

# Verificar Simulador iOS
if pgrep -f "NossaMaternidade.app" > /dev/null; then
  SIM_MEM=$(ps aux | grep "NossaMaternidade.app" | grep -v grep | awk '{sum+=$6} END {print int(sum/1024) " MB"}' || echo "0 MB")
  echo "   🟡 Simulador iOS: $SIM_MEM"
  echo "      → Feche se não estiver testando agora"
fi

# Verificar TypeScript Server
if pgrep -f "tsserver" > /dev/null; then
  TS_MEM=$(ps aux | grep tsserver | grep -v grep | awk '{sum+=$6} END {print int(sum/1024) " MB"}' || echo "0 MB")
  echo "   🟡 TypeScript Server: $TS_MEM"
fi

echo ""
echo "✅ Limpeza de emergência concluída!"
echo ""
echo "📝 AÇÕES RECOMENDADAS IMEDIATAS:"
echo "   1. Feche o Google Chrome (está usando ~1GB+)"
echo "   2. Feche abas não utilizadas no Cursor"
echo "   3. Reinicie o Cursor IDE"
echo "   4. Feche outros apps não essenciais (Slack, Discord, etc.)"
echo "   5. Execute: npm start --clear (se estiver desenvolvendo)"
echo ""
echo "💡 DICA: Com 8GB RAM, mantenha apenas 2-3 apps pesados abertos"
echo "   Prioridade: Cursor > Terminal > (Chrome apenas quando necessário)"
