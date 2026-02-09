#!/bin/bash
# UserPromptSubmit Hook - Adiciona contexto útil ao processar prompts
# Injeta informações relevantes sobre o estado atual do projeto

set -e

PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
cd "$PROJECT_ROOT"

CONTEXT=""

# Verificar se prompt menciona "build", "deploy", "production"
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | grep -o '"prompt":"[^"]*"' | cut -d'"' -f4)

if echo "$PROMPT" | grep -qiE "(build|deploy|production|release|submit|app store|play store)"; then
  CONTEXT+="📦 Build/Deploy Context:\n"
  CONTEXT+="   - SEMPRE executar 'npm run quality-gate' antes de builds de produção\n"
  CONTEXT+="   - Release gates completos: 'npm run gate:0'\n"
  CONTEXT+="   - Verificar IMMUTABLE CONSTANTS em CLAUDE.md\n\n"
fi

if echo "$PROMPT" | grep -qiE "(test|spec|jest)"; then
  CONTEXT+="🧪 Testing Context:\n"
  CONTEXT+="   - Run tests: 'npm test'\n"
  CONTEXT+="   - Watch mode: 'npm test -- --watch'\n"
  CONTEXT+="   - Coverage: 'npm run test:coverage'\n\n"
fi

if echo "$PROMPT" | grep -qiE "(type|typescript|tsc)"; then
  CONTEXT+="📘 TypeScript Context:\n"
  CONTEXT+="   - Typecheck: 'npm run typecheck'\n"
  CONTEXT+="   - Regenerate DB types: 'npm run generate-types'\n"
  CONTEXT+="   - NON-NEGOTIABLE: Zero 'any' types\n\n"
fi

if echo "$PROMPT" | grep -qiE "(color|theme|style|design)"; then
  CONTEXT+="🎨 Design System Context:\n"
  CONTEXT+="   - NEVER hardcode colors\n"
  CONTEXT+="   - Use: Tokens.* from @/theme/tokens\n"
  CONTEXT+="   - Use: useThemeColors() hook\n\n"
fi

# Output context se houver algo relevante
if [ -n "$CONTEXT" ]; then
  echo -e "$CONTEXT"
fi

exit 0
