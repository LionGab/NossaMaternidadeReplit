#!/bin/bash
#
# Nossa Maternidade CLI - Terminal Funcional
# Uso: npm run nm [comando]
#
# Comandos:
#   (vazio)  - Menu interativo
#   doctor   - Health check do ambiente
#   fix      - Quick fix (lint + format + typecheck)
#   dev      - Iniciar dev server
#   ship     - Deploy para stores
#   clean    - Limpeza inteligente
#   status   - Status do projeto
#   help     - Mostrar ajuda
#

# ══════════════════════════════════════════════════════════════════════════════
# CORES E SÍMBOLOS
# ══════════════════════════════════════════════════════════════════════════════

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Estilos
BOLD='\033[1m'
DIM='\033[2m'
UNDERLINE='\033[4m'

# Símbolos
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
WARN="${YELLOW}⚠${NC}"
ARROW="${BLUE}→${NC}"
STAR="${MAGENTA}★${NC}"
HEART="${RED}♥${NC}"

# ══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════════════════

# Timer
START_TIME=$(date +%s)

elapsed_time() {
    local end_time=$(date +%s)
    local elapsed=$((end_time - START_TIME))
    if [ $elapsed -lt 60 ]; then
        echo "${elapsed}s"
    else
        local mins=$((elapsed / 60))
        local secs=$((elapsed % 60))
        echo "${mins}m ${secs}s"
    fi
}

# Print functions
print_header() {
    echo ""
    echo -e "${MAGENTA}╭─────────────────────────────────────────────────╮${NC}"
    echo -e "${MAGENTA}│${NC}  ${HEART} ${BOLD}Nossa Maternidade CLI${NC}                        ${MAGENTA}│${NC}"
    echo -e "${MAGENTA}│${NC}  ${DIM}Terminal funcional para devs${NC}                   ${MAGENTA}│${NC}"
    echo -e "${MAGENTA}╰─────────────────────────────────────────────────╯${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${CYAN}━━━ ${BOLD}$1${NC} ${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "  ${CHECK} $1"
}

print_error() {
    echo -e "  ${CROSS} $1"
}

print_warn() {
    echo -e "  ${WARN} $1"
}

print_info() {
    echo -e "  ${ARROW} $1"
}

print_star() {
    echo -e "  ${STAR} $1"
}

print_done() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${CHECK} ${BOLD}Concluído${NC} em $(elapsed_time)"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_failed() {
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${CROSS} ${BOLD}Falhou${NC} após $(elapsed_time)"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Spinner
spin() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " ${CYAN}%c${NC}  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Confirm prompt
confirm() {
    local prompt="$1"
    local default="${2:-n}"

    if [ "$default" = "y" ]; then
        prompt="$prompt [Y/n] "
    else
        prompt="$prompt [y/N] "
    fi

    echo -ne "  ${ARROW} ${prompt}"
    read -r response

    if [ -z "$response" ]; then
        response=$default
    fi

    case "$response" in
        [yY][eE][sS]|[yY]) return 0 ;;
        *) return 1 ;;
    esac
}

# ══════════════════════════════════════════════════════════════════════════════
# COMANDOS
# ══════════════════════════════════════════════════════════════════════════════

# DOCTOR - Health check
cmd_doctor() {
    print_header
    print_section "Health Check"

    local errors=0

    # Node
    if command -v node &> /dev/null; then
        local node_ver=$(node -v)
        print_success "Node ${node_ver}"
    else
        print_error "Node não encontrado"
        ((errors++))
    fi

    # npm
    if command -v npm &> /dev/null; then
        local npm_ver=$(npm -v)
        print_success "npm v${npm_ver}"
    else
        print_error "npm não encontrado"
        ((errors++))
    fi

    # bun (opcional)
    if command -v bun &> /dev/null; then
        local bun_ver=$(bun -v)
        print_success "bun v${bun_ver} ${DIM}(opcional)${NC}"
    else
        print_warn "bun não instalado ${DIM}(opcional, mas recomendado)${NC}"
    fi

    # Git
    if command -v git &> /dev/null; then
        local git_ver=$(git --version | cut -d' ' -f3)
        print_success "git v${git_ver}"
    else
        print_error "git não encontrado"
        ((errors++))
    fi

    # EAS CLI
    if command -v eas &> /dev/null || npx eas --version &> /dev/null 2>&1; then
        print_success "EAS CLI disponível"
    else
        print_warn "EAS CLI não instalado globalmente ${DIM}(usa npx)${NC}"
    fi

    print_section "Arquivos"

    # .env.local
    if [ -f ".env.local" ]; then
        print_success ".env.local existe"
    else
        print_error ".env.local não encontrado"
        ((errors++))
    fi

    # node_modules
    if [ -d "node_modules" ]; then
        local nm_count=$(ls -1 node_modules | wc -l | tr -d ' ')
        print_success "node_modules (${nm_count} pacotes)"
    else
        print_error "node_modules não existe - rode: npm install"
        ((errors++))
    fi

    # package-lock.json
    if [ -f "package-lock.json" ]; then
        print_success "package-lock.json existe"
    elif [ -f "bun.lock" ]; then
        print_success "bun.lock existe"
    else
        print_warn "Lockfile não encontrado"
    fi

    print_section "Projeto"

    # TypeScript config
    if [ -f "tsconfig.json" ]; then
        print_success "tsconfig.json configurado"
    else
        print_error "tsconfig.json não encontrado"
        ((errors++))
    fi

    # App config
    if [ -f "app.config.js" ]; then
        print_success "app.config.js existe"
    elif [ -f "app.json" ]; then
        print_success "app.json existe"
    else
        print_error "Config do Expo não encontrado"
        ((errors++))
    fi

    # Git status
    if git rev-parse --is-inside-work-tree &> /dev/null; then
        local branch=$(git branch --show-current)
        local changes=$(git status --porcelain | wc -l | tr -d ' ')
        if [ "$changes" -eq 0 ]; then
            print_success "Git: ${CYAN}${branch}${NC} (limpo)"
        else
            print_warn "Git: ${CYAN}${branch}${NC} (${changes} alterações)"
        fi
    fi

    # Resultado
    if [ $errors -eq 0 ]; then
        print_done
        echo -e "  ${GREEN}Ambiente saudável!${NC} Pronto para desenvolver."
        echo ""
    else
        print_failed
        echo -e "  ${RED}${errors} problema(s) encontrado(s).${NC}"
        echo ""
        return 1
    fi
}

# FIX - Quick fix
cmd_fix() {
    print_header
    print_section "Quick Fix"

    print_info "Executando lint:fix..."
    if npm run lint:fix 2>&1 | tail -5; then
        print_success "Lint corrigido"
    else
        print_error "Lint falhou"
        print_failed
        return 1
    fi

    print_info "Formatando código..."
    if npm run format 2>&1 | tail -3; then
        print_success "Código formatado"
    else
        print_warn "Format teve problemas (não crítico)"
    fi

    print_info "Verificando tipos..."
    if npm run typecheck 2>&1; then
        print_success "TypeScript OK"
    else
        print_error "Erros de TypeScript encontrados"
        print_failed
        return 1
    fi

    print_done
    echo -e "  ${GREEN}Código limpo e pronto!${NC}"
    echo ""
}

# DEV - Start dev server
cmd_dev() {
    print_header
    print_section "Dev Server"

    # Check if Metro is already running
    if lsof -i :8081 &> /dev/null 2>&1 || netstat -an | grep -q ":8081.*LISTEN" 2>/dev/null; then
        print_warn "Porta 8081 já em uso"
        if confirm "Limpar e reiniciar?"; then
            print_info "Limpando cache..."
            npm run clean 2>&1 | tail -3
        fi
    fi

    print_info "Iniciando Expo..."
    echo ""

    # Start with clear cache
    npm run start:clear
}

# CLEAN - Smart clean
cmd_clean() {
    print_header
    print_section "Limpeza"

    local freed=0

    print_info "Limpando cache do Metro..."
    rm -rf .expo 2>/dev/null && print_success ".expo removido"
    rm -rf node_modules/.cache 2>/dev/null && print_success "Cache de node_modules removido"

    print_info "Limpando cache do Expo..."
    npx expo start --clear --offline &
    local pid=$!
    sleep 2
    kill $pid 2>/dev/null
    print_success "Cache do Expo limpo"

    # Watchman (se existir)
    if command -v watchman &> /dev/null; then
        print_info "Limpando Watchman..."
        watchman watch-del-all 2>/dev/null && print_success "Watchman limpo"
    fi

    # Temp files
    print_info "Removendo arquivos temporários..."
    rm -rf tmp 2>/dev/null
    rm -rf .tmp 2>/dev/null
    rm -rf *.log 2>/dev/null
    print_success "Temporários removidos"

    print_done
    echo -e "  ${GREEN}Tudo limpo!${NC}"
    echo ""
}

# STATUS - Project status
cmd_status() {
    print_header
    print_section "Status do Projeto"

    # Git info
    if git rev-parse --is-inside-work-tree &> /dev/null; then
        local branch=$(git branch --show-current)
        local last_commit=$(git log -1 --pretty=format:"%h %s" 2>/dev/null)
        local changes=$(git status --porcelain | wc -l | tr -d ' ')
        local ahead=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "0")
        local behind=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")

        echo -e "  ${CYAN}Branch:${NC} ${branch}"
        echo -e "  ${CYAN}Último commit:${NC} ${last_commit}"
        echo -e "  ${CYAN}Alterações:${NC} ${changes} arquivo(s)"

        if [ "$ahead" -gt 0 ]; then
            print_warn "${ahead} commit(s) para push"
        fi
        if [ "$behind" -gt 0 ]; then
            print_warn "${behind} commit(s) para pull"
        fi
    fi

    print_section "Builds Recentes"

    # EAS builds (últimos 3)
    if command -v eas &> /dev/null || npx eas --version &> /dev/null 2>&1; then
        print_info "Buscando builds..."
        npx eas build:list --limit 3 --non-interactive 2>/dev/null | head -20 || print_warn "Não foi possível listar builds"
    else
        print_warn "EAS CLI não disponível"
    fi

    echo ""
}

# SHIP - Deploy flow
cmd_ship() {
    local platform="${1:-}"

    print_header
    print_section "Deploy"

    # Quality gate first
    print_info "Executando quality gate..."
    if ! npm run quality-gate 2>&1; then
        print_error "Quality gate falhou!"
        print_failed
        echo -e "  ${YELLOW}Corrija os erros antes de fazer deploy.${NC}"
        echo ""
        return 1
    fi
    print_success "Quality gate passou"

    # Platform selection
    if [ -z "$platform" ]; then
        echo ""
        echo -e "  Escolha a plataforma:"
        echo -e "    ${CYAN}1${NC}) iOS (App Store)"
        echo -e "    ${CYAN}2${NC}) Android (Google Play)"
        echo -e "    ${CYAN}3${NC}) Ambos"
        echo -e "    ${CYAN}0${NC}) Cancelar"
        echo ""
        echo -ne "  ${ARROW} Opção: "
        read -r choice

        case "$choice" in
            1) platform="ios" ;;
            2) platform="android" ;;
            3) platform="all" ;;
            0|"")
                print_warn "Cancelado"
                return 0
                ;;
            *)
                print_error "Opção inválida"
                return 1
                ;;
        esac
    fi

    # Build
    print_section "Build"

    case "$platform" in
        ios)
            print_info "Iniciando build iOS (production)..."
            npm run build:prod:ios
            ;;
        android)
            print_info "Iniciando build Android (production)..."
            npm run build:prod:android
            ;;
        all)
            print_info "Iniciando build iOS + Android (production)..."
            npm run build:prod
            ;;
    esac

    if [ $? -ne 0 ]; then
        print_failed
        return 1
    fi

    # Submit prompt
    echo ""
    if confirm "Submeter para a store?"; then
        print_section "Submit"

        case "$platform" in
            ios)
                print_info "Submetendo para App Store..."
                npm run submit:prod:ios
                ;;
            android)
                print_info "Submetendo para Google Play..."
                npm run submit:prod:android
                ;;
            all)
                print_info "Submetendo para ambas stores..."
                npm run submit:prod
                ;;
        esac
    fi

    print_done
    echo -e "  ${GREEN}Deploy concluído!${NC}"
    echo ""
}

# MENU - Interactive menu
cmd_menu() {
    while true; do
        print_header

        echo -e "  ${BOLD}Comandos disponíveis:${NC}"
        echo ""
        echo -e "  ${CYAN}1${NC}) ${GREEN}dev${NC}      - Iniciar servidor de desenvolvimento"
        echo -e "  ${CYAN}2${NC}) ${GREEN}fix${NC}      - Quick fix (lint + format + typecheck)"
        echo -e "  ${CYAN}3${NC}) ${GREEN}doctor${NC}   - Health check do ambiente"
        echo -e "  ${CYAN}4${NC}) ${GREEN}status${NC}   - Status do projeto"
        echo -e "  ${CYAN}5${NC}) ${GREEN}clean${NC}    - Limpeza inteligente"
        echo -e "  ${CYAN}6${NC}) ${GREEN}ship${NC}     - Deploy para stores"
        echo ""
        echo -e "  ${GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "  ${CYAN}7${NC}) ${DIM}test${NC}     - Rodar testes"
        echo -e "  ${CYAN}8${NC}) ${DIM}lint${NC}     - Verificar lint"
        echo -e "  ${CYAN}9${NC}) ${DIM}build${NC}    - Build preview"
        echo ""
        echo -e "  ${CYAN}0${NC}) ${DIM}Sair${NC}"
        echo ""
        echo -ne "  ${ARROW} Escolha: "
        read -r choice

        case "$choice" in
            1) cmd_dev; break ;;
            2) cmd_fix ;;
            3) cmd_doctor ;;
            4) cmd_status ;;
            5) cmd_clean ;;
            6) cmd_ship ;;
            7) npm test ;;
            8) npm run lint ;;
            9) npm run build:preview:ios ;;
            0|q|Q|"")
                echo ""
                echo -e "  ${HEART} Até mais!"
                echo ""
                break
                ;;
            *)
                print_warn "Opção inválida"
                sleep 1
                ;;
        esac

        if [ "$choice" != "1" ] && [ "$choice" != "6" ]; then
            echo ""
            echo -ne "  ${ARROW} Pressione Enter para continuar..."
            read -r
        fi
    done
}

# HELP - Show help
cmd_help() {
    print_header

    echo -e "  ${BOLD}Uso:${NC} npm run nm [comando]"
    echo ""
    echo -e "  ${BOLD}Comandos:${NC}"
    echo ""
    echo -e "    ${GREEN}(vazio)${NC}    Menu interativo"
    echo -e "    ${GREEN}dev${NC}        Iniciar dev server com cache limpo"
    echo -e "    ${GREEN}fix${NC}        Quick fix: lint:fix + format + typecheck"
    echo -e "    ${GREEN}doctor${NC}     Health check do ambiente"
    echo -e "    ${GREEN}status${NC}     Status do projeto e builds recentes"
    echo -e "    ${GREEN}clean${NC}      Limpeza inteligente de cache"
    echo -e "    ${GREEN}ship${NC}       Deploy completo para stores"
    echo -e "    ${GREEN}help${NC}       Mostrar esta ajuda"
    echo ""
    echo -e "  ${BOLD}Exemplos:${NC}"
    echo ""
    echo -e "    ${CYAN}npm run nm${NC}           # Abre menu interativo"
    echo -e "    ${CYAN}npm run nm fix${NC}       # Roda quick fix"
    echo -e "    ${CYAN}npm run nm ship ios${NC}  # Deploy iOS direto"
    echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

main() {
    local cmd="${1:-menu}"
    shift 2>/dev/null || true

    case "$cmd" in
        dev)     cmd_dev "$@" ;;
        fix)     cmd_fix "$@" ;;
        doctor)  cmd_doctor "$@" ;;
        status)  cmd_status "$@" ;;
        clean)   cmd_clean "$@" ;;
        ship)    cmd_ship "$@" ;;
        menu)    cmd_menu "$@" ;;
        help|-h|--help) cmd_help "$@" ;;
        *)
            print_error "Comando desconhecido: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
