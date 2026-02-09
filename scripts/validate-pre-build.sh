#!/usr/bin/env bash
# validate-pre-build.sh - Preflight rápido para builds (Typecheck + Lint + Build ready + MCP)
# Uso: npm run validate:pre-build
set -euo pipefail

echo "✅ Preflight build: iniciando..."

npm run check-mcp
npm run quality-gate

echo "✅ Preflight build: ok"
