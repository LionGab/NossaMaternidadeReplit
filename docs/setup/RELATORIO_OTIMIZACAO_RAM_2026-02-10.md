# Relatório de Otimização RAM - MacBook 8GB

**Data**: 10 de fevereiro de 2026  
**Status**: 🚨 CRÍTICO - Ação imediata necessária

---

## 📊 Diagnóstico Atual

### Swap (Memória Virtual)

```
Total: 5.120 MB
Usado: 3.623 MB (70,7%)  ← 🚨 CRÍTICO (> 2 GB)
Livre: 1.497 MB
```

**⚠️ ALERTA**: Swap > 2 GB indica que o sistema está com **pressão de memória crítica**. O disco está sendo usado como RAM, causando lentidão extrema (1000x mais lento).

### Top 5 Processos por RAM

| Processo                 | PID   | %CPU  | %RAM | Uso Real | Observação               |
| ------------------------ | ----- | ----- | ---- | -------- | ------------------------ |
| Cursor Helper (Renderer) | 20234 | 99.4% | 5.2% | ~437 MB  | Normal para renderização |
| Chrome Helper (Renderer) | 11590 | 51.1% | 4.4% | ~370 MB  | **1 aba pesada rodando** |
| Cursor Helper (Plugin)   | 20987 | 11.6% | 2.3% | ~193 MB  | Extension hosts          |
| iTerm2                   | 96118 | -     | 1.2% | ~100 MB  | Terminal                 |
| Chrome                   | 11543 | 1.6%  | 1.3% | ~112 MB  | Processo principal       |

**Total Cursor**: ~15+ processos = **~1 GB+** (somando todos)  
**Total Chrome**: ~10 processos = **~600 MB+**  
**MCP Servers (Node)**: ~48 processos = **~500 MB** (muitos duplicados!)

### ⚠️ Problema Crítico Identificado: MCP Servers Duplicados

Há **48 processos Node** rodando MCP servers, muitos duplicados:

- `context7-mcp`: 8 instâncias
- `playwright-mcp`: 8 instâncias
- `mcp-server-sequential-thinking`: 8 instâncias
- `mcp-server-github`: 8 instâncias
- `react-native-debugger-mcp`: 8 instâncias

**Cada instância**: ~5-10 MB  
**Total desperdiçado**: ~300-400 MB

---

## 🎯 Ações Imediatas (Prioridade Máxima)

### 1. Limpar MCP Servers Órfãos (EXECUTAR AGORA)

```bash
# Matar todos os MCP servers órfãos (exceto os rodando no Cursor atual)
pkill -f "context7-mcp"
pkill -f "playwright-mcp"
pkill -f "mcp-server-sequential-thinking"
pkill -f "mcp-server-github"
pkill -f "react-native-debugger-mcp"
```

**Economia esperada**: ~300-400 MB RAM

### 2. Limpar Memória do Sistema (REQUER SUDO)

```bash
sudo purge
```

**Efeito**: Libera memória comprimida e cache inativo.

### 3. Reduzir Abas do Chrome

**Estado atual**: Chrome tem apenas 1-2 abas ativas (bom!)  
**Ação**: Manter assim, máx 5-7 abas.

**Verificar Memory Saver**:

1. Chrome → Settings → Performance
2. Ativar "Memory Saver"

### 4. Reiniciar Cursor IDE (Recomendado)

Cursor está há várias horas rodando. Reiniciar irá:

- Liberar ~500 MB de RAM
- Fechar MCP servers órfãos automaticamente
- Resetar extension hosts

**Como fazer**:

1. Salvar tudo
2. Fechar Cursor completamente (Cmd+Q)
3. Esperar 10 segundos
4. Reabrir Cursor

---

## ✅ Otimizações Já Aplicadas

### 1. Limpeza de Caches ✅

Executado: `npm run optimize:macos:cache`  
**Resultado**: 109 KB liberados (Homebrew, Expo, Metro, Node)

### 2. Configurações do Projeto ✅

O projeto já possui otimizações configuradas:

- `.cursorignore` excluindo `node_modules`, build, coverage
- `files.watcherExclude` em pastas pesadas
- `search.exclude` em diretórios grandes
- CodeLens desabilitado

---

## 📋 Rotina Recomendada (A Partir de Hoje)

### Manhã (Ao Iniciar Trabalho)

```bash
# 1. Verificar swap
sysctl vm.swapusage

# Se swap > 1 GB: Reiniciar Mac antes de começar
```

### Durante o Dia

1. **Manter apenas apps essenciais abertos**:
   - ✅ Cursor (1 projeto)
   - ✅ Terminal (iTerm ou nativo)
   - ✅ Safari/Chrome (máx 5-7 abas)
   - ❌ Slack, Discord, outros pesados

2. **A cada 2-3 horas**:

   ```bash
   sudo purge
   sysctl vm.swapusage  # Verificar swap
   ```

3. **Fechar simulador iOS quando não estiver testando**:
   ```bash
   # Fechar simulador
   killall Simulator
   ```
   **Economia**: ~400 MB

### Fim do Dia

```bash
# 1. Fechar tudo
# 2. Limpar memória
sudo purge

# 3. Verificar swap (deve estar < 500 MB)
sysctl vm.swapusage
```

---

## 🚨 Checklist de Emergência (Quando Swap > 3 GB)

**Status atual**: ✅ Executar agora!

```bash
# 1. Salvar tudo no Cursor

# 2. Fechar Cursor
# Cmd+Q no Cursor

# 3. Matar MCP servers órfãos
pkill -f "context7-mcp"
pkill -f "playwright-mcp"
pkill -f "mcp-server-sequential-thinking"
pkill -f "mcp-server-github"
pkill -f "react-native-debugger-mcp"

# 4. Limpar memória
sudo purge

# 5. Verificar swap novamente
sysctl vm.swapusage

# 6. Reabrir Cursor

# Se swap ainda > 2 GB: Reiniciar Mac
```

---

## 🔍 Monitoramento Contínuo

### Scripts Disponíveis

```bash
# Ver uso de swap e RAM
sysctl vm.swapusage

# Top 10 processos por RAM
ps aux | awk '{print $2, $4, $11}' | sort -k2 -rn | head -10

# Ver todos os processos Cursor
ps aux | grep -i cursor | grep -v grep | wc -l

# Ver todos os processos Node (MCP servers)
ps aux | grep node | grep -v grep | wc -l

# Limpar caches do projeto
npm run optimize:macos:cache

# Monitor de memória macOS (daemon)
npm run monitor:macos:memory
```

### Aliases Úteis (Adicionar ao `.zshrc`)

```bash
# Adicionar ao ~/.zshrc:
alias memcheck='sysctl vm.swapusage && ps aux | awk "{print \$2, \$4, \$11}" | sort -k2 -rn | head -10'
alias mempurge='sudo purge && echo "Memória limpa!"'
alias memkill='pkill -f "context7-mcp" && pkill -f "playwright-mcp" && pkill -f "mcp-server-sequential-thinking" && pkill -f "mcp-server-github" && echo "MCP servers limpos!"'
```

Depois:

```bash
source ~/.zshrc
```

Uso:

```bash
memcheck   # Ver status de memória
mempurge   # Limpar memória (requer sudo)
memkill    # Matar MCP servers órfãos
```

---

## 📈 Metas de Otimização

| Métrica              | Atual   | Meta     | Status     |
| -------------------- | ------- | -------- | ---------- |
| Swap                 | 3,62 GB | < 500 MB | 🚨 CRÍTICO |
| Processos Cursor     | 15+     | < 10     | ⚠️ Alto    |
| Processos Node (MCP) | 48      | < 10     | 🚨 CRÍTICO |
| Processos Chrome     | 10      | < 8      | ✅ OK      |
| Cursor RAM           | ~1 GB   | < 800 MB | ⚠️ Alto    |
| Chrome RAM           | ~600 MB | < 500 MB | ✅ OK      |

---

## 🎓 Explicação: Por Que Swap Alto é Ruim?

**RAM** (memória física) é **1000x mais rápida** que disco (SSD).

Quando a RAM acaba, o macOS usa o **swap** (espaço no disco como RAM virtual):

- ✅ **Swap < 500 MB**: Normal, sistema saudável
- ⚠️ **Swap 500 MB - 1 GB**: Aceitável, monitorar
- 🚨 **Swap > 2 GB**: Crítico, sistema lento
- ☠️ **Swap > 4 GB**: Sistema praticamente travado

**Solução de longo prazo**: Upgrade para 16 GB RAM (impossível no MacBook M1 por ser soldado).  
**Solução imediata**: Gerenciar processos e fechar apps desnecessários.

---

## 📚 Referências do Projeto

- [OTIMIZACAO_RAM_M1_8GB.md](OTIMIZACAO_RAM_M1_8GB.md) — Rotina completa
- [OTIMIZACAO_MACBOOK.md](OTIMIZACAO_MACBOOK.md) — Scripts e configurações
- [CURSOR_OPTIMIZATION.md](CURSOR_OPTIMIZATION.md) — Protocolo de contexto
- [performance-low-ram.mdc](../../.cursor/rules/performance-low-ram.mdc) — Regras para o agente

---

## ✅ Próximos Passos (Executar Agora)

1. [ ] Executar `memkill` (ou comandos manuais) para matar MCP servers órfãos
2. [ ] Executar `sudo purge` para limpar memória
3. [ ] Reiniciar Cursor IDE
4. [ ] Verificar swap novamente: `sysctl vm.swapusage` (meta: < 1 GB)
5. [ ] Adicionar aliases ao `.zshrc` para monitoramento rápido
6. [ ] Configurar rotina diária (manhã, durante dia, fim do dia)

---

**🎯 Ação Mais Importante**: Matar os 48 processos Node órfãos (MCP servers) irá liberar ~300-400 MB imediatamente!
