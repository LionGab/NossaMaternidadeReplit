#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "${repo_root}"

fail=0

echo "P0 scan: console.log (src/)"
if rg -n "console\\.log" src -g"*.ts" -g"*.tsx" \
  --glob '!**/logger.ts' \
  --glob '!**/logger.tsx' \
  --glob '!**/Toast.tsx' \
  --glob '!**/useToast.ts' \
  | rg -v ":\\s*\\*" ; then
  fail=1
else
  echo "OK: no console.log hits"
fi

echo ""
echo "P0 scan: ': any' (src/)"
if rg -n ": any\\b" src -g"*.ts" -g"*.tsx" ; then
  fail=1
else
  echo "OK: no ': any' hits"
fi

echo ""
echo "P0 scan: hardcoded colors (src/)"
if rg -n "#[0-9a-fA-F]{3,8}|rgba?\\(|'white'|'black'" src -g"*.ts" -g"*.tsx" ; then
  fail=1
else
  echo "OK: no hardcoded color hits"
fi

echo ""
if [[ "${fail}" -ne 0 ]]; then
  echo "P0 scan: FAIL (fix before quality-gate/build)"
  exit 1
fi

echo "P0 scan: PASS"

