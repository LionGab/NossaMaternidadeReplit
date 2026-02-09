# Integração da Linha de Status com Claude Code IDE

Este documento explica como integrar a linha de status personalizada diretamente no IDE do Claude Code.

---

## 🔧 Passo 1: Localizar as Configurações do Claude Code

### Onde encontrar o arquivo de configuração?

**Windows:**

```powershell
# Perfil PowerShell global
notepad $PROFILE

# Ou procure em:
C:\Users\[YourUsername]\Documents\Claude Code\settings.json
```

**macOS/Linux:**

```bash
# Perfil Bash/Zsh
nano ~/.bash_profile
# ou
nano ~/.zshrc

# Ou procure em:
~/.config/claude-code/settings.json
```

---

## 🎯 Passo 2: Configurar a Linha de Status

### Para Windows (PowerShell)

1. **Abra o terminal do Claude Code** (Shift + `)
2. **Digite um destes comandos**:

   ```powershell
   # Exibir linha de status
   .\.claude\scripts\status-line.ps1

   # Exibir com debug
   .\.claude\scripts\status-line.ps1 -Debug

   # Exibir JSON
   .\.claude\scripts\status-line.ps1 -ShowJson
   ```

3. **Para integração automática:**
   - Se Claude Code suporta custom terminal hooks, configure:
   ```json
   {
     "terminal.statusLine": ".claude\\scripts\\status-line.ps1"
   }
   ```

### Para WSL/Linux/macOS (Bash/Zsh)

1. **Torne o script executável:**

   ```bash
   chmod +x ./.claude/scripts/status-line.sh
   ```

2. **Teste:**

   ```bash
   ./.claude/scripts/status-line.sh
   ./.claude/scripts/status-line.sh -ShowJson
   ```

3. **Configure no shell profile:**
   ```bash
   # ~/.bashrc ou ~/.zshrc
   export PROMPT="$(./.claude/scripts/status-line.sh) > "
   ```

---

## 📊 Passo 3: Verificar Dados em Tempo Real

### Teste 1: Verificar Contexto de Tokens

Se a barra de progresso mostrar **0%**, isso é esperado porque Claude Code não expõe dados de contexto por padrão. Para obter dados reais:

```powershell
# Modo debug (mostra avisos)
.\.claude\scripts\status-line.ps1 -Debug

# Modo JSON (estrutura de dados)
.\.claude\scripts\status-line.ps1 -ShowJson | ConvertFrom-Json | Format-List
```

### Teste 2: Verificar Git Branch

```powershell
# Verificar branch atual
git branch --show-current

# Verificar repositório
git status
```

### Teste 3: Verificar Nome do Projeto

```powershell
# Windows
Split-Path -Leaf (Get-Location)

# Linux/macOS
basename $(pwd)
```

---

## 🎨 Personalização

### Customizar Cores (Windows)

Edite `.\.claude\scripts\status-line.ps1`:

```powershell
$Colors = @{
    Cyan    = "`e[96m"   # Bright cyan para model
    Green   = "`e[92m"   # Bright green para 0-50%
    Yellow  = "`e[93m"   # Bright yellow para 50-75%
    Red     = "`e[91m"   # Bright red para 75%+
    Blue    = "`e[94m"   # Bright blue para percentual
    Magenta = "`e[95m"   # Bright magenta para branch
}
```

**Referência de cores ANSI:**

- `30-37`: Padrão (escuro)
- `90-97`: Bright/Brilhante
- `40-47`: Background

### Customizar Símbolos

Em `Format-StatusLine`, mude:

```powershell
# Branch
$branchIcon = if ($Branch -eq "main") { "[main]" } else { "[$Branch]" }

# Model
$modelPart = "$($Colors.Cyan)@ $Model$($Colors.Reset)"

# Separadores
$separator = "$($Colors.Dim)|$($Colors.Reset)"
```

### Customizar Comprimento da Barra

```powershell
# Em New-ProgressBar, mude o parâmetro:
New-ProgressBar -Percent $Context.percentUsed -Length 30   # Ao invés de 15
```

---

## ⚙️ Configurações Avançadas

### Usar Alias PowerShell

Para chamar simplesmente `status`, adicione ao seu `$PROFILE`:

```powershell
# Abra seu profile
notepad $PROFILE

# Adicione:
function status { & "C:\Users\User\Documents\new\NossaMaternidade\.claude\scripts\status-line.ps1" @args }

# Salve e recarregue
. $PROFILE
```

Agora pode chamar:

```powershell
status          # Linha de status normal
status -Debug   # Com debug
status -ShowJson  # JSON
```

### Executar Automaticamente ao Abrir Terminal

```powershell
# No seu $PROFILE, adicione no final:
Write-Host ""
& .\.claude\scripts\status-line.ps1
Write-Host ""
```

---

## 🔍 Troubleshooting Avançado

### Problema: Cores não aparecem

**Diagnóstico:**

```powershell
# Verificar versão do PowerShell
$PSVersionTable.PSVersion

# Testar suporte a ANSI
Write-Host "`e[92mVerde`e[0m"
```

**Solução:**

- Use **Windows Terminal** (recomendado)
- Ou atualize para PowerShell 7+
- Ou configure no VS Code: `"terminal.integrated.profiles.windows"`

### Problema: Git branch mostra "no-git"

**Diagnóstico:**

```powershell
git rev-parse --git-dir
```

**Solução:**

```powershell
cd /caminho/para/repo/existente
git status
```

### Problema: Execução bloqueada

**Erro:** `cannot be loaded because running scripts is disabled`

**Solução permanente:**

```powershell
# Com privilégios de admin
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Solução temporária:**

```powershell
PowerShell -ExecutionPolicy Bypass -File .\.claude\scripts\status-line.ps1
```

---

## 🚀 Próximos Passos

1. **Adicione a linha de status ao `.claude/PROMPT.md`** para que futuras sessões do Claude Code a usem automaticamente
2. **Crie uma integração com CI/CD** para monitorar contexto em pipelines
3. **Configure alertas** para quando contexto exceder 75%

---

## 📚 Recursos Adicionais

| Tópico                 | Link                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **ANSI Escape Codes**  | https://en.wikipedia.org/wiki/ANSI_escape_code                                           |
| **PowerShell Colors**  | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.host/write-host |
| **Bash Prompt Design** | https://www.gnu.org/software/bash/manual/bash.html#Controlling-the-Prompt                |
| **Claude Code Docs**   | https://docs.claude.ai/                                                                  |

---

## ✅ Checklist Final

- [ ] Script testado com: `.\.claude\scripts\status-line.ps1`
- [ ] Cores aparecem corretamente no terminal
- [ ] Git branch é detectado corretamente
- [ ] Contexto de tokens exibe (mesmo que 0%)
- [ ] Alias PowerShell criado (opcional)
- [ ] Auto-execução ao abrir terminal (opcional)
- [ ] Customizações de cores aplicadas (opcional)

**Pronto!** Sua linha de status está funcionando. 🎉
