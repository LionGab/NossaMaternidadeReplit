#!/bin/bash
# Limpeza segura de RAM - sem sudo, sem riscos
# Uso: npm run clean:ram-safe

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/clean-ram-no-sudo.sh"
