#!/bin/bash
# Claude Code Custom Status Line - Bash/Zsh (WSL, Linux, macOS)
# Author: GitHub Copilot
# Purpose: Display real-time dashboard with context usage, Git branch, project folder, and model
# Usage: source this file or make it executable and call directly

set -euo pipefail

DEBUG="${DEBUG:-0}"
SHOW_JSON="${SHOW_JSON:-0}"
CONTEXT_MAX_TOKENS=200000

# Color codes (ANSI)
declare -A COLORS=(
    [Reset]='\033[0m'
    [Bold]='\033[1m'
    [Dim]='\033[2m'
    [Red]='\033[31m'
    [Green]='\033[32m'
    [Yellow]='\033[33m'
    [Blue]='\033[34m'
    [Magenta]='\033[35m'
    [Cyan]='\033[36m'
    [BgRed]='\033[41m'
)

get_context_usage() {
    local percent_used=0
    local tokens_used=0

    # Method 1: Check environment variable
    if [[ -n "${CLAUDE_CONTEXT_USAGE:-}" ]]; then
        if command -v jq &> /dev/null; then
            percent_used=$(echo "$CLAUDE_CONTEXT_USAGE" | jq -r '.percentUsed // 0')
            tokens_used=$(echo "$CLAUDE_CONTEXT_USAGE" | jq -r '.tokensUsed // 0')
        fi
    fi

    # Method 2: Check .claude directory
    local claude_home="${HOME}/.claude"
    local context_file="${claude_home}/context.json"

    if [[ -f "$context_file" ]] && command -v jq &> /dev/null; then
        tokens_used=$(jq -r '.usage.tokens // 0' "$context_file" 2>/dev/null || echo 0)
        if (( tokens_used > 0 )); then
            percent_used=$((tokens_used * 100 / CONTEXT_MAX_TOKENS))
        fi
    fi

    echo "$percent_used"
}

get_git_branch() {
    if git rev-parse --git-dir > /dev/null 2>&1; then
        git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "no-git"
    else
        echo "no-git"
    fi
}

get_project_folder() {
    basename "$(pwd)" | sed 's/^tmp.*-cwd$/temp-dir/'
}

get_model_name() {
    echo "${CLAUDE_MODEL:-Claude 3.5 Sonnet}"
}

progress_bar() {
    local percent=$1
    local length=${2:-20}
    local filled=$((percent * length / 100))
    local empty=$((length - filled))

    local bar_color
    if (( percent < 50 )); then
        bar_color="${COLORS[Green]}"
    elif (( percent < 75 )); then
        bar_color="${COLORS[Yellow]}"
    else
        bar_color="${COLORS[Red]}"
    fi

    local filled_bar=$(printf '█%.0s' $(seq 1 "$filled"))
    local empty_bar=$(printf '░%.0s' $(seq 1 "$empty"))

    echo -ne "${bar_color}${filled_bar}${empty_bar}${COLORS[Reset]}"
}

format_status_line() {
    local percent_used=$1
    local branch=$2
    local project=$3
    local model=$4

    # Component 1: Model (Cyan, bold)
    local model_part="${COLORS[Cyan]}${COLORS[Bold]}@ ${model}${COLORS[Reset]}"

    # Component 2: Context bar
    local bar
    bar=$(progress_bar "$percent_used")
    local context_part="${bar} ${COLORS[Blue]}${percent_used}%${COLORS[Reset]}"

    # Component 3: Git branch (Magenta)
    local branch_part="${COLORS[Magenta]}[${branch}]${COLORS[Reset]}"

    # Component 4: Project folder (Yellow, dimmed)
    local project_part="${COLORS[Dim]}${COLORS[Yellow]}[${project}]${COLORS[Reset]}"

    # Assemble
    local separator="${COLORS[Dim]}|${COLORS[Reset]}"
    echo -ne "${model_part} ${separator} ${context_part} ${separator} ${branch_part} ${separator} ${project_part}\n"
}

main() {
    local context_pct
    context_pct=$(get_context_usage)

    local branch
    branch=$(get_git_branch)

    local project
    project=$(get_project_folder)

    local model
    model=$(get_model_name)

    if [[ "$SHOW_JSON" == "1" ]]; then
        # Output JSON format
        cat <<EOF
{
  "model": "${model}",
  "context": {
    "percentUsed": ${context_pct},
    "tokensMax": ${CONTEXT_MAX_TOKENS}
  },
  "branch": "${branch}",
  "project": "${project}",
  "timestamp": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
}
EOF
    else
        # Output formatted status line
        format_status_line "$context_pct" "$branch" "$project" "$model"
    fi
}

main "$@"
