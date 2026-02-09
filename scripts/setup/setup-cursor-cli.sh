#!/bin/bash

# Script para configurar CLI do Cursor no macOS
# Para MacBook M1 8GB RAM

echo "🔧 Configurando CLI do Cursor..."
echo ""

CURSOR_APP="/Applications/Cursor.app"
CURSOR_BIN="$CURSOR_APP/Contents/Resources/app/bin/cursor"

# Verificar se Cursor está instalado
if [ ! -d "$CURSOR_APP" ]; then
    echo "❌ Cursor não encontrado em $CURSOR_APP"
    echo "   Por favor, instale o Cursor primeiro."
    exit 1
fi

# Verificar se o binário existe
if [ ! -f "$CURSOR_BIN" ]; then
    echo "⚠️  Binário do Cursor não encontrado em $CURSOR_BIN"
    echo "   Tentando localizar..."
    
    # Tentar encontrar o binário
    CURSOR_BIN=$(find "$CURSOR_APP" -name "cursor" -type f 2>/dev/null | head -1)
    
    if [ -z "$CURSOR_BIN" ]; then
        echo "❌ Não foi possível encontrar o binário do Cursor"
        exit 1
    fi
    
    echo "✅ Encontrado em: $CURSOR_BIN"
fi

# Determinar o shell e arquivo de configuração
# Usar $SHELL que é mais confiável que $ZSH_VERSION/$BASH_VERSION
CURRENT_SHELL=$(basename "$SHELL" 2>/dev/null || echo "zsh")

if [[ "$CURRENT_SHELL" == "zsh" ]] || [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [[ "$CURRENT_SHELL" == "bash" ]] || [ -f "$HOME/.bash_profile" ]; then
    SHELL_RC="$HOME/.bash_profile"
    SHELL_NAME="bash"
else
    # Padrão: zsh (padrão do macOS moderno)
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
fi

echo "🔍 Shell detectado: $SHELL_NAME"
echo "📝 Arquivo de configuração: $SHELL_RC"
echo ""

# Tentar criar symlink em /usr/local/bin (requer sudo)
echo "📦 Tentando criar symlink em /usr/local/bin..."
echo "   (Pode solicitar senha do administrador)"
echo ""

SYMLINK_SUCCESS=false
if sudo ln -sf "$CURSOR_BIN" /usr/local/bin/cursor 2>/dev/null; then
    echo "✅ Symlink criado com sucesso em /usr/local/bin/cursor"
    SYMLINK_SUCCESS=true
else
    echo "⚠️  Não foi possível criar symlink (sem permissões sudo)"
    echo "   Continuando com configuração via PATH..."
    SYMLINK_SUCCESS=false
fi
echo ""

# Adicionar ao PATH no arquivo de configuração do shell
echo "📝 Configurando PATH no $SHELL_RC..."

# Verificar se já existe
if grep -q "Cursor.app" "$SHELL_RC" 2>/dev/null; then
    echo "✅ Cursor já está configurado no $SHELL_RC"
else
    # Criar arquivo se não existir
    if [ ! -f "$SHELL_RC" ]; then
        touch "$SHELL_RC"
        echo "📄 Arquivo $SHELL_RC criado"
    fi
    
    # Adicionar configuração
    echo "" >> "$SHELL_RC"
    echo "# Cursor CLI - Adicionado em $(date '+%Y-%m-%d %H:%M:%S')" >> "$SHELL_RC"
    echo "export PATH=\"\$PATH:$CURSOR_APP/Contents/Resources/app/bin\"" >> "$SHELL_RC"
    echo "✅ Adicionado ao $SHELL_RC"
fi

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🔄 Recarregue o terminal ou execute:"
echo "   source $SHELL_RC"
echo ""
echo "🧪 Teste com:"
echo "   cursor --version"
echo "   cursor --list-extensions"

