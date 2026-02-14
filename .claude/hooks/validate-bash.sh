#!/bin/bash
# PreToolUse Hook - Valida comandos Bash antes de executar
# Protege contra comandos perigosos e valida contexto

set -e

# Resolve repo root (works on macOS, Linux, Git Bash / WSL)
if command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1; then
  ROOT_DIR=$(git rev-parse --show-toplevel)
else
  ROOT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
fi

# Allow explicit bypass for advanced users (must be intentional)
# Usage: CLAUDE_SKIP_VALIDATE_BASH=1 <command>
if [ "${CLAUDE_SKIP_VALIDATE_BASH:-0}" = "1" ]; then
  echo "⚠️ CLAUDE_SKIP_VALIDATE_BASH=1 — skipping validate-bash checks" >&2
  exit 0
fi

# Ler input JSON do stdin
INPUT=$(cat)

# Extrair comando usando jq (ou parsing manual se jq não disponível)
COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | cut -d'"' -f4 | head -1)

# Comandos bloqueados (destrutivos)
BLOCKED_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \."
  "> /dev/"
  "dd if="
  "mkfs"
  "format"
  ":(){:"
)

# Verificar padrões bloqueados
for PATTERN in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -q "$PATTERN"; then
    echo "❌ COMANDO BLOQUEADO: Padrão perigoso detectado" >&2
    echo "   Padrão: $PATTERN" >&2
    echo "   Comando: $COMMAND" >&2
    exit 2  # Exit code 2 bloqueia a tool call
  fi
done

# Validações específicas do projeto
if echo "$COMMAND" | grep -q "npm run build:prod" || echo "$COMMAND" | grep -q "eas build.*production"; then
  # Verificar se quality-gate foi executado recentemente (usar repo root)
  if [ ! -f "$ROOT_DIR/reports/gates/latest.md" ]; then
    echo -e "\n⚠️  AVISO: Build de produção sem quality-gate recente" >&2
    echo "   Recomendado executar: npm run quality-gate" >&2
    # Não bloqueia, apenas avisa
  fi
fi

# Validar modificações em arquivos críticos
if echo "$COMMAND" | grep -qE "(rm|mv|cp).*(\.env|\.env\.local|eas\.json|app\.json)"; then
  echo "⚠️  AVISO: Modificando arquivo de configuração crítico" >&2
fi

# Allow - comando passou nas validações
exit 0
