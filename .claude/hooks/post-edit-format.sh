#!/bin/bash
# PostToolUse Hook - Auto-formata código após Write/Edit
# Executa Prettier apenas nos arquivos modificados

set -e

# Resolve repo root (git-aware fallback)
if command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1; then
  ROOT_DIR="$(git rev-parse --show-toplevel)"
else
  ROOT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
fi

INPUT=$(cat)

# Extrair file_path
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4 | head -1)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Normalize path: accept absolute or repo-relative paths
if [ -f "$FILE_PATH" ]; then
  TARGET_PATH="$FILE_PATH"
elif [ -f "$ROOT_DIR/$FILE_PATH" ]; then
  TARGET_PATH="$ROOT_DIR/$FILE_PATH"
else
  exit 0
fi

# Extensões que devem ser formatadas
EXTENSION="${FILE_PATH##*.}"

if [[ "$EXTENSION" =~ ^(ts|tsx|js|jsx|json|md|mdx)$ ]]; then

  # Executar Prettier
  if command -v npx &> /dev/null; then
    if npx prettier --write "$FILE_PATH" 2>/dev/null; then
      echo "✅ Formatado: $FILE_PATH" >&1
    else
      # Não bloqueia se prettier falhar
      echo "⚠️  Prettier falhou para: $FILE_PATH" >&2
    fi
  fi
fi

exit 0
