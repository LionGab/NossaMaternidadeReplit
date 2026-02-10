#!/bin/bash

# Script para remover todos os arquivos Swift do projeto
# Execute com: chmod +x remove_swift_files.sh && ./remove_swift_files.sh

echo "🗑️  Removendo arquivos Swift..."

# Lista de arquivos Swift para remover
SWIFT_FILES=(
    "App.swift"
    "ContentView.swift"
    "AuthenticationView.swift"
    "Models.swift"
    "SupabaseClient.swift"
    "Tests.swift"
)

# Remover cada arquivo
for file in "${SWIFT_FILES[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "✓ Removido: $file"
    else
        echo "⚠ Não encontrado: $file"
    fi
done

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "Arquivos Swift removidos:"
for file in "${SWIFT_FILES[@]}"; do
    echo "  - $file"
done
