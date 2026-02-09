#!/bin/bash
# PreToolUse Hook - Validações antes de Write/Edit
# Verifica padrões anti-patterns antes de modificar código

set -e

INPUT=$(cat)

# Extrair file_path do JSON
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4 | head -1)

if [ -z "$FILE_PATH" ]; then
  exit 0  # Sem file_path, não há o que validar
fi

# Extrair extensão
EXTENSION="${FILE_PATH##*.}"

# Validações para arquivos TypeScript/JavaScript
if [[ "$EXTENSION" =~ ^(ts|tsx|js|jsx)$ ]]; then

  # Verificar se está tentando editar arquivo em node_modules
  if echo "$FILE_PATH" | grep -q "node_modules/"; then
    echo "⚠️  AVISO: Editando arquivo em node_modules/" >&2
    echo "   Considere usar patch-package ao invés disso" >&2
  fi

  # Verificar se está tentando modificar arquivo gerado
  if echo "$FILE_PATH" | grep -qE "(\.generated\.|supabase/types/)"; then
    echo "❌ BLOQUEADO: Não edite arquivos gerados automaticamente" >&2
    echo "   Arquivo: $FILE_PATH" >&2
    echo "   Execute o gerador apropriado ao invés disso" >&2
    exit 2
  fi
fi

# Validações para .env files
if echo "$FILE_PATH" | grep -qE "\.env(\.local|\.example)?$"; then
  echo "⚠️  AVISO: Modificando arquivo de environment" >&2
  echo "   .env files não devem conter secrets reais" >&2
  echo "   Use .env.local (gitignored) para valores locais" >&2
fi

# Validações para app.json / eas.json
if echo "$FILE_PATH" | grep -qE "(app\.json|eas\.json)$"; then
  echo "⚠️  AVISO: Modificando configuração crítica do Expo/EAS" >&2
  echo "   Verifique IMMUTABLE CONSTANTS em CLAUDE.md" >&2
fi

exit 0
