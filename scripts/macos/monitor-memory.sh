#!/bin/bash
# Monitora uso de memória e alerta quando alto
# Uso: bash scripts/macos/monitor-memory.sh [--daemon]

THRESHOLD=7000  # 7GB (87.5% de 8GB)
ALERT_THRESHOLD=6500  # 6.5GB (81.25%) - alerta preventivo

monitor() {
  # Obter memória ativa em MB
  MEMORY_ACTIVE=$(vm_stat | grep "Pages active" | awk '{print $3}' | sed 's/\.//')
  MEMORY_INACTIVE=$(vm_stat | grep "Pages inactive" | awk '{print $3}' | sed 's/\.//')
  MEMORY_SPECULATIVE=$(vm_stat | grep "Pages speculative" | awk '{print $3}' | sed 's/\.//')

  # Calcular total usado (em páginas de 4KB)
  TOTAL_PAGES=$((MEMORY_ACTIVE + MEMORY_INACTIVE + MEMORY_SPECULATIVE))
  MEMORY_USED_MB=$((TOTAL_PAGES * 4096 / 1024 / 1024))

  echo "💾 Memória usada: ${MEMORY_USED_MB}MB / 8192MB ($((MEMORY_USED_MB * 100 / 8192))%)"

  if [ $MEMORY_USED_MB -gt $THRESHOLD ]; then
    echo "🚨 ALERTA CRÍTICO: Memória acima de ${THRESHOLD}MB!"
    osascript -e "display notification \"Memória em ${MEMORY_USED_MB}MB (limite: ${THRESHOLD}MB)\" with title \"Alerta de Memória Crítico\"" 2>/dev/null || true

    # Limpar caches automaticamente
    echo "🧹 Limpando caches automaticamente..."
    sudo purge 2>/dev/null || true
    npm cache clean --force 2>/dev/null || true
    rm -rf ~/.metro-cache 2>/dev/null || true

  elif [ $MEMORY_USED_MB -gt $ALERT_THRESHOLD ]; then
    echo "⚠️  Alerta preventivo: Memória acima de ${ALERT_THRESHOLD}MB"
    osascript -e "display notification \"Memória em ${MEMORY_USED_MB}MB\" with title \"Alerta de Memória\"" 2>/dev/null || true
  fi
}

if [ "$1" == "--daemon" ]; then
  echo "🔄 Iniciando monitoramento contínuo (Ctrl+C para parar)..."
  while true; do
    monitor
    sleep 60
  done
else
  monitor
fi
