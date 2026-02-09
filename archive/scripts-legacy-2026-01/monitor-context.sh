#!/bin/bash
# Monitor de Contexto Claude - Alerta quando próximo de 70%
# Uso: npm run monitor:context

set -e

THRESHOLD_WARNING=0.65  # 65% - alerta
THRESHOLD_CRITICAL=0.70  # 70% - crítico
CHECK_INTERVAL=30  # segundos

echo "🔍 Monitor de Contexto Claude"
echo "=============================="
echo ""
echo "Thresholds:"
echo "  ⚠️  Alerta: ${THRESHOLD_WARNING}% (65%)"
echo "  🚨 Crítico: ${THRESHOLD_CRITICAL}% (70%)"
echo ""
echo "Intervalo de verificação: ${CHECK_INTERVAL}s"
echo "Pressione Ctrl+C para parar"
echo ""

# Criar diretório de logs se não existir
mkdir -p .cursor
LOG_FILE=".cursor/context-monitor.log"

log_message() {
  local level=$1
  shift
  local message="$@"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

check_context() {
  # Nota: O Cursor não expõe API direta para verificar contexto
  # Este script serve como lembrete e guia

  log_message "INFO" "Verificando uso de contexto..."

  echo ""
  echo "📊 Status do Contexto"
  echo "-------------------"
  echo ""
  echo "⚠️  ATENÇÃO: O Cursor não expõe API para verificar contexto automaticamente."
  echo "   Este script serve como lembrete e guia."
  echo ""
  echo "💡 Como verificar manualmente:"
  echo "   1. Olhe o indicador de contexto no Cursor (canto superior direito)"
  echo "   2. Se próximo de 65%: Execute /compact"
  echo "   3. Se próximo de 70%: Execute /clear + reancora com spec"
  echo ""
  echo "📝 Comandos disponíveis:"
  echo "   /compact - Resumo em 12 linhas (objetivo, decisões, arquivos, próximos passos)"
  echo "   /clear   - Limpa contexto + reancora com spec"
  echo ""
  echo "📖 Protocolo completo: .cursor/context-protocol.md"
  echo ""
}

# Loop principal
while true; do
  check_context
  sleep "$CHECK_INTERVAL"
done
