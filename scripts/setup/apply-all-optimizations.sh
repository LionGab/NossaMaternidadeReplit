#!/bin/bash
# Script Unificado: Aplica TODAS as otimizações (Claude Code + Cursor + macOS)
# Uso: bash scripts/apply-all-optimizations.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 APLICANDO TODAS AS OTIMIZAÇÕES UNIFICADAS"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fase 1: Otimizações macOS (base)
echo -e "${BLUE}📱 FASE 1: Otimizações macOS${NC}"
echo "-----------------------------------"
bash "$SCRIPT_DIR/macos/memory-optimization.sh"
bash "$SCRIPT_DIR/macos/system-optimization.sh"
bash "$SCRIPT_DIR/macos/cleanup-cache.sh"
bash "$SCRIPT_DIR/macos/optimize-dns.sh"
echo ""

# Fase 2: Verificar estrutura MDC
echo -e "${BLUE}📋 FASE 2: Verificando estrutura MDC${NC}"
echo "-----------------------------------"
if [ -d "$PROJECT_ROOT/.claude/rules/always" ]; then
  echo -e "${GREEN}✅ Estrutura MDC já existe${NC}"
  ls -1 "$PROJECT_ROOT/.claude/rules/always/" | wc -l | xargs echo "   Regras 'always':"
  ls -1 "$PROJECT_ROOT/.claude/rules/frontend/" 2>/dev/null | wc -l | xargs echo "   Regras 'frontend':"
  ls -1 "$PROJECT_ROOT/.claude/rules/backend/" 2>/dev/null | wc -l | xargs echo "   Regras 'backend':"
else
  echo -e "${YELLOW}⚠️  Estrutura MDC não encontrada. Execute primeiro o plano de governança Claude Code.${NC}"
fi
echo ""

# Fase 3: Verificar configurações
echo -e "${BLUE}⚙️  FASE 3: Verificando configurações${NC}"
echo "-----------------------------------"

# Verificar .vscode/settings.json
if [ -f "$PROJECT_ROOT/.vscode/settings.json" ]; then
  echo -e "${GREEN}✅ .vscode/settings.json existe${NC}"

  # Verificar se tem otimizações
  if grep -q "typescript.tsserver.maxTsServerMemory" "$PROJECT_ROOT/.vscode/settings.json"; then
    echo -e "${GREEN}   ✅ Otimizações TypeScript encontradas${NC}"
  else
    echo -e "${YELLOW}   ⚠️  Otimizações TypeScript não encontradas. Consulte docs/PLANO_UNIFICADO_OTIMIZACAO_COMPLETA.md${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  .vscode/settings.json não encontrado${NC}"
fi

# Verificar .cursor/settings.json
if [ -f "$PROJECT_ROOT/.cursor/settings.json" ]; then
  echo -e "${GREEN}✅ .cursor/settings.json existe${NC}"
else
  echo -e "${YELLOW}⚠️  .cursor/settings.json não encontrado. Será criado...${NC}"
  mkdir -p "$PROJECT_ROOT/.cursor"
  cat > "$PROJECT_ROOT/.cursor/settings.json" << 'EOF'
{
  "claude": {
    "maxContextTokens": 49000,
    "compactThreshold": 0.65,
    "autoCompact": true,
    "compactInterval": 300
  },
  "cursor": {
    "inlineSuggest": {
      "enabled": true,
      "delay": 300
    },
    "autocomplete": {
      "enabled": true,
      "maxResults": 5
    }
  }
}
EOF
  echo -e "${GREEN}   ✅ .cursor/settings.json criado${NC}"
fi

# Verificar .claude/settings.json
if [ -f "$PROJECT_ROOT/.claude/settings.json" ]; then
  echo -e "${GREEN}✅ .claude/settings.json existe${NC}"

  # Verificar autoCompact
  if grep -q '"triggerTokens": 49000' "$PROJECT_ROOT/.claude/settings.json"; then
    echo -e "${GREEN}   ✅ autoCompact configurado para 70%${NC}"
  else
    echo -e "${YELLOW}   ⚠️  autoCompact pode precisar de ajuste${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  .claude/settings.json não encontrado${NC}"
fi
echo ""

# Fase 4: Status de memória
echo -e "${BLUE}💾 FASE 4: Status de memória${NC}"
echo "-----------------------------------"
bash "$SCRIPT_DIR/macos/monitor-memory.sh"
echo ""

# Resumo
echo -e "${GREEN}✅ OTIMIZAÇÕES APLICADAS!${NC}"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "   1. Reinicie o Cursor IDE para aplicar configurações"
echo "   2. Execute: npm run monitor:macos:memory:daemon (opcional)"
echo "   3. Verifique documentação: docs/PLANO_UNIFICADO_OTIMIZACAO_COMPLETA.md"
echo ""
echo "🔍 VERIFICAÇÃO:"
echo "   - Memória: npm run monitor:macos:memory"
echo "   - Sistema: npm run monitor:macos"
echo "   - Contexto Claude: Use /context no Cursor"
echo ""
