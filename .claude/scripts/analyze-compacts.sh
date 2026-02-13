#!/bin/bash
# Script de análise de métricas de compactação
# Exibe estatísticas sobre compactações realizadas

METRICS_FILE=".claude/compact-metrics.jsonl"

# Verificar se arquivo existe
if [ ! -f "$METRICS_FILE" ]; then
  echo "📊 Nenhuma métrica de compactação encontrada ainda."
  echo "O arquivo será criado automaticamente na primeira compactação."
  exit 0
fi

echo "📊 ESTATÍSTICAS DE COMPACTAÇÃO"
echo "================================"
echo ""

# Total de compactações
TOTAL=$(wc -l < "$METRICS_FILE")
echo "✅ Total de compactações: $TOTAL"
echo ""

# Compactações nos últimos 7 dias
echo "📅 Últimos 7 dias:"
LAST_7_DAYS=$(date -d '7 days ago' +%Y-%m-%d 2>/dev/null || date -v-7d +%Y-%m-%d 2>/dev/null || echo "N/A")
if [ "$LAST_7_DAYS" != "N/A" ]; then
  COUNT_7D=$(grep "$LAST_7_DAYS" "$METRICS_FILE" 2>/dev/null | wc -l)
  echo "   $COUNT_7D compactações"
else
  echo "   (Não disponível neste sistema)"
fi
echo ""

# Última compactação
echo "⏰ Última compactação:"
if command -v jq &> /dev/null; then
  LAST_COMPACT=$(tail -1 "$METRICS_FILE" | jq -r '.timestamp' 2>/dev/null || echo "N/A")
  echo "   $LAST_COMPACT"
else
  LAST_COMPACT=$(tail -1 "$METRICS_FILE" | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)
  echo "   $LAST_COMPACT"
fi
echo ""

# Compactações hoje
echo "📆 Hoje:"
TODAY=$(date +%Y-%m-%d)
COUNT_TODAY=$(grep "$TODAY" "$METRICS_FILE" 2>/dev/null | wc -l)
echo "   $COUNT_TODAY compactações"
echo ""

# Top 5 dias com mais compactações
echo "🔥 Top 5 dias com mais compactações:"
if command -v jq &> /dev/null; then
  jq -r '.timestamp' "$METRICS_FILE" 2>/dev/null | cut -d'T' -f1 | sort | uniq -c | sort -rn | head -5 | while read count date; do
    echo "   $date: $count compactações"
  done
else
  grep -o '"timestamp":"[^"]*"' "$METRICS_FILE" | cut -d'"' -f4 | cut -d'T' -f1 | sort | uniq -c | sort -rn | head -5 | while read count date; do
    echo "   $date: $count compactações"
  done
fi

echo ""
echo "💡 Dica: Use /compact manualmente para compactar contexto quando necessário"
echo "💡 Use /clear entre tarefas não relacionadas para reset completo"
