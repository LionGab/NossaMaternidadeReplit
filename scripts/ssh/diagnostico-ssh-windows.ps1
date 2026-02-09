# Script de Diagnóstico SSH para Windows
# Testa conectividade com host remoto Mac

param(
    [string]$HostName = "mac-remoto",
    [string]$HostIP = "192.168.2.7",
    [int]$Port = 22,
    [string]$User = ""
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Diagnóstico de Conexão SSH - Windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$erros = @()
$sucessos = @()

# 1. Testar Ping
Write-Host "[1/8] Testando conectividade básica (Ping)..." -ForegroundColor Yellow
try {
    $ping = Test-Connection -ComputerName $HostIP -Count 2 -Quiet
    if ($ping) {
        Write-Host "✓ Ping OK - Mac está acessível na rede" -ForegroundColor Green
        $sucessos += "Ping OK"
    } else {
        Write-Host "✗ Ping FALHOU - Mac não responde" -ForegroundColor Red
        $erros += "Ping falhou - Mac pode estar desligado, em sleep, ou em outra rede"
    }
} catch {
    Write-Host "✗ Erro ao testar ping: $_" -ForegroundColor Red
    $erros += "Erro no ping: $_"
}
Write-Host ""

# 2. Testar Porta SSH
Write-Host "[2/8] Testando porta SSH (22)..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($HostIP, $Port, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(3000, $false)

    if ($wait) {
        $tcpClient.EndConnect($connection)
        $tcpClient.Close()
        Write-Host "✓ Porta 22 ABERTA - SSH está escutando" -ForegroundColor Green
        $sucessos += "Porta 22 aberta"
    } else {
        $tcpClient.Close()
        Write-Host "✗ Porta 22 FECHADA ou TIMEOUT - SSH não está acessível" -ForegroundColor Red
        $erros += "Porta 22 não acessível - SSH pode estar desabilitado ou bloqueado por firewall"
    }
} catch {
    Write-Host "✗ Erro ao testar porta: $_" -ForegroundColor Red
    $erros += "Erro ao testar porta: $_"
}
Write-Host ""

# 3. Verificar Configuração SSH
Write-Host "[3/8] Verificando configuração SSH local..." -ForegroundColor Yellow
$sshConfigPath = "$env:USERPROFILE\.ssh\config"
if (Test-Path $sshConfigPath) {
    $configContent = Get-Content $sshConfigPath -Raw
    if ($configContent -match $HostName) {
        Write-Host "✓ Configuração SSH encontrada para '$HostName'" -ForegroundColor Green
        Write-Host "  Conteúdo relevante:" -ForegroundColor Gray
        $lines = Get-Content $sshConfigPath
        $inHostBlock = $false
        foreach ($line in $lines) {
            if ($line -match "^\s*Host\s+$HostName") {
                $inHostBlock = $true
            }
            if ($inHostBlock) {
                Write-Host "  $line" -ForegroundColor Gray
                if ($line -match "^\s*Host\s+") {
                    if ($line -notmatch $HostName) {
                        $inHostBlock = $false
                    }
                }
            }
        }
        $sucessos += "Config SSH existe"
    } else {
        Write-Host "⚠ Configuração SSH não encontrada para '$HostName'" -ForegroundColor Yellow
        $erros += "Config SSH não encontrada - você precisa configurar o host no ~/.ssh/config"
    }
} else {
    Write-Host "⚠ Arquivo ~/.ssh/config não existe" -ForegroundColor Yellow
    $erros += "Arquivo SSH config não existe"
}
Write-Host ""

# 4. Verificar Chaves SSH
Write-Host "[4/8] Verificando chaves SSH..." -ForegroundColor Yellow
$sshDir = "$env:USERPROFILE\.ssh"
if (Test-Path $sshDir) {
    $keys = Get-ChildItem $sshDir -Filter "id_*" -File | Where-Object { $_.Name -notmatch "\.pub$" }
    if ($keys.Count -gt 0) {
        Write-Host "✓ Chaves SSH encontradas:" -ForegroundColor Green
        foreach ($key in $keys) {
            Write-Host "  - $($key.Name)" -ForegroundColor Gray
        }
        $sucessos += "Chaves SSH encontradas"
    } else {
        Write-Host "⚠ Nenhuma chave SSH privada encontrada" -ForegroundColor Yellow
        $erros += "Nenhuma chave SSH privada encontrada"
    }
} else {
    Write-Host "⚠ Diretório ~/.ssh não existe" -ForegroundColor Yellow
    $erros += "Diretório .ssh não existe"
}
Write-Host ""

# 5. Testar Resolução de Nome
Write-Host "[5/8] Testando resolução de nome de host..." -ForegroundColor Yellow
try {
    if ($HostName -ne $HostIP) {
        $resolved = [System.Net.Dns]::GetHostAddresses($HostName)
        if ($resolved) {
            Write-Host "✓ Hostname '$HostName' resolve para:" -ForegroundColor Green
            foreach ($ip in $resolved) {
                Write-Host "  - $($ip.IPAddressToString)" -ForegroundColor Gray
            }
            $sucessos += "Resolução de nome OK"
        }
    } else {
        Write-Host "⏭ Pulado (usando IP diretamente)" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠ Não foi possível resolver o hostname: $_" -ForegroundColor Yellow
}
Write-Host ""

# 6. Testar SSH Manualmente (se usuário fornecido)
if ($User) {
    Write-Host "[6/8] Testando conexão SSH manual..." -ForegroundColor Yellow
    Write-Host "  Tentando conectar como $User@$HostIP..." -ForegroundColor Gray
    Write-Host "  (Isso pode levar alguns segundos e solicitar senha/chave)" -ForegroundColor Gray

    $sshCommand = "ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $User@$HostIP 'echo SSH_OK' 2>&1"

    try {
        $result = & cmd /c $sshCommand 2>&1
        if ($result -match "SSH_OK") {
            Write-Host "✓ Conexão SSH MANUAL funcionou!" -ForegroundColor Green
            $sucessos += "SSH manual OK"
        } elseif ($result -match "Permission denied") {
            Write-Host "⚠ Autenticação falhou (senha/chave incorreta)" -ForegroundColor Yellow
            $erros += "Autenticação SSH falhou - verifique usuário e chaves"
        } elseif ($result -match "Connection refused" -or $result -match "Connection timed out") {
            Write-Host "✗ Conexão SSH FALHOU: $result" -ForegroundColor Red
            $erros += "SSH manual falhou: $result"
        } else {
            Write-Host "⚠ Resposta inesperada: $result" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Erro ao executar SSH: $_" -ForegroundColor Red
        $erros += "Erro SSH: $_"
    }
} else {
    Write-Host "[6/8] Pulando teste SSH manual (usuário não fornecido)" -ForegroundColor Gray
    Write-Host "  Execute manualmente: ssh usuario@$HostIP" -ForegroundColor Gray
}
Write-Host ""

# 7. Verificar Extensão Remote-SSH no Cursor
Write-Host "[7/8] Verificando extensão Remote-SSH..." -ForegroundColor Yellow
$cursorExtensionsPath = "$env:USERPROFILE\.cursor\extensions"
if (Test-Path $cursorExtensionsPath) {
    $remoteSshExt = Get-ChildItem $cursorExtensionsPath -Recurse -Filter "*remote-ssh*" -Directory -ErrorAction SilentlyContinue
    if ($remoteSshExt) {
        Write-Host "✓ Extensão Remote-SSH encontrada:" -ForegroundColor Green
        foreach ($ext in $remoteSshExt) {
            Write-Host "  - $($ext.Name)" -ForegroundColor Gray
        }
        $sucessos += "Extensão Remote-SSH instalada"
    } else {
        Write-Host "⚠ Extensão Remote-SSH não encontrada" -ForegroundColor Yellow
        $erros += "Extensão Remote-SSH não encontrada - instale via Cursor Extensions"
    }
} else {
    Write-Host "⚠ Diretório de extensões do Cursor não encontrado" -ForegroundColor Yellow
}
Write-Host ""

# 8. Resumo e Recomendações
Write-Host "[8/8] Resumo do diagnóstico..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "RESUMO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($sucessos.Count -gt 0) {
    Write-Host "✓ Testes que passaram ($($sucessos.Count)):" -ForegroundColor Green
    foreach ($sucesso in $sucessos) {
        Write-Host "  - $sucesso" -ForegroundColor Green
    }
    Write-Host ""
}

if ($erros.Count -gt 0) {
    Write-Host "✗ Problemas encontrados ($($erros.Count)):" -ForegroundColor Red
    foreach ($erro in $erros) {
        Write-Host "  - $erro" -ForegroundColor Red
    }
    Write-Host ""

    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "RECOMENDAÇÕES" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""

    if ($erros -match "Ping falhou") {
        Write-Host "1. MAC NÃO RESPONDE:" -ForegroundColor Yellow
        Write-Host "   - Verifique se o Mac está ligado e acordado" -ForegroundColor White
        Write-Host "   - Confirme que está na mesma rede Wi-Fi" -ForegroundColor White
        Write-Host "   - Verifique o IP atual do Mac: ifconfig | grep inet" -ForegroundColor White
        Write-Host ""
    }

    if ($erros -match "Porta 22") {
        Write-Host "2. SSH DESABILITADO OU BLOQUEADO:" -ForegroundColor Yellow
        Write-Host "   No Mac, execute:" -ForegroundColor White
        Write-Host "   sudo systemsetup -setremotelogin on" -ForegroundColor Cyan
        Write-Host "   Ou: System Preferences > Sharing > Remote Login" -ForegroundColor White
        Write-Host ""
    }

    if ($erros -match "Config SSH") {
        Write-Host "3. CONFIGURAR SSH:" -ForegroundColor Yellow
        Write-Host "   Crie/edite: $env:USERPROFILE\.ssh\config" -ForegroundColor White
        Write-Host "   Adicione:" -ForegroundColor White
        Write-Host "   Host $HostName" -ForegroundColor Cyan
        Write-Host "       HostName $HostIP" -ForegroundColor Cyan
        Write-Host "       User seu-usuario-mac" -ForegroundColor Cyan
        Write-Host "       Port 22" -ForegroundColor Cyan
        Write-Host ""
    }

    Write-Host "4. TESTE MANUAL:" -ForegroundColor Yellow
    Write-Host "   ssh -v usuario@$HostIP" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "5. DOCUMENTAÇÃO:" -ForegroundColor Yellow
    Write-Host "   Veja: docs/TROUBLESHOOTING_SSH_REMOTO.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✓ Todos os testes passaram!" -ForegroundColor Green
    Write-Host "  Se ainda houver problemas, verifique:" -ForegroundColor White
    Write-Host "  - Logs do Cursor (Help > Toggle Developer Tools)" -ForegroundColor White
    Write-Host "  - Configuração no arquivo ~/.ssh/config" -ForegroundColor White
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
