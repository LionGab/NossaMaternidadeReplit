#!/usr/bin/env python3
"""
Hook: Validate Sensitive Files
Blocks edits to sensitive files (.env, secrets, credentials)

Exit codes:
- 0: Allow operation
- 2: Block operation (returns error message to Claude)
"""

import json
import sys
import os

# Patterns for sensitive files/directories
BLOCKED_PATTERNS = [
    '.env',
    '.env.local',
    '.env.production',
    'secrets',
    'credentials',
    '.git/',
    'node_modules/',
    '.eas/',
    'ios/Pods/',
    'android/app/google-services.json',
    'eas.json',  # Contains sensitive build configs
]

# Files that can be edited with warning (logged but not blocked)
WARN_PATTERNS = [
    'package-lock.json',
    'yarn.lock',
    'Podfile.lock',
]

def main():
    try:
        # Read JSON input from stdin (Claude Code hook input)
        input_data = json.load(sys.stdin)

        # Extract file path from tool input
        tool_input = input_data.get('tool_input', {})
        file_path = tool_input.get('file_path', '') or tool_input.get('filePath', '')

        if not file_path:
            # No file path means this isn't a file operation
            sys.exit(0)

        # Normalize path
        file_path_lower = file_path.lower().replace('\\', '/')

        # Check for blocked patterns
        for pattern in BLOCKED_PATTERNS:
            if pattern.lower() in file_path_lower:
                print(f"🚫 BLOCKED: Cannot edit sensitive file '{file_path}'", file=sys.stderr)
                print(f"   Pattern matched: {pattern}", file=sys.stderr)
                print(f"   Use manual editing for sensitive files.", file=sys.stderr)
                sys.exit(2)  # Exit code 2 blocks the operation

        # Check for warning patterns (log but allow)
        for pattern in WARN_PATTERNS:
            if pattern.lower() in file_path_lower:
                log_file = os.path.join(os.path.dirname(__file__), '..', 'sensitive-access.log')
                with open(log_file, 'a') as f:
                    f.write(f"WARN: Edit to {file_path}\n")

        # Allow operation
        sys.exit(0)

    except json.JSONDecodeError:
        # If we can't parse input, allow operation (fail open)
        sys.exit(0)
    except Exception as e:
        # Log error but don't block operation
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == '__main__':
    main()
