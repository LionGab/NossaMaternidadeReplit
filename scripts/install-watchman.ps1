# ========================================
# INSTALAR WATCHMAN - PowerShell Admin
# ========================================

Write-Host "🚀 Instalando Watchman via Chocolatey..." -ForegroundColor Cyan

# Atualizar PATH manualmente
$env:ChocolateyInstall = Convert-Path "$((Get-Command choco -ErrorAction SilentlyContinue).Path)\..\.."
Import-Module "$env:ChocolateyInstall\helpers\chocolateyProfile.psm1" -ErrorAction SilentlyContinue
Update-SessionEnvironment -ErrorAction SilentlyContinue

# Tentar via path direto
& "C:\ProgramData\chocolatey\choco.exe" install watchman -y

Write-Host "`n✅ Instalação concluída!" -ForegroundColor Green
Write-Host "Feche e reabra o PowerShell para usar o Watchman" -ForegroundColor Yellow

# Verificar instalação
Write-Host "`nTestando..." -ForegroundColor Cyan
$watchmanPath = "C:\ProgramData\chocolatey\lib\watchman\tools\watchman.exe"
if (Test-Path $watchmanPath) {
    & $watchmanPath --version
    Write-Host "✅ Watchman instalado em: $watchmanPath" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Reinicie o PowerShell e teste: watchman --version" -ForegroundColor Yellow
}
