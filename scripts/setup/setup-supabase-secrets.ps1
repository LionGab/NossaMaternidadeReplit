# ============================================
# Nossa Maternidade - Setup Supabase Secrets (PowerShell)
# ============================================
# Configura todas as API keys necessárias nas Edge Functions do Supabase
#
# IMPORTANTE: Estas keys NÃO devem ter prefixo EXPO_PUBLIC_*
# Elas ficam APENAS no backend (Supabase) e nunca são expostas no app
# ============================================

$ErrorActionPreference = "Stop"

# Cores para output
function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Verificar se Supabase CLI está instalado
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Error "Supabase CLI não está instalado"
    Write-Info "Instale com: npm install -g supabase"
    exit 1
}

Write-Header "Configuração de Secrets do Supabase"

# Project ID do Supabase
$PROJECT_REF = "lqahkqfpynypbmhtffyi"
Write-Info "Projeto Supabase: $PROJECT_REF"

# Função para configurar secret
function Set-SupabaseSecret {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Description
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        Write-Warning "$Name não fornecido - pulando"
        return
    }

    Write-Info "Configurando $Name..."

    $result = supabase secrets set "$Name=$Value" --project-ref $PROJECT_REF 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "$Name configurado com sucesso"
    } else {
        Write-Error "Falha ao configurar $Name"
        Write-Host $result -ForegroundColor Red
    }
}

# ============================================
# API KEYS DE IA (Obrigatórias)
# ============================================

Write-Header "1. Configurando API Keys de IA"

if (-not $env:OPENAI_API_KEY) {
    $OPENAI_API_KEY = Read-Host "OPENAI_API_KEY (ou Enter para pular)"
}
Set-SupabaseSecret "OPENAI_API_KEY" $OPENAI_API_KEY "OpenAI API Key (GPT-4o)"

if (-not $env:GEMINI_API_KEY) {
    $GEMINI_API_KEY = Read-Host "GEMINI_API_KEY (ou Enter para pular)"
}
Set-SupabaseSecret "GEMINI_API_KEY" $GEMINI_API_KEY "Google Gemini API Key (Gemini 2.5 Flash)"

if (-not $env:ANTHROPIC_API_KEY) {
    $ANTHROPIC_API_KEY = Read-Host "ANTHROPIC_API_KEY (ou Enter para pular)"
}
Set-SupabaseSecret "ANTHROPIC_API_KEY" $ANTHROPIC_API_KEY "Anthropic API Key (Claude Sonnet)"

# ============================================
# ELEVENLABS (Opcional mas recomendado)
# ============================================

Write-Header "2. Configurando ElevenLabs (Voz da NathIA)"

if (-not $env:ELEVENLABS_API_KEY) {
    $ELEVENLABS_API_KEY = Read-Host "ELEVENLABS_API_KEY (ou Enter para pular)"
}
Set-SupabaseSecret "ELEVENLABS_API_KEY" $ELEVENLABS_API_KEY "ElevenLabs API Key (Text-to-Speech)"

# ============================================
# PERPLEXITY (Opcional)
# ============================================

Write-Header "3. Configurando Perplexity (Opcional)"

if (-not $env:PERPLEXITY_API_KEY) {
    $PERPLEXITY_API_KEY = Read-Host "PERPLEXITY_API_KEY (ou Enter para pular)"
}
if ($PERPLEXITY_API_KEY) {
    Set-SupabaseSecret "PERPLEXITY_API_KEY" $PERPLEXITY_API_KEY "Perplexity API Key"
}

# ============================================
# REVENUECAT WEBHOOK SECRET
# ============================================

Write-Header "4. Configurando RevenueCat Webhook Secret"

if (-not $env:REVENUECAT_WEBHOOK_SECRET) {
    Write-Info "Gerando webhook secret..."
    # Gerar secret aleatório (32 bytes em base64)
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    $REVENUECAT_WEBHOOK_SECRET = [Convert]::ToBase64String($bytes)
    Write-Success "Secret gerado: $($REVENUECAT_WEBHOOK_SECRET.Substring(0, 20))..."
    Write-Warning "IMPORTANTE: Use este mesmo valor no RevenueCat Dashboard!"
    Write-Host ""
    Write-Host "Copie este valor para configurar no RevenueCat:" -ForegroundColor Yellow
    Write-Host $REVENUECAT_WEBHOOK_SECRET -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
}
Set-SupabaseSecret "REVENUECAT_WEBHOOK_SECRET" $REVENUECAT_WEBHOOK_SECRET "RevenueCat Webhook Secret"

# ============================================
# UPSTASH REDIS (Opcional - Rate Limiting)
# ============================================

Write-Header "5. Configurando Upstash Redis (Opcional - Rate Limiting)"

if (-not $env:UPSTASH_REDIS_REST_URL) {
    $UPSTASH_REDIS_REST_URL = Read-Host "UPSTASH_REDIS_REST_URL (ou Enter para pular)"
}
if ($UPSTASH_REDIS_REST_URL) {
    Set-SupabaseSecret "UPSTASH_REDIS_REST_URL" $UPSTASH_REDIS_REST_URL "Upstash Redis REST URL"

    if (-not $env:UPSTASH_REDIS_REST_TOKEN) {
        $UPSTASH_REDIS_REST_TOKEN = Read-Host "UPSTASH_REDIS_REST_TOKEN"
    }
    Set-SupabaseSecret "UPSTASH_REDIS_REST_TOKEN" $UPSTASH_REDIS_REST_TOKEN "Upstash Redis REST Token"
}

# ============================================
# VALIDAÇÃO
# ============================================

Write-Header "6. Validando Secrets Configurados"

Write-Info "Listando secrets configurados..."
supabase secrets list --project-ref $PROJECT_REF

Write-Header "✅ Configuração Concluída!"

Write-Success "Secrets configurados no Supabase"
Write-Info "Próximos passos:"
Write-Host "  1. Deploy das Edge Functions: npm run deploy:functions"
Write-Host "  2. Configurar webhook no RevenueCat Dashboard"
Write-Host "  3. Testar Edge Functions: npm run test:functions"
Write-Host ""
