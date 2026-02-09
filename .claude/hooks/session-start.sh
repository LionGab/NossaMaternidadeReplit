#!/bin/bash
# SessionStart Hook - Valida ambiente e adiciona contexto ao iniciar sessão
# NossaMaternidade - React Native + Expo

set -e

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-.}"
cd "$PROJECT_ROOT"

# Função para adicionar contexto
add_context() {
  if [ -n "$CLAUDE_ENV_FILE" ]; then
    echo "$1" >> "$CLAUDE_ENV_FILE"
  fi
}

# Contexto inicial
CONTEXT=""

# 1. Verificar Node/Bun/Expo versions
CONTEXT+="📱 Nossa Maternidade - React Native + Expo Development\n"
CONTEXT+="════════════════════════════════════════════════\n\n"

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  CONTEXT+="✅ Node.js: $NODE_VERSION\n"
else
  CONTEXT+="⚠️  Node.js não encontrado\n"
fi

if command -v bun &> /dev/null; then
  BUN_VERSION=$(bun --version)
  CONTEXT+="✅ Bun: v$BUN_VERSION\n"
else
  CONTEXT+="⚠️  Bun não encontrado (recomendado para este projeto)\n"
fi

if command -v npx &> /dev/null && npx expo --version &> /dev/null; then
  EXPO_VERSION=$(npx expo --version 2>/dev/null || echo "unknown")
  CONTEXT+="✅ Expo CLI: $EXPO_VERSION\n"
else
  CONTEXT+="⚠️  Expo CLI não encontrado\n"
fi

# 2. Verificar .env.local
CONTEXT+="\n📝 Environment Variables:\n"
if [ -f ".env.local" ]; then
  CONTEXT+="✅ .env.local existe\n"

  # Verificar vars críticas (sem expor valores)
  MISSING_VARS=()
  for VAR in EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL; do
    if ! grep -q "^$VAR=" .env.local 2>/dev/null; then
      MISSING_VARS+=("$VAR")
    fi
  done

  if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    CONTEXT+="✅ Todas as variáveis obrigatórias estão definidas\n"
  else
    CONTEXT+="⚠️  Variáveis faltando: ${MISSING_VARS[*]}\n"
  fi
else
  CONTEXT+="❌ .env.local NÃO EXISTE!\n"
  CONTEXT+="   Execute: cp .env.example .env.local\n"
fi

# 3. Verificar node_modules
if [ -d "node_modules" ]; then
  CONTEXT+="✅ node_modules/ existe\n"
else
  CONTEXT+="⚠️  node_modules/ não encontrado. Execute: npm install\n"
fi

# 4. Quality Gate Status
CONTEXT+="\n🎯 Quality Gates:\n"
CONTEXT+="   Para validar antes de build: npm run quality-gate\n"
CONTEXT+="   Release gates (G-1 → G7): npm run gate:0\n"

# 5. Comandos úteis
CONTEXT+="\n🚀 Comandos Rápidos:\n"
CONTEXT+="   npm start              → Expo dev server\n"
CONTEXT+="   npm run typecheck      → TypeScript validation\n"
CONTEXT+="   npm run lint:fix       → Auto-fix ESLint\n"
CONTEXT+="   npm run test           → Run tests\n"
CONTEXT+="   npm run quality-gate   → OBRIGATÓRIO antes de PR/build\n"

# 6. Build commands
CONTEXT+="\n📦 Builds (EAS):\n"
CONTEXT+="   npm run build:dev:ios       → Dev build iOS\n"
CONTEXT+="   npm run build:prod:ios      → Production iOS (+ quality-gate)\n"
CONTEXT+="   npm run build:prod:android  → Production Android (+ quality-gate)\n"

CONTEXT+="\n════════════════════════════════════════════════\n"

# Output context
echo -e "$CONTEXT"

# Persist environment variables para Bash commands subsequentes
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo "export PROJECT_ROOT=\"$PROJECT_ROOT\"" >> "$CLAUDE_ENV_FILE"
  echo "export NODE_ENV=development" >> "$CLAUDE_ENV_FILE"
fi

exit 0
