# Fix Claude Desktop CSP Issues
# Limpa dados corrompidos que causam erros de Content Security Policy

param(
    [switch]$Force,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Claude Desktop CSP Fix Script

Este script limpa dados corrompidos do Claude Desktop que causam:
- Erros de Content Security Policy (CSP)
- Falhas no StatsigClient
- Warnings de Permissions-Policy

Uso:
    .\fix-claude-desktop-csp.ps1          # Modo interativo (pergunta antes de deletar)
    .\fix-claude-desktop-csp.ps1 -Force    # Modo automático (deleta sem perguntar)

IMPORTANTE:
- Feche o Claude Desktop antes de executar este script
- Você precisará fazer login novamente após a limpeza
"@
    exit 0
}

Write-Host "🔧 Claude Desktop CSP Fix" -ForegroundColor Cyan
Write-Host ""

# Verificar se Claude Desktop está rodando
$claudeProcess = Get-Process -Name "Claude" -ErrorAction SilentlyContinue
if ($claudeProcess) {
    Write-Host "⚠️  AVISO: Claude Desktop está rodando!" -ForegroundColor Yellow
    Write-Host "   Feche o Claude Desktop antes de continuar." -ForegroundColor Yellow
    Write-Host ""

    $response = Read-Host "Deseja fechar o Claude Desktop agora? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host "Fechando Claude Desktop..." -ForegroundColor Yellow
        Stop-Process -Name "Claude" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    } else {
        Write-Host "❌ Operação cancelada. Feche o Claude Desktop manualmente e tente novamente." -ForegroundColor Red
        exit 1
    }
}

# Caminhos dos diretórios
$storagePath = "$env:APPDATA\Claude\storage"
$cachePath = "$env:LOCALAPPDATA\Claude\cache"
$logsPath = "$env:APPDATA\Claude\logs"

# Função para limpar diretório
function Clear-Directory {
    param(
        [string]$Path,
        [string]$Name
    )

    if (Test-Path $Path) {
        Write-Host "🗑️  Limpando $Name..." -ForegroundColor Yellow
        try {
            Remove-Item -Recurse -Force $Path -ErrorAction Stop
            Write-Host "   ✅ $Name limpo com sucesso" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "   ❌ Erro ao limpar $Name`: $_" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "   ℹ️  $Name não existe (já está limpo)" -ForegroundColor Gray
        return $true
    }
}

# Verificar o que será limpo
Write-Host "📋 Diretórios que serão limpos:" -ForegroundColor Cyan
$toClean = @()

if (Test-Path $storagePath) {
    $size = (Get-ChildItem -Path $storagePath -Recurse -ErrorAction SilentlyContinue |
             Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
    $sizeMB = [math]::Round($size / 1MB, 2)
    Write-Host "   - Storage: $storagePath ($sizeMB MB)" -ForegroundColor White
    $toClean += @{Path=$storagePath; Name="Storage"}
}

if (Test-Path $cachePath) {
    $size = (Get-ChildItem -Path $cachePath -Recurse -ErrorAction SilentlyContinue |
             Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
    $sizeMB = [math]::Round($size / 1MB, 2)
    Write-Host "   - Cache: $cachePath ($sizeMB MB)" -ForegroundColor White
    $toClean += @{Path=$cachePath; Name="Cache"}
}

if (Test-Path $logsPath) {
    $size = (Get-ChildItem -Path $logsPath -Recurse -ErrorAction SilentlyContinue |
             Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
    $sizeMB = [math]::Round($size / 1MB, 2)
    Write-Host "   - Logs: $logsPath ($sizeMB MB)" -ForegroundColor White
    $toClean += @{Path=$logsPath; Name="Logs"}
}

if ($toClean.Count -eq 0) {
    Write-Host ""
    Write-Host "✅ Nada para limpar. Claude Desktop já está limpo!" -ForegroundColor Green
    exit 0
}

Write-Host ""

# Confirmar antes de limpar (a menos que -Force seja usado)
if (-not $Force) {
    Write-Host "⚠️  ATENÇÃO: Esta operação irá:" -ForegroundColor Yellow
    Write-Host "   - Deletar dados de storage (configurações locais)" -ForegroundColor Yellow
    Write-Host "   - Deletar cache (você precisará fazer login novamente)" -ForegroundColor Yellow
    Write-Host "   - Deletar logs (opcional)" -ForegroundColor Yellow
    Write-Host ""

    $response = Read-Host "Deseja continuar? (S/N)"
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "❌ Operação cancelada." -ForegroundColor Red
        exit 0
    }
}

Write-Host ""
Write-Host "🧹 Iniciando limpeza..." -ForegroundColor Cyan
Write-Host ""

# Limpar storage
$storageSuccess = Clear-Directory -Path $storagePath -Name "Storage"

# Limpar cache
$cacheSuccess = Clear-Directory -Path $cachePath -Name "Cache"

# Limpar logs (opcional)
$logsSuccess = Clear-Directory -Path $logsPath -Name "Logs"

Write-Host ""

# Resultado final
if ($storageSuccess -and $cacheSuccess) {
    Write-Host "✅ Limpeza concluída com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Reinicie o Claude Desktop" -ForegroundColor White
    Write-Host "   2. Faça login novamente" -ForegroundColor White
    Write-Host "   3. Verifique se os erros de CSP desapareceram" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Dica: Se os problemas persistirem, use Claude Web:" -ForegroundColor Yellow
    Write-Host "   https://claude.ai" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Limpeza concluída com alguns erros." -ForegroundColor Yellow
    Write-Host "   Tente executar o script novamente ou limpe manualmente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📚 Veja o guia completo em:" -ForegroundColor Cyan
    Write-Host "   docs/CLAUDE_DESKTOP_TROUBLESHOOTING.md" -ForegroundColor White
}
