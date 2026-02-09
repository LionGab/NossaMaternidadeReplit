#!/usr/bin/env pwsh
# Helper script para EAS CLI no Windows
# Uso: .\scripts\eas.ps1 <comando> [args...]
# Exemplo: .\scripts\eas.ps1 whoami
#          .\scripts\eas.ps1 build --platform ios --profile preview

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

if ($Args.Count -eq 0) {
    Write-Host "EAS CLI Helper - Nossa Maternidade" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\scripts\eas.ps1 <comando> [args...]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Green
    Write-Host "  .\scripts\eas.ps1 whoami"
    Write-Host "  .\scripts\eas.ps1 build --platform ios --profile preview"
    Write-Host "  .\scripts\eas.ps1 secret:list"
    Write-Host ""
    Write-Host "Ou use via npm: npm run eas -- <comando>" -ForegroundColor Cyan
    exit 0
}

npx eas-cli $Args

