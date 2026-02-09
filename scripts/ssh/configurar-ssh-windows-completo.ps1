# Script Auxiliar: Configuração SSH Completa com Detecção Automática de Chave
# Este script detecta automaticamente a chave SSH mais recente e configura tudo

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ConfigScript = Join-Path $ScriptDir "configurar-ssh-windows.ps1"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Configuração SSH Completa - Windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Procurar chave SSH mais recente
$sshKeys = @(
    "$env:USERPROFILE\.ssh\id_ed25519.pub",
    "$env:USERPROFILE\.ssh\id_rsa.pub",
    "$env:USERPROFILE\.ssh\id_ecdsa.pub",
    "$env:USERPROFILE\.ssh\id_dsa.pub"
)

$chaveEncontrada = $null
foreach ($key in $sshKeys) {
    if (Test-Path $key) {
        $chaveEncontrada = $key
        break
    }
}

if ($chaveEncontrada) {
    Write-Host "[✓] Chave SSH encontrada: $chaveEncontrada" -ForegroundColor Green
    $chavePublica = Get-Content $chaveEncontrada -Raw
    Write-Host ""
    Write-Host "Executando configuração com chave pública..." -ForegroundColor Yellow
    Write-Host ""
    & $ConfigScript -ChavePublica $chavePublica.Trim()
} else {
    Write-Host "[⚠] Nenhuma chave SSH pública encontrada" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Executando configuração básica (sem chave pública)..." -ForegroundColor Yellow
    Write-Host "Você pode adicionar uma chave depois executando:" -ForegroundColor White
    Write-Host "  .\configurar-ssh-windows.ps1 -ChavePublica (Get-Content ~\.ssh\id_ed25519.pub -Raw)" -ForegroundColor Gray
    Write-Host ""
    & $ConfigScript
}
