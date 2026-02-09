#!/bin/bash
# Fix Claude Desktop CSP Issues
# Limpa dados corrompidos que causam erros de Content Security Policy

set -e

FORCE=false
HELP=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE=true
            shift
            ;;
        --help|-h)
            HELP=true
            shift
            ;;
        *)
            echo "Opção desconhecida: $1"
            echo "Use --help para ver a ajuda"
            exit 1
            ;;
    esac
done

if [ "$HELP" = true ]; then
    cat << EOF
Claude Desktop CSP Fix Script

Este script limpa dados corrompidos do Claude Desktop que causam:
- Erros de Content Security Policy (CSP)
- Falhas no StatsigClient
- Warnings de Permissions-Policy

Uso:
    ./fix-claude-desktop-csp.sh          # Modo interativo (pergunta antes de deletar)
    ./fix-claude-desktop-csp.sh --force   # Modo automático (deleta sem perguntar)

IMPORTANTE:
- Feche o Claude Desktop antes de executar este script
- Você precisará fazer login novamente após a limpeza

Plataformas suportadas:
- macOS
- Linux
EOF
    exit 0
fi

echo "🔧 Claude Desktop CSP Fix"
echo ""

# Detectar plataforma
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    STORAGE_PATH="$HOME/Library/Application Support/Claude/storage"
    CACHE_PATH="$HOME/Library/Caches/Claude"
    LOGS_PATH="$HOME/Library/Logs/Claude"
    PLATFORM="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    STORAGE_PATH="$HOME/.config/Claude/storage"
    CACHE_PATH="$HOME/.cache/Claude"
    LOGS_PATH="$HOME/.local/share/Claude/logs"
    PLATFORM="Linux"
else
    echo "❌ Plataforma não suportada: $OSTYPE"
    echo "   Este script funciona apenas em macOS e Linux"
    echo "   Para Windows, use: scripts/fix-claude-desktop-csp.ps1"
    exit 1
fi

# Verificar se Claude Desktop está rodando
if pgrep -x "Claude" > /dev/null; then
    echo "⚠️  AVISO: Claude Desktop está rodando!"
    echo "   Feche o Claude Desktop antes de continuar."
    echo ""

    if [ "$FORCE" = false ]; then
        read -p "Deseja fechar o Claude Desktop agora? (S/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            echo "Fechando Claude Desktop..."
            pkill -x "Claude" || true
            sleep 2
        else
            echo "❌ Operação cancelada. Feche o Claude Desktop manualmente e tente novamente."
            exit 1
        fi
    else
        echo "Fechando Claude Desktop (modo --force)..."
        pkill -x "Claude" || true
        sleep 2
    fi
fi

# Função para calcular tamanho do diretório
get_dir_size() {
    if [ -d "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1 || echo "0"
    else
        echo "0"
    fi
}

# Função para limpar diretório
clear_directory() {
    local path=$1
    local name=$2

    if [ -d "$path" ]; then
        echo "🗑️  Limpando $name..."
        if rm -rf "$path" 2>/dev/null; then
            echo "   ✅ $name limpo com sucesso"
            return 0
        else
            echo "   ❌ Erro ao limpar $name"
            return 1
        fi
    else
        echo "   ℹ️  $name não existe (já está limpo)"
        return 0
    fi
}

# Verificar o que será limpo
echo "📋 Diretórios que serão limpos:"
TO_CLEAN=0

if [ -d "$STORAGE_PATH" ]; then
    SIZE=$(get_dir_size "$STORAGE_PATH")
    echo "   - Storage: $STORAGE_PATH ($SIZE)"
    TO_CLEAN=$((TO_CLEAN + 1))
fi

if [ -d "$CACHE_PATH" ]; then
    SIZE=$(get_dir_size "$CACHE_PATH")
    echo "   - Cache: $CACHE_PATH ($SIZE)"
    TO_CLEAN=$((TO_CLEAN + 1))
fi

if [ -d "$LOGS_PATH" ]; then
    SIZE=$(get_dir_size "$LOGS_PATH")
    echo "   - Logs: $LOGS_PATH ($SIZE)"
    TO_CLEAN=$((TO_CLEAN + 1))
fi

if [ $TO_CLEAN -eq 0 ]; then
    echo ""
    echo "✅ Nada para limpar. Claude Desktop já está limpo!"
    exit 0
fi

echo ""

# Confirmar antes de limpar (a menos que --force seja usado)
if [ "$FORCE" = false ]; then
    echo "⚠️  ATENÇÃO: Esta operação irá:"
    echo "   - Deletar dados de storage (configurações locais)"
    echo "   - Deletar cache (você precisará fazer login novamente)"
    echo "   - Deletar logs (opcional)"
    echo ""

    read -p "Deseja continuar? (S/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Operação cancelada."
        exit 0
    fi
fi

echo ""
echo "🧹 Iniciando limpeza..."
echo ""

# Limpar storage
STORAGE_SUCCESS=false
if clear_directory "$STORAGE_PATH" "Storage"; then
    STORAGE_SUCCESS=true
fi

# Limpar cache
CACHE_SUCCESS=false
if clear_directory "$CACHE_PATH" "Cache"; then
    CACHE_SUCCESS=true
fi

# Limpar logs (opcional)
LOGS_SUCCESS=false
if clear_directory "$LOGS_PATH" "Logs"; then
    LOGS_SUCCESS=true
fi

echo ""

# Resultado final
if [ "$STORAGE_SUCCESS" = true ] && [ "$CACHE_SUCCESS" = true ]; then
    echo "✅ Limpeza concluída com sucesso!"
    echo ""
    echo "📝 Próximos passos:"
    echo "   1. Reinicie o Claude Desktop"
    echo "   2. Faça login novamente"
    echo "   3. Verifique se os erros de CSP desapareceram"
    echo ""
    echo "💡 Dica: Se os problemas persistirem, use Claude Web:"
    echo "   https://claude.ai"
else
    echo "⚠️  Limpeza concluída com alguns erros."
    echo "   Tente executar o script novamente ou limpe manualmente."
    echo ""
    echo "📚 Veja o guia completo em:"
    echo "   docs/CLAUDE_DESKTOP_TROUBLESHOOTING.md"
fi
