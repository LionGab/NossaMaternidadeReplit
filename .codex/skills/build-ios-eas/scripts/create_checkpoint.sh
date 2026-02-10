#!/usr/bin/env bash
set -euo pipefail

profile="${1:-}"
if [[ -z "${profile}" ]]; then
  echo "Usage: $0 <profile>"
  echo "Example: $0 ios_testflight"
  exit 2
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "${repo_root}"

template="docs/builds/TEMPLATE.md"
if [[ ! -f "${template}" ]]; then
  echo "Missing template: ${template}"
  exit 1
fi

date_ymd="$(date +%F)"
date_hm="$(date +%F' '%H:%M)"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"

out_dir="docs/builds"
out_file="${out_dir}/${date_ymd}-ios-${profile}.md"

mkdir -p "${out_dir}"

if [[ -f "${out_file}" ]]; then
  echo "Checkpoint already exists: ${out_file}"
  exit 0
fi

tmp="$(mktemp)"
cp "${template}" "${tmp}"

# Minimal placeholder replacements; keep the rest for the interview step.
sed -i '' \
  -e "s/{YYYY-MM-DD}-{platform}-{profile}/${date_ymd}-ios-${profile}/g" \
  -e "s/{YYYY-MM-DD HH:MM}/${date_hm}/g" \
  -e "s/| Plataforma   | iOS \\/ Android \\/ Ambos              |/| Plataforma   | iOS                              |/g" \
  -e "s/| Profile      | development \\/ preview \\/ production |/| Profile      | ${profile} |/g" \
  -e "s/{branch-name}/${branch}/g" \
  "${tmp}"

mv "${tmp}" "${out_file}"
echo "Created checkpoint: ${out_file}"

