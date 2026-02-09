#!/bin/bash

# ============================================
# Pre-Build Validation Script
# Nossa Maternidade - MVP TestFlight Ready
# ============================================
# Valida projeto antes de build EAS
# Retorna exit code 0 se tudo OK, 1 se houver erros
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

echo "🔍 Validando projeto antes do build..."
echo ""

# ============================================
# 1. Check Environment Variables
# ============================================
echo "📋 Verificando variáveis de ambiente..."

if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}⚠️  .env.local não encontrado${NC}"
  echo "   Criando a partir de .env.example..."
  if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo -e "${YELLOW}   ⚠️  Preencha .env.local com suas credenciais${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${RED}✗ .env.example não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${GREEN}✓ .env.local existe${NC}"
fi

# Check required vars
REQUIRED_VARS=(
  "EXPO_PUBLIC_SUPABASE_URL"
  "EXPO_PUBLIC_SUPABASE_ANON_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
  if grep -q "^${var}=" .env.local 2>/dev/null; then
    VALUE=$(grep "^${var}=" .env.local | cut -d '=' -f2)
    if [ -z "$VALUE" ] || [ "$VALUE" = "" ]; then
      echo -e "${RED}✗ ${var} está vazio${NC}"
      ERRORS=$((ERRORS + 1))
    else
      echo -e "${GREEN}✓ ${var} configurado${NC}"
    fi
  else
    echo -e "${RED}✗ ${var} não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""

# ============================================
# 2. TypeScript Check
# ============================================
echo "📘 Verificando TypeScript..."

if npm run typecheck > /dev/null 2>&1; then
  echo -e "${GREEN}✓ TypeScript sem erros${NC}"
else
  echo -e "${RED}✗ TypeScript com erros${NC}"
  echo "   Execute: npm run typecheck"
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# 3. ESLint Check
# ============================================
echo "🔍 Verificando ESLint..."

if npm run lint > /dev/null 2>&1; then
  echo -e "${GREEN}✓ ESLint sem warnings críticos${NC}"
else
  echo -e "${YELLOW}⚠️  ESLint com warnings${NC}"
  echo "   Execute: npm run lint"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# 4. Check for console.log
# ============================================
echo "📝 Verificando uso de console.log..."

CONSOLE_COUNT=$(grep -r "console\." src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "console.error" | grep -v "console.warn" | wc -l || echo "0")

if [ "$CONSOLE_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✓ Nenhum console.log encontrado${NC}"
else
  echo -e "${RED}✗ ${CONSOLE_COUNT} console.log encontrado(s)${NC}"
  echo "   Use logger.* ao invés de console.*"
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# 5. Check for hardcoded colors
# ============================================
echo "🎨 Verificando cores hardcoded..."

HARDCODED_COLORS=$(grep -rE "(#[0-9A-Fa-f]{3,6}|rgba?\(|'white'|'black')" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "//" | grep -v "logger" | wc -l || echo "0")

if [ "$HARDCODED_COLORS" -eq 0 ]; then
  echo -e "${GREEN}✓ Nenhuma cor hardcoded encontrada${NC}"
else
  echo -e "${YELLOW}⚠️  ${HARDCODED_COLORS} cor(es) hardcoded encontrada(s)${NC}"
  echo "   Use tokens de src/theme/tokens.ts"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# 6. Check EAS Configuration
# ============================================
echo "⚙️  Verificando configuração EAS..."

if [ -f "eas.json" ]; then
  echo -e "${GREEN}✓ eas.json existe${NC}"

  # Check if preview profile exists
  if grep -q '"preview"' eas.json; then
    echo -e "${GREEN}✓ Profile 'preview' configurado${NC}"
  else
    echo -e "${YELLOW}⚠️  Profile 'preview' não encontrado${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi

  # Check if production profile exists
  if grep -q '"production"' eas.json; then
    echo -e "${GREEN}✓ Profile 'production' configurado${NC}"
  else
    echo -e "${YELLOW}⚠️  Profile 'production' não encontrado${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}✗ eas.json não encontrado${NC}"
  echo "   Execute: eas build:configure"
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# Summary
# ============================================
echo "=========================================="
echo "📊 Resumo da Validação"
echo "=========================================="
echo -e "Erros: ${RED}${ERRORS}${NC}"
echo -e "Avisos: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ Tudo OK! Pronto para build.${NC}"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Build pode prosseguir, mas há avisos.${NC}"
  exit 0
else
  echo -e "${RED}❌ Corrija os erros antes de fazer build.${NC}"
  exit 1
fi
