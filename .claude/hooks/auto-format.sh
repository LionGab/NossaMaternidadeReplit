#!/bin/bash
# Hook: Auto-format files after edit
# Runs prettier/eslint on TypeScript/JavaScript files

# Read JSON input from stdin
INPUT=$(cat)

# Extract file path using jq (or fallback to grep)
if command -v jq &> /dev/null; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')
else
    # Fallback: try to extract with grep
    FILE_PATH=$(echo "$INPUT" | grep -oP '"file_path"\s*:\s*"\K[^"]+' || echo "")
fi

# Exit if no file path
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# Format based on file type
case "$EXT" in
    ts|tsx|js|jsx)
        # Run prettier if available
        if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
            npx prettier --write "$FILE_PATH" 2>/dev/null || true
        fi
        ;;
    json)
        # Format JSON files
        if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
            npx prettier --write "$FILE_PATH" 2>/dev/null || true
        fi
        ;;
    md|mdx)
        # Format markdown
        if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
            npx prettier --write "$FILE_PATH" 2>/dev/null || true
        fi
        ;;
esac

# Always exit 0 to not block operations
exit 0
