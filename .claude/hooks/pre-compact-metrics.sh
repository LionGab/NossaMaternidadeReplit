#!/bin/bash
# PreCompact Metrics Hook - Registra métricas de compactação
# Formato JSONL (JSON Lines) para análise posterior

METRICS_FILE=".claude/compact-metrics.jsonl"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Criar arquivo se não existir
touch "$METRICS_FILE"

# Capturar contexto adicional
SESSION_DURATION=""
TOKEN_COUNT=""

# Se tiver jq instalado, usar JSON formatado; senão, usar formato simples
if command -v jq &> /dev/null; then
  echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"pre_compact\",\"session_id\":\"$$\"}" | jq -c >> "$METRICS_FILE"
else
  # Fallback para JSON simples sem jq
  echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"pre_compact\",\"session_id\":\"$$\"}" >> "$METRICS_FILE"
fi

# Exit silenciosamente
exit 0
