# Script para configurar servidor SSH completo no Windows
# Windows PowerShell
# Requer: Executar como Administrador
# Uso: .\scripts\configurar-ssh-windows-completo.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Configuração SSH Completa - Windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está executando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ ERRO: Este script requer privilégios de Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute como Administrador:" -ForegroundColor Yellow
    Write-Host "  1. Clique com botão direito no PowerShell" -ForegroundColor White
    Write-Host "  2. Escolha 'Executar como administrador'" -ForegroundColor White
    Write-Host "  3. Execute: .\scripts\configurar-ssh-windows-completo.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "[✓] Executando como Administrador" -ForegroundColor Green
Write-Host ""

# [PASSO] 1/5 - Verificar e instalar OpenSSH Server
Write-Host "[PASSO] 1/5 - Verificando OpenSSH Server..." -ForegroundColor Yellow

$sshService = Get-Service -Name sshd -ErrorAction SilentlyContinue
if (-not $sshService) {
    Write-Host "   [INFO] OpenSSH Server não está instalado" -ForegroundColor Yellow
    Write-Host "   [INFO] Instalando OpenSSH Server..." -ForegroundColor Yellow

    try {
        Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0 -ErrorAction Stop
        Write-Host "   [✓] OpenSSH Server instalado" -ForegroundColor Green
    }
    catch {
        Write-Host "   [❌] ERRO ao instalar OpenSSH Server" -ForegroundColor Red
        Write-Host "   [INFO] Tente instalar manualmente via 'Recursos do Windows'" -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "   [✓] OpenSSH Server já está instalado" -ForegroundColor Green
}

# [PASSO] 2/5 - Iniciar e habilitar serviço SSH
Write-Host ""
Write-Host "[PASSO] 2/5 - Configurando serviço SSH..." -ForegroundColor Yellow

try {
    Start-Service sshd
    Set-Service -Name sshd -StartupType Automatic
    Write-Host "   [✓] Serviço SSH iniciado e habilitado" -ForegroundColor Green
    Write-Host "   [INFO] Status: $(Get-Service sshd | Select-Object -ExpandProperty Status)" -ForegroundColor Gray
}
catch {
    Write-Host "   [❌] ERRO ao configurar serviço SSH" -ForegroundColor Red
    Write-Host "   [INFO] Tente manualmente: Start-Service sshd" -ForegroundColor Yellow
    exit 1
}

# [PASSO] 3/5 - Configurar firewall
Write-Host ""
Write-Host "[PASSO] 3/5 - Configurando firewall..." -ForegroundColor Yellow

try {
    $firewallRule = Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue
    if (-not $firewallRule) {
        New-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -DisplayName "OpenSSH SSH Server (sshd)" -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22 -Profile Domain,Private,Public | Out-Null
        Write-Host "   [✓] Regra de firewall criada" -ForegroundColor Green
    }
    else {
        # Atualizar regra existente para aplicar em todos os perfis
        Set-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -Profile Domain,Private,Public -ErrorAction SilentlyContinue | Out-Null
        Enable-NetFirewallRule -Name "OpenSSH-Server-In-TCP" | Out-Null
        Write-Host "   [✓] Regra de firewall habilitada" -ForegroundColor Green
        Write-Host "   [INFO] Regra configurada para perfis: Domain, Private, Public" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   [⚠]  Aviso: Não foi possível configurar firewall automaticamente" -ForegroundColor Yellow
    Write-Host "   [INFO] Configure manualmente: Porta 22 TCP, Inbound, Allow" -ForegroundColor Gray
}

# [PASSO] 4/5 - Descobrir IP do Windows
Write-Host ""
Write-Host "[PASSO] 4/5 - Descobrindo IP do Windows..." -ForegroundColor Yellow

$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notmatch "^(127\.|169\.254\.)" -and
    $_.InterfaceAlias -notmatch "Loopback"
} | Select-Object -ExpandProperty IPAddress

if ($ipAddresses) {
    Write-Host "   [✓] IPs encontrados:" -ForegroundColor Green
    foreach ($ip in $ipAddresses) {
        Write-Host "      - $ip" -ForegroundColor Gray
    }
    $mainIP = $ipAddresses[0]
}
else {
    Write-Host "   [⚠]  Nenhum IP encontrado (verifique conexão de rede)" -ForegroundColor Yellow
    $mainIP = "DESCONHECIDO"
}

# [PASSO] 5/5 - Configurar authorized_keys (se não existe)
Write-Host ""
Write-Host "[PASSO] 5/5 - Verificando authorized_keys..." -ForegroundColor Yellow

$sshDir = "$env:USERPROFILE\.ssh"
$authorizedKeysPath = "$sshDir\authorized_keys"

if (-not (Test-Path $authorizedKeysPath)) {
    Write-Host "   [INFO] Arquivo authorized_keys não existe" -ForegroundColor Yellow
    Write-Host "   [INFO] Execute primeiro: .\scripts\configurar-ssh-windows.ps1" -ForegroundColor Gray
}
else {
    $keyCount = (Get-Content $authorizedKeysPath -ErrorAction SilentlyContinue | Where-Object { $_.Trim() -ne "" }).Count
    Write-Host "   [✓] Arquivo authorized_keys existe ($keyCount chave(s))" -ForegroundColor Green
}

# Resumo
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "RESUMO DA CONFIGURAÇÃO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[✓] OpenSSH Server instalado e configurado" -ForegroundColor Green
Write-Host "[✓] Serviço SSH iniciado e habilitado" -ForegroundColor Green
Write-Host "[✓] Firewall configurado para porta 22" -ForegroundColor Green
Write-Host ""
Write-Host "Informações para Conexão:" -ForegroundColor Cyan
Write-Host "  IP do Windows: $mainIP" -ForegroundColor White
Write-Host "  Porta SSH: 22" -ForegroundColor White
Write-Host "  Usuário: $env:USERNAME" -ForegroundColor White
Write-Host ""
Write-Host "Para conectar do MacBook:" -ForegroundColor Cyan
Write-Host "  ssh $env:USERNAME@$mainIP" -ForegroundColor White
Write-Host ""
Write-Host "Ou configure SSH config no MacBook (~/.ssh/config):" -ForegroundColor Yellow
Write-Host "  Host windows-remoto" -ForegroundColor White
Write-Host "      HostName $mainIP" -ForegroundColor White
Write-Host "      User $env:USERNAME" -ForegroundColor White
Write-Host "      Port 22" -ForegroundColor White
Write-Host ""
Write-Host "Depois, teste a conexão do MacBook:" -ForegroundColor Cyan
Write-Host "  ssh windows-remoto" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
