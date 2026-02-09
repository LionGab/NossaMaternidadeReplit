#!/bin/bash
# Monitora sistema completo e otimiza automaticamente
# Uso: bash scripts/macos/monitor-system.sh

LOG_FILE="$HOME/.cursor-optimization.log"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Iniciando monitoramento do sistema ==="

# Verificar memória
MEMORY_ACTIVE=$(vm_stat | grep "Pages active" | awk '{print $3}' | sed 's/\.//')
MEMORY_INACTIVE=$(vm_stat | grep "Pages inactive" | awk '{print $3}' | sed 's/\.//')
MEMORY_SPECULATIVE=$(vm_stat | grep "Pages speculative" | awk '{print $3}' | sed 's/\.//')
TOTAL_PAGES=$((MEMORY_ACTIVE + MEMORY_INACTIVE + MEMORY_SPECULATIVE))
MEMORY_USED_MB=$((TOTAL_PAGES * 4096 / 1024 / 1024))

log "Memória usada: ${MEMORY_USED_MB}MB"

if [ $MEMORY_USED_MB -gt 7000 ]; then
  log "Memória alta, limpando caches..."
  sudo purge 2>/dev/null || true
  npm cache clean --force 2>/dev/null || true
  rm -rf ~/.metro-cache 2>/dev/null || true
  log "Caches limpos"
fi

# Verificar processos do Cursor
CURSOR_PIDS=$(pgrep -f "Cursor" 2>/dev/null || echo "")
if [ -n "$CURSOR_PIDS" ]; then
  CURSOR_MEMORY=$(ps aux | grep -i cursor | grep -v grep | awk '{sum+=$6} END {print sum/1024}' || echo "0")
  log "Cursor usando: ${CURSOR_MEMORY}MB"

  if (( $(echo "$CURSOR_MEMORY > 2000" | bc -l 2>/dev/null || echo "0") )); then
    log "Cursor usando muita memória (>2GB)"
  fi
else
  log "Cursor não está em execução"
fi

# Verificar espaço em disco
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
log "Disco usado: ${DISK_USAGE}%"

if [ $DISK_USAGE -gt 85 ]; then
  log "Disco quase cheio, limpando..."
  if command -v brew &> /dev/null; then
    brew cleanup --prune=all 2>/dev/null || true
  fi
  npm cache clean --force 2>/dev/null || true
  log "Limpeza concluída"
fi

log "=== Monitoramento concluído ==="
