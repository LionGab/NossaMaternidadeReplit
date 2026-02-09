# Script para recarregar Cursor e aplicar configuracoes MCP

Write-Host "Recarregando Cursor para aplicar MCPs..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Cursor esta rodando
$cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue

if ($cursorProcess) {
    Write-Host "Cursor esta rodando" -ForegroundColor Green
    Write-Host ""
    Write-Host "Opcoes para recarregar:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. RECOMENDADO: Recarregar janela via Command Palette" -ForegroundColor Cyan
    Write-Host "   - Pressione: Ctrl+Shift+P" -ForegroundColor Gray
    Write-Host "   - Digite: 'Reload Window' ou 'Developer: Reload Window'" -ForegroundColor Gray
    Write-Host "   - Pressione Enter" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. ALTERNATIVA: Fechar e reabrir Cursor" -ForegroundColor Cyan
    Write-Host "   - Feche todas as janelas do Cursor" -ForegroundColor Gray
    Write-Host "   - Abra o Cursor novamente" -ForegroundColor Gray
    Write-Host ""
    
    # Tentar enviar comando de reload via processo (pode nao funcionar)
    Write-Host "Tentando recarregar via processo..." -ForegroundColor Yellow
    try {
        # Enviar sinal para recarregar (se suportado)
        # Nota: Cursor pode nao suportar isso diretamente
        Write-Host "   (Cursor precisa ser recarregado manualmente)" -ForegroundColor Gray
    } catch {
        Write-Host "   Nao foi possivel recarregar automaticamente" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "Cursor nao esta rodando" -ForegroundColor Yellow
    Write-Host "Abra o Cursor para aplicar as configuracoes" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Apos recarregar, verifique os MCPs:" -ForegroundColor Yellow
Write-Host "  .\scripts\verify-mcps.ps1" -ForegroundColor Cyan
Write-Host ""

