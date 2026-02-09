#!/bin/bash
# Status Line - Claude Code IDE (Ultrathink Mode)
# MacBook Air 2020 8GB - Mostra info do projeto, memória e tokens

# Ler JSON input do Claude Code (stdin)
INPUT=$(cat)

# Extrair valores do JSON (se jq disponível)
if command -v jq &> /dev/null && [ -n "$INPUT" ]; then
    MODEL=$(echo "$INPUT" | jq -r '.model.display_name // "Claude"' 2>/dev/null)
    CONTEXT_SIZE=$(echo "$INPUT" | jq -r '.context_window.context_window_size // 200000' 2>/dev/null)
    CURRENT_USAGE=$(echo "$INPUT" | jq '.context_window.current_usage' 2>/dev/null)

    # Calcular porcentagem de contexto
    if [ "$CURRENT_USAGE" != "null" ] && [ -n "$CURRENT_USAGE" ]; then
        CURRENT_TOKENS=$(echo "$CURRENT_USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens // 0' 2>/dev/null)
        if [ -n "$CURRENT_TOKENS" ] && [ "$CURRENT_TOKENS" != "null" ]; then
            TOKEN_PERCENT=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))
        else
            TOKEN_PERCENT=0
        fi
    else
        TOKEN_PERCENT=0
    fi
else
    MODEL="Opus"
    TOKEN_PERCENT=0
    CONTEXT_SIZE=200000
fi

# Configuração de thresholds
COMPACT_THRESHOLD=35  # 35% = ~70k tokens
WARNING_THRESHOLD=75  # 75% = ~150k tokens
CRITICAL_THRESHOLD=90 # 90% = ~180k tokens

# Status do git
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
GIT_STATUS=$(git status --porcelain 2>/dev/null)
if [ -n "$GIT_STATUS" ]; then
    GIT_ICON="●"
else
    GIT_ICON="✓"
fi

# Verificar swap (indicador de pressão de memória)
SWAP_INFO=$(sysctl vm.swapusage 2>/dev/null || echo "")
SWAP_USED=0
if [ -n "$SWAP_INFO" ]; then
    SWAP_USED_RAW=$(echo "$SWAP_INFO" | awk '{print $7}' | sed 's/M//')
    SWAP_USED=${SWAP_USED_RAW%.*}
fi

# Indicador de memória
if [ "$SWAP_USED" -gt 2000 ]; then
    MEM_ICON="MEM:🔴"
elif [ "$SWAP_USED" -gt 1000 ]; then
    MEM_ICON="MEM:🟡"
else
    MEM_ICON="MEM:🟢"
fi

# Indicador de tokens
if [ "$TOKEN_PERCENT" -ge "$CRITICAL_THRESHOLD" ]; then
    TOKEN_ICON="🔴"
elif [ "$TOKEN_PERCENT" -ge "$WARNING_THRESHOLD" ]; then
    TOKEN_ICON="🟡"
elif [ "$TOKEN_PERCENT" -ge "$COMPACT_THRESHOLD" ]; then
    TOKEN_ICON="🟠"
else
    TOKEN_ICON="🟢"
fi

# Montar status (primeira linha do output = status line)
echo "Nossa Maternidade | $BRANCH $GIT_ICON | $MEM_ICON | ${TOKEN_ICON}${TOKEN_PERCENT}%"
