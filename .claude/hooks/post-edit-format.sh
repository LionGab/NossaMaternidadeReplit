#!/bin/bash
# PostToolUse Hook - Auto-formata código após Write/Edit
# Executa Prettier apenas nos arquivos modificados

set -e

INPUT=$(cat)

# Extrair file_path
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4 | head -1)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Verificar se arquivo existe
if [ ! -f "$FILE_PATH" ]; then
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
