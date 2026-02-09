#!/bin/bash

# Script de Configuração SSH para MacBook Remoto
# Automatiza a configuração necessária para permitir conexões SSH remotas
#
# Uso:
#   ./configurar-ssh-macbook.sh [--chave-publica "ssh-ed25519 AAAAC3..."]
#
# Exemplo:
#   ./configurar-ssh-macbook.sh --chave-publica "$(cat ~/.ssh/id_ed25519.pub)"

set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variáveis
CHAVE_PUBLICA=""
VERBOSE=false

# Função para exibir mensagens
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

# Função para exibir ajuda
show_help() {
    cat << EOF
Script de Configuração SSH para MacBook Remoto

Uso:
    $0 [OPÇÕES]

Opções:
    --chave-publica "chave"    Adiciona uma chave pública SSH ao authorized_keys
    --verbose                  Exibe informações detalhadas
    --help                     Exibe esta ajuda

Exemplos:
    # Configuração básica (apenas habilita SSH)
    $0

    # Configuração completa com chave pública
    $0 --chave-publica "\$(cat ~/.ssh/id_ed25519.pub)"

    # Com chave de arquivo
    $0 --chave-publica "\$(cat /caminho/para/id_rsa.pub)"

EOF
}

# Parse de argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --chave-publica)
            CHAVE_PUBLICA="$2"
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            log_error "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Banner
echo ""
echo "================================================"
echo -e "${CYAN}Configuração SSH para MacBook Remoto${NC}"
echo "================================================"
echo ""

# Verificar se está rodando no macOS
if [[ "$(uname)" != "Darwin" ]]; then
    log_error "Este script deve ser executado no macOS"
    exit 1
fi

# Verificar se está rodando como root (não recomendado, mas alguns comandos precisam sudo)
if [[ $EUID -eq 0 ]]; then
    log_warning "Executando como root. Alguns comandos podem não funcionar corretamente."
fi

# ============================================
# PASSO 1: Verificar IP Atual
# ============================================
log_step "1/6 - Verificando IP atual do MacBook..."

IP_WIFI=$(ipconfig getifaddr en0 2>/dev/null || echo "")
IP_ETHERNET=$(ipconfig getifaddr en1 2>/dev/null || echo "")

if [[ -n "$IP_WIFI" ]]; then
    log_success "IP Wi-Fi (en0): $IP_WIFI"
fi

if [[ -n "$IP_ETHERNET" ]]; then
    log_success "IP Ethernet (en1): $IP_ETHERNET"
fi

if [[ -z "$IP_WIFI" && -z "$IP_ETHERNET" ]]; then
    log_warning "Nenhum IP encontrado. Verifique a conexão de rede."
    IP_ATUAL="N/A"
else
    IP_ATUAL="${IP_WIFI:-$IP_ETHERNET}"
fi

echo ""

# ============================================
# PASSO 2: Habilitar SSH (Remote Login)
# ============================================
log_step "2/6 - Habilitando SSH (Remote Login)..."

SSH_STATUS=$(sudo systemsetup -getremotelogin 2>/dev/null | grep -i "on" || echo "")

if [[ -n "$SSH_STATUS" ]]; then
    log_success "SSH já está habilitado"
else
    log_info "Habilitando SSH..."
    if sudo systemsetup -setremotelogin on 2>/dev/null; then
        log_success "SSH habilitado com sucesso"
    else
        log_error "Falha ao habilitar SSH. Verifique as permissões."
        log_info "Alternativa: System Preferences > Sharing > Remote Login"
        exit 1
    fi
fi

# Verificar novamente
SSH_STATUS=$(sudo systemsetup -getremotelogin 2>/dev/null)
log_info "Status SSH: $SSH_STATUS"

echo ""

# ============================================
# PASSO 3: Configurar Firewall
# ============================================
log_step "3/6 - Configurando firewall..."

FIREWALL_STATUS=$(sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null | grep -i "on" || echo "")

if [[ -n "$FIREWALL_STATUS" ]]; then
    log_info "Firewall está ativo. Configurando permissões para SSH..."

    # Adicionar SSH ao firewall se ainda não estiver
    if sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/sbin/sshd 2>/dev/null; then
        log_success "SSH adicionado ao firewall"
    else
        log_warning "SSH pode já estar configurado no firewall"
    fi

    # Permitir SSH explicitamente
    if sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/sbin/sshd 2>/dev/null; then
        log_success "SSH desbloqueado no firewall"
    else
        log_warning "Não foi possível desbloquear SSH no firewall (pode já estar desbloqueado)"
    fi
else
    log_info "Firewall não está ativo. Nenhuma ação necessária."
fi

echo ""

# ============================================
# PASSO 4: Criar Diretório .ssh e Configurar Permissões
# ============================================
log_step "4/6 - Configurando diretório .ssh..."

SSH_DIR="$HOME/.ssh"

if [[ ! -d "$SSH_DIR" ]]; then
    log_info "Criando diretório .ssh..."
    mkdir -p "$SSH_DIR"
    chmod 700 "$SSH_DIR"
    log_success "Diretório .ssh criado"
else
    log_success "Diretório .ssh já existe"
    # Garantir permissões corretas
    chmod 700 "$SSH_DIR" 2>/dev/null || true
fi

# Criar authorized_keys se não existir
AUTHORIZED_KEYS="$SSH_DIR/authorized_keys"
if [[ ! -f "$AUTHORIZED_KEYS" ]]; then
    touch "$AUTHORIZED_KEYS"
    chmod 600 "$AUTHORIZED_KEYS"
    log_success "Arquivo authorized_keys criado"
else
    log_success "Arquivo authorized_keys já existe"
    # Garantir permissões corretas
    chmod 600 "$AUTHORIZED_KEYS" 2>/dev/null || true
fi

echo ""

# ============================================
# PASSO 5: Adicionar Chave Pública (se fornecida)
# ============================================
log_step "5/6 - Configurando chaves SSH..."

if [[ -n "$CHAVE_PUBLICA" ]]; then
    log_info "Adicionando chave pública ao authorized_keys..."

    # Verificar se a chave já existe
    if grep -Fxq "$CHAVE_PUBLICA" "$AUTHORIZED_KEYS" 2>/dev/null; then
        log_warning "Esta chave já está no authorized_keys"
    else
        echo "$CHAVE_PUBLICA" >> "$AUTHORIZED_KEYS"
        chmod 600 "$AUTHORIZED_KEYS"
        log_success "Chave pública adicionada com sucesso"
    fi
else
    log_info "Nenhuma chave pública fornecida. Pulando adição de chave."
    log_info "Para adicionar uma chave depois, execute:"
    log_info "  echo 'sua-chave-publica' >> ~/.ssh/authorized_keys"
fi

# Listar chaves existentes
CHAVES_COUNT=$(wc -l < "$AUTHORIZED_KEYS" 2>/dev/null || echo "0")
if [[ "$CHAVES_COUNT" -gt 0 ]]; then
    log_info "Total de chaves no authorized_keys: $CHAVES_COUNT"
fi

echo ""

# ============================================
# PASSO 6: Testar SSH Localmente
# ============================================
log_step "6/6 - Testando SSH localmente..."

if ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no localhost "echo 'SSH_OK'" 2>/dev/null; then
    log_success "SSH está funcionando corretamente!"
else
    log_warning "Não foi possível testar SSH localmente (pode ser normal se não houver chave configurada)"
    log_info "Teste manualmente com: ssh localhost"
fi

echo ""

# ============================================
# RESUMO FINAL
# ============================================
echo "================================================"
echo -e "${CYAN}RESUMO DA CONFIGURAÇÃO${NC}"
echo "================================================"
echo ""

log_success "SSH (Remote Login) está habilitado"
log_success "Firewall configurado para permitir SSH"
log_success "Diretório .ssh configurado com permissões corretas"

if [[ -n "$IP_ATUAL" && "$IP_ATUAL" != "N/A" ]]; then
    echo ""
    echo -e "${CYAN}Informações para Conexão:${NC}"
    echo "  IP do MacBook: $IP_ATUAL"
    echo "  Porta SSH: 22"
    echo "  Usuário: $(whoami)"
    echo ""
    echo -e "${CYAN}Para conectar de outro dispositivo:${NC}"
    echo "  ssh $(whoami)@$IP_ATUAL"
    echo ""
    echo -e "${CYAN}Ou usando hostname (mDNS/Bonjour):${NC}"
    HOSTNAME=$(hostname)
    echo "  ssh $(whoami)@${HOSTNAME}.local"
fi

echo ""
echo -e "${CYAN}Próximos Passos:${NC}"
echo "  1. No dispositivo remoto, configure o SSH config:"
echo "     Host mac-remoto"
echo "         HostName $IP_ATUAL"
echo "         User $(whoami)"
echo "         Port 22"
echo ""
echo "  2. Teste a conexão do dispositivo remoto:"
echo "     ssh $(whoami)@$IP_ATUAL"
echo ""

if [[ -z "$CHAVE_PUBLICA" ]]; then
    echo -e "${YELLOW}⚠ Aviso:${NC} Nenhuma chave pública foi adicionada."
    echo "  Para autenticação sem senha, adicione sua chave pública:"
    echo "  $0 --chave-publica \"\$(cat ~/.ssh/id_ed25519.pub)\""
    echo ""
fi

echo "================================================"
echo ""
