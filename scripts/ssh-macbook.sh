#!/bin/bash
# Executa comando no MacBook via SSH
# Uso: ./scripts/ssh-macbook.sh <comando> [args...]
# Exemplo: ./scripts/ssh-macbook.sh npm start
#          ./scripts/ssh-macbook.sh git status
#          ./scripts/ssh-macbook.sh npm run ios

if [ $# -eq 0 ]; then
    echo "SSH MacBook Helper - Nossa Maternidade"
    echo ""
    echo "Uso: ./scripts/ssh-macbook.sh <comando> [args...]"
    echo ""
    echo "Exemplos:"
    echo "  ./scripts/ssh-macbook.sh npm start"
    echo "  ./scripts/ssh-macbook.sh git status"
    echo "  ./scripts/ssh-macbook.sh npm run ios"
    echo "  ./scripts/ssh-macbook.sh 'cd ~/Applications/NossaMaternidade-1 && npm install'"
    echo ""
    echo "Configuração SSH:"
    echo "  Host: macbook"
    echo "  IP: 192.168.2.2"
    echo "  User: lion"
    echo "  Project: ~/Applications/NossaMaternidade-1"
    echo ""
    exit 0
fi

COMMAND="$@"
PROJECT_DIR="~/Applications/NossaMaternidade-1"

# Executar comando no MacBook via SSH
ssh macbook "cd $PROJECT_DIR && $COMMAND"
