#!/bin/bash
# Monitora uso de RAM
# Uso: npm run monitor:ram [--daemon]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "$(uname)" == "Darwin" ]] && [ -f "$SCRIPT_DIR/../macos/monitor-memory.sh" ]; then
  bash "$SCRIPT_DIR/../macos/monitor-memory.sh" "$@"
else
  # Fallback genérico
  echo "💾 Uso de memória:"
  if command -v vm_stat &>/dev/null; then
    vm_stat | grep -E "Pages (free|active|inactive)"
  elif command -v free &>/dev/null; then
    free -h
  else
    echo "   vm_stat ou free não disponível"
  fi
fi
