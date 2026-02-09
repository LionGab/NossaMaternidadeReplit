#!/bin/bash

# Script para verificar YOLO MODE e Layout Fixo
# Uso: bash scripts/verify-yolo-mode.sh

set -e

echo "🔍 Verificando YOLO MODE e Layout Fixo..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL=0
PASSED=0
FAILED=0
WARNINGS=0

check_setting() {
  local file=$1
  local setting=$2
  local expected=$3
  local description=$4

  TOTAL=$((TOTAL + 1))

  if [ -f "$file" ]; then
    if grep -q "\"$setting\"" "$file" 2>/dev/null; then
      value=$(grep "\"$setting\"" "$file" | head -1 | sed 's/.*: *//' | sed 's/[,\"]//g' | tr -d ' ')
      if [ "$value" = "$expected" ]; then
        echo -e "${GREEN}✅${NC} $description"
        echo -e "   ${BLUE}→${NC} $setting = $value (em $file)"
        PASSED=$((PASSED + 1))
        return 0
      else
        echo -e "${YELLOW}⚠️${NC} $description"
        echo -e "   ${BLUE}→${NC} $setting = $value (esperado: $expected) em $file"
        WARNINGS=$((WARNINGS + 1))
        return 1
      fi
    else
      echo -e "${RED}❌${NC} $description"
      echo -e "   ${BLUE}→${NC} $setting não encontrado em $file"
      FAILED=$((FAILED + 1))
      return 1
    fi
  else
    echo -e "${RED}❌${NC} Arquivo $file não existe"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 YOLO MODE - Verificação"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_setting ".cursor/settings.json" "cursor.ai.autoAcceptCompletions" "true" "Auto-accept completions"
check_setting ".cursor/settings.json" "cursor.ai.autoApply" "true" "Auto-apply mudanças"
check_setting ".cursor/settings.json" "cursor.ai.skipConfirmation" "true" "Skip confirmações"
check_setting ".cursor/settings.json" "cursor.ai.autoAcceptEdits" "true" "Auto-accept edits"
check_setting ".cursor/settings.json" "editor.inlineSuggest.showToolbar" "never" "Toolbar nunca mostra"
check_setting ".vscode/settings.json" "editor.inlineSuggest.showToolbar" "never" "Toolbar nunca mostra (VS Code)"
check_setting ".vscode/settings.json" "workbench.editor.confirmBeforeClose" "never" "Sem confirmação ao fechar"
check_setting ".vscode/settings.json" "workbench.editor.confirmDelete" "false" "Sem confirmação ao deletar"
check_setting ".vscode/settings.json" "files.confirmDelete" "false" "Sem confirmação ao deletar arquivos"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 LAYOUT FIXO - Verificação"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_setting ".vscode/settings.json" "workbench.panel.defaultLocation" "bottom" "Terminal inferior"
check_setting ".vscode/settings.json" "workbench.sideBar.location" "left" "Sidebar esquerda"
check_setting ".vscode/settings.json" "workbench.editor.showTabs" "multiple" "Tabs múltiplos"
check_setting ".vscode/settings.json" "workbench.editor.enablePreview" "false" "Preview desabilitado"
check_setting ".cursor/settings.json" "workbench.panel.defaultLocation" "bottom" "Terminal inferior (Cursor)"
check_setting ".cursor/settings.json" "workbench.sideBar.location" "left" "Sidebar esquerda (Cursor)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ PERFORMANCE (8GB RAM) - Verificação"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_setting ".vscode/settings.json" "typescript.tsserver.maxTsServerMemory" "2048" "TypeScript Server: 2GB max"
check_setting ".cursor/settings.json" "cursor.ai.maxMemoryUsageMB" "2048" "Cursor AI: 2GB max"

# Verificar file watchers
if grep -q "files.watcherExclude" ".vscode/settings.json" && grep -q "node_modules" ".vscode/settings.json"; then
  echo -e "${GREEN}✅${NC} File watchers otimizados"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}❌${NC} File watchers não configurados"
  FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "Total de verificações: ${BLUE}$TOTAL${NC}"
echo -e "${GREEN}✅ Passou:${NC} $PASSED"
echo -e "${YELLOW}⚠️  Avisos:${NC} $WARNINGS"
echo -e "${RED}❌ Falhou:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✨ TUDO PERFEITO! YOLO MODE e Layout Fixo configurados corretamente!${NC}"
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Configuração OK, mas há alguns avisos${NC}"
  exit 0
else
  echo -e "${RED}❌ Algumas configurações precisam de atenção${NC}"
  exit 1
fi
