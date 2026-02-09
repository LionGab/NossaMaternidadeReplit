#!/bin/bash
# Auditoria do Design System
# Identifica cores hardcoded que devem usar tokens

echo "🎨 Auditoria de Design System - Nossa Maternidade"
echo "================================================"
echo ""

echo "📊 Resumo:"
echo "---------"

# Contar imports do colors.ts (deprecated)
colors_imports=$(grep -r "from.*colors" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "__tests__" | grep -v "node_modules" | wc -l | tr -d ' ')
echo "Imports de colors.ts (deprecated): $colors_imports"

# Contar cores hardcoded (#hex)
hex_colors=$(grep -rE "(color|backgroundColor):\s*['\"]#[0-9a-fA-F]{3,6}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "__tests__" | grep -v "tokens.ts" | grep -v "colors.ts" | wc -l | tr -d ' ')
echo "Cores hardcoded (#hex): $hex_colors"

# Contar tokens.ts imports (correto)
tokens_imports=$(grep -r "from.*tokens" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "__tests__" | grep -v "node_modules" | wc -l | tr -d ' ')
echo "Imports de tokens.ts (correto): $tokens_imports"

echo ""
echo "🔍 Detalhes de cores hardcoded:"
echo "--------------------------------"
grep -rE "(color|backgroundColor):\s*['\"]#[0-9a-fA-F]{3,6}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "__tests__" | grep -v "tokens.ts" | grep -v "colors.ts" || echo "Nenhuma cor hardcoded encontrada!"

echo ""
echo "✅ Padrões corretos:"
echo "--------------------"
echo "import { Tokens } from '@/theme/tokens';"
echo "import { useThemeColors } from '@/hooks/useTheme';"
echo ""
echo "const colors = useThemeColors();"
echo "backgroundColor: colors.background"
echo "color: Tokens.brand.primary"

echo ""
if [ "$hex_colors" -eq 0 ] && [ "$colors_imports" -eq 0 ]; then
  echo "🎉 Design system 100% migrado!"
  exit 0
else
  echo "⚠️  Encontradas $hex_colors cores hardcoded e $colors_imports imports deprecated"
  echo "   Veja detalhes acima e migre para tokens.ts"
  exit 1
fi
