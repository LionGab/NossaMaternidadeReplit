#!/bin/bash
# Monitora uso de contexto (tokens, etc.)
# Uso: npm run monitor:context

echo "📊 Monitor de contexto"
echo ""
if [ -f ".claude/token-monitor.sh" ]; then
  bash .claude/token-monitor.sh
else
  echo "   Token monitor não configurado."
  echo "   Use: npm run tokens"
fi
