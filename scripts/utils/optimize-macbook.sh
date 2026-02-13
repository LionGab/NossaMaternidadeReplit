#!/bin/bash
# Otimizações para MacBook - memória, cache, sistema
# Uso: npm run optimize:macbook

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [[ "$(uname)" != "Darwin" ]]; then
  echo "⚠️  Este script é para macOS. Use npm run clean:ram-no-sudo em outros sistemas."
  exit 1
fi

MACOS_SCRIPT="$(cd "$SCRIPT_DIR/../.." && pwd)/scripts/macos/apply-all-optimizations.sh"
if [ -f "$MACOS_SCRIPT" ]; then
  bash "$MACOS_SCRIPT"
else
  bash "$SCRIPT_DIR/clean-ram-no-sudo.sh"
fi
