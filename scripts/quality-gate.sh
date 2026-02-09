#!/bin/bash
# Quality gate script - roda antes de PR/build
# Uso: npm run quality-gate

set -e

echo "🚀 Running quality gates for Nossa Maternidade..."

# 1. TypeScript type check
echo ""
echo "📝 [1/4] TypeScript type check..."
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found!"
  exit 1
fi
echo "✅ TypeScript check passed"

# 2. ESLint
echo ""
echo "🔧 [2/4] ESLint check..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint errors found!"
  exit 1
fi
echo "✅ ESLint check passed"

# 3. Build readiness
echo ""
echo "🏗️  [3/4] Build readiness check..."
npm run check-build-ready
if [ $? -ne 0 ]; then
  echo "❌ Build readiness check failed!"
  exit 1
fi
echo "✅ Build readiness check passed"

# 4. Verificar se não há console.log (exceto warn/error)
echo ""
echo "🔍 [4/4] Checking for console.log usage..."
# Ignorar comentários JSDoc (linhas que começam com *) e arquivos específicos
# Observação: `grep -r` prefixa cada match com "arquivo:", então filtramos por `: *` no output.
CONSOLE_LOGS=$(grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "logger.ts" | grep -v "logger.tsx" | grep -v "Toast.tsx" | grep -v "useToast.ts" | grep -vE ":[[:space:]]*\\*" || true)
if [ -n "$CONSOLE_LOGS" ]; then
  echo "⚠️  Found console.log usage (should use logger instead):"
  echo "$CONSOLE_LOGS"
  echo ""
  echo "Replace with: import { logger } from '@/utils/logger';"
  echo "Then use: logger.info('message', 'context');"
  exit 1
fi
echo "✅ No console.log found (using logger instead)"

echo ""
echo "🎉 All quality gates passed! Ready for PR/build."
