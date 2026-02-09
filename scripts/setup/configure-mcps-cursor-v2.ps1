# Script para configurar MCPs no Cursor IDE (Versao Corrigida)
# Windows - Cursor Settings

$CURSOR_SETTINGS = "$env:APPDATA\Cursor\User\settings.json"
$MCP_EXAMPLE = ".claude\mcp-settings-example.json"

Write-Host "Configurando MCPs no Cursor..." -ForegroundColor Cyan
Write-Host "Arquivo: $CURSOR_SETTINGS" -ForegroundColor Gray
Write-Host ""

# Ler configuracao de exemplo
$mcpConfig = Get-Content $MCP_EXAMPLE -Raw | ConvertFrom-Json

# Verificar se o arquivo existe
if (Test-Path $CURSOR_SETTINGS) {
    Write-Host "Arquivo settings.json encontrado" -ForegroundColor Green
    try {
        $settingsContent = Get-Content $CURSOR_SETTINGS -Raw
        $settings = $settingsContent | ConvertFrom-Json
    } catch {
        Write-Host "Erro ao ler settings.json, criando novo..." -ForegroundColor Yellow
        $settings = @{} | ConvertTo-Json | ConvertFrom-Json
    }
} else {
    Write-Host "Criando novo arquivo settings.json..." -ForegroundColor Yellow
    $settings = @{} | ConvertTo-Json | ConvertFrom-Json
}

# Garantir que mcpServers existe
if (-not $settings.mcpServers) {
    $settings | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value @{} -Force
}

# Adicionar cada MCP
$mcpConfig.mcpServers.PSObject.Properties | ForEach-Object {
    $serverName = $_.Name
    $serverConfig = $_.Value
    
    if (-not $settings.mcpServers.$serverName) {
        Write-Host "Adicionando MCP: $serverName" -ForegroundColor Green
        # Converter para objeto PSCustomObject
        $serverObj = @{}
        $serverConfig.PSObject.Properties | ForEach-Object {
            $serverObj[$_.Name] = $_.Value
        }
        $settings.mcpServers | Add-Member -MemberType NoteProperty -Name $serverName -Value ($serverObj | ConvertTo-Json | ConvertFrom-Json) -Force
    } else {
        Write-Host "MCP ja existe: $serverName" -ForegroundColor Yellow
    }
}

# Converter de volta para JSON e salvar
$outputJson = $settings | ConvertTo-Json -Depth 10
$outputJson | Out-File -FilePath $CURSOR_SETTINGS -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "Configuracao concluida!" -ForegroundColor Green
Write-Host ""
Write-Host "MCPs configurados:" -ForegroundColor Cyan
$mcpConfig.mcpServers.PSObject.Properties | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "IMPORTANTE: Reinicie o Cursor para aplicar as mudancas." -ForegroundColor Yellow
Write-Host ""

