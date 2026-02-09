# Script para verificar MCPs configurados no Cursor

$CURSOR_SETTINGS = "$env:APPDATA\Cursor\User\settings.json"

Write-Host "Verificando MCPs no Cursor..." -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $CURSOR_SETTINGS)) {
    Write-Host "ERRO: Arquivo settings.json nao encontrado" -ForegroundColor Red
    Write-Host "Localizacao esperada: $CURSOR_SETTINGS" -ForegroundColor Yellow
    exit 1
}

try {
    $settings = Get-Content $CURSOR_SETTINGS -Raw | ConvertFrom-Json
    
    if ($settings.mcpServers) {
        Write-Host "MCPs configurados:" -ForegroundColor Green
        Write-Host ""
        
        $mcpCount = 0
        $settings.mcpServers.PSObject.Properties | ForEach-Object {
            $serverName = $_.Name
            $serverConfig = $_.Value
            
            # Ignorar propriedades internas do PowerShell
            if ($serverName -notmatch '^(IsReadOnly|IsFixedSize|IsSynchronized|Keys|Values|SyncRoot|Count)$') {
                $mcpCount++
                Write-Host "  [$mcpCount] $serverName" -ForegroundColor Cyan
                
                if ($serverConfig.transport) {
                    Write-Host "      Transport: $($serverConfig.transport)" -ForegroundColor Gray
                }
                if ($serverConfig.url) {
                    Write-Host "      URL: $($serverConfig.url)" -ForegroundColor Gray
                }
                if ($serverConfig.command) {
                    Write-Host "      Command: $($serverConfig.command)" -ForegroundColor Gray
                }
                Write-Host ""
            }
        }
        
        Write-Host "Total: $mcpCount MCPs configurados" -ForegroundColor Green
        Write-Host ""
        Write-Host "Status:" -ForegroundColor Yellow
        Write-Host "  - Reinicie o Cursor se ainda nao fez" -ForegroundColor Gray
        Write-Host "  - Verifique as ferramentas MCP no Cursor (devem comecar com 'mcp_')" -ForegroundColor Gray
        
    } else {
        Write-Host "Nenhum MCP configurado em settings.json" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Execute: .\scripts\configure-mcps-cursor-v2.ps1" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "ERRO ao ler settings.json: $_" -ForegroundColor Red
    exit 1
}

