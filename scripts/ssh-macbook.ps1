#!/usr/bin/env pwsh
# Executa comando no MacBook via SSH
# Uso: .\scripts\ssh-macbook.ps1 <comando> [args...]
# Exemplo: .\scripts\ssh-macbook.ps1 "npm start"
#          .\scripts\ssh-macbook.ps1 "git status"
#          .\scripts\ssh-macbook.ps1 "npm run ios"

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)

if ($Args.Count -eq 0) {
    Write-Host "SSH MacBook Helper - Nossa Maternidade" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\scripts\ssh-macbook.ps1 <comando> [args...]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Green
    Write-Host "  .\scripts\ssh-macbook.ps1 'npm start'"
    Write-Host "  .\scripts\ssh-macbook.ps1 'git status'"
    Write-Host "  .\scripts\ssh-macbook.ps1 'npm run ios'"
    Write-Host ""
    Write-Host "Configuração SSH:" -ForegroundColor Cyan
    Write-Host "  Host: macbook"
    Write-Host "  IP: 192.168.2.2"
    Write-Host "  User: lion"
    Write-Host "  Project: ~/NossaMaternidadeReplit"
    Write-Host ""
    exit 0
}

$command = $Args -join " "
$projectDir = "~/NossaMaternidadeReplit"

# Executar comando no MacBook via SSH
ssh macbook "cd $projectDir && $command"
