# Como Conectar do MacBook ao Windows via SSH

Este guia explica como configurar SSH no Windows para permitir conexões remotas do MacBook.

## 🚀 Configuração Rápida

### ⚠️ IMPORTANTE: Onde Executar Cada Script

- **Scripts `.ps1` (PowerShell)**: Execute **NO WINDOWS** (PowerShell como Administrador)
- **Scripts `.sh` (Bash)**: Execute **NO MACBOOK** (Terminal/zsh)

### Passo 1: Preparar MacBook (Opcional, mas Recomendado)

**No MacBook, execute:**

```bash
# Preparar configuração SSH no MacBook
./scripts/preparar-ssh-macbook-para-windows.sh
```

Este script vai:

- ✅ Verificar/criar diretório `.ssh`
- ✅ Verificar/gerar chave SSH
- ✅ Exibir sua chave pública (para adicionar ao Windows depois)
- ✅ Configurar `~/.ssh/config` (se você fornecer IP e usuário)

**Ou configure manualmente** (veja Passo 2 abaixo).

### Passo 2: Configurar SSH no Windows

**⚠️ NO WINDOWS, execute como Administrador:**

```powershell
# Navegue até o diretório do projeto
cd C:\caminho\para\NossaMaternidade-1

# Execute o script de configuração completa
.\scripts\configurar-ssh-windows-completo.ps1
```

```powershell
# Navegue até o diretório do projeto
cd C:\caminho\para\NossaMaternidade-1

# Execute o script de configuração completa
.\scripts\configurar-ssh-windows-completo.ps1
```

O script vai:

1. ✅ Instalar OpenSSH Server (se necessário)
2. ✅ Iniciar e habilitar o serviço SSH
3. ✅ Configurar firewall
4. ✅ Criar diretório `.ssh` com permissões corretas
5. ✅ Adicionar sua chave SSH (se detectada)
6. ✅ Exibir o IP do Windows e informações de conexão

**⚠️ Importante:** Anote o IP exibido no resumo final!

### Passo 3: Configurar SSH no MacBook (se ainda não fez)

**No MacBook, edite o arquivo `~/.ssh/config`:**

```bash
# Abrir o arquivo de configuração
nano ~/.ssh/config
# ou
code ~/.ssh/config
```

**Adicione a seguinte configuração:**

```ssh-config
Host windows-remoto
    HostName IP_DO_WINDOWS_AQUI
    User SEU_USUARIO_WINDOWS
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

**Substitua:**

- `IP_DO_WINDOWS_AQUI` pelo IP exibido no script do Windows
- `SEU_USUARIO_WINDOWS` pelo seu nome de usuário do Windows

### Passo 4: Adicionar Chave SSH ao Windows (Opcional, mas Recomendado)

**Se você ainda não adicionou sua chave SSH ao Windows:**

1. **No MacBook, copie sua chave pública:**

   ```bash
   cat ~/.ssh/id_ed25519.pub
   # ou
   cat ~/.ssh/id_rsa.pub
   ```

2. **No Windows, execute:**

   ```powershell
   # Cole a chave pública entre as aspas
   .\scripts\configurar-ssh-windows.ps1 -ChavePublica "ssh-ed25519 AAAAC3..."
   ```

   **Ou manualmente:**

   ```powershell
   # Adicione a chave ao authorized_keys
   Add-Content -Path $env:USERPROFILE\.ssh\authorized_keys -Value "sua-chave-publica-aqui"
   ```

### Passo 5: Testar Conexão

**No MacBook, teste a conexão:**

```bash
# Teste básico
ssh windows-remoto

# Ou usando o IP diretamente
ssh usuario@IP_DO_WINDOWS

# Teste com verbose (para debug)
ssh -vvv windows-remoto
```

**Se funcionar, você verá o prompt do PowerShell do Windows!**

## 🔧 Configuração no Cursor (MacBook)

Após configurar o SSH, você pode usar o Cursor para conectar ao Windows:

1. **Abrir Command Palette:** `Cmd+Shift+P`
2. **Digite:** `Remote-SSH: Connect to Host`
3. **Selecione:** `windows-remoto` (deve aparecer na lista)
4. **Aguarde:** Cursor vai instalar o servidor remoto automaticamente

Se não aparecer o host:

1. **Command Palette:** `Cmd+Shift+P`
2. **Digite:** `Remote-SSH: Open SSH Configuration File`
3. **Verifique** se a configuração está correta
4. **Salve** e tente novamente

## 🐛 Troubleshooting

### Erro: "Connection refused" ou "Connection timed out"

**Possíveis causas:**

1. OpenSSH Server não está rodando no Windows
2. Firewall bloqueando a porta 22
3. IP do Windows mudou

**Soluções:**

```powershell
# No Windows, verificar se o serviço está rodando
Get-Service sshd

# Se não estiver, iniciar:
Start-Service sshd

# Verificar regra de firewall
Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP"

# Verificar IP atual
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" }
```

### Erro: "Permission denied (publickey)"

**Causa:** Chave SSH não foi adicionada ao Windows ou permissões incorretas.

**Solução:**

1. **No Windows, verificar se a chave está no authorized_keys:**

   ```powershell
   Get-Content $env:USERPROFILE\.ssh\authorized_keys
   ```

2. **Se não estiver, adicionar:**

   ```powershell
   # No MacBook, copie a chave pública
   cat ~/.ssh/id_ed25519.pub

   # No Windows, adicione
   Add-Content -Path $env:USERPROFILE\.ssh\authorized_keys -Value "chave-copiada"
   ```

3. **Verificar permissões:**
   ```powershell
   # O script já configura as permissões, mas você pode verificar:
   icacls $env:USERPROFILE\.ssh\authorized_keys
   ```

### Erro: "Could not resolve hostname"

**Causa:** IP do Windows mudou ou configuração incorreta.

**Solução:**

1. **No Windows, verificar IP atual:**

   ```powershell
   Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" }
   ```

2. **Atualizar `~/.ssh/config` no MacBook com o novo IP**

### IP do Windows Muda Frequentemente

**Solução:** Configure um IP estático no Windows ou use o hostname:

```ssh-config
Host windows-remoto
    HostName NOME_DO_COMPUTADOR.local
    # ou
    HostName NOME_DO_COMPUTADOR.home
    User SEU_USUARIO_WINDOWS
    Port 22
```

**Para descobrir o nome do computador:**

```powershell
# No Windows
$env:COMPUTERNAME
```

## 📋 Checklist Rápido

- [ ] OpenSSH Server instalado no Windows
- [ ] Serviço SSH rodando (`Get-Service sshd`)
- [ ] Firewall configurado (regra "OpenSSH-Server-In-TCP")
- [ ] Diretório `.ssh` criado no Windows
- [ ] Chave pública adicionada ao `authorized_keys`
- [ ] IP do Windows anotado
- [ ] Configuração SSH no MacBook (`~/.ssh/config`)
- [ ] Teste de conexão funcionando (`ssh windows-remoto`)

## 🔐 Segurança

**Recomendações:**

1. **Use chaves SSH** em vez de senhas
2. **Desabilite autenticação por senha** no OpenSSH (opcional):

   ```powershell
   # Editar: C:\ProgramData\ssh\sshd_config
   # Alterar: PasswordAuthentication no
   # Reiniciar serviço: Restart-Service sshd
   ```

3. **Use apenas em redes confiáveis** ou configure VPN
4. **Mantenha o Windows atualizado**

## 📚 Documentação Relacionada

- [Scripts SSH](../scripts/README_SSH.md) - Documentação completa dos scripts
- [Troubleshooting SSH Remoto](./TROUBLESHOOTING_SSH_REMOTO.md) - Guia de troubleshooting geral
- [Setup Windows](./SETUP_WINDOWS.md) - Configuração inicial do Windows

## 💡 Dicas

- **IP Dinâmico:** Se o IP do Windows muda frequentemente, considere configurar um IP estático no roteador ou usar o hostname do computador
- **Wake on LAN:** Se o Windows estiver em sleep, você pode acordá-lo via Wake on LAN (se configurado)
- **Porta Alternativa:** Se a porta 22 estiver bloqueada, você pode configurar SSH em outra porta (ex: 2222) no `sshd_config`
