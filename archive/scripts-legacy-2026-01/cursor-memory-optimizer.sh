#!/bin/bash
# Otimizador de Memória - Cursor + Claude Code IDE
# Otimizado para MacBook Air 2020 8GB RAM + Ultrathink Mode
# Uso: npm run optimize:cursor

set -e

echo "🧠 Otimizador de Memória - MacBook Air 8GB"
echo "==========================================="
echo "Cursor + Claude Code IDE - Ultrathink Mode"
echo ""

# Função para obter uso de RAM de um processo
get_process_memory() {
  local pid=$1
  if [ -n "$pid" ]; then
    ps -p "$pid" -o rss= 2>/dev/null | awk '{printf "%.0f", $1/1024}' || echo "0"
  else
    echo "0"
  fi
}

# Função para calcular memória de processos por padrão
calc_process_group_memory() {
  local pattern=$1
  local total=0
  local pids=$(pgrep -f "$pattern" 2>/dev/null || echo "")
  for pid in $pids; do
    mem=$(get_process_memory "$pid")
    total=$((total + mem))
  done
  echo "$total"
}

# ============================================
# MEMÓRIA DO SISTEMA
# ============================================
echo "💾 Memória do Sistema (8GB Target)"
echo "-----------------------------------"

TOTAL_RAM=$(sysctl -n hw.memsize | awk '{printf "%.0f", $1/1024/1024/1024}')
SWAP_INFO=$(sysctl vm.swapusage 2>/dev/null || echo "")

if [ -n "$SWAP_INFO" ]; then
  SWAP_USED_RAW=$(echo "$SWAP_INFO" | awk '{print $7}' | sed 's/M//')
  SWAP_TOTAL_RAW=$(echo "$SWAP_INFO" | awk '{print $9}' | sed 's/M//')
  SWAP_USED=${SWAP_USED_RAW%.*}
  SWAP_TOTAL=${SWAP_TOTAL_RAW%.*}

  echo "   RAM Total: ${TOTAL_RAM}GB"
  echo "   Swap usado: ${SWAP_USED}MB / ${SWAP_TOTAL}MB"

  if [ "$SWAP_USED" -gt 2000 ]; then
    echo "   🚨 CRÍTICO: Swap > 2GB - Sistema muito lento!"
  elif [ "$SWAP_USED" -gt 1000 ]; then
    echo "   ⚠️  ALERTA: Swap > 1GB - Pode afetar performance"
  else
    echo "   ✅ Swap saudável (< 1GB)"
  fi
else
  echo "   ⚠️  Não foi possível verificar swap"
fi

echo ""

# ============================================
# PROCESSOS CURSOR IDE
# ============================================
echo "📊 Cursor IDE"
echo "-------------"

CURSOR_MAIN=$(pgrep -f "Cursor.app/Contents/MacOS/Cursor" 2>/dev/null | head -1 || echo "")
CURSOR_HELPER_MEM=$(calc_process_group_memory "Cursor Helper")
CURSOR_HELPER_COUNT=$(pgrep -f "Cursor Helper" 2>/dev/null | wc -l | tr -d ' ' || echo "0")

if [ -n "$CURSOR_MAIN" ]; then
  MAIN_MEM=$(get_process_memory "$CURSOR_MAIN")
  echo "   ✅ Cursor Principal: ~${MAIN_MEM}MB"
else
  echo "   ⚠️  Cursor não está rodando"
fi

if [ "$CURSOR_HELPER_COUNT" -gt 0 ]; then
  echo "   📦 Helpers ($CURSOR_HELPER_COUNT processos): ~${CURSOR_HELPER_MEM}MB"

  if [ "$CURSOR_HELPER_MEM" -gt 1500 ]; then
    echo "      🚨 CRÍTICO: Helpers > 1.5GB - Reinicie Cursor"
  elif [ "$CURSOR_HELPER_MEM" -gt 1000 ]; then
    echo "      ⚠️  ALERTA: Helpers > 1GB - Monitore"
  fi
fi

echo ""

# ============================================
# PROCESSOS CLAUDE CODE
# ============================================
echo "🤖 Claude Code"
echo "--------------"

CLAUDE_MEM=$(calc_process_group_memory "claude")
NODE_CLAUDE_MEM=$(calc_process_group_memory "node.*claude")

if [ "$CLAUDE_MEM" -gt 0 ] || [ "$NODE_CLAUDE_MEM" -gt 0 ]; then
  TOTAL_CLAUDE=$((CLAUDE_MEM + NODE_CLAUDE_MEM))
  echo "   ✅ Claude Code: ~${TOTAL_CLAUDE}MB"

  if [ "$TOTAL_CLAUDE" -gt 1000 ]; then
    echo "      ⚠️  ALERTA: Claude usando > 1GB"
  fi
else
  echo "   ⚠️  Claude Code não detectado"
fi

echo ""

# ============================================
# PROCESSOS NODE.JS / DESENVOLVIMENTO
# ============================================
echo "🔧 Desenvolvimento"
echo "------------------"

METRO_MEM=$(calc_process_group_memory "metro")
EXPO_MEM=$(calc_process_group_memory "expo")
TSC_MEM=$(calc_process_group_memory "tsserver")

echo "   Metro Bundler: ~${METRO_MEM}MB"
echo "   Expo: ~${EXPO_MEM}MB"
echo "   TypeScript Server: ~${TSC_MEM}MB"

DEV_TOTAL=$((METRO_MEM + EXPO_MEM + TSC_MEM))
if [ "$DEV_TOTAL" -gt 2000 ]; then
  echo "   🚨 Dev tools usando > 2GB - Pare processos não usados"
fi

echo ""

# ============================================
# TOP PROCESSOS
# ============================================
echo "🔍 Top 5 Processos (RAM)"
echo "------------------------"
ps aux | awk '{print $2, $4, $11}' | sort -k2 -rn | head -5 | awk '{printf "   PID: %-6s %5s%% %s\n", $1, $2, $3}'

echo ""

# ============================================
# ORÇAMENTO DE MEMÓRIA (8GB)
# ============================================
echo "📊 Orçamento de Memória (8GB)"
echo "-----------------------------"
echo "   Recomendado para MacBook Air 2020:"
echo "   ├── macOS:          ~2GB"
echo "   ├── Cursor IDE:     ~1.5GB"
echo "   ├── Claude Code:    ~1GB"
echo "   ├── TypeScript:     ~1GB"
echo "   ├── Metro/Expo:     ~1GB"
echo "   └── Margem:         ~1.5GB"
echo ""

# ============================================
# RECOMENDAÇÕES
# ============================================
echo "💡 Recomendações - Ultrathink Mode"
echo "-----------------------------------"

# Calcular uso total estimado
TOTAL_DEV_MEM=$((CURSOR_HELPER_MEM + CLAUDE_MEM + NODE_CLAUDE_MEM + DEV_TOTAL))

if [ "$SWAP_USED" -gt 2000 ] || [ "$TOTAL_DEV_MEM" -gt 5000 ]; then
  echo "🚨 AÇÕES IMEDIATAS (Sistema sob pressão):"
  echo ""
  echo "   1. Reinicie o Cursor IDE"
  echo "      Cmd+Shift+P → 'Developer: Reload Window'"
  echo ""
  echo "   2. Pare serviços não usados:"
  echo "      • Feche Chrome/Safari"
  echo "      • Pare Metro se não estiver desenvolvendo: Ctrl+C"
  echo "      • Feche abas do Cursor não usadas"
  echo ""
  echo "   3. Limpe caches:"
  echo "      npm run clean"
  echo ""
elif [ "$SWAP_USED" -gt 1000 ] || [ "$TOTAL_DEV_MEM" -gt 4000 ]; then
  echo "⚠️  AÇÕES PREVENTIVAS:"
  echo ""
  echo "   1. Feche aplicativos não essenciais"
  echo "   2. Considere reiniciar Cursor a cada 2h"
  echo "   3. Use 'npm run clean' periodicamente"
  echo ""
else
  echo "✅ Sistema saudável para Ultrathink Mode"
  echo ""
  echo "   Dicas para manter performance:"
  echo "   • Reinicie Cursor a cada 3-4h de uso"
  echo "   • Feche abas não utilizadas"
  echo "   • Use 'npm run optimize:cursor' periodicamente"
  echo ""
fi

# ============================================
# ATALHOS ÚTEIS
# ============================================
echo "⌨️  Atalhos Úteis"
echo "-----------------"
echo "   Cmd+L          → Claude Code Chat"
echo "   Cmd+Shift+P    → Command Palette"
echo "   Cmd+B          → Toggle Sidebar"
echo "   Cmd+J          → Toggle Terminal"
echo "   Cmd+K Cmd+W    → Fechar todas as abas"
echo ""

# Criar diretório de logs se não existir
mkdir -p .cursor

# Log
echo "$(date '+%Y-%m-%d %H:%M:%S') | Swap: ${SWAP_USED}MB | Cursor: ${CURSOR_HELPER_MEM}MB | Dev: ${DEV_TOTAL}MB" >> .cursor/memory-optimizer.log

echo "📝 Log: .cursor/memory-optimizer.log"
echo ""
