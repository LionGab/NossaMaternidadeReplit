#!/bin/bash
# PreCompact Hook - Salva decisões críticas antes de compactar
# Executado automaticamente quando autoCompact é acionado

DECISION_LOG=".claude/decisions.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Criar arquivo se não existir
touch "$DECISION_LOG"

echo "=== PreCompact: $TIMESTAMP ===" >> "$DECISION_LOG"
echo "Context preserved before auto-compact" >> "$DECISION_LOG"

# Capturar último commit (se existir)
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  LAST_COMMIT=$(git log -1 --oneline 2>/dev/null || echo "No commits yet")
  echo "Last commit: $LAST_COMMIT" >> "$DECISION_LOG"

  # Capturar branch atual
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "detached HEAD")
  echo "Branch: $CURRENT_BRANCH" >> "$DECISION_LOG"

  # Capturar arquivos modificados não commitados (se existir)
  MODIFIED=$(git status --short 2>/dev/null | head -5 || echo "No changes")
  if [ ! -z "$MODIFIED" ]; then
    echo "Modified files:" >> "$DECISION_LOG"
    echo "$MODIFIED" >> "$DECISION_LOG"
  fi
fi

echo "---" >> "$DECISION_LOG"

# Exit silenciosamente para não interromper compactação
exit 0
