# Otimização de RAM - MacBook M1 8GB

## 🚨 Problema Identificado

Com apenas **8GB de RAM**, o sistema está usando **5.86GB de SWAP** (memória no disco), causando lentidão extrema.

**Swap alto = Sistema lento** porque disco é 1000x mais lento que RAM.

## 📊 Consumidores Principais de RAM

### 1. Cursor IDE (~2GB+)

- **Cursor Helper (Renderer)**: ~810MB
- **Cursor Helper (Plugin)**: múltiplos processos ~1GB+
- **Cursor principal**: ~493MB

**Solução**: Reiniciar o Cursor periodicamente libera ~2GB

### 2. Node.js / Expo (~1.18GB)

- Expo dev server rodando
- Múltiplos processos node (MCP servers, etc.)

**Solução**: Parar quando não estiver desenvolvendo

### 3. Simulador iOS (~395MB)

- App rodando no simulador

**Solução**: Fechar quando não estiver testando

### 4. Google Chrome (~270MB+)

- Abas abertas

**Solução**: Fechar ou usar Safari (mais leve)

## 🎯 Ações Imediatas

### Nível 1: Rápido (sem reiniciar nada)

```bash
# 1. Ver estado atual
npm run reduce:ram

# 2. Limpar memória comprimida
sudo purge

# 3. Fechar Chrome (se não estiver usando)
# 4. Fechar abas não utilizadas no Cursor
```

### Nível 2: Médio (parar processos)

```bash
# 1. Parar Expo dev server
# No terminal onde está rodando: Ctrl+C

# 2. Fechar simulador iOS
# Clicar em X no simulador

# 3. Limpar memória
sudo purge
```

### Nível 3: Agressivo (reiniciar Cursor)

```bash
# 1. Salvar tudo no Cursor
# 2. Fechar Cursor completamente
# 3. Reabrir Cursor
# 4. Limpar memória
sudo purge
```

## 📋 Checklist de Otimização

### ✅ Quando Começar a Trabalhar

- [ ] Fechar Chrome (se não precisar)
- [ ] Fechar outros apps não essenciais
- [ ] Verificar swap: `sysctl vm.swapusage`
- [ ] Se swap > 1GB: reiniciar Cursor

### ✅ Durante Desenvolvimento

- [ ] Manter apenas Expo dev server rodando (quando necessário)
- [ ] Fechar simulador iOS quando não estiver testando
- [ ] Fechar abas não utilizadas no Cursor
- [ ] Executar `sudo purge` a cada 2-3 horas

### ✅ Quando Sistema Estiver Lento

1. **Verificar swap**: `sysctl vm.swapusage`
2. **Se swap > 2GB**: Reiniciar Cursor
3. **Se swap > 3GB**: Reiniciar Mac (último recurso)
4. **Sempre**: Executar `sudo purge` após fechar apps

## 🔧 Comandos Úteis

```bash
# Ver uso de swap atual
sysctl vm.swapusage

# Ver processos consumindo mais RAM
ps aux | awk '{print $2, $4, $11}' | sort -k2 -rn | head -10

# Limpar memória comprimida
sudo purge

# Ver processos do Cursor
ps aux | grep -i cursor | grep -v grep

# Ver processos node
ps aux | grep node | grep -v grep

# Parar Expo dev server (se rodando em background)
pkill -f "expo start"
```

## 💡 Dicas de Uso Diário

### ✅ Fazer

- Manter apenas 2-3 apps pesados abertos
- Prioridade: Cursor > Terminal > (Chrome apenas quando necessário)
- Reiniciar Cursor uma vez por dia (manhã ou após almoço)
- Usar Safari ao invés de Chrome quando possível
- Fechar simulador iOS quando não estiver testando

### ❌ Evitar

- Chrome + Slack + Discord + Cursor simultaneamente
- Múltiplas abas não utilizadas no Cursor
- Deixar Expo dev server rodando quando não estiver desenvolvendo
- Deixar simulador iOS aberto quando não estiver testando
- Múltiplas instâncias do mesmo app

## 🎯 Meta de Swap

**Ideal**: < 500MB de swap
**Aceitável**: < 1GB de swap
**Crítico**: > 2GB de swap (sistema muito lento)

## 📱 Apps Leves vs Pesados

### ✅ Leves (usar quando possível)

- Safari (ao invés de Chrome)
- Terminal nativo (ao invés de iTerm2)
- VS Code (mais leve que Cursor, mas menos features)

### ⚠️ Pesados (usar com moderação)

- Cursor IDE (~2GB)
- Google Chrome (~300MB+ por aba)
- Slack (~200MB+)
- Discord (~150MB+)
- Simulador iOS (~400MB+)

## 🔄 Rotina Recomendada

### Manhã

1. Abrir apenas Cursor + Terminal
2. Verificar swap: `sysctl vm.swapusage`
3. Se swap > 1GB: reiniciar Mac

### Durante o Dia

1. Desenvolver: Cursor + Terminal + Expo
2. Testar: + Simulador iOS
3. Pesquisar: Safari (não Chrome)
4. A cada 2-3h: `sudo purge`

### Fim do Dia

1. Fechar tudo
2. `sudo purge`
3. Verificar swap: deve estar < 500MB

## 🚨 Emergência (Swap > 3GB)

```bash
# 1. Salvar tudo
# 2. Fechar TODOS os apps
# 3. Executar limpeza de emergência
npm run optimize:emergency

# 4. Se não resolver: Reiniciar Mac
```
