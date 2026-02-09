#!/bin/bash
# Monitor de RAM - Verifica uso a cada 30s e alerta quando swap > 1GB
# Uso: npm run monitor:ram

set -e

CHECK_INTERVAL=30  # segundos
SWAP_THRESHOLD=1000  # MB - alerta quando swap > 1GB
LOG_FILE=".cursor/ram-monitor.log"

# Criar diretório de logs se não existir
mkdir -p .cursor

log_message() {
  local level=$1
  shift
  local message="$@"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

check_ram() {
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  # Obter informações de swap
  SWAP_INFO=$(sysctl vm.swapusage 2>/dev/null || echo "")

  if [ -n "$SWAP_INFO" ]; then
    SWAP_USED_RAW=$(echo "$SWAP_INFO" | awk '{print $7}' | sed 's/M//')
    SWAP_TOTAL_RAW=$(echo "$SWAP_INFO" | awk '{print $9}' | sed 's/M//')
    SWAP_USED=${SWAP_USED_RAW%.*}
    SWAP_TOTAL=${SWAP_TOTAL_RAW%.*}

    # Verificar processos Cursor
    CURSOR_HELPERS=$(pgrep -f "Cursor Helper" | wc -l | tr -d ' ')

    # Calcular memória total dos helpers
    HELPER_PIDS=$(pgrep -f "Cursor Helper")
    TOTAL_HELPER_MEM=0
    for pid in $HELPER_PIDS; do
      mem=$(ps -p "$pid" -o rss= 2>/dev/null | awk '{printf "%.0f", $1/1024}' || echo "0")
      TOTAL_HELPER_MEM=$((TOTAL_HELPER_MEM + mem))
    done

    # Status
    echo "[$timestamp] Swap: ${SWAP_USED}MB / ${SWAP_TOTAL}MB | Cursor Helpers: $CURSOR_HELPERS (~${TOTAL_HELPER_MEM}MB)"

    # Alertas
    if [ "$SWAP_USED" -gt 3000 ]; then
      log_message "CRITICAL" "Swap > 3GB - Sistema muito lento! Reinicie o Cursor IDE imediatamente."
      echo "🚨 CRÍTICO: Swap > 3GB - Reinicie o Cursor IDE"
    elif [ "$SWAP_USED" -gt 2000 ]; then
      log_message "WARNING" "Swap > 2GB - Considere reiniciar Cursor"
      echo "⚠️  ALERTA: Swap > 2GB - Considere reiniciar Cursor"
    elif [ "$SWAP_USED" -gt "$SWAP_THRESHOLD" ]; then
      log_message "WARNING" "Swap > 1GB - Sistema pode estar lento"
      echo "⚠️  ALERTA: Swap > 1GB"

      # Sugestões específicas
      echo "   💡 Sugestões:"
      echo "      - Feche o Google Chrome (se não estiver usando)"
      echo "      - Feche abas não utilizadas no Cursor"
      echo "      - Pare o Expo dev server se não estiver desenvolvendo"
    fi

    # Alerta para Cursor Helpers
    if [ "$TOTAL_HELPER_MEM" -gt 2000 ]; then
      log_message "WARNING" "Cursor Helpers usando > 2GB - considere reiniciar Cursor"
      echo "⚠️  ALERTA: Cursor Helpers usando > 2GB"
    fi
  else
    log_message "ERROR" "Não foi possível verificar swap"
    echo "⚠️  Não foi possível verificar swap"
  fi
}

echo "💾 Monitor de RAM - MacBook 8GB"
echo "================================"
echo ""
echo "Intervalo de verificação: ${CHECK_INTERVAL}s"
echo "Threshold de alerta: Swap > ${SWAP_THRESHOLD}MB (1GB)"
echo "Log: $LOG_FILE"
echo ""
echo "Pressione Ctrl+C para parar"
echo ""

# Log inicial
log_message "INFO" "Monitor iniciado"

# Loop principal
while true; do
  check_ram
  sleep "$CHECK_INTERVAL"
done
