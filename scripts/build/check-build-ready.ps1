# Script de validação pré-build (PowerShell para Windows)
# Verifica se o projeto está pronto para build de produção

$ErrorActionPreference = "Stop"

Write-Host "Verificando prontidao para build..." -ForegroundColor Cyan

$Errors = 0
$Warnings = 0

# Verificar se eas.json existe
if (-not (Test-Path "eas.json")) {
    Write-Host "ERROR: eas.json nao encontrado" -ForegroundColor Red
    $Errors++
} else {
    Write-Host "OK: eas.json encontrado" -ForegroundColor Green
}

# Verificar se app.json ou app.config.js existe
if (Test-Path "app.json") {
    Write-Host "OK: app.json encontrado" -ForegroundColor Green

    $appJson = Get-Content "app.json" -Raw
    if ($appJson -notmatch '"bundleIdentifier"') {
        Write-Host "WARNING: bundleIdentifier iOS nao configurado" -ForegroundColor Yellow
        $Warnings++
    } else {
        Write-Host "OK: bundleIdentifier iOS configurado" -ForegroundColor Green
    }

    if ($appJson -notmatch '"package"') {
        Write-Host "WARNING: package Android nao configurado" -ForegroundColor Yellow
        $Warnings++
    } else {
        Write-Host "OK: package Android configurado" -ForegroundColor Green
    }
} elseif (Test-Path "app.config.js") {
    Write-Host "OK: app.config.js encontrado (dynamic config)" -ForegroundColor Green

    $appConfig = Get-Content "app.config.js" -Raw
    if ($appConfig -notmatch 'bundleIdentifier') {
        Write-Host "WARNING: bundleIdentifier iOS nao configurado" -ForegroundColor Yellow
        $Warnings++
    } else {
        Write-Host "OK: bundleIdentifier iOS configurado" -ForegroundColor Green
    }

    if ($appConfig -notmatch 'package') {
        Write-Host "WARNING: package Android nao configurado" -ForegroundColor Yellow
        $Warnings++
    } else {
        Write-Host "OK: package Android configurado" -ForegroundColor Green
    }
} else {
    Write-Host "ERROR: app.json ou app.config.js nao encontrado" -ForegroundColor Red
    $Errors++
}

# Verificar assets
if (-not (Test-Path "assets/icon.png")) {
    Write-Host "WARNING: assets/icon.png nao encontrado" -ForegroundColor Yellow
    $Warnings++
} else {
    Write-Host "OK: Icone do app encontrado" -ForegroundColor Green
}

if (-not (Test-Path "assets/splash.png")) {
    Write-Host "WARNING: assets/splash.png nao encontrado" -ForegroundColor Yellow
    $Warnings++
} else {
    Write-Host "OK: Splash screen encontrado" -ForegroundColor Green
}

# Nota: TypeScript e ESLint já são verificados no quality-gate.ps1 antes deste script
# Não precisamos verificar novamente aqui para evitar duplicação

# Verificar se EAS CLI está instalado
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue
if ($easInstalled) {
    Write-Host "OK: EAS CLI instalado" -ForegroundColor Green

    # Verificar login (pode falhar se não logado, mas não é crítico)
    try {
        $null = eas whoami 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK: Logado no EAS" -ForegroundColor Green
        } else {
            Write-Host "WARNING: Nao logado no EAS. Execute: eas login" -ForegroundColor Yellow
            $Warnings++
        }
    } catch {
        Write-Host "WARNING: Nao logado no EAS. Execute: eas login" -ForegroundColor Yellow
        $Warnings++
    }
} else {
    Write-Host "WARNING: EAS CLI nao instalado. Execute: npm install -g eas-cli" -ForegroundColor Yellow
    $Warnings++
}

# Resumo
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
if ($Errors -eq 0 -and $Warnings -eq 0) {
    Write-Host "SUCCESS: Projeto pronto para build!" -ForegroundColor Green
    exit 0
} elseif ($Errors -eq 0) {
    Write-Host "WARNING: Projeto pronto com $Warnings aviso(s)" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "ERROR: $Errors erro(s) encontrado(s)" -ForegroundColor Red
    if ($Warnings -gt 0) {
        Write-Host "   $Warnings aviso(s) encontrado(s)" -ForegroundColor Yellow
    }
    exit 1
}
