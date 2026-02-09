# Script para configurar Supabase completamente

Write-Host "Configurando Supabase - Nossa Maternidade" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Supabase CLI esta instalado
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseInstalled) {
    Write-Host "ERRO: Supabase CLI nao encontrado" -ForegroundColor Red
    Write-Host "Instale com: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host "Supabase CLI: $(supabase --version)" -ForegroundColor Green
Write-Host ""

# Verificar login
Write-Host "1. Verificando autenticacao..." -ForegroundColor Yellow
try {
    $projects = supabase projects list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK: Autenticado no Supabase" -ForegroundColor Green
    } else {
        Write-Host "   ERRO: Nao autenticado" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Execute: supabase login" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ERRO: Falha ao verificar autenticacao" -ForegroundColor Red
    Write-Host "   Execute: supabase login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Listar projetos disponiveis
Write-Host "2. Projetos disponiveis:" -ForegroundColor Yellow
supabase projects list
Write-Host ""

# Projeto recomendado (ja linkado)
$PROJECT_REF = "lqahkqfpynypbmhtffyi"
$PROJECT_NAME = "NossaMaternidade"

Write-Host "3. Linkando projeto..." -ForegroundColor Yellow
Write-Host "   Projeto: $PROJECT_NAME" -ForegroundColor Gray
Write-Host "   Reference: $PROJECT_REF" -ForegroundColor Gray
Write-Host ""

# Verificar se ja esta linkado
if (Test-Path "supabase\.temp\project-ref") {
    $currentRef = Get-Content "supabase\.temp\project-ref" -Raw | ForEach-Object { $_.Trim() }
    if ($currentRef -eq $PROJECT_REF) {
        Write-Host "   OK: Projeto ja esta linkado" -ForegroundColor Green
    } else {
        Write-Host "   Linkando projeto..." -ForegroundColor Yellow
        supabase link --project-ref $PROJECT_REF
    }
} else {
    Write-Host "   Linkando projeto..." -ForegroundColor Yellow
    supabase link --project-ref $PROJECT_REF
}

Write-Host ""

# Verificar status
Write-Host "4. Verificando status do projeto..." -ForegroundColor Yellow
supabase status
Write-Host ""

# Verificar configuracao MCP
Write-Host "5. Verificando configuracao MCP..." -ForegroundColor Yellow
$CURSOR_SETTINGS = "$env:APPDATA\Cursor\User\settings.json"
if (Test-Path $CURSOR_SETTINGS) {
    $settings = Get-Content $CURSOR_SETTINGS -Raw | ConvertFrom-Json
    if ($settings.mcpServers.supabase) {
        Write-Host "   OK: Supabase MCP ja configurado" -ForegroundColor Green
    } else {
        Write-Host "   INFO: Supabase MCP e configurado automaticamente" -ForegroundColor Gray
        Write-Host "   (Nao precisa adicionar manualmente ao settings.json)" -ForegroundColor Gray
    }
} else {
    Write-Host "   INFO: Arquivo settings.json nao encontrado" -ForegroundColor Gray
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Configuracao concluida!" -ForegroundColor Green
Write-Host ""
Write-Host "Projeto Supabase:" -ForegroundColor Cyan
Write-Host "  - Nome: $PROJECT_NAME" -ForegroundColor Gray
Write-Host "  - Reference: $PROJECT_REF" -ForegroundColor Gray
Write-Host "  - URL: https://$PROJECT_REF.supabase.co" -ForegroundColor Gray
Write-Host ""
Write-Host "MCP Supabase:" -ForegroundColor Cyan
Write-Host "  - Status: Configurado automaticamente" -ForegroundColor Gray
Write-Host "  - Ferramentas disponiveis: mcp_Supabase_*" -ForegroundColor Gray
Write-Host ""
Write-Host "Teste o MCP:" -ForegroundColor Yellow
Write-Host "  - Use: mcp_Supabase_list_projects" -ForegroundColor Gray
Write-Host "  - Use: mcp_Supabase_get_project com id: $PROJECT_REF" -ForegroundColor Gray
Write-Host ""

