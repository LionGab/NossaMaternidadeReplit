#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# Setup Terminal Premium - Leve e Rápido
# ══════════════════════════════════════════════════════════════════════════════
#
# Melhora o visual do terminal sem deixar o macOS pesado
# Opções:
#   1. Starship (recomendado - mais leve e rápido)
#   2. Prompt customizado simples (sem dependências)
#

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo ""
echo "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${CYAN}║${NC}     ${MAGENTA}✨ Terminal Premium Setup - Leve e Rápido ✨${NC}     ${CYAN}║${NC}"
echo "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detectar shell
if [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_RC="$HOME/.bash_profile"
    SHELL_NAME="bash"
else
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
fi

echo "${BLUE}📝 Shell detectado:${NC} $SHELL_NAME"
echo "${BLUE}📄 Arquivo de configuração:${NC} $SHELL_RC"
echo ""

# Verificar se Starship está instalado
STARSHIP_INSTALLED=false
if command -v starship &> /dev/null; then
    STARSHIP_INSTALLED=true
    echo "${GREEN}✅ Starship já está instalado${NC}"
else
    echo "${YELLOW}ℹ️  Starship não está instalado${NC}"
fi

echo ""
echo "${CYAN}Escolha uma opção:${NC}"
echo "  ${GREEN}1)${NC} Instalar Starship (recomendado - leve e rápido)"
echo "  ${GREEN}2)${NC} Prompt customizado simples (sem dependências)"
echo "  ${GREEN}3)${NC} Apenas melhorar cores e aliases"
echo ""
read -p "Opção [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "${BLUE}🚀 Instalando Starship...${NC}"

        if ! $STARSHIP_INSTALLED; then
            # Instalar Starship via Homebrew (mais rápido)
            if command -v brew &> /dev/null; then
                echo "${CYAN}📦 Instalando via Homebrew...${NC}"
                brew install starship
            else
                # Instalar via script oficial (fallback)
                echo "${CYAN}📦 Instalando via script oficial...${NC}"
                curl -sS https://starship.rs/install.sh | sh
            fi
        fi

        # Criar configuração Starship premium
        STARSHIP_CONFIG="$HOME/.config/starship.toml"
        mkdir -p "$HOME/.config"

        cat > "$STARSHIP_CONFIG" << 'EOF'
# ══════════════════════════════════════════════════════════════════════════════
# Starship Config - Professional Dev Layout
# ══════════════════════════════════════════════════════════════════════════════

# Formato profissional: linha única compacta
format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$nodejs\
$python\
$rust\
$docker_context\
$character"""

# Caracteres profissionais
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"
vimcmd_symbol = "[V](bold green)"

# Diretório - compacto e inteligente
[directory]
truncation_length = 2
truncate_to_repo = true
format = "[$path]($style)[$read_only]($read_only_style) "
style = "bold blue"
read_only = " 🔒"
read_only_style = "red"

# Git Branch - estilo profissional
[git_branch]
format = "on [$symbol$branch(:$remote_branch)]($style) "
symbol = "git "
style = "bold purple"
truncation_length = 20
truncation_symbol = "…"

# Git Status - indicadores profissionais
[git_status]
format = '([\[$all_status$ahead_behind\]]($style) )'
style = "bold yellow"
conflicted = "="
up_to_date = ""
untracked = "?"
ahead = "⇡${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
behind = "⇣${count}"
stashed = "📦"
disabled = false

# Node.js - só quando relevante
[nodejs]
format = "via [$symbol($version )]($style)"
symbol = "⬢ "
style = "bold green"
detect_extensions = ["js", "mjs", "cjs", "ts", "tsx", "jsx"]
detect_files = ["package.json", ".node-version"]
detect_folders = ["node_modules"]

# Python - só quando relevante
[python]
format = "via [$symbol($version )]($style)"
symbol = "🐍 "
style = "bold yellow"
detect_extensions = ["py"]
detect_files = [".python-version", "Pipfile", "requirements.txt"]
detect_folders = []

# Rust - só quando relevante
[rust]
format = "via [$symbol($version )]($style)"
symbol = "🦀 "
style = "bold red"
detect_extensions = ["rs"]
detect_files = ["Cargo.toml"]
detect_folders = []

# Docker - só quando relevante
[docker_context]
format = "via [$symbol($context )]($style) "
symbol = "🐳 "
style = "bold blue"
only_with_files = true
detect_files = ["docker-compose.yml", "Dockerfile", ".dockerignore"]
detect_folders = []

# Username - só quando necessário
[username]
format = "[$user]($style) "
style_user = "bold yellow"
style_root = "bold red"
show_always = false
disabled = false

# Hostname - só em SSH
[hostname]
ssh_only = true
ssh_symbol = "ssh "
format = "@[$hostname]($style) "
style = "bold dimmed white"
disabled = false

# Tempo de execução - para comandos longos
[cmd_duration]
min_time = 2_000
format = "took [$duration]($style) "
style = "bold yellow"
show_milliseconds = false

# Jobs em background
[jobs]
format = "[$symbol$number]($style) "
symbol = "✦ "
style = "bold blue"
number_threshold = 1

# Package version - quando em projeto
[package]
format = "is [$symbol$version]($style) "
symbol = "📦 "
style = "bold 208"
display_private = false
EOF

        echo "${GREEN}✅ Configuração Starship criada em: $STARSHIP_CONFIG${NC}"

        # Adicionar ao .zshrc se não existir
        if ! grep -q "starship init" "$SHELL_RC" 2>/dev/null; then
            echo "" >> "$SHELL_RC"
            echo "# Starship Prompt" >> "$SHELL_RC"
            echo 'eval "$(starship init zsh)"' >> "$SHELL_RC"
            echo "${GREEN}✅ Starship adicionado ao $SHELL_RC${NC}"
        fi
        ;;

    2)
        echo ""
        echo "${BLUE}🎨 Criando prompt customizado simples...${NC}"

        # Criar arquivo de prompt customizado
        PROMPT_FILE="$HOME/.zsh_prompt"

        cat > "$PROMPT_FILE" << 'PROMPT_EOF'
# ══════════════════════════════════════════════════════════════════════════════
# Prompt Customizado Professional - Layout Dev
# ══════════════════════════════════════════════════════════════════════════════

# Cores
autoload -U colors && colors

# Git info profissional
git_info() {
    local branch=$(git branch 2>/dev/null | sed -n 's/^\* \(.*\)/\1/p')
    if [ -n "$branch" ]; then
        local status=$(git status --porcelain 2>/dev/null)
        local ahead=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "0")
        local behind=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")

        local git_status=""
        if [ -n "$status" ]; then
            git_status=" %F{yellow}●%f"
        fi
        if [ "$ahead" -gt 0 ]; then
            git_status="${git_status} %F{green}⇡${ahead}%f"
        fi
        if [ "$behind" -gt 0 ]; then
            git_status="${git_status} %F{red}⇣${behind}%f"
        fi

        echo "%F{magenta}git %F{white}${branch}%f${git_status}"
    fi
}

# Node version quando em projeto Node
node_info() {
    if [ -f "package.json" ] || [ -d "node_modules" ]; then
        local node_version=$(node -v 2>/dev/null | sed 's/v//')
        if [ -n "$node_version" ]; then
            echo "%F{green}⬢ ${node_version}%f "
        fi
    fi
}

# Prompt principal - linha única profissional
setopt PROMPT_SUBST
PROMPT='%F{yellow}%n%f %F{blue}%~%f $(git_info) $(node_info)
%F{green}❯%f %f'

# Prompt de continuação
PROMPT2='%F{yellow}...%f %f'

# Prompt direito - timestamp (opcional, descomente se quiser)
# RPROMPT='%F{240}%*%f'
PROMPT_EOF

        # Adicionar ao .zshrc se não existir
        if ! grep -q ".zsh_prompt" "$SHELL_RC" 2>/dev/null; then
            echo "" >> "$SHELL_RC"
            echo "# Prompt Customizado Premium" >> "$SHELL_RC"
            echo "source \$HOME/.zsh_prompt" >> "$SHELL_RC"
            echo "${GREEN}✅ Prompt customizado adicionado ao $SHELL_RC${NC}"
        fi
        ;;

    3)
        echo ""
        echo "${BLUE}🎨 Apenas melhorando cores e aliases...${NC}"
        ;;
esac

# ══════════════════════════════════════════════════════════════════════════════
# Melhorias Gerais (sempre aplicadas)
# ══════════════════════════════════════════════════════════════════════════════

echo ""
echo "${BLUE}🎨 Aplicando melhorias gerais...${NC}"

# Criar arquivo de melhorias
IMPROVEMENTS_FILE="$HOME/.zsh_improvements"

cat > "$IMPROVEMENTS_FILE" << 'IMPROVEMENTS_EOF'
# ══════════════════════════════════════════════════════════════════════════════
# Melhorias Premium para Terminal - Leve e Rápido
# ══════════════════════════════════════════════════════════════════════════════

# Cores
autoload -U colors && colors
export CLICOLOR=1
export LSCOLORS="ExFxBxDxCxegedabagacad"

# Aliases úteis e rápidos
alias ls='ls -GFh'
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git aliases rápidos
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --decorate'
alias gd='git diff'

# Navegação rápida
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# Projeto específico
alias nm='cd ~/NossaMaternidade/NossaMaternidade'
alias nm-dev='cd ~/NossaMaternidade/NossaMaternidade && npm start'

# Histórico melhorado (leve)
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE
setopt SHARE_HISTORY

# Autocomplete melhorado (leve)
autoload -Uz compinit
compinit

# Correção automática de comandos (opcional - descomente se quiser)
# setopt CORRECT

# Auto-sugestões (se tiver zsh-autosuggestions instalado)
if [ -f /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh ]; then
    source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
fi

# Syntax highlighting (se tiver zsh-syntax-highlighting instalado)
if [ -f /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ]; then
    source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
fi
IMPROVEMENTS_EOF

# Adicionar melhorias ao .zshrc se não existir
if ! grep -q ".zsh_improvements" "$SHELL_RC" 2>/dev/null; then
    echo "" >> "$SHELL_RC"
    echo "# Melhorias Premium do Terminal" >> "$SHELL_RC"
    echo "source \$HOME/.zsh_improvements" >> "$SHELL_RC"
    echo "${GREEN}✅ Melhorias adicionadas ao $SHELL_RC${NC}"
fi

echo ""
echo "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${GREEN}║${NC}                    ${MAGENTA}✅ Concluído!${NC}                    ${GREEN}║${NC}"
echo "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "${CYAN}📝 Próximos passos:${NC}"
echo "   1. Recarregue o terminal: ${YELLOW}source $SHELL_RC${NC}"
echo "   2. Ou abra uma nova aba/janela do terminal"
echo ""
echo "${CYAN}💡 Dicas:${NC}"
echo "   • Starship é muito leve (<1MB RAM)"
echo "   • Prompt customizado não usa RAM extra"
echo "   • Melhorias são otimizadas para performance"
echo ""
