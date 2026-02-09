# Script para adicionar variaveis do Supabase ao .env.local
# Uso: .\scripts\add-env-vars.ps1

$envFile = ".env.local"
$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot $envFile

Write-Host "Adicionando variaveis do Supabase ao $envPath" -ForegroundColor Cyan

# Variáveis a adicionar
$newVars = @"
# ============================================
# Supabase - Configuração Principal
# ============================================
# Projeto: NossaMaternidade (lqahkqfpynypbmhtffyi)
EXPO_PUBLIC_SUPABASE_URL="https://lqahkqfpynypbmhtffyi.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="***REMOVED***"
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL="https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1"
SUPABASE_PROJECT_ID="lqahkqfpynypbmhtffyi"

# ============================================
# ElevenLabs - Text-to-Speech (Opcional)
# ============================================
EXPO_ELEVENLABS_API_KEY="***REMOVED***"
VOICE_ID="ux2J2EvwciGXj9xGOHNN"
"@

# Ler conteudo atual
$currentContent = ""
if (Test-Path $envPath) {
    $currentContent = Get-Content $envPath -Raw
    Write-Host "Arquivo encontrado: $envPath" -ForegroundColor Green
} else {
    Write-Host "Arquivo nao encontrado, criando novo..." -ForegroundColor Yellow
}

# Verificar se variáveis já existem
$varsToCheck = @(
    "EXPO_PUBLIC_SUPABASE_URL",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL"
)

$needsUpdate = $false
foreach ($var in $varsToCheck) {
    if ($currentContent -notmatch "$var=") {
        $needsUpdate = $true
        Write-Host "   $var nao encontrado" -ForegroundColor Red
    } else {
        Write-Host "   $var ja existe" -ForegroundColor Green
    }
}

if (-not $needsUpdate) {
    Write-Host "`nTodas as variaveis ja estao configuradas!" -ForegroundColor Green
    exit 0
}

# Adicionar variaveis ao final do arquivo
Write-Host "`nAdicionando variaveis..." -ForegroundColor Cyan

if ($currentContent) {
    # Se arquivo existe, adicionar ao final
    Add-Content -Path $envPath -Value "`n$newVars"
} else {
    # Se nao existe, criar novo
    Set-Content -Path $envPath -Value $newVars
}

Write-Host "Variaveis adicionadas com sucesso!" -ForegroundColor Green
Write-Host "`nExecute 'npm run validate-env' para verificar" -ForegroundColor Cyan
