#!/bin/bash
set -e

# ============================================
# Setup MacBook 2020 - Nossa Maternidade
# Aplica otimizações para hardware limitado
# ============================================

RESET='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'

echo -e "${BLUE}================================${RESET}"
echo -e "${BLUE}MacBook 2020 Setup - Honesto${RESET}"
echo -e "${BLUE}================================${RESET}\n"

# Detecta modelo
echo -e "${YELLOW}Detectando hardware...${RESET}"
TOTAL_RAM=$(sysctl hw.memsize | awk '{print $2/1024/1024/1024}')
CPU_CORES=$(sysctl -n hw.ncpu)
MODEL=$(system_profiler SPHardwareDataType | grep "Model Name" | awk -F': ' '{print $2}')

echo -e "  Modelo: ${GREEN}${MODEL}${RESET}"
echo -e "  RAM: ${GREEN}${TOTAL_RAM}GB${RESET}"
echo -e "  CPUs: ${GREEN}${CPU_CORES} cores${RESET}\n"

# Validação
if (( $(echo "$TOTAL_RAM < 12" | bc -l) )); then
  echo -e "${YELLOW}⚠️  RAM < 12GB detectada - setup conservador será aplicado${RESET}\n"
  CONSERVATIVE=true
else
  echo -e "${GREEN}✅ RAM >= 12GB - setup padrão${RESET}\n"
  CONSERVATIVE=false
fi

# Backup
echo -e "${YELLOW}1. Criando backups...${RESET}"
mkdir -p ~/Desktop/nm-setup-backup-$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=~/Desktop/nm-setup-backup-$(date +%Y%m%d-%H%M%S)

if [ -f .vscode/settings.json ]; then
  cp .vscode/settings.json "$BACKUP_DIR/settings.json.backup"
  echo -e "  ${GREEN}✓${RESET} .vscode/settings.json → backup"
fi

if [ -f .claude/settings.json ]; then
  cp .claude/settings.json "$BACKUP_DIR/claude-settings.json.backup"
  echo -e "  ${GREEN}✓${RESET} .claude/settings.json → backup"
fi

# Aplicar configs VSCode
echo -e "\n${YELLOW}2. Otimizando VSCode/Cursor...${RESET}"

if [ "$CONSERVATIVE" = true ]; then
  # RAM < 12GB: aplica config conservadora
  cat > .vscode/settings.local.json << 'EOF'
{
  "typescript.tsserver.maxTsServerMemory": 2048,
  "editor.minimap.enabled": false,
  "editor.inlayHints.enabled": "offUnlessPressed",
  "typescript.referencesCodeLens.enabled": false,
  "typescript.implementationsCodeLens.enabled": false,
  "workbench.localHistory.enabled": false,
  "git.autofetch": false,
  "search.searchOnType": false
}
EOF
  echo -e "  ${GREEN}✓${RESET} Config conservadora aplicada (RAM < 12GB)"
else
  # RAM >= 12GB: config moderada
  cat > .vscode/settings.local.json << 'EOF'
{
  "typescript.tsserver.maxTsServerMemory": 4096,
  "editor.minimap.enabled": true,
  "editor.inlayHints.enabled": "onUnlessPressed"
}
EOF
  echo -e "  ${GREEN}✓${RESET} Config moderada aplicada (RAM >= 12GB)"
fi

# Aplicar configs Claude
echo -e "\n${YELLOW}3. Otimizando Claude Code...${RESET}"

if [ "$CONSERVATIVE" = true ]; then
  cat > .claude/settings.local.json << 'EOF'
{
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "UserPromptSubmit": []
  },
  "statusline": {
    "enabled": false
  },
  "mcp": {
    "servers": {}
  }
}
EOF
  echo -e "  ${GREEN}✓${RESET} Hooks desabilitados (economiza CPU)"
  echo -e "  ${GREEN}✓${RESET} MCP servers desabilitados"
else
  cat > .claude/settings.local.json << 'EOF'
{
  "hooks": {
    "PostToolUse": []
  },
  "statusline": {
    "enabled": true,
    "refreshIntervalMs": 30000
  }
}
EOF
  echo -e "  ${GREEN}✓${RESET} Hooks parcialmente desabilitados"
  echo -e "  ${GREEN}✓${RESET} Status line reduzido (30s refresh)"
fi

# Limpar pastas desnecessárias
echo -e "\n${YELLOW}4. Limpando pastas duplicadas...${RESET}"

DIRS_TO_REMOVE=(.agent .codebuddy .codex .continue .gemini .kiro .opencode .qoder .roo .trae .windsurf)

for dir in "${DIRS_TO_REMOVE[@]}"; do
  if [ -d "$dir" ]; then
    cp -r "$dir" "$BACKUP_DIR/" 2>/dev/null || true
    rm -rf "$dir"
    echo -e "  ${GREEN}✓${RESET} Removido $dir (backup em $BACKUP_DIR)"
  fi
done

# Desabilitar rules pesadas
if [ "$CONSERVATIVE" = true ]; then
  echo -e "\n${YELLOW}5. Desabilitando rules pesadas...${RESET}"
  
  if [ -f .claude/rules/workflows/bug-fixing.mdc ]; then
    mv .claude/rules/workflows/bug-fixing.mdc .claude/rules/workflows/bug-fixing.mdc.disabled
    echo -e "  ${GREEN}✓${RESET} bug-fixing.mdc → disabled"
  fi
  
  if [ -f .claude/rules/workflows/new-feature.mdc ]; then
    mv .claude/rules/workflows/new-feature.mdc .claude/rules/workflows/new-feature.mdc.disabled
    echo -e "  ${GREEN}✓${RESET} new-feature.mdc → disabled"
  fi
fi

# Configurar shell
echo -e "\n${YELLOW}6. Otimizando shell environment...${RESET}"

SHELL_RC=""
if [ -f ~/.zshrc ]; then
  SHELL_RC=~/.zshrc
elif [ -f ~/.bash_profile ]; then
  SHELL_RC=~/.bash_profile
fi

if [ -n "$SHELL_RC" ]; then
  # Verifica se já existe
  if ! grep -q "NODE_OPTIONS.*max-old-space-size" "$SHELL_RC"; then
    cat >> "$SHELL_RC" << 'EOF'

# ============================================
# Nossa Maternidade - MacBook 2020 Optimizations
# ============================================
export NODE_OPTIONS="--max-old-space-size=2048"
export EXPO_NO_METRO_LAZY=true
export EXPO_METRO_MAX_WORKERS=2
EOF
    echo -e "  ${GREEN}✓${RESET} Variáveis adicionadas a $SHELL_RC"
    echo -e "  ${YELLOW}⚠️  Execute: source $SHELL_RC${RESET}"
  else
    echo -e "  ${BLUE}ℹ${RESET}  Variáveis já configuradas"
  fi
fi

# Git config
echo -e "\n${YELLOW}7. Otimizando Git...${RESET}"
git config --global fetch.parallel 2
git config --global core.preloadindex true
git config --global core.fscache true
echo -e "  ${GREEN}✓${RESET} Git config otimizado"

# Resumo
echo -e "\n${BLUE}================================${RESET}"
echo -e "${GREEN}✅ Setup completo!${RESET}"
echo -e "${BLUE}================================${RESET}\n"

echo -e "${YELLOW}Próximos passos:${RESET}"
echo -e "  1. ${BLUE}Reinicie Cursor${RESET}"
echo -e "  2. ${BLUE}source $SHELL_RC${RESET} (se aplicável)"
echo -e "  3. ${BLUE}Leia MACBOOK_2020_SETUP.md${RESET}\n"

echo -e "${YELLOW}Backup salvo em:${RESET}"
echo -e "  ${GREEN}$BACKUP_DIR${RESET}\n"

if [ "$CONSERVATIVE" = true ]; then
  echo -e "${YELLOW}Modo conservador ativo (RAM < 12GB)${RESET}"
  echo -e "  - Hooks desabilitados"
  echo -e "  - MCP desabilitado"
  echo -e "  - TypeScript limit: 2GB"
  echo -e "  - Minimap desabilitado\n"
fi

echo -e "${BLUE}Para reverter: cp $BACKUP_DIR/* .vscode/ && cp $BACKUP_DIR/* .claude/${RESET}\n"
