#!/bin/bash

# Script para configurar CLI do Cursor no macOS
# Execute este script manualmente no seu terminal

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
    
    CURSOR_BIN=$(find "$CURSOR_APP" -name "cursor" -type f 2>/dev/null | head -1)
    
    if [ -z "$CURSOR_BIN" ]; then
        echo "❌ Não foi possível encontrar o binário do Cursor"
        exit 1
    fi
    
    echo "✅ Encontrado em: $CURSOR_BIN"
fi

# Determinar o shell
CURRENT_SHELL=$(basename "$SHELL" 2>/dev/null || echo "zsh")

if [[ "$CURRENT_SHELL" == "zsh" ]] || [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [[ "$CURRENT_SHELL" == "bash" ]] || [ -f "$HOME/.bash_profile" ]; then
    SHELL_RC="$HOME/.bash_profile"
    SHELL_NAME="bash"
else
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
fi

echo "🔍 Shell detectado: $SHELL_NAME"
echo "📝 Arquivo de configuração: $SHELL_RC"
echo ""

# Verificar se já está configurado
if grep -q "Cursor.app" "$SHELL_RC" 2>/dev/null; then
    echo "✅ Cursor já está configurado no $SHELL_RC"
    echo ""
    echo "🔄 Recarregue o terminal:"
    echo "   source $SHELL_RC"
    echo ""
    echo "🧪 Teste com:"
    echo "   cursor --version"
    exit 0
fi

# Mostrar instruções
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 INSTRUÇÕES PARA CONFIGURAÇÃO MANUAL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Adicione esta linha ao final do arquivo $SHELL_RC:"
echo ""
echo "   export PATH=\"\$PATH:$CURSOR_APP/Contents/Resources/app/bin\""
echo ""
echo "2. Execute este comando para adicionar automaticamente:"
echo ""
echo "   echo 'export PATH=\"\$PATH:/Applications/Cursor.app/Contents/Resources/app/bin\"' >> $SHELL_RC"
echo ""
echo "3. Recarregue o shell:"
echo ""
echo "   source $SHELL_RC"
echo ""
echo "4. Teste:"
echo ""
echo "   cursor --version"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

