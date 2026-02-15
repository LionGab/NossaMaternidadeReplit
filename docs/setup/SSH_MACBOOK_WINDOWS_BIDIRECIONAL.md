# SSH bidirecional: MacBook ↔ Windows

Guia para configurar as duas direções de conexão SSH entre MacBook e Windows (Cursor Remote-SSH).

---

## Ordem sugerida

1. **Mac** → rodar `preparar-ssh-macbook-para-windows.sh` e copiar a chave
2. **Windows** → instalar OpenSSH, rodar `configurar-ssh-windows-completo.ps1` e depois `configurar-ssh-windows.ps1` (colar chave)
3. **Mac** → configurar `~/.ssh/config` (Host `windows-remoto`) e testar `ssh windows-remoto`
4. **Mac** → habilitar Remote Login e adicionar chave do Windows em `~/.ssh/authorized_keys`
5. **Windows** → gerar chave, configurar `~/.ssh/config` (Host `macbook`) e testar `ssh macbook`

---

## Parte A: MacBook → Windows (Cursor no Mac acessando o Windows)

### 1. No MacBook

```bash
cd ~/NossaMaternidadeReplit   # ou o caminho do projeto

bash scripts/ssh/preparar-ssh-macbook-para-windows.sh
```

O script mostra sua chave pública. **Copie a linha inteira** (começa com `ssh-ed25519` ou `ssh-rsa`).

### 2. No Windows

Abra o **PowerShell como Administrador** (clique direito → "Executar como administrador").

**Verificar/instalar OpenSSH Server:**

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'

# Se não instalado:
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

**Rodar scripts na pasta do projeto:**

```powershell
cd C:\Users\User\Documents\Nossa-Maternidade-03\NossaMaternidadeReplit

# 1) Configurar OpenSSH Server, firewall e serviço
.\scripts\configurar-ssh-windows-completo.ps1

# 2) Adicionar chave pública do Mac (o script pede se não passar)
.\scripts\configurar-ssh-windows.ps1 -ChavePublica "COLE_A_CHAVE_DO_MAC_AQUI"

# Ou sem parâmetro – o script pede para colar:
.\scripts\configurar-ssh-windows.ps1
```

Anote o **IP do Windows** e o **usuário** (mostrados no output).

### 3. No MacBook – editar SSH config

```bash
nano ~/.ssh/config
# ou: code ~/.ssh/config
```

Adicione (ajustando IP e usuário):

```
Host windows-remoto
    HostName 192.168.2.XX
    User SEU_USUARIO_WINDOWS
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
```

### 4. Testar no Mac

```bash
ssh windows-remoto
```

Se aparecer o prompt do PowerShell do Windows, a conexão está ok.

### 5. No Cursor (Mac)

- `Cmd+Shift+P` → `Remote-SSH: Connect to Host`
- Escolha `windows-remoto`

---

## Parte B: Windows → MacBook (Windows rodando comandos no Mac)

### 1. No MacBook

```bash
# Habilitar SSH no Mac
sudo systemsetup -setremotelogin on
```

### 2. No Windows – gerar chave SSH

```powershell
ssh-keygen -t ed25519 -C "windows@seu-pc" -f $env:USERPROFILE\.ssh\id_ed25519 -N ""
```

**Copiar chave pública:**

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

### 3. No MacBook – adicionar chave autorizada

```bash
echo "COLE_A_CHAVE_AQUI" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 4. Descobrir o IP do Mac

```bash
ipconfig getifaddr en0
# ou
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### 5. No Windows – editar SSH config

Arquivo: `C:\Users\SEU_USUARIO\.ssh\config`

```ssh-config
Host macbook
    HostName 192.168.2.XX
    User lion
    Port 22
    IdentityFile C:\Users\SEU_USUARIO\.ssh\id_ed25519
```

### 6. Testar no Windows

```powershell
ssh macbook "echo 'Mac conectado!'"
```

### 7. Rodar comandos no Mac a partir do Windows

```powershell
# No Windows, dentro da pasta do projeto
.\scripts\ssh-macbook.ps1 "npm start"
.\scripts\ssh-macbook.ps1 "npm run ios"
```

> No Windows use `ssh-macbook.ps1`. No Git Bash use `bash scripts/ssh-macbook.sh`.  
> Os scripts usam a pasta `~/NossaMaternidadeReplit` no Mac. Ajuste `$projectDir` / `PROJECT_DIR` se o projeto estiver em outro caminho.

---

## Resumo rápido

| Onde você está | O que fazer                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| **Mac**        | `bash scripts/ssh/preparar-ssh-macbook-para-windows.sh`                                  |
| **Windows**    | `.\scripts\configurar-ssh-windows-completo.ps1` e `.\scripts\configurar-ssh-windows.ps1` |
| **Mac**        | Editar `~/.ssh/config` com host `windows-remoto`                                         |
| **Windows**    | Editar `C:\Users\SEU_USUARIO\.ssh\config` com host `macbook`                             |

---

## Scripts disponíveis

| Script                                             | Uso                                                  |
| -------------------------------------------------- | ---------------------------------------------------- |
| `scripts/ssh/preparar-ssh-macbook-para-windows.sh` | Mac – prepara chave e opcionalmente config           |
| `scripts/configurar-ssh-windows-completo.ps1`      | Windows – instala/configura OpenSSH Server           |
| `scripts/configurar-ssh-windows.ps1`               | Windows – adiciona chave do Mac ao `authorized_keys` |
| `scripts/ssh-macbook.ps1`                          | Windows – roda comando no Mac via SSH                |
| `scripts/ssh-macbook.sh`                           | Git Bash – roda comando no Mac via SSH               |

---

## Troubleshooting

Consulte [TROUBLESHOOTING_SSH_REMOTO.md](../troubleshooting/TROUBLESHOOTING_SSH_REMOTO.md) para problemas comuns (timeout, firewall, etc.).
