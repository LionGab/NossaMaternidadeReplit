# Barra de Progresso no Claude Code - Status Line

**Data:** 04 Jan 2026
**Status:** ✅ Configurado

---

## 🎯 O Que É?

A **Status Line** do Claude Code é uma linha personalizada na parte inferior da interface que pode exibir informações do projeto, status do git, e **barras de progresso** para tarefas em execução.

---

## ✅ Configuração Atual

A status line já está configurada no projeto:

**Arquivo:** `.claude/settings.json`

```json
{
  "statusLine": {
    "type": "command",
    "command": "powershell",
    "args": ["-ExecutionPolicy", "Bypass", "-File", "${PWD}/.claude/statusline.ps1"],
    "refreshInterval": 2000,
    "padding": 0
  }
}
```

**Script:** `.claude/statusline.ps1` (Windows)
**Script:** `.claude/statusline.sh` (macOS/Linux)

---

## 📋 O Que Mostra?

A status line atual exibe:

1. **Nome do Projeto**: "Nossa Maternidade"
2. **Branch Git**: Nome da branch atual
3. **Status Git**:
   - `✓` (verde) = Sem mudanças
   - `●` (amarelo) = Com mudanças não commitadas
4. **Progresso** (se houver): Informações de processos em execução

**Exemplo de saída:**

```
Nossa Maternidade | main ✓
```

ou com progresso:

```
Nossa Maternidade | main ✓ | 🔨 Building... 45%
```

---

## 🔧 Como Usar a Barra de Progresso

### Método 1: Atualizar Arquivo de Progresso

Crie ou atualize o arquivo `.claude/progress.txt` com a mensagem desejada:

**PowerShell (Windows):**

```powershell
# Mostrar progresso
Write-Output "🔨 Building..." | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline

# Com porcentagem
Write-Output "🔍 Testing... 45%" | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline

# Limpar quando terminar
Remove-Item ".claude/progress.txt" -ErrorAction SilentlyContinue
```

**Bash (macOS/Linux):**

```bash
# Mostrar progresso
echo "🔨 Building..." > .claude/progress.txt

# Com porcentagem
echo "🔍 Testing... 45%" > .claude/progress.txt

# Limpar quando terminar
rm .claude/progress.txt
```

### Método 2: Integrar em Scripts

Adicione atualizações de progresso nos seus scripts:

**Exemplo: `scripts/build.ps1`**

```powershell
# Início
Write-Output "🔨 Building..." | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline

# Durante build
Write-Output "📦 Installing dependencies..." | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline

# Finalização
Write-Output "✅ Build complete!" | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline

# Limpar ao final
Remove-Item ".claude/progress.txt" -ErrorAction SilentlyContinue
```

---

## 🎨 Personalização

### Adicionar Mais Informações

Edite `.claude/statusline.ps1` para adicionar:

- **Status do build**: Verificar se há build em andamento
- **Testes**: Mostrar status dos testes
- **Linter**: Mostrar erros do ESLint
- **TypeScript**: Mostrar erros de tipo
- **Commits pendentes**: Quantidade de commits não pushados

**Exemplo avançado:**

```powershell
# Verificar erros do TypeScript
$tsErrors = (bun run typecheck 2>&1 | Select-String "error").Count
if ($tsErrors -gt 0) {
    $status += " | ⚠️ TS:$tsErrors"
}

# Verificar commits não pushados
$commitsAhead = (git rev-list --count @{u}..HEAD 2>$null)
if ($commitsAhead -gt 0) {
    $status += " | 📤 +$commitsAhead"
}
```

### Mudar Intervalo de Atualização

No `.claude/settings.json`, ajuste `refreshInterval`:

```json
{
  "statusLine": {
    "refreshInterval": 1000 // Atualiza a cada 1 segundo (padrão: 2000ms)
  }
}
```

---

## 📚 Exemplos Práticos

### 1. Progresso Durante Build

```powershell
# scripts/build-with-progress.ps1
Write-Output "🔨 Building..." | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline
bun run build
Remove-Item ".claude/progress.txt" -ErrorAction SilentlyContinue
```

### 2. Progresso Durante Testes

```powershell
# scripts/test-with-progress.ps1
Write-Output "🧪 Running tests..." | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline
bun test
Remove-Item ".claude/progress.txt" -ErrorAction SilentlyContinue
```

### 3. Progresso com Etapas

```powershell
# scripts/deploy-with-progress.ps1
$steps = @("Building", "Testing", "Linting", "Deploying")
for ($i = 0; $i -lt $steps.Length; $i++) {
    $percent = [math]::Round(($i + 1) / $steps.Length * 100)
    Write-Output "📦 $($steps[$i])... $percent%" | Out-File -FilePath ".claude/progress.txt" -Encoding UTF8 -NoNewline
    Start-Sleep -Seconds 2
}
Remove-Item ".claude/progress.txt" -ErrorAction SilentlyContinue
```

---

## 🔍 Troubleshooting

### Status Line Não Aparece

1. **Verificar configuração**: Confirme que `statusLine` está no `.claude/settings.json`
2. **Reiniciar Claude Code**: Feche e abra novamente
3. **Verificar permissões**: O script precisa ter permissão de execução
4. **Verificar caminho**: Confirme que o caminho do script está correto

### Progresso Não Atualiza

1. **Verificar arquivo**: Confirme que `.claude/progress.txt` existe e tem conteúdo
2. **Verificar refreshInterval**: Pode estar muito alto (padrão: 2000ms)
3. **Verificar encoding**: Use UTF-8 para suportar emojis

### Script Não Executa (Windows)

1. **Execution Policy**: O script usa `-ExecutionPolicy Bypass` para contornar restrições
2. **Caminho absoluto**: Se necessário, use caminho absoluto em vez de `${PWD}`

---

## 📖 Referências

- **Documentação Claude Code**: https://docs.anthropic.com/pt/docs/claude-code/statusline
- **Scripts de exemplo**: `.claude/progress-example.ps1`
- **Status line script**: `.claude/statusline.ps1` (Windows) ou `.claude/statusline.sh` (macOS/Linux)

---

**Última atualização:** 04 Jan 2026
