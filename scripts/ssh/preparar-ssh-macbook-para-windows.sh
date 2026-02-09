#!/bin/bash

# Script para preparar o MacBook para conectar ao Windows via SSH
# Este script configura apenas o lado do cliente (MacBook)
#
# Uso:
#   ./scripts/preparar-ssh-macbook-para-windows.sh [IP_DO_WINDOWS] [USUARIO_WINDOWS]

set -euo pipefail

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_step() {
    echo -e "${CYAN}[PASSO]${NC} $1"
}

# Banner
echo ""
echo "================================================"
echo -e "${CYAN}Preparação SSH - MacBook para Windows${NC}"
echo "================================================"
echo ""

# Verificar se está no macOS
if [[ "$(uname)" != "Darwin" ]]; then
    log_error "Este script deve ser executado no macOS"
    exit 1
fi

# Parâmetros
WINDOWS_IP="${1:-}"
WINDOWS_USER="${2:-}"

# ============================================
# PASSO 1: Verificar/Criar Diretório .ssh
# ============================================
log_step "1/4 - Verificando diretório .ssh..."

SSH_DIR="$HOME/.ssh"
if [[ ! -d "$SSH_DIR" ]]; then
    log_info "Criando diretório .ssh..."
    mkdir -p "$SSH_DIR"
    chmod 700 "$SSH_DIR"
    log_success "Diretório .ssh criado"
else
    log_success "Diretório .ssh já existe"
fi

# ============================================
# PASSO 2: Verificar/Criar Chave SSH
# ============================================
log_step "2/4 - Verificando chaves SSH..."

SSH_KEYS=(
    "$SSH_DIR/id_ed25519"
    "$SSH_DIR/id_rsa"
    "$SSH_DIR/id_ecdsa"
)

CHAVE_ENCONTRADA=""
for key in "${SSH_KEYS[@]}"; do
    if [[ -f "$key" ]]; then
        CHAVE_ENCONTRADA="$key"
        break
    fi
done

if [[ -z "$CHAVE_ENCONTRADA" ]]; then
    log_warning "Nenhuma chave SSH encontrada"
    read -p "Deseja gerar uma nova chave SSH? (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        log_info "Gerando nova chave SSH (ed25519)..."
        ssh-keygen -t ed25519 -C "$(whoami)@macbook" -f "$SSH_DIR/id_ed25519" -N ""
        CHAVE_ENCONTRADA="$SSH_DIR/id_ed25519"
        log_success "Chave SSH gerada: $CHAVE_ENCONTRADA"
    else
        log_warning "Você precisará gerar uma chave SSH depois"
    fi
else
    log_success "Chave SSH encontrada: $CHAVE_ENCONTRADA"
fi

# Exibir chave pública
if [[ -n "$CHAVE_ENCONTRADA" ]]; then
    CHAVE_PUBLICA="${CHAVE_ENCONTRADA}.pub"
    if [[ -f "$CHAVE_PUBLICA" ]]; then
        echo ""
        log_info "Sua chave pública SSH:"
        echo ""
        cat "$CHAVE_PUBLICA"
        echo ""
        log_info "Copie esta chave para adicionar ao Windows depois"
    fi
fi

# ============================================
# PASSO 3: Configurar SSH Config
# ============================================
log_step "3/4 - Configurando SSH config..."

SSH_CONFIG="$SSH_DIR/config"

# Solicitar informações se não fornecidas
if [[ -z "$WINDOWS_IP" ]]; then
    echo ""
    read -p "Digite o IP do Windows (ou pressione Enter para pular): " WINDOWS_IP
fi

if [[ -z "$WINDOWS_USER" ]]; then
    echo ""
    read -p "Digite o usuário do Windows (ou pressione Enter para pular): " WINDOWS_USER
fi

# Criar/atualizar config
if [[ -n "$WINDOWS_IP" && -n "$WINDOWS_USER" ]]; then
    # Verificar se já existe configuração para windows-remoto
    if grep -q "^Host windows-remoto" "$SSH_CONFIG" 2>/dev/null; then
        log_warning "Configuração 'windows-remoto' já existe em $SSH_CONFIG"
        read -p "Deseja atualizar? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            # Remover configuração antiga
            sed -i.bak '/^Host windows-remoto$/,/^$/d' "$SSH_CONFIG" 2>/dev/null || true
        else
            log_info "Mantendo configuração existente"
            WINDOWS_IP=""
            WINDOWS_USER=""
        fi
    fi

    if [[ -n "$WINDOWS_IP" && -n "$WINDOWS_USER" ]]; then
        # Adicionar nova configuração
        {
            echo ""
            echo "Host windows-remoto"
            echo "    HostName $WINDOWS_IP"
            echo "    User $WINDOWS_USER"
            echo "    Port 22"
            if [[ -n "$CHAVE_ENCONTRADA" ]]; then
                echo "    IdentityFile $CHAVE_ENCONTRADA"
            fi
            echo "    ServerAliveInterval 60"
            echo "    ServerAliveCountMax 3"
            echo ""
        } >> "$SSH_CONFIG"

        log_success "Configuração adicionada ao $SSH_CONFIG"
    fi
else
    log_info "Informações não fornecidas. Configure manualmente:"
    echo ""
    echo "Edite: $SSH_CONFIG"
    echo ""
    echo "Adicione:"
    echo "Host windows-remoto"
    echo "    HostName IP_DO_WINDOWS"
    echo "    User USUARIO_WINDOWS"
    echo "    Port 22"
    if [[ -n "$CHAVE_ENCONTRADA" ]]; then
        echo "    IdentityFile $CHAVE_ENCONTRADA"
    fi
    echo "    ServerAliveInterval 60"
    echo "    ServerAliveCountMax 3"
fi

# ============================================
# PASSO 4: Resumo e Próximos Passos
# ============================================
log_step "4/4 - Resumo..."

echo ""
echo "================================================"
echo -e "${CYAN}RESUMO${NC}"
echo "================================================"
echo ""

log_success "Diretório .ssh configurado"

if [[ -n "$CHAVE_ENCONTRADA" ]]; then
    log_success "Chave SSH: $CHAVE_ENCONTRADA"
    echo ""
    log_info "PRÓXIMO PASSO: Adicione sua chave pública ao Windows"
    echo ""
    echo "No Windows, execute (como Administrador):"
    echo "  .\scripts\configurar-ssh-windows.ps1 -ChavePublica \"$(cat "$CHAVE_PUBLICA")\""
    echo ""
    echo "Ou copie e cole a chave pública acima no comando."
else
    log_warning "Nenhuma chave SSH configurada"
fi

if [[ -n "$WINDOWS_IP" && -n "$WINDOWS_USER" ]]; then
    log_success "Configuração SSH adicionada"
    echo ""
    log_info "PRÓXIMO PASSO: Configure o servidor SSH no Windows"
    echo ""
    echo "No Windows, execute (como Administrador):"
    echo "  .\scripts\configurar-ssh-windows-completo.ps1"
    echo ""
    echo "Depois, teste a conexão:"
    echo "  ssh windows-remoto"
else
    log_warning "Configuração SSH não foi adicionada automaticamente"
    echo ""
    log_info "Configure manualmente editando: $SSH_CONFIG"
fi

echo ""
echo "================================================"
echo ""
