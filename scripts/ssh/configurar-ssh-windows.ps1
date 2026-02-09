# Script de Configuração SSH para Windows
# Configura o servidor OpenSSH no Windows para permitir conexões remotas
#
# Uso:
#   .\configurar-ssh-windows.ps1 [-ChavePublica "ssh-ed25519 AAAAC3..."]
#
# Exemplo:
#   .\configurar-ssh-windows.ps1 -ChavePublica (Get-Content ~\.ssh\id_ed25519.pub -Raw)

param(
    [string]$ChavePublica = "",
    [switch]$Verbose,
    [switch]$Help
)

# Cores para output
function Write-Info { Write-Host "[INFO] " -ForegroundColor Blue -NoNewline; Write-Host $args }
function Write-Success { Write-Host "[✓] " -ForegroundColor Green -NoNewline; Write-Host $args }
function Write-Warning { Write-Host "[⚠] " -ForegroundColor Yellow -NoNewline; Write-Host $args }
function Write-Error { Write-Host "[✗] " -ForegroundColor Red -NoNewline; Write-Host $args }
function Write-Step { Write-Host "[PASSO] " -ForegroundColor Cyan -NoNewline; Write-Host $args }

# Função para exibir ajuda
function Show-Help {
    @"
Script de Configuração SSH para Windows

Uso:
    .\configurar-ssh-windows.ps1 [OPÇÕES]

Opções:
    -ChavePublica "chave"    Adiciona uma chave pública SSH ao authorized_keys
    -Verbose                 Exibe informações detalhadas
    -Help                    Exibe esta ajuda

Exemplos:
    # Configuração básica (apenas habilita SSH)
    .\configurar-ssh-windows.ps1

    # Configuração completa com chave pública
    .\configurar-ssh-windows.ps1 -ChavePublica (Get-Content ~\.ssh\id_ed25519.pub -Raw)

    # Com chave de arquivo
    .\configurar-ssh-windows.ps1 -ChavePublica (Get-Content C:\caminho\para\id_rsa.pub -Raw)

"@
}

if ($Help) {
    Show-Help
    exit 0
}

# Banner
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Configuração SSH para Windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando no Windows
if ($PSVersionTable.Platform -and $PSVersionTable.Platform -ne "Win32NT") {
    Write-Error "Este script deve ser executado no Windows"
    exit 1
}

# Verificar se está rodando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "Este script precisa ser executado como Administrador"
    Write-Info "Execute: Start-Process PowerShell -Verb RunAs"
    exit 1
}

# ============================================
# PASSO 1: Verificar IP Atual
# ============================================
Write-Step "1/7 - Verificando IP atual do Windows..."

$networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object IPAddress, InterfaceAlias

if ($networkAdapters) {
    Write-Success "IPs encontrados:"
    foreach ($adapter in $networkAdapters) {
        Write-Host "  - $($adapter.IPAddress) ($($adapter.InterfaceAlias))" -ForegroundColor Gray
    }
    $IP_ATUAL = ($networkAdapters | Select-Object -First 1).IPAddress
} else {
    Write-Warning "Nenhum IP encontrado. Verifique a conexão de rede."
    $IP_ATUAL = "N/A"
}

Write-Host ""

# ============================================
# PASSO 2: Instalar OpenSSH Server
# ============================================
Write-Step "2/7 - Verificando/Instalando OpenSSH Server..."

$sshServerCapability = Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH.Server*'

if ($sshServerCapability.State -eq "Installed") {
    Write-Success "OpenSSH Server já está instalado"
} else {
    Write-Info "Instalando OpenSSH Server..."
    try {
        Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0 | Out-Null
        Write-Success "OpenSSH Server instalado com sucesso"
    } catch {
        Write-Error "Falha ao instalar OpenSSH Server: $_"
        exit 1
    }
}

Write-Host ""

# ============================================
# PASSO 3: Iniciar e Habilitar Serviço SSH
# ============================================
Write-Step "3/7 - Configurando serviço SSH..."

$sshService = Get-Service -Name sshd -ErrorAction SilentlyContinue

if (-not $sshService) {
    Write-Error "Serviço SSH não encontrado. Reinstale o OpenSSH Server."
    exit 1
}

# Iniciar serviço
if ($sshService.Status -ne "Running") {
    Write-Info "Iniciando serviço SSH..."
    Start-Service sshd
    Write-Success "Serviço SSH iniciado"
} else {
    Write-Success "Serviço SSH já está rodando"
}

# Habilitar para iniciar automaticamente
Set-Service -Name sshd -StartupType Automatic | Out-Null
Write-Success "Serviço SSH configurado para iniciar automaticamente"

Write-Host ""

# ============================================
# PASSO 4: Configurar Firewall
# ============================================
Write-Step "4/7 - Configurando firewall..."

$firewallRule = Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue

if ($firewallRule) {
    if ($firewallRule.Enabled) {
        Write-Success "Regra de firewall já existe e está habilitada"
    } else {
        Write-Info "Habilitando regra de firewall..."
        Enable-NetFirewallRule -Name "OpenSSH-Server-In-TCP" | Out-Null
        Write-Success "Regra de firewall habilitada"
    }
} else {
    Write-Info "Criando regra de firewall..."
    New-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -DisplayName "OpenSSH SSH Server (sshd)" -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22 | Out-Null
    Write-Success "Regra de firewall criada"
}

Write-Host ""

# ============================================
# PASSO 5: Criar Diretório .ssh e Configurar Permissões
# ============================================
Write-Step "5/7 - Configurando diretório .ssh..."

$sshDir = "$env:USERPROFILE\.ssh"

if (-not (Test-Path $sshDir)) {
    Write-Info "Criando diretório .ssh..."
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
    Write-Success "Diretório .ssh criado"
} else {
    Write-Success "Diretório .ssh já existe"
}

# Criar authorized_keys se não existir
$authorizedKeys = "$sshDir\authorized_keys"
if (-not (Test-Path $authorizedKeys)) {
    New-Item -ItemType File -Path $authorizedKeys -Force | Out-Null
    Write-Success "Arquivo authorized_keys criado"
} else {
    Write-Success "Arquivo authorized_keys já existe"
}

# Configurar permissões (Windows ACL)
Write-Info "Configurando permissões do authorized_keys..."
$acl = Get-Acl $authorizedKeys
$permission = $env:USERNAME, "FullControl", "Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl $authorizedKeys $acl | Out-Null
Write-Success "Permissões configuradas"

Write-Host ""

# ============================================
# PASSO 6: Adicionar Chave Pública (se fornecida)
# ============================================
Write-Step "6/7 - Configurando chaves SSH..."

if ($ChavePublica) {
    Write-Info "Adicionando chave pública ao authorized_keys..."

    # Verificar se a chave já existe
    $existingKeys = Get-Content $authorizedKeys -ErrorAction SilentlyContinue
    if ($existingKeys -contains $ChavePublica) {
        Write-Warning "Esta chave já está no authorized_keys"
    } else {
        Add-Content -Path $authorizedKeys -Value $ChavePublica
        Write-Success "Chave pública adicionada com sucesso"
    }
} else {
    Write-Info "Nenhuma chave pública fornecida. Pulando adição de chave."
    Write-Info "Para adicionar uma chave depois, execute:"
    Write-Info "  Add-Content -Path `$env:USERPROFILE\.ssh\authorized_keys -Value 'sua-chave-publica'"
}

# Listar chaves existentes
$keysCount = (Get-Content $authorizedKeys -ErrorAction SilentlyContinue | Where-Object { $_.Trim() -ne "" }).Count
if ($keysCount -gt 0) {
    Write-Info "Total de chaves no authorized_keys: $keysCount"
}

Write-Host ""

# ============================================
# PASSO 7: Verificar Configuração do OpenSSH
# ============================================
Write-Step "7/7 - Verificando configuração do OpenSSH..."

$sshdConfig = "$env:ProgramData\ssh\sshd_config"

if (Test-Path $sshdConfig) {
    Write-Success "Arquivo de configuração SSH encontrado"

    # Verificar se AuthorizedKeysFile está configurado corretamente
    $configContent = Get-Content $sshdConfig -Raw
    if ($configContent -match "AuthorizedKeysFile") {
        Write-Info "AuthorizedKeysFile já está configurado"
    } else {
        Write-Warning "AuthorizedKeysFile não encontrado na configuração"
        Write-Info "Adicione ao $sshdConfig :"
        Write-Host "  AuthorizedKeysFile .ssh/authorized_keys" -ForegroundColor Cyan
    }
} else {
    Write-Warning "Arquivo de configuração SSH não encontrado"
}

# Verificar se precisa reiniciar o serviço
Write-Info "Verificando se precisa reiniciar o serviço SSH..."
$needsRestart = $false

if ($ChavePublica) {
    $needsRestart = $true
}

if ($needsRestart) {
    Write-Info "Reiniciando serviço SSH para aplicar mudanças..."
    Restart-Service sshd
    Write-Success "Serviço SSH reiniciado"
} else {
    Write-Success "Nenhuma reinicialização necessária"
}

Write-Host ""

# ============================================
# RESUMO FINAL
# ============================================
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "RESUMO DA CONFIGURAÇÃO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Success "OpenSSH Server está instalado e rodando"
Write-Success "Firewall configurado para permitir SSH"
Write-Success "Diretório .ssh configurado com permissões corretas"

if ($IP_ATUAL -ne "N/A") {
    Write-Host ""
    Write-Host "Informações para Conexão:" -ForegroundColor Cyan
    Write-Host "  IP do Windows: $IP_ATUAL" -ForegroundColor White
    Write-Host "  Porta SSH: 22" -ForegroundColor White
    Write-Host "  Usuário: $env:USERNAME" -ForegroundColor White
    Write-Host ""
    Write-Host "Para conectar de outro dispositivo:" -ForegroundColor Cyan
    Write-Host "  ssh $env:USERNAME@$IP_ATUAL" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou usando hostname:" -ForegroundColor Cyan
    $hostname = $env:COMPUTERNAME
    Write-Host "  ssh $env:USERNAME@${hostname}.local" -ForegroundColor White
}

Write-Host ""
Write-Host "Próximos Passos:" -ForegroundColor Cyan
Write-Host "  1. No dispositivo remoto (MacBook), configure o SSH config:" -ForegroundColor White
Write-Host "     Host windows-remoto" -ForegroundColor Gray
Write-Host "         HostName $IP_ATUAL" -ForegroundColor Gray
Write-Host "         User $env:USERNAME" -ForegroundColor Gray
Write-Host "         Port 22" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Teste a conexão do dispositivo remoto:" -ForegroundColor White
Write-Host "     ssh $env:USERNAME@$IP_ATUAL" -ForegroundColor Gray
Write-Host ""

if (-not $ChavePublica) {
    Write-Host "⚠ Aviso: Nenhuma chave pública foi adicionada." -ForegroundColor Yellow
    Write-Host "  Para autenticação sem senha, adicione sua chave pública:" -ForegroundColor White
    Write-Host "  .\configurar-ssh-windows.ps1 -ChavePublica (Get-Content ~\.ssh\id_ed25519.pub -Raw)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
