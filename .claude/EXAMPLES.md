# Exemplos Práticos - Linha de Status Personalizada

Aqui estão cenários do mundo real e como usá-los.

---

## 📌 Cenário 1: Monitorar Contexto Durante Sessão Longa

**Problema**: Você está trabalhando há 2 horas, conversa tem muitos arquivos lidos, e não sabe se contexto está perto do limite.

**Solução**:

```powershell
# Antes de fazer uma ação crítica:
.\.claude\scripts\status-line.ps1

# Output:
# @ Claude 3.5 Sonnet | ████████████░░░░░░░░░ 63% | [feature/nathia] | [NossaMaternidade]
```

**Interpretação**:

- ✅ Ainda temos 37% de contexto disponível (111.000 tokens)
- ✅ Seguro fazer mais leituras de arquivo
- ⚠️ Se chegar a 75%, considere `/compact` ou `/clear`

---

## 📌 Cenário 2: Evitar Enviar para Branch Errada

**Problema**: Você tem 3 branches abertas em worktrees diferentes e acidentalmente fez commit em `main` em vez de `feature/oauth`.

**Solução**:

```powershell
# Antes de fazer git push:
.\.claude\scripts\status-line.ps1

# Output:
# @ Claude 3.5 Sonnet | ████████░░░░░░░░░░░░░░░░ 40% | [main] | [NossaMaternidade]
#                                                                 ^^^^^^

# ❌ ALERTA! Você está em [main], mas deveria estar em [feature/oauth]
```

**Próximos passos**:

```powershell
# Desfazer commit
git reset --soft HEAD~1

# Trocar de branch
git checkout feature/oauth

# Refazer commit
git add . && git commit -m "message"
```

---

## 📌 Cenário 3: Debugar Porque Cores Não Aparecem

**Problema**: Você rodou o script mas vê apenas texto sem cores.

**Solução - Passo 1: Verificar versão do PowerShell**

```powershell
$PSVersionTable.PSVersion
# Output: Major  Minor  Build  Revision
#         -----  -----  -----  --------
#         7      4      4      40000
# ✅ Versão 7.4.4 suporta ANSI colors
```

**Solução - Passo 2: Testar suporte ANSI no terminal**

```powershell
# Teste cores ANSI direto
Write-Host "`e[92mTexto verde (bright)`e[0m"
Write-Host "`e[91mTexto vermelho (bright)`e[0m"
```

**Solução - Passo 3: Se ainda não funcionar**

```powershell
# Use Windows Terminal (https://aka.ms/terminal)
# Ele tem suporte completo a ANSI colors

# OU use a flag -ShowJson para debug
.\.claude\scripts\status-line.ps1 -ShowJson
```

---

## 📌 Cenário 4: Criar Alias para Chamar Rápido

**Problema**: Digitar `.\.claude\scripts\status-line.ps1` é muito longo toda vez.

**Solução:**

```powershell
# 1. Abra seu profile PowerShell
notepad $PROFILE

# 2. Adicione isto no final:
function status {
    & "$PSScriptRoot\.claude\scripts\status-line.ps1" @args
}

# 3. Salve e recarregue o profile
. $PROFILE

# 4. Agora pode usar:
status              # Linha de status
status -Debug       # Com avisos
status -ShowJson    # JSON bruto
```

**Resultado:**

```powershell
❯ status
@ Claude 3.5 Sonnet | ██████████░░░░░░░░░░ 50% | [main] | [NossaMaternidade]
```

---

## 📌 Cenário 5: Integrar com Seu Prompt Personalizado

**Problema**: Você quer que a linha de status apareça **automaticamente** cada vez que abre um novo terminal.

**Solução (Windows):**

```powershell
# 1. Abra seu profile
notepad $PROFILE

# 2. No TOPO do arquivo, adicione:
function prompt {
    # Linha de status
    Write-Host ""
    & "$PSScriptRoot\.claude\scripts\status-line.ps1"
    Write-Host ""

    # Prompt padrão
    "❯ "
}

# 3. Salve
. $PROFILE
```

**Resultado cada vez que abre um terminal:**

```
@ Claude 3.5 Sonnet | ████████░░░░░░░░░░░░░░ 40% | [main] | [NossaMaternidade]

❯
```

---

## 📌 Cenário 6: Detectar Contexto Crítico Automaticamente

**Problema**: Você quer ser avisado quando contexto passar de 75%.

**Solução (Script PowerShell):**

```powershell
# Crie: .\.claude\scripts\check-context.ps1

param([int]$WarnThreshold = 75)

$statusJson = & .\.claude\scripts\status-line.ps1 -ShowJson | ConvertFrom-Json

$percent = $statusJson.context.percentUsed

if ($percent -gt $WarnThreshold) {
    Write-Host ""
    Write-Host "⚠️  AVISO: Contexto em $percent% (limite: $WarnThreshold%)" -ForegroundColor Red
    Write-Host "Dica: Use /compact ou /clear para gerenciar contexto" -ForegroundColor Yellow
    Write-Host ""
    exit 1
} else {
    Write-Host "✅ Contexto OK: $percent%" -ForegroundColor Green
    exit 0
}
```

**Use em scripts/CI:**

```powershell
# Verificar contexto antes de continuar
& .\.claude\scripts\check-context.ps1 -WarnThreshold 80

if ($LASTEXITCODE -eq 1) {
    Write-Host "Abortando ação crítica"
    exit 1
}
```

---

## 📌 Cenário 7: Monitorar Múltiplas Worktrees

**Problema**: Você tem 3 worktrees do Git rodando em paralelo:

- `.claude-worktrees/feature-auth`
- `.claude-worktrees/feature-oauth`
- `.claude-worktrees/bugfix-session`

**Solução:**

```powershell
# Terminal 1: feature-auth
cd .claude-worktrees/feature-auth
.\.claude\scripts\status-line.ps1
# @ Claude 3.5 Sonnet | ████████░░░░░░░░░░░░░░░░ 40% | [feature-auth] | [feature-auth]

# Terminal 2: feature-oauth
cd .\.claude-worktrees/feature-oauth
.\.claude\scripts\status-line.ps1
# @ Claude 3.5 Sonnet | ███████░░░░░░░░░░░░░░░░░░░ 35% | [feature-oauth] | [feature-oauth]

# Terminal 3: bugfix-session
cd .\.claude-worktrees/bugfix-session
.\.claude\scripts\status-line.ps1
# @ Claude 3.5 Sonnet | ██████░░░░░░░░░░░░░░░░░░░░░ 30% | [bugfix-session] | [bugfix-session]
```

**Vantagem**: Cada terminal mostra sua branch correta, evitando acidentes! ✅

---

## 📌 Cenário 8: Exportar Relatório de Contexto

**Problema**: Você quer documentar quanto contexto usou em cada dia para referência futura.

**Solução:**

```powershell
# Crie: .\.claude\scripts\log-context.ps1

$logFile = ".\.claude\context-log.csv"

$statusJson = & .\.claude\scripts\status-line.ps1 -ShowJson | ConvertFrom-Json

$entry = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Percent = $statusJson.context.percentUsed
    Project = $statusJson.project
    Branch = $statusJson.branch
}

# Append to CSV
$entry | ConvertTo-Csv -NoTypeInformation | Add-Content $logFile

Write-Host "Logged: $($entry | ConvertTo-Json -Compress)"
```

**Use diariamente:**

```powershell
# Adicione ao seu profile para rodar ao abrir terminal:
& .\.claude\scripts\log-context.ps1
```

**Resultado (context-log.csv):**

```
"Timestamp","Percent","Project","Branch"
"2025-01-24 10:30:45","45","NossaMaternidade","feature-nathia"
"2025-01-24 11:15:20","52","NossaMaternidade","feature-nathia"
"2025-01-24 14:45:33","78","NossaMaternidade","main"
```

---

## 🎯 Dicas Rápidas

| Situação             | Comando                                | Resultado                  |
| -------------------- | -------------------------------------- | -------------------------- |
| **Check rápido**     | `status`                               | Exibe linha uma vez        |
| **Monitor contínuo** | Adicione ao `$PROFILE`                 | Exibe a cada terminal novo |
| **Debug dados**      | `status -ShowJson \| ConvertFrom-Json` | Estrutura JSON             |
| **Com avisos**       | `status -Debug`                        | Mostra warnings            |
| **Agendar check**    | `while (1) { status; Start-Sleep 60 }` | Check a cada 60s           |

---

## 📚 Próximas Ideias

1. **Notificação Sonora**: Adicione beep quando contexto > 80%
2. **Discord Webhook**: Envie status para Discord channel privado
3. **Histórico Gráfico**: Crie gráfico de uso ao longo do tempo
4. **Integração GitHub**: Mostre PR status junto com branch
5. **Tempo de Sessão**: Adicione "Session: 2h 30m" ao status

---

**Quer sugerir um novo caso de uso?** Edite este arquivo ou crie uma issue no repositório!
