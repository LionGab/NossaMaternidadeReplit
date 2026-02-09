#!/bin/bash
# Script de setup do ambiente de desenvolvimento
# Uso: bun run setup-dev

set -e

echo "🚀 Configurando ambiente de desenvolvimento..."

# Verificar se bun está instalado
if ! command -v bun &> /dev/null; then
  echo "❌ Bun não está instalado. Instale em: https://bun.sh"
  exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
bun install

# Verificar variáveis de ambiente
if [ ! -f .env ]; then
  echo "⚠️  Arquivo .env não encontrado. Copiando template..."
  if [ -f env.template ]; then
    cp env.template .env
    echo "✅ Arquivo .env criado. Configure as variáveis necessárias."
  else
    echo "⚠️  Template não encontrado. Crie um arquivo .env manualmente."
  fi
else
  echo "✅ Arquivo .env encontrado."
fi

# Verificar TypeScript
echo "🔍 Verificando TypeScript..."
bun run typecheck || {
  echo "⚠️  Erros de TypeScript encontrados. Corrija antes de continuar."
}

# Verificar ESLint
echo "🔍 Verificando ESLint..."
bun run lint || {
  echo "⚠️  Erros de ESLint encontrados. Corrija antes de continuar."
}

# Verificar Prettier
echo "🔍 Verificando formatação..."
bun run format:check || {
  echo "⚠️  Arquivos não formatados. Execute: bun run format"
}

echo ""
echo "✅ Setup completo!"
echo ""
echo "Próximos passos:"
echo "  1. Configure as variáveis em .env"
echo "  2. Execute: bun start"
echo "  3. Para iOS: bun run ios"
echo "  4. Para Android: bun run android"
