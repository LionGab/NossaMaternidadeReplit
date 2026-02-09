# Configuração da Linha de Status Personalizada - Claude Code

**Objetivo**: Transformar o terminal do Claude Code em um dashboard útil que exibe contexto, Git branch, pasta e modelo em tempo real.

---

## 📊 O Que Será Exibido

```
◆ Claude 3.5 Sonnet │ ██████████░░░░░░░░░░ 45% │ ★ main │ @ NossaMaternidade
```

| Componente       | Informação               | Cores                                              |
| ---------------- | ------------------------ | -------------------------------------------------- |
| **◆ Model**      | Nome do modelo IA        | Cyan (destaque)                                    |
| **Progress Bar** | Barra de tokens usados   | Verde (0-49%) → Amarelo (50-74%) → Vermelho (75%+) |
| **Percentual**   | % do contexto usado      | Azul                                               |
| **★ Branch**     | Nome da branch Git       | Magenta (★ = main, ○ = outra)                      |
| **@ Folder**     | Nome da pasta do projeto | Amarelo (dimmed)                                   |

---

## 🎯 Implementação

### Opção 1: Integração Manual com Claude Code (Recomendado)

1. **Abra o terminal do Claude Code** (Shift + `) em uma sessão
2. **Execute um destes comandos**:

   ```powershell
   # Teste o script diretamente
   .\.claude\scripts\status-line.ps1

   # Com informações de debug
   .\.claude\scripts\status-line.ps1 -Debug

   # Ver output JSON bruto (para diagnóstico)
   .\.claude\scripts\status-line.ps1 -ShowJson
   ```

3. **Copie a saída e use como linha de status customizada**
   - No Claude Code, procure por: **Copilot → Settings → Terminal Status Line**
   - Cole o comando: `.\.claude\scripts\status-line.ps1`

### Opção 2: Alias PowerShell Persistente

Adicione ao seu perfil PowerShell (`$PROFILE`):

```powershell
# Abra o perfil
notepad $PROFILE

# Adicione isto:
function status-line { & "C:\Users\User\Documents\new\NossaMaternidade\.claude\scripts\status-line.ps1" @args }
```

Depois pode chamar apenas: `status-line`

---

## 🔍 Solução de Problemas

### Problema: Barra de Progresso Mostra 0% ou Está Incorreta

**Causa**: Claude Code não expõe contexto via environment variables por padrão.

**Solução**:

```powershell
# Teste se a variável está disponível
$env:CLAUDE_CONTEXT_USAGE

# Se vazio, o script assume 0%. Para depurar:
.\.claude\scripts\status-line.ps1 -ShowJson
```

O script atualmente **estima** tokens via arquivo `.claude/context.json` (se existir). Se precisar de dados reais, consulte a documentação do Claude Code.

### Problema: Git Branch Mostra "no-git"

**Causa**: Você não está em um repositório Git inicializado.

**Solução**:

```powershell
# Verifique se estou na pasta certa
git status

# Se erro, reinicializar
git init
```

### Problema: Cores Não Aparecem

**Causa**: Terminal não suporta ANSI color codes.

**Solução**:

- Use **Windows Terminal** (recomendado) em vez de CMD
- Ou use PowerShell v7+ com suporte nativo a cores ANSI
- Verifique: `$PSVersionTable.PSVersion`

### Problema: Execução Bloqueada por Política

**Causa**: Execution Policy do PowerShell.

**Solução**:

```powershell
# Temporário (sessão atual)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Permanente (com admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

---

## 🎨 Customização

### Alterar Cores

Edite `.\.claude\scripts\status-line.ps1` e modifique o hashtable `$Colors`:

```powershell
$Colors = @{
    Green   = "`e[92m"  # Bright green
    Red     = "`e[91m"  # Bright red
    Cyan    = "`e[96m"  # Bright cyan
    # etc...
}
```

**Referência ANSI**:

- `30-37`: Cores normais
- `90-97`: Cores bright/brilhantes
- `40-47`: Background colors

### Alterar Símbolo de Branch

Em `Format-StatusLine`, mude:

```powershell
$branchIcon = if ($Branch -eq "main") { "★" } else { "○" }
```

Para:

```powershell
$branchIcon = if ($Branch -eq "main") { "✓" } else { "⎇" }
```

---

## 📝 Monitoramento de Contexto

**Por que é importante?**

- **Limite de tokens**: 200.000 tokens
- **Qualidade degrada** acima de 75% (150.000 tokens)
- **Resumo automático**: Claude pode perder conversa após 85%

**Dica**: Quando a barra ficar vermelha (75%+):

```
/compact        # Compactar contexto mantendo histórico importante
/clear          # Limpar completamente e resetar
/rewind         # Voltar a um checkpoint anterior
```

---

## 🔗 Integração com Workflows

### Em CI/CD ou Scripts

```powershell
# Capturar status como JSON
$status = & .\.claude\scripts\status-line.ps1 -ShowJson | ConvertFrom-Json

# Usar em condicional
if ($status.context.percentUsed -gt 80) {
    Write-Host "⚠ Aviso: Contexto acima de 80%!" -ForegroundColor Yellow
}
```

---

## 📚 Referências

- **Vídeo original**: "Your Claude Code Terminal Should Look Like This" - Leon van Zyl
- **ANSI Color Codes**: https://en.wikipedia.org/wiki/ANSI_escape_code
- **PowerShell Color**: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.host/write-host

---

## ✅ Checklist de Setup

- [ ] Script criado em `.\.claude\scripts\status-line.ps1`
- [ ] Testei com: `.\.claude\scripts\status-line.ps1`
- [ ] Cores aparecem corretamente
- [ ] Git branch detecta corretamente
- [ ] Integrei com Claude Code terminal (opcional)
- [ ] Criei alias PowerShell (opcional)
- [ ] Testei em múltiplas pastas do projeto

---

**Nota**: Este script é específico para **Windows PowerShell 7+**. Para WSL/Linux/Mac, veja `status-line.sh` (versão Bash).
