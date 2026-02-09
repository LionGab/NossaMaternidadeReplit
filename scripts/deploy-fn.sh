#!/usr/bin/env bash
# Deploy uma Edge Function do Supabase.
# Usa o CLI global (ex.: scoop supabase 2.72.7) se existir; senão npx supabase@2.71.0.
# Uso: npm run deploy:fn -- <nome>
set -e
NAME="$1"
PROJECT_REF="lqahkqfpynypbmhtffyi"
if [ -z "$NAME" ]; then
  echo "Uso: npm run deploy:fn -- <nome>"
  echo "Ex.: npm run deploy:fn -- notifications"
  echo "Funções: ai, analytics, community-feed, delete-account, elevenlabs-tts, export-data, moderate-content, mundo-nath-feed, notifications, transcribe, upload-image, webhook"
  exit 1
fi
if command -v supabase >/dev/null 2>&1; then
  supabase functions deploy "$NAME" --project-ref "$PROJECT_REF"
else
  npx supabase@2.71.0 functions deploy "$NAME" --project-ref "$PROJECT_REF"
fi
