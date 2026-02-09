#!/bin/bash
# Script para verificar uso de disco do projeto
# Uso: npm run check:disk

set -e

echo "📊 Análise de Uso de Disco - Nossa Maternidade"
echo "================================================"
echo ""

# Função para formatar tamanho
format_size() {
  local size=$1
  if [ -z "$size" ]; then
    echo "0B"
  else
    echo "$size"
  fi
}

echo "📦 Projeto Local"
echo "----------------"

# node_modules
if [ -d "node_modules" ]; then
  NM_SIZE=$(du -sh node_modules 2>/dev/null | awk '{print $1}')
  echo "   node_modules:        $NM_SIZE"
else
  echo "   node_modules:        não encontrado"
fi

# ios/Pods
if [ -d "ios/Pods" ]; then
  PODS_SIZE=$(du -sh ios/Pods 2>/dev/null | awk '{print $1}')
  echo "   ios/Pods:            $PODS_SIZE"
else
  echo "   ios/Pods:            não encontrado"
fi

# ios/build
if [ -d "ios/build" ]; then
  BUILD_SIZE=$(du -sh ios/build 2>/dev/null | awk '{print $1}')
  echo "   ios/build:           $BUILD_SIZE"
else
  echo "   ios/build:           não encontrado"
fi

# .expo
if [ -d ".expo" ]; then
  EXPO_SIZE=$(du -sh .expo 2>/dev/null | awk '{print $1}')
  echo "   .expo:               $EXPO_SIZE"
else
  echo "   .expo:               não encontrado"
fi

# .metro-cache
if [ -d ".metro-cache" ]; then
  METRO_SIZE=$(du -sh .metro-cache 2>/dev/null | awk '{print $1}')
  echo "   .metro-cache:        $METRO_SIZE"
else
  echo "   .metro-cache:        não encontrado"
fi

# Total do projeto
PROJECT_SIZE=$(du -sh . 2>/dev/null | awk '{print $1}')
echo ""
echo "   📊 Total do projeto:  $PROJECT_SIZE"

echo ""
echo "💻 Caches Globais"
echo "-----------------"

# Cache do npm
if [ -d "$HOME/.npm" ]; then
  NPM_SIZE=$(du -sh "$HOME/.npm" 2>/dev/null | awk '{print $1}')
  echo "   ~/.npm:              $NPM_SIZE"
else
  echo "   ~/.npm:              não encontrado"
fi

# Cache do Metro global
if [ -d "$HOME/.metro-cache" ]; then
  METRO_GLOBAL_SIZE=$(du -sh "$HOME/.metro-cache" 2>/dev/null | awk '{print $1}')
  echo "   ~/.metro-cache:      $METRO_GLOBAL_SIZE"
else
  echo "   ~/.metro-cache:      não encontrado"
fi

# Cache do yarn
if [ -d "$HOME/.yarn" ]; then
  YARN_SIZE=$(du -sh "$HOME/.yarn" 2>/dev/null | awk '{print $1}')
  echo "   ~/.yarn:             $YARN_SIZE"
else
  echo "   ~/.yarn:             não encontrado"
fi

# Cache do bun
if [ -d "$HOME/.bun" ]; then
  BUN_SIZE=$(du -sh "$HOME/.bun" 2>/dev/null | awk '{print $1}')
  echo "   ~/.bun:              $BUN_SIZE"
else
  echo "   ~/.bun:              não encontrado"
fi

echo ""
echo "💡 Comandos de Limpeza Disponíveis:"
echo "   npm run clean              - Limpa caches do projeto"
echo "   npm run clean:npm-cache    - Limpa cache do npm (~1.8GB)"
echo "   npm run clean:ios          - Limpa Pods e build iOS (~960MB)"
echo "   npm run optimize:macbook   - Limpeza completa + otimizações"
echo ""
