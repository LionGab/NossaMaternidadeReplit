# Deploy da Edge Function `ai` no Windows (workaround para parse de `.env.local`)
#
# Por que existe:
# - O Supabase CLI tenta parsear `.env.local` automaticamente.
# - Se `.env.local` contiver valores multi-line (ex: PEM com `-----BEGIN ...`),
#   o CLI pode falhar com: "unexpected character '-' in variable name".
# - Este script faz um rename temporário do `.env.local`, faz o deploy, e restaura.
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts/supabase-deploy-ai.ps1
#   powershell -ExecutionPolicy Bypass -File scripts/supabase-deploy-ai.ps1 -ProjectRef lqahkqfpynypbmhtffyi
#

param(
  [string]$ProjectRef = $env:SUPABASE_PROJECT_ID
)

$ErrorActionPreference = "Stop"

if (-not $ProjectRef) {
  $ProjectRef = "lqahkqfpynypbmhtffyi"
}

$envFile = Join-Path (Get-Location) ".env.local"
$bakFile = Join-Path (Get-Location) ".env.local.bak-supabase-cli"

Write-Host "Deploying Supabase Edge Function: ai" -ForegroundColor Cyan
Write-Host "Project ref: $ProjectRef" -ForegroundColor Gray

# Cleanup stale backup (if any)
if (Test-Path $bakFile) {
  Remove-Item -Force $bakFile
}

try {
  if (Test-Path $envFile) {
    Move-Item -Force $envFile $bakFile
  }

  npx supabase functions deploy ai --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  if (Test-Path $bakFile) {
    Move-Item -Force $bakFile $envFile
  }
}

Write-Host "✅ Deploy concluído" -ForegroundColor Green
