# Scripts de Configuração e Diagnóstico SSH

Este diretório contém scripts para facilitar a configuração e diagnóstico de conexões SSH remotas.

## 📋 Scripts Disponíveis

### 1. `configurar-ssh-macbook.sh` - Configuração SSH no MacBook

Script principal para configurar SSH no MacBook remoto. Automatiza todas as etapas necessárias.

**Uso:**

```bash
# Configuração básica (apenas habilita SSH)
./scripts/configurar-ssh-macbook.sh

# Com chave pública
./scripts/configurar-ssh-macbook.sh --chave-publica "$(cat ~/.ssh/id_ed25519.pub)"

# Ver ajuda
./scripts/configurar-ssh-macbook.sh --help
```

**O que faz:**

- ✅ Verifica e exibe o IP atual do MacBook
- ✅ Habilita SSH (Remote Login)
- ✅ Configura firewall para permitir SSH
- ✅ Cria/configura diretório `.ssh` com permissões corretas
- ✅ Adiciona chave pública ao `authorized_keys` (se fornecida)
- ✅ Testa conexão SSH localmente
- ✅ Exibe resumo com informações para conexão remota

**Requisitos:**

- macOS
- Permissões sudo (para habilitar SSH e configurar firewall)

---

### 2. `configurar-ssh-macbook-completo.sh` - Configuração Completa Automática

Script auxiliar que detecta automaticamente a chave SSH mais recente e executa a configuração completa.

---

### 2.1. `preparar-ssh-macbook-para-windows.sh` - Preparar MacBook para Conectar ao Windows

Script para preparar o MacBook (lado cliente) para conectar ao Windows via SSH.

**Uso:**

```bash
# Preparação interativa
./scripts/preparar-ssh-macbook-para-windows.sh

# Com IP e usuário do Windows
./scripts/preparar-ssh-macbook-para-windows.sh "192.168.2.X" "usuario-windows"
```

**O que faz:**

- ✅ Verifica/cria diretório `.ssh`
- ✅ Verifica/gera chave SSH
- ✅ Exibe chave pública (para adicionar ao Windows)
- ✅ Configura `~/.ssh/config` com host windows-remoto

**Requisitos:**

- macOS
- Terminal/zsh

---

**Uso:**

```bash
./scripts/configurar-ssh-macbook-completo.sh
```

**O que faz:**

- Detecta automaticamente chaves SSH disponíveis (`id_ed25519.pub`, `id_rsa.pub`, etc.)
- Executa `configurar-ssh-macbook.sh` com a chave encontrada
- Se não encontrar chave, executa configuração básica

**Requisitos:**

- macOS
- Pelo menos uma chave SSH pública em `~/.ssh/`

---

### 3. `configurar-ssh-windows.ps1` - Configuração SSH no Windows

Script principal para configurar o servidor SSH no Windows. Permite conexões remotas do MacBook ao Windows.

**Uso:**

```powershell
# Executar como Administrador
# Configuração básica (apenas habilita SSH)
.\scripts\configurar-ssh-windows.ps1

# Com chave pública
.\scripts\configurar-ssh-windows.ps1 -ChavePublica (Get-Content ~\.ssh\id_ed25519.pub -Raw)

# Ver ajuda
.\scripts\configurar-ssh-windows.ps1 -Help
```

**O que faz:**

- ✅ Verifica e exibe o IP atual do Windows
- ✅ Instala OpenSSH Server (se não estiver instalado)
- ✅ Inicia e habilita o serviço SSH
- ✅ Configura firewall para permitir SSH
- ✅ Cria/configura diretório `.ssh` com permissões corretas
- ✅ Adiciona chave pública ao `authorized_keys` (se fornecida)
- ✅ Configura OpenSSH para usar authorized_keys
- ✅ Exibe resumo com informações para conexão remota

**Requisitos:**

- Windows 10/11
- PowerShell executado como Administrador
- Acesso à internet (para instalar OpenSSH Server)

---

### 4. `configurar-ssh-windows-completo.ps1` - Configuração Completa Automática (Windows)

Script auxiliar que detecta automaticamente a chave SSH mais recente e executa a configuração completa no Windows.

**Uso:**

```powershell
# Executar como Administrador
.\scripts\configurar-ssh-windows-completo.ps1
```

**O que faz:**

- Detecta automaticamente chaves SSH disponíveis (`id_ed25519.pub`, `id_rsa.pub`, etc.)
- Executa `configurar-ssh-windows.ps1` com a chave encontrada
- Se não encontrar chave, executa configuração básica

**Requisitos:**

- Windows 10/11
- PowerShell executado como Administrador
- Pelo menos uma chave SSH pública em `~\.ssh\`

---

### 5. `diagnostico-ssh-windows.ps1` - Diagnóstico SSH no Windows

Script PowerShell para diagnosticar problemas de conexão SSH do Windows para o MacBook.

**Uso:**

```powershell
# Diagnóstico completo
.\scripts\diagnostico-ssh-windows.ps1 -HostName "mac-remoto" -HostIP "192.168.2.7" -Port 22 -User "usuario-mac"

# Apenas com IP
.\scripts\diagnostico-ssh-windows.ps1 -HostIP "192.168.2.7"
```

**O que faz:**

- ✅ Testa conectividade básica (ping)
- ✅ Testa porta SSH (22)
- ✅ Verifica configuração SSH local (`~/.ssh/config`)
- ✅ Verifica chaves SSH disponíveis
- ✅ Testa resolução de nome de host
- ✅ Testa conexão SSH manual (se usuário fornecido)
- ✅ Verifica extensão Remote-SSH no Cursor
- ✅ Gera relatório com recomendações

**Requisitos:**

- Windows com PowerShell
- OpenSSH Client instalado

---

## 🔄 Fluxo de Trabalho Recomendado

### Cenário 1: Conectar do Windows ao MacBook

1. **No MacBook remoto:**

   ```bash
   cd /caminho/para/NossaMaternidade-1
   ./scripts/configurar-ssh-macbook-completo.sh
   ```

   - Anote o IP exibido no resumo

2. **No Windows (host local):**

   ```powershell
   # Configure o SSH config
   # Edite: C:\Users\SeuUsuario\.ssh\config
   # Adicione:
   # Host mac-remoto
   #     HostName IP_DO_MACBOOK
   #     User usuario-mac
   #     Port 22

   # Teste a conexão
   .\scripts\diagnostico-ssh-windows.ps1 -HostName "mac-remoto" -HostIP "IP_DO_MACBOOK" -User "usuario-mac"
   ```

3. **No Cursor (Windows):**
   - `Ctrl+Shift+P` → `Remote-SSH: Connect to Host`
   - Selecione `mac-remoto`

### Cenário 2: Conectar do MacBook ao Windows

1. **No Windows (host remoto):**

   ```powershell
   # Execute como Administrador
   cd C:\caminho\para\NossaMaternidade-1
   .\scripts\configurar-ssh-windows-completo.ps1
   ```

   - Anote o IP exibido no resumo

2. **No MacBook (host local):**

   ```bash
   # Configure o SSH config
   # Edite: ~/.ssh/config
   # Adicione:
   # Host windows-remoto
   #     HostName IP_DO_WINDOWS
   #     User usuario-windows
   #     Port 22

   # Teste a conexão
   ssh usuario-windows@IP_DO_WINDOWS
   ```

3. **No Cursor (MacBook):**
   - `Cmd+Shift+P` → `Remote-SSH: Connect to Host`
   - Selecione `windows-remoto`

### Cenário 3: Problemas de Conexão

1. **No Windows (para conectar ao Mac):**

   ```powershell
   # Execute diagnóstico
   .\scripts\diagnostico-ssh-windows.ps1 -HostName "mac-remoto" -HostIP "192.168.2.7" -User "usuario-mac"
   ```

2. **Siga as recomendações do relatório**

3. **Se necessário, reconfigurar no MacBook:**
   ```bash
   ./scripts/configurar-ssh-macbook.sh
   ```

---

## 📝 Exemplos de Uso

### Configurar SSH no Windows (Primeira Vez)

```powershell
# No Windows, execute como Administrador
cd C:\caminho\para\NossaMaternidade-1
.\scripts\configurar-ssh-windows-completo.ps1
```

### Adicionar Nova Chave SSH ao Windows

```powershell
# No Windows
.\scripts\configurar-ssh-windows.ps1 -ChavePublica (Get-Content ~\.ssh\id_ed25519.pub -Raw)
```

### Adicionar Nova Chave SSH ao MacBook

```bash
# No MacBook
./scripts/configurar-ssh-macbook.sh --chave-publica "$(cat ~/.ssh/id_ed25519.pub)"
```

### Verificar IP Atual do MacBook

```bash
# O script exibe automaticamente, mas você também pode:
ipconfig getifaddr en0  # Wi-Fi
ipconfig getifaddr en1  # Ethernet
```

### Verificar IP Atual do Windows

```powershell
# O script exibe automaticamente, mas você também pode:
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" }
```

### Testar Conexão do Windows para MacBook

```powershell
# Teste básico
ssh usuario@192.168.2.7

# Teste com verbose
ssh -vvv usuario@192.168.2.7

# Teste usando alias
ssh mac-remoto
```

### Testar Conexão do MacBook para Windows

```bash
# Teste básico
ssh usuario@192.168.2.X

# Teste com verbose
ssh -vvv usuario@192.168.2.X

# Teste usando alias
ssh windows-remoto
```

---

## 🔧 Troubleshooting

### Script não executa no MacBook

```bash
# Dar permissão de execução
chmod +x scripts/configurar-ssh-macbook.sh
chmod +x scripts/configurar-ssh-macbook-completo.sh
```

### Script não executa no Windows (Política de Execução)

```powershell
# Se receber erro de política de execução, execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ou execute o script diretamente:
powershell -ExecutionPolicy Bypass -File .\scripts\configurar-ssh-windows.ps1
```

### Erro de permissão sudo (MacBook)

- O script precisa de sudo para habilitar SSH e configurar firewall
- Você será solicitado a inserir sua senha

### Erro de permissão Administrador (Windows)

- O script precisa ser executado como Administrador
- Clique com botão direito no PowerShell e selecione "Executar como Administrador"
- Ou execute: `Start-Process PowerShell -Verb RunAs`

### Chave SSH não funciona

1. Verifique se a chave foi adicionada:

   ```bash
   cat ~/.ssh/authorized_keys
   ```

2. Verifique permissões:

   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. Teste localmente:
   ```bash
   ssh localhost
   ```

### IP mudou

- Execute o script novamente no MacBook para ver o novo IP
- Atualize a configuração SSH no Windows (`~/.ssh/config`)

---

## 📚 Documentação Relacionada

- [Conectar Mac ao Windows](../docs/CONECTAR_MAC_AO_WINDOWS.md) - **Guia completo para conectar do MacBook ao Windows**
- [Troubleshooting SSH Remoto](../docs/TROUBLESHOOTING_SSH_REMOTO.md) - Guia completo de troubleshooting
- [Configuração Windows](../docs/SETUP_WINDOWS.md) - Setup inicial do ambiente Windows

---

## ⚠️ Notas de Segurança

1. **Chaves SSH:** Sempre use chaves SSH em vez de senhas quando possível
2. **Firewall:** O script configura o firewall, mas verifique se está adequado para seu ambiente
3. **Rede:** Certifique-se de estar em uma rede confiável ao usar SSH sem senha
4. **Permissões:** O script configura permissões corretas automaticamente, mas verifique se estão corretas

---

## 🤝 Contribuindo

Se encontrar problemas ou tiver sugestões de melhoria:

1. Verifique a documentação em `docs/TROUBLESHOOTING_SSH_REMOTO.md`
2. Execute os scripts com `--verbose` para mais detalhes
3. Reporte problemas com logs detalhados
