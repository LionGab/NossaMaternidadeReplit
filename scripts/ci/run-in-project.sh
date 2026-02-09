#!/bin/bash
# Wrapper para garantir que comandos sempre executem no diretório do projeto

PROJECT_DIR="/Users/lion/Documents/Lion/NossaMaternidade"

# Sempre mudar para o diretório do projeto primeiro
cd "$PROJECT_DIR" || {
  echo "Erro: Não foi possível acessar o diretório do projeto: $PROJECT_DIR" >&2
  exit 1
}

# Executar o comando passado como argumentos
exec "$@"
