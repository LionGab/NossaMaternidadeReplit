# Aliases para Otimização de RAM - MacBook 8GB
# Adicionar ao ~/.zshrc (macOS usa zsh por padrão)
# 
# Criado: 2026-02-10
# Uso: source ~/.zshrc (após adicionar)

# ============================================
# ALIASES DE MEMÓRIA
# ============================================

# Ver status de memória (swap + top 10 processos)
alias memcheck='echo "📊 Status de Swap:" && sysctl vm.swapusage && echo "" && echo "🔝 Top 10 processos por RAM:" && ps aux | awk "{print \$2, \$4, \$11}" | sort -k2 -rn | head -10'

# Limpar memória (requer sudo)
alias mempurge='sudo purge && echo "✅ Memória limpa!"'

# Matar MCP servers órfãos
alias memkill='pkill -f "context7-mcp" 2>/dev/null; pkill -f "playwright-mcp" 2>/dev/null; pkill -f "mcp-server-sequential-thinking" 2>/dev/null; pkill -f "mcp-server-github" 2>/dev/null; pkill -f "react-native-debugger-mcp" 2>/dev/null; echo "✅ MCP servers órfãos limpos!"'

# Limpeza completa (memkill + mempurge)
alias memclean='memkill && mempurge'

# ============================================
# ALIASES DE PROCESSOS
# ============================================

# Contar processos Cursor
alias pscursor='echo "🖱️  Processos Cursor: $(ps aux | grep -i cursor | grep -v grep | wc -l | tr -d " ")"'

# Contar processos Node (MCP)
alias psnode='echo "📦 Processos Node/MCP: $(ps aux | grep node | grep -v grep | wc -l | tr -d " ")"'

# Contar processos Chrome
alias pschrome='echo "🌐 Processos Chrome: $(ps aux | grep -i chrome | grep -v grep | wc -l | tr -d " ")"'

# Contar todos de uma vez
alias psall='pscursor && psnode && pschrome'

# ============================================
# ALIASES DO PROJETO
# ============================================

# Ir para o projeto
alias cdnm='cd "/Users/lion/Documents/NossaMaternidade - GO/NossaMaternidadeReplit"'

# Limpeza rápida de RAM do projeto
alias nmram='cdnm && npm run ram:quick-clean'

# Limpar caches do projeto
alias nmcache='cdnm && npm run optimize:macos:cache'

# Quality gate
alias nmqg='cdnm && npm run quality-gate'

# ============================================
# ALIASES DE MONITORAMENTO
# ============================================

# Ver status completo do sistema
alias memstatus='memcheck && echo "" && psall'

# ============================================
# INSTRUÇÕES DE USO
# ============================================
#
# 1. Copiar todo este arquivo para o clipboard
# 2. Abrir ~/.zshrc: nano ~/.zshrc
# 3. Colar no final do arquivo
# 4. Salvar: Ctrl+O, Enter, Ctrl+X
# 5. Recarregar: source ~/.zshrc
#
# COMANDOS ÚTEIS:
#   memcheck    - Ver swap + top 10 processos por RAM
#   mempurge    - Limpar memória (requer sudo)
#   memkill     - Matar MCP servers órfãos
#   memclean    - Limpeza completa (memkill + mempurge)
#   memstatus   - Status completo do sistema
#   pscursor    - Contar processos Cursor
#   psnode      - Contar processos Node/MCP
#   pschrome    - Contar processos Chrome
#   psall       - Contar todos os processos
#   nmram       - Limpeza rápida de RAM do projeto
#   nmcache     - Limpar caches do projeto
#   nmqg        - Quality gate do projeto
#   cdnm        - Ir para o projeto
