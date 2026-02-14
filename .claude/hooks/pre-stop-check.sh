#!/bin/bash
# Stop Hook - Verifica quality gates antes de Claude parar
# Garante que o código está em bom estado

set -e

# Resolve project root robustly (git-aware, fallback to CLAUDE_PROJECT_DIR or cwd)
if command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1; then
  PROJECT_ROOT="$(git rev-parse --show-toplevel)"
else
  PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
fi
cd "$PROJECT_ROOT" || exit 1

# Verificar se há arquivos TypeScript/JavaScript modificados
if git diff --name-only 2>/dev/null | grep -qE '\.(ts|tsx|js|jsx)$'; then

  # Executar typecheck rápido
  if command -v npm &> /dev/null; then
    echo "🔍 Verificando TypeScript..." >&2

    if ! npm run typecheck --silent 2>&1 | grep -q "error TS"; then
      echo "✅ TypeScript OK" >&2
    else
      echo "❌ Erros de TypeScript detectados!" >&2
      echo "" >&2
      echo "Continue trabalhando para corrigir os erros antes de parar." >&2
      echo "Reason: TypeScript errors detected. Run 'npm run typecheck' to see details." >&2
      exit 0  # Não bloqueia, apenas informa
    fi
  fi
fi

# Verificar se há arquivos staged mas não committed
if git diff --cached --quiet 2>/dev/null; then
  : # Nada staged
else
  echo "⚠️  Há arquivos staged mas não committed" >&2
  echo "   Considere criar um commit antes de parar" >&2
fi

exit 0
