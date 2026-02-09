# ========================================
# Setup Windows Optimization
# React Native + Expo - Ryzen 5 7600X
# ========================================

Write-Host "🚀 Configurando otimizações para React Native..." -ForegroundColor Cyan

# ========================================
# 1. INSTALAR CHOCOLATEY (se necessário)
# ========================================

if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Chocolatey não encontrado. Instalando..." -ForegroundColor Yellow
    Write-Host "Você será solicitado a confirmar (pressione Y)" -ForegroundColor Yellow

    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

    Write-Host "✅ Chocolatey instalado!" -ForegroundColor Green
}
else {
    Write-Host "✅ Chocolatey já instalado" -ForegroundColor Green
}

# ========================================
# 2. INSTALAR WATCHMAN
# ========================================

Write-Host "`n📡 Instalando Watchman..." -ForegroundColor Cyan

if (-not (Get-Command watchman -ErrorAction SilentlyContinue)) {
    choco install watchman -y

    # Atualizar PATH na sessão atual
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

    Write-Host "✅ Watchman instalado!" -ForegroundColor Green
}
else {
    Write-Host "✅ Watchman já instalado" -ForegroundColor Green
    watchman --version
}

# ========================================
# 3. WINDOWS DEFENDER EXCLUSÕES
# ========================================

Write-Host "`n🛡️ Configurando Windows Defender exclusões..." -ForegroundColor Cyan
Write-Host "IMPORTANTE: Requer privilégios de administrador" -ForegroundColor Yellow

try {
    # Verificar se é admin
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    $isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

    if ($isAdmin) {
        # Projeto
        Add-MpPreference -ExclusionPath "$PWD" -ErrorAction SilentlyContinue

        # Node/NPM
        Add-MpPreference -ExclusionPath "$env:USERPROFILE\.npm" -ErrorAction SilentlyContinue
        Add-MpPreference -ExclusionPath "$env:USERPROFILE\.metro-cache" -ErrorAction SilentlyContinue
        Add-MpPreference -ExclusionPath "C:\npm-cache" -ErrorAction SilentlyContinue

        # Processos
        Add-MpPreference -ExclusionProcess "node.exe" -ErrorAction SilentlyContinue
        Add-MpPreference -ExclusionProcess "Code.exe" -ErrorAction SilentlyContinue
        Add-MpPreference -ExclusionProcess "watchman.exe" -ErrorAction SilentlyContinue

        Write-Host "✅ Exclusões do Windows Defender configuradas!" -ForegroundColor Green

        # Mostrar exclusões
        Write-Host "`nExclusões configuradas:" -ForegroundColor Cyan
        Get-MpPreference | Select-Object -ExpandProperty ExclusionPath | ForEach-Object {
            Write-Host "  - $_" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "⚠️ Execute como Administrador para configurar exclusões do Windows Defender" -ForegroundColor Yellow
        Write-Host "   Ganho de performance: 15-25% em builds" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️ Não foi possível configurar exclusões: $($_.Exception.Message)" -ForegroundColor Yellow
}

# ========================================
# 4. CRIAR CACHE NPM
# ========================================

Write-Host "`n📦 Configurando cache NPM..." -ForegroundColor Cyan

if (-not (Test-Path "C:\npm-cache")) {
    New-Item -ItemType Directory -Path "C:\npm-cache" -Force | Out-Null
    Write-Host "✅ Diretório de cache criado: C:\npm-cache" -ForegroundColor Green
}

# ========================================
# 5. VERIFICAR CONFIGURAÇÕES
# ========================================

Write-Host "`n🔍 Verificando configurações..." -ForegroundColor Cyan

# Node version
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "❌ Node.js não encontrado" -ForegroundColor Red
}

# NPM version
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "✅ NPM: v$npmVersion" -ForegroundColor Green
}

# Expo CLI
$expoCLI = Get-Command expo -ErrorAction SilentlyContinue
if ($expoCLI) {
    Write-Host "✅ Expo CLI instalado" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Expo CLI não encontrado globalmente (ok se usar npx)" -ForegroundColor Yellow
}

# Watchman
$watchmanVersion = watchman --version 2>$null
if ($watchmanVersion) {
    Write-Host "✅ Watchman: $watchmanVersion" -ForegroundColor Green
}
else {
    Write-Host "❌ Watchman não encontrado" -ForegroundColor Red
}

# Arquivos de configuração
$configFiles = @('.env.local', '.npmrc', '.watchmanconfig')
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file criado" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $file não encontrado" -ForegroundColor Red
    }
}

# ========================================
# 6. CONFIGURAR POWERSHELL PROFILE
# ========================================

Write-Host "`n⚙️ Configurar PowerShell Profile?" -ForegroundColor Cyan
Write-Host "Adiciona aliases úteis para React Native (rn-start, rn-clean, etc.)" -ForegroundColor Gray

$response = Read-Host "Configurar? (S/N)"
if ($response -eq 'S' -or $response -eq 's' -or $response -eq 'Y' -or $response -eq 'y') {

    $profileContent = @'

# === REACT NATIVE ENV ===
$env:NODE_OPTIONS = "--max-old-space-size=8192"
$env:METRO_MAX_WORKERS = 5
$env:EXPO_NO_TELEMETRY = 1

# Aliases úteis
function rn-start { npm run start:turbo }
function rn-ios { npm run ios }
function rn-android { npm run android }
function rn-clean { npm run cache:clear:all }
function rn-kill { taskkill /F /IM node.exe 2>$null }

# CD rápido
function nm { Set-Location "C:\Users\User\Documents\new\NossaMaternidade\NossaMaternidade" }

# Cor do terminal
Set-PSReadLineOption -Colors @{
    Command = 'Green'
    Parameter = 'Gray'
    String = 'Yellow'
}

Write-Host "✅ React Native profile loaded" -ForegroundColor Green
'@

    if (Test-Path $PROFILE) {
        $existingContent = Get-Content $PROFILE -Raw
        if ($existingContent -notmatch 'REACT NATIVE ENV') {
            Add-Content $PROFILE $profileContent
            Write-Host "✅ PowerShell Profile atualizado!" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️ Profile já configurado" -ForegroundColor Yellow
        }
    }
    else {
        New-Item -Path $PROFILE -ItemType File -Force | Out-Null
        Set-Content $PROFILE $profileContent
        Write-Host "✅ PowerShell Profile criado!" -ForegroundColor Green
    }

    Write-Host "   Reinicie o PowerShell para aplicar" -ForegroundColor Gray
}

# ========================================
# RESUMO
# ========================================

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Feche e reabra o PowerShell/VS Code" -ForegroundColor White
Write-Host "2. Execute: npm install (vai usar cache otimizado)" -ForegroundColor White
Write-Host "3. Execute: npm start (Metro com 5 workers)" -ForegroundColor White
Write-Host "4. Verifique console: '[Metro] Using 5 workers'" -ForegroundColor White

Write-Host "`nComandos úteis:" -ForegroundColor Yellow
Write-Host "  rn-start    - Start com turbo mode" -ForegroundColor Gray
Write-Host "  rn-clean    - Limpar todos os caches" -ForegroundColor Gray
Write-Host "  rn-kill     - Matar processos Node travados" -ForegroundColor Gray
Write-Host "  nm          - CD para projeto" -ForegroundColor Gray

Write-Host "`n📖 Documentação completa:" -ForegroundColor Cyan
Write-Host "   docs/setup/REACT-NATIVE-OPTIMIZATION.md" -ForegroundColor Gray

Write-Host "`n"
