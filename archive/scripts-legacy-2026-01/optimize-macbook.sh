#!/bin/bash
# Script de Otimização MacBook M1 - Cursor IDE
# Limpeza segura de caches e otimizações de performance
# Uso: npm run optimize:macbook

set -e

echo "🚀 Otimização MacBook M1 - Cursor IDE"
echo "======================================"
echo ""

# Contador de espaço liberado (estimativa)
SPACE_FREED=0

# Função para calcular tamanho de diretório
calculate_size() {
  if [ -d "$1" ]; then
    du -sk "$1" 2>/dev/null | awk '{print $1}' || echo "0"
  else
    echo "0"
  fi
}

# Função para remover com cálculo de espaço
safe_remove() {
  local path=$1
  local description=$2

  if [ -e "$path" ]; then
    local size=$(calculate_size "$path")
    echo "🗑️  Removendo: $description"
    rm -rf "$path" 2>/dev/null || echo "⚠️  Não foi possível remover: $path"
    SPACE_FREED=$((SPACE_FREED + size))
  fi
}

echo "📦 Fase 1: Limpeza de Caches do Projeto"
echo "----------------------------------------"

# Cache do Expo
safe_remove ".expo" "Cache do Expo"

# Cache do Metro (local)
safe_remove ".metro-cache" "Cache do Metro (local)"

# Cache do Metro (global)
if [ -d "$HOME/.metro-cache" ]; then
  size=$(calculate_size "$HOME/.metro-cache")
  echo "🗑️  Removendo: Cache do Metro (global)"
  rm -rf "$HOME/.metro-cache" 2>/dev/null && SPACE_FREED=$((SPACE_FREED + size)) || echo "⚠️  Não foi possível remover cache global"
fi

# Cache do node_modules
safe_remove "node_modules/.cache" "Cache do node_modules"

# TypeScript build info
echo "🗑️  Removendo arquivos *.tsbuildinfo..."
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

# Coverage
safe_remove "coverage" "Relatórios de coverage"

# Arquivos temporários do projeto
safe_remove "temp" "Diretório temp"
safe_remove "tmp" "Diretório tmp"

# Build artifacts
safe_remove "build" "Diretório build"
safe_remove "dist" "Diretório dist"
safe_remove "web-build" "Build web"

# Arquivos de log
echo "🗑️  Removendo arquivos de log..."
find . -maxdepth 1 -name "*.log" -type f -delete 2>/dev/null || true
safe_remove "expo.log" "Log do Expo"

# Arquivos temporários diversos
echo "🗑️  Removendo arquivos temporários..."
find . -maxdepth 1 -name "*.tmp" -type f -delete 2>/dev/null || true
find . -maxdepth 1 -name "*.bak" -type f -delete 2>/dev/null || true
find . -maxdepth 1 -name "*.swp" -type f -delete 2>/dev/null || true
find . -maxdepth 1 -name "*.swo" -type f -delete 2>/dev/null || true

echo ""
echo "💻 Fase 2: Limpeza de Caches do Sistema macOS"
echo "----------------------------------------------"

# Cache do npm (global) - VERIFICAR TAMANHO ANTES
if command -v npm &> /dev/null; then
  if [ -d "$HOME/.npm" ]; then
    NPM_SIZE=$(du -sh "$HOME/.npm" 2>/dev/null | awk '{print $1}')
    echo "📊 Cache do npm atual: $NPM_SIZE"
  fi
  echo "🗑️  Limpando cache do npm..."
  npm cache clean --force 2>/dev/null || echo "⚠️  Não foi possível limpar cache do npm"
fi

# Cache do yarn (global)
if command -v yarn &> /dev/null; then
  echo "🗑️  Limpando cache do yarn..."
  yarn cache clean 2>/dev/null || echo "⚠️  Não foi possível limpar cache do yarn"
fi

# Cache do bun (global)
if command -v bun &> /dev/null; then
  echo "🗑️  Limpando cache do bun..."
  bun pm cache rm 2>/dev/null || echo "⚠️  Não foi possível limpar cache do bun"
fi

# Cache do Homebrew (se disponível)
if command -v brew &> /dev/null; then
  echo "🗑️  Limpando cache do Homebrew..."
  brew cleanup -s 2>/dev/null || echo "⚠️  Não foi possível limpar cache do Homebrew"
fi

# Cache do sistema macOS (logs antigos - cuidado)
echo "⚠️  Limpeza de logs do sistema requer sudo (pulando por segurança)"
echo "   Para limpar manualmente: sudo rm -rf /private/var/log/asl/*.asl"

echo ""
echo "🎯 Fase 3: Otimizações do Cursor IDE"
echo "-------------------------------------"

# Verificar se .cursorignore está otimizado
if [ -f ".cursorignore" ]; then
  if grep -q "coverage/" .cursorignore && grep -q "docs/archive/" .cursorignore; then
    echo "✅ .cursorignore já está otimizado"
  else
    echo "⚠️  .cursorignore pode ser melhorado (verifique manualmente)"
  fi
else
  echo "⚠️  .cursorignore não encontrado (considere criar)"
fi

# Verificar configurações do Cursor
if [ -d ".cursor" ]; then
  echo "✅ Diretório .cursor encontrado"
else
  echo "ℹ️  Diretório .cursor não existe (será criado com configurações)"
fi

echo ""
echo "📊 Resumo"
echo "---------"
echo "Espaço liberado estimado: ~$((SPACE_FREED / 1024)) MB"
echo ""
echo "✅ Otimização concluída!"
echo ""
echo "📝 Próximos passos recomendados:"
echo "   1. Reinicie o Cursor IDE para aplicar mudanças"
echo "   2. Execute: npm start --clear para reiniciar o Expo com cache limpo"
echo "   3. Feche abas/arquivos não utilizados no Cursor"
echo "   4. Considere fechar outros apps pesados (Chrome, Slack, etc.)"
echo ""
echo "💡 Dica: Execute este script regularmente (semanalmente) para manter performance"
