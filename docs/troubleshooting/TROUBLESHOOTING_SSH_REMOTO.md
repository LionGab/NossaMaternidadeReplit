# Troubleshooting: Conexão SSH Remota - Cursor

## Problema

Erro ao conectar via SSH ao host remoto "mac-remoto" (IP: 192.168.2.7, porta 22):

```
ssh: connect to host 192.168.2.7 port 22: Connection timed out
Error: Failed to connect to the remote SSH host.
Error installing server: [Error: Failed to connect to the remote SSH host. Please check the logs for more details.]
```

### Contexto dos Logs

Os logs do Cursor mostram que:

- ✅ Cursor identificou corretamente o host "mac-remoto" como macOS
- ✅ Extensão Remote-SSH está funcionando
- ✅ Script de instalação do servidor remoto está sendo gerado
- ❌ **Timeout ao tentar conectar na porta 22**

**Isso indica que o problema está na conectividade de rede/firewall, não na configuração do Cursor.**

## 🚀 Solução Rápida: Script de Configuração Automática (MacBook)

**⚠️ RECOMENDADO PRIMEIRO:** Se você tem acesso físico ao MacBook remoto, execute o script de configuração automática:

### No MacBook Remoto

```bash
# Opção 1: Configuração completa com detecção automática de chave
cd /caminho/para/NossaMaternidade-1
./scripts/configurar-ssh-macbook-completo.sh

# Opção 2: Configuração básica (apenas habilita SSH)
./scripts/configurar-ssh-macbook.sh

# Opção 3: Configuração com chave pública específica
./scripts/configurar-ssh-macbook.sh --chave-publica "$(cat ~/.ssh/id_ed25519.pub)"
```

O script automatiza:

1. ✅ Verificação do IP atual
2. ✅ Habilitação do SSH (Remote Login)
3. ✅ Configuração do firewall
4. ✅ Criação/configuração do diretório `.ssh`
5. ✅ Adição de chave pública (se fornecida)
6. ✅ Teste de conexão SSH local

**Após executar o script no MacBook, volte ao Windows e teste a conexão novamente.**

## Diagnóstico Rápido (Script Automático - Windows)

**⚠️ RECOMENDADO:** Use o script de diagnóstico automático primeiro:

```powershell
# No PowerShell (no diretório do projeto)
cd C:\Users\SeuUsuario\Documents\NossaMaternidade
.\scripts\diagnostico-ssh-windows.ps1 -HostName "mac-remoto" -HostIP "192.168.2.7" -Port 22 -User "seu-usuario-mac"
```

O script vai testar automaticamente:

1. ✅ Conectividade básica (ping)
2. ✅ Porta SSH (22)
3. ✅ Configuração SSH local
4. ✅ Chaves SSH
5. ✅ Resolução de nome
6. ✅ Conexão SSH manual
7. ✅ Extensão Remote-SSH
8. ✅ Gerar relatório com recomendações

## Diagnóstico Passo a Passo (Manual)

### 1. Verificar Conectividade de Rede

No Windows (host local), teste se o Mac está acessível:

```powershell
# Testar ping
ping 192.168.2.7

# Testar porta SSH (PowerShell)
Test-NetConnection -ComputerName 192.168.2.7 -Port 22

# Teste mais detalhado
$tcpClient = New-Object System.Net.Sockets.TcpClient
$tcpClient.Connect("192.168.2.7", 22)
if ($tcpClient.Connected) {
    Write-Host "Porta 22 está aberta!"
    $tcpClient.Close()
} else {
    Write-Host "Porta 22 está fechada ou bloqueada"
}
```

**Se o ping falhar:**

- Mac pode estar desligado ou em sleep
- Mac pode estar em outra rede
- Problema de roteamento de rede

### 2. Verificar Status do SSH no Mac Remoto

No Mac remoto, verifique se o SSH está habilitado:

```bash
# Verificar se o serviço SSH está rodando
sudo systemsetup -getremotelogin

# Se estiver desabilitado, habilitar:
sudo systemsetup -setremotelogin on

# Ou via System Preferences:
# System Preferences > Sharing > Remote Login (ativar)
```

### 3. Verificar Firewall no Mac

O firewall do macOS pode estar bloqueando conexões SSH:

```bash
# Verificar status do firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Se necessário, permitir SSH explicitamente:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/sbin/sshd
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/sbin/sshd
```

**Ou via interface gráfica:**

- System Preferences > Security & Privacy > Firewall
- Clique em "Firewall Options"
- Certifique-se de que "Block all incoming connections" está desmarcado
- Verifique se o SSH está permitido na lista

### 4. Verificar Configuração SSH no Windows

No Windows, verifique sua configuração SSH em `~/.ssh/config` ou `C:\Users\SeuUsuario\.ssh\config`:

```ssh-config
Host mac-remoto
    HostName 192.168.2.7
    User seu-usuario
    Port 22
    IdentityFile ~/.ssh/id_rsa
    # Se necessário, adicionar:
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

### 5. Testar Conexão SSH Manualmente

No terminal do Windows (Git Bash, PowerShell, ou CMD), teste a conexão SSH:

```bash
# Teste básico
ssh usuario@192.168.2.7

# Teste com verbose (para debug)
ssh -v usuario@192.168.2.7

# Teste com verbose máximo
ssh -vvv usuario@192.168.2.7
```

**Se funcionar manualmente mas não no Cursor:**

- Problema pode estar na configuração do Remote-SSH no Cursor
- Verifique logs do Cursor: `Help > Toggle Developer Tools > Console`

### 6. Verificar IP do Mac (Pode Ter Mudado)

O IP 192.168.2.7 pode não ser mais o IP atual do Mac. No Mac, verifique:

```bash
# Ver IP atual
ifconfig | grep "inet " | grep -v 127.0.0.1

# Ou mais específico
ipconfig getifaddr en0  # Wi-Fi
ipconfig getifaddr en1  # Ethernet
```

**Se o IP mudou:**

- Atualize a configuração SSH no Cursor
- Ou configure um hostname estático via DHCP no roteador
- Ou use mDNS/Bonjour: `ssh usuario@nome-do-mac.local`

### 7. Verificar Roteador/Firewall de Rede

Se o ping funciona mas o SSH não:

- Verifique se o roteador não está bloqueando a porta 22
- Alguns roteadores têm "Client Isolation" que bloqueia comunicação entre dispositivos
- Verifique regras de firewall no roteador

### 8. Usar Hostname em vez de IP

Se o IP muda frequentemente, use o hostname do Mac:

```ssh-config
Host mac-remoto
    HostName nome-do-mac.local  # mDNS/Bonjour
    # ou
    HostName nome-do-mac.home   # se configurado no roteador
    User seu-usuario
    Port 22
```

## Soluções Temporárias

### Solução 1: Usar VPN ou Tailscale

Se os dispositivos estão em redes diferentes:

1. Instale Tailscale em ambos os dispositivos
2. Use o IP do Tailscale na configuração SSH

### Solução 2: Usar Port Forwarding via SSH

Se houver um intermediário acessível:

```bash
ssh -L 2222:192.168.2.7:22 usuario@intermediario
```

Depois configure o Cursor para usar `localhost:2222`

### Solução 3: Wake on LAN (Se Mac estiver em sleep)

Se o Mac está em sleep, você pode acordá-lo:

```bash
# No Windows, instale wakeonlan ou use um script
wakeonlan MAC_ADDRESS_DO_MAC
```

## Configuração no Cursor

### Localizar Arquivo de Configuração SSH

No Windows:

```
C:\Users\SeuUsuario\.ssh\config
```

### Exemplo de Configuração Completa

```ssh-config
Host mac-remoto
    HostName 192.168.2.7
    User seu-usuario-mac
    Port 22
    IdentityFile C:\Users\SeuUsuario\.ssh\id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

**⚠️ Atenção:** `StrictHostKeyChecking no` reduz segurança. Use apenas em redes confiáveis.

### Configuração no Cursor Settings

1. Abra Command Palette: `Ctrl+Shift+P`
2. Digite: `Remote-SSH: Open SSH Configuration File`
3. Adicione a configuração do host

## Verificar Logs do Cursor

Para logs mais detalhados:

1. Abra Developer Tools: `Help > Toggle Developer Tools`
2. Vá para a aba "Console"
3. Filtre por "ssh" ou "remote"
4. Procure por mensagens de erro específicas

## Checklist Rápido

- [ ] Mac está ligado e acordado?
- [ ] Mac está na mesma rede que o Windows?
- [ ] SSH está habilitado no Mac? (`sudo systemsetup -getremotelogin`)
- [ ] Firewall do Mac permite SSH?
- [ ] IP do Mac é realmente 192.168.2.7? (verificar com `ifconfig`)
- [ ] Porta 22 está aberta? (`Test-NetConnection -ComputerName 192.168.2.7 -Port 22`)
- [ ] Consegue conectar manualmente via SSH? (`ssh usuario@192.168.2.7`)
- [ ] Configuração SSH no Windows está correta? (`~/.ssh/config`)

## Próximos Passos

Se nenhuma solução funcionar:

1. **Verificar logs do SSH no Mac:**

   ```bash
   sudo tail -f /var/log/system.log | grep sshd
   ```

2. **Testar conexão reversa:**
   - Do Mac, conectar ao Windows para verificar se o problema é bidirecional

3. **Usar alternativa:**
   - VNC/RDP para acesso remoto
   - Git sync para sincronizar código
   - Usar Cursor diretamente no Mac se possível

## Solução Rápida: Configuração Completa Passo a Passo

### No Mac Remoto (192.168.2.7)

**🎯 RECOMENDADO: Use o script automático (mais fácil):**

```bash
# No diretório do projeto
cd /caminho/para/NossaMaternidade-1
./scripts/configurar-ssh-macbook-completo.sh
```

**Ou manualmente (passo a passo):**

```bash
# 1. Habilitar SSH
sudo systemsetup -setremotelogin on

# 2. Verificar status
sudo systemsetup -getremotelogin
# Deve retornar: "Remote Login: On"

# 3. Verificar IP atual
ifconfig | grep "inet " | grep -v 127.0.0.1
# Anote o IP (pode não ser mais 192.168.2.7)

# 4. Verificar firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
# Se estiver "ON", permitir SSH:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/sbin/sshd
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/sbin/sshd

# 5. Testar SSH localmente (no próprio Mac)
ssh localhost
# Deve conectar sem problemas
```

### No Windows (Host Local)

```powershell
# 1. Verificar se OpenSSH está instalado
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'

# Se não estiver instalado, instalar:
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# 2. Criar diretório .ssh (se não existir)
if (!(Test-Path "$env:USERPROFILE\.ssh")) {
    New-Item -ItemType Directory -Path "$env:USERPROFILE\.ssh"
}

# 3. Criar/editar arquivo de configuração SSH
$sshConfigPath = "$env:USERPROFILE\.ssh\config"
if (!(Test-Path $sshConfigPath)) {
    New-Item -ItemType File -Path $sshConfigPath
}

# 4. Adicionar configuração do host mac-remoto
@"
Host mac-remoto
    HostName 192.168.2.7
    User SEU_USUARIO_MAC
    Port 22
    IdentityFile $env:USERPROFILE\.ssh\id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ConnectTimeout 10
"@ | Add-Content $sshConfigPath

# 5. Gerar chave SSH (se ainda não tiver)
if (!(Test-Path "$env:USERPROFILE\.ssh\id_rsa")) {
    ssh-keygen -t rsa -b 4096 -C "seu-email@exemplo.com"
    # Pressione Enter para aceitar o caminho padrão
    # Digite uma senha ou deixe em branco
}

# 6. Copiar chave pública para o Mac
type "$env:USERPROFILE\.ssh\id_rsa.pub" | ssh SEU_USUARIO_MAC@192.168.2.7 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# OU manualmente:
# - Copie o conteúdo de C:\Users\SeuUsuario\.ssh\id_rsa.pub
# - No Mac, execute: echo "conteudo-da-chave" >> ~/.ssh/authorized_keys
# - No Mac, execute: chmod 600 ~/.ssh/authorized_keys

# 7. Testar conexão SSH
ssh -v SEU_USUARIO_MAC@192.168.2.7
# Deve conectar sem pedir senha (se a chave foi copiada corretamente)

# 8. Testar conexão usando o alias
ssh mac-remoto
```

### No Cursor (Windows)

1. **Abrir Command Palette:** `Ctrl+Shift+P`
2. **Digite:** `Remote-SSH: Connect to Host`
3. **Selecione:** `mac-remoto` (deve aparecer na lista)
4. **Aguarde:** Cursor vai instalar o servidor remoto automaticamente

Se não aparecer o host:

1. **Command Palette:** `Ctrl+Shift+P`
2. **Digite:** `Remote-SSH: Open SSH Configuration File`
3. **Verifique** se a configuração está correta
4. **Salve** e tente novamente

## Troubleshooting Específico do Erro "Connection timed out"

### Cenário 1: Ping funciona, mas SSH não

**Causa:** Firewall bloqueando porta 22 ou SSH desabilitado

**Solução:**

- No Mac: Verificar firewall e habilitar SSH (ver comandos acima)
- Verificar se roteador tem "Client Isolation" ativado

### Cenário 2: Ping não funciona

**Causa:** Mac está desligado, em sleep, ou em outra rede

**Solução:**

- Acordar o Mac (Wake on LAN ou fisicamente)
- Verificar se ambos estão na mesma rede Wi-Fi
- Verificar IP atual do Mac (pode ter mudado)

### Cenário 3: SSH funciona manualmente, mas não no Cursor

**Causa:** Problema de configuração no Cursor ou timeout muito curto

**Solução:**

- Adicionar `ConnectTimeout 30` no `~/.ssh/config`
- Verificar logs do Cursor: `Help > Toggle Developer Tools > Console`
- Tentar reconectar: `Remote-SSH: Kill VS Code Server on Host`

## Referências

- [Cursor Remote-SSH Documentation](https://code.visualstudio.com/docs/remote/ssh)
- [OpenSSH Manual](https://www.openssh.com/manual.html)
- [macOS Remote Login Setup](https://support.apple.com/en-us/102713)
- [Windows OpenSSH Setup](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse)
