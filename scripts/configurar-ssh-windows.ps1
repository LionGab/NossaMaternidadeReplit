# Script para configurar SSH no Windows - Adicionar chave pública do MacBook
# Windows PowerShell
# Uso: .\scripts\configurar-ssh-windows.ps1 -ChavePublica "ssh-ed25519 AAAAC3..."

param(
    [Parameter(Mandatory = $false)]
    [string]$ChavePublica
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Configuração SSH - Adicionar Chave MacBook" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está executando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  ATENÇÃO: Algumas operações requerem privilégios de Administrador" -ForegroundColor Yellow
    Write-Host "   Execute como Administrador para configuração completa" -ForegroundColor Yellow
    Write-Host ""
}

# [PASSO] 1/3 - Configurar diretório .ssh
Write-Host "[PASSO] 1/3 - Configurando diretório .ssh..." -ForegroundColor Yellow

$sshDir = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
    Write-Host "   [✓] Diretório .ssh criado" -ForegroundColor Green
}
else {
    Write-Host "   [✓] Diretório .ssh já existe" -ForegroundColor Green
}

$authorizedKeysPath = "$sshDir\authorized_keys"
if (-not (Test-Path $authorizedKeysPath)) {
    New-Item -ItemType File -Path $authorizedKeysPath -Force | Out-Null
    Write-Host "   [✓] Arquivo authorized_keys criado" -ForegroundColor Green
}
else {
    Write-Host "   [✓] Arquivo authorized_keys já existe" -ForegroundColor Green
}

# [PASSO] 2/3 - Obter chave pública
Write-Host ""
Write-Host "[PASSO] 2/3 - Obter chave pública do MacBook..." -ForegroundColor Yellow

if ([string]::IsNullOrWhiteSpace($ChavePublica)) {
    Write-Host ""
    Write-Host "Cole a chave pública do MacBook (começa com ssh-ed25519...)" -ForegroundColor Cyan
    Write-Host "Ou pressione Enter para pular" -ForegroundColor Gray
    $ChavePublica = Read-Host "Chave pública"
}

if ([string]::IsNullOrWhiteSpace($ChavePublica)) {
    Write-Host ""
    Write-Host "⏭️  Pulando adição de chave." -ForegroundColor Yellow
    Write-Host "   Você pode adicionar depois manualmente editando:" -ForegroundColor Gray
    Write-Host "   $authorizedKeysPath" -ForegroundColor Gray
    exit 0
}

# Validar formato da chave
$ChavePublica = $ChavePublica.Trim()
if (-not ($ChavePublica -match "^(ssh-ed25519|ssh-rsa|ecdsa-)") {
        Write-Host ""
        Write-Host "❌ ERRO: Formato de chave inválido!" -ForegroundColor Red
        Write-Host "   A chave deve começar com: ssh-ed25519, ssh-rsa ou ecdsa-" -ForegroundColor Red
        Write-Host "   Chave recebida: $($ChavePublica.Substring(0, [Math]::Min(30, $ChavePublica.Length)))..." -ForegroundColor Gray
        exit 1
    }

    # [PASSO] 3/3 - Adicionar chave ao authorized_keys
    Write-Host ""
    Write-Host "[PASSO] 3/3 - Adicionar chave ao authorized_keys..." -ForegroundColor Yellow

    # Verificar se a chave já existe
    $existingKeys = Get-Content $authorizedKeysPath -ErrorAction SilentlyContinue
    $keyExists = $false
    if ($existingKeys) {
        foreach ($key in $existingKeys) {
            if ($key.Trim() -eq $ChavePublica) {
                $keyExists = $true
                break
            }
        }
    }

    if ($keyExists) {
        Write-Host "   [INFO] Chave já existe no authorized_keys" -ForegroundColor Yellow
    }
    else {
        Add-Content -Path $authorizedKeysPath -Value $ChavePublica -Encoding UTF8
        Write-Host "   [✓] Chave pública adicionada com sucesso" -ForegroundColor Green

        # Contar chaves
        $totalKeys = (Get-Content $authorizedKeysPath -ErrorAction SilentlyContinue | Where-Object { $_.Trim() -ne "" }).Count
        Write-Host "   [INFO] Total de chaves no authorized_keys: $totalKeys" -ForegroundColor Gray
    }

    # Ajustar permissões (importante no Windows)
    Write-Host ""
    Write-Host "[INFO] Ajustando permissões do authorized_keys..." -ForegroundColor Yellow

    try {
        # Remover herança de permissões
        $acl = Get-Acl $authorizedKeysPath
        $acl.SetAccessRuleProtection($true, $false)

        # Adicionar permissão apenas para o usuário atual
        $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
        $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($currentUser, "FullControl", "Allow")
        $acl.SetAccessRule($accessRule)
        Set-Acl -Path $authorizedKeysPath -AclObject $acl

        Write-Host "   [✓] Permissões configuradas" -ForegroundColor Green
    }
    catch {
        Write-Host "   [⚠]  Aviso: Não foi possível ajustar permissões automaticamente" -ForegroundColor Yellow
        Write-Host "   [INFO] Configure manualmente: Permissão apenas para $currentUser" -ForegroundColor Gray
    }

    # Resumo
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "RESUMO" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[✓] Diretório .ssh configurado: $sshDir" -ForegroundColor Green
    Write-Host "[✓] Arquivo authorized_keys: $authorizedKeysPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "[INFO] PRÓXIMO PASSO: Configure o servidor SSH no Windows" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "No Windows, execute (como Administrador):" -ForegroundColor Cyan
    Write-Host "  .\scripts\configurar-ssh-windows-completo.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Depois, teste a conexão do MacBook:" -ForegroundColor Cyan
    Write-Host "  ssh windows-remoto" -ForegroundColor White
    Write-Host ""
