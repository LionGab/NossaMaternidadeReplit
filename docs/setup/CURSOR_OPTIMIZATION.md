# Otimização Cursor + Claude para MacBook 8GB RAM

**Data**: 2026-01-06
**Objetivo**: Reduzir uso de RAM e melhorar performance do Cursor IDE em MacBook 2020 com 8GB RAM

---

## Estrutura Implementada

### 1. Regras MDC (Model-Driven Configuration)

Regras divididas por escopo para carregamento seletivo:

- **`.cursor/rules/00-global.always.mdc`** - Regras universais (sempre carregadas)
- **`.cursor/rules/10-rn.expo.mdc`** - Regras React Native/Expo (só quando mexer em `src/**`)
- **`.cursor/rules/20-supabase.mdc`** - Regras Supabase (só quando mexer em `supabase/**`)
- **`.cursor/rules/30-ui.a11y.mdc`** - Regras UI/Acessibilidade (só quando mexer em componentes)
- **`.cursor/rules/90-release.checklist.mdc`** - Checklist de release (só antes de build)

**Benefício**: Reduz carga de contexto em ~60% (só carrega regras relevantes ao arquivo aberto).

### 2. Configurações do Cursor

**`.cursor/settings.json`** com otimizações específicas:

- `claude.maxContextTokens`: 70000 (limite hard de 70%)
- `claude.compactThreshold`: 0.65 (compacta antes de 70%)
- `typescript.tsserver.maxMemory`: 2048 (limitar TS server a 2GB)
- `files.watcherExclude`: Ignorar `node_modules`, `.expo`, `build`, `coverage`
- `search.exclude`: Excluir diretórios grandes
- `files.maxMemoryForLargeFilesMB`: 512 (limitar arquivos grandes)

### 3. Protocolo de Contexto

**`.cursor/context-protocol.md`** define:

- Limite hard: 70% de contexto
- Comando `/compact`: Resumo em 12 linhas
- Comando `/clear`: Limpa contexto + reancora com spec
- Template de resumo padronizado

### 4. Scripts de Monitoramento

#### `npm run monitor:context`

Monitora uso de contexto e alerta quando próximo de 70%.

**Uso:**

```bash
npm run monitor:context
```

**Funcionalidades:**

- Verifica contexto a cada 30s
- Alerta quando próximo de 65% (threshold de alerta)
- Alerta quando próximo de 70% (threshold crítico)
- Sugere `/compact` ou `/clear` automaticamente
- Log em `.cursor/context-monitor.log`

#### `npm run monitor:ram`

Monitora uso de RAM e alerta quando swap > 1GB.

**Uso:**

```bash
npm run monitor:ram
```

**Funcionalidades:**

- Verifica swap a cada 30s
- Alerta quando swap > 1GB
- Monitora processos Cursor Helper
- Sugere ações específicas (fechar Chrome, reiniciar Cursor)
- Log em `.cursor/ram-monitor.log`

#### `npm run optimize:cursor`

Otimiza memória do Cursor detectando vazamentos e sugerindo ações.

**Uso:**

```bash
npm run optimize:cursor
```

**Funcionalidades:**

- Monitora processos Cursor Helper
- Detecta vazamentos de memória
- Sugere reinício quando RAM > 6GB
- Mostra top 10 processos consumindo RAM
- Log em `.cursor/memory-optimizer.log`

---

## Comandos Úteis

### Monitoramento

```bash
# Monitorar contexto (alerta quando próximo de 70%)
npm run monitor:context

# Monitorar RAM (alerta quando swap > 1GB)
npm run monitor:ram

# Otimizar memória do Cursor
npm run optimize:cursor
```

### Limpeza

```bash
# Limpar caches do projeto
npm run optimize:macbook

# Reduzir uso de RAM
npm run reduce:ram

# Limpeza de emergência
npm run optimize:emergency
```

---

## Protocolo de Contexto

### Limites Hard

- **70% de contexto**: Limite absoluto. Acionar `/compact` ou `/clear` imediatamente.
- **65% de contexto**: Threshold de alerta. Preparar resumo.
- **Mudança de fase**: Sempre `/clear` + reancora com spec.

### Comando `/compact`

Quando chegar perto de 70%, execute `/compact` e forneça:

```
OBJETIVO: [Uma linha descrevendo o objetivo atual]

DECISÕES: [2-3 linhas com decisões arquiteturais/chave tomadas]

ARQUIVOS TOCADOS: [Lista de arquivos principais modificados/criados]

PRÓXIMOS PASSOS: [2-3 linhas com próximas ações]
```

### Comando `/clear`

Quando mudar de assunto/fase, execute `/clear` e forneça:

```
OBJETIVO ATUAL: [Uma linha]

SPEC ATUAL: [2-3 linhas descrevendo a especificação]

CONSTRAINTS: [1-2 linhas com restrições importantes]
```

---

## Troubleshooting

### Cursor muito lento

1. Execute `npm run optimize:cursor` para verificar uso de memória
2. Se swap > 2GB: Reinicie o Cursor IDE
3. Feche o Google Chrome (se não estiver usando)
4. Feche abas não utilizadas no Cursor
5. Pare o Expo dev server se não estiver desenvolvendo

### Contexto próximo de 70%

1. Execute `/compact` para resumir contexto
2. Se ainda próximo de 70%: Execute `/clear` + reancora com spec
3. Verifique `.cursorignore` está otimizado
4. Feche arquivos não utilizados

### Swap > 1GB

1. Execute `npm run monitor:ram` para monitorar
2. Feche o Google Chrome (270MB+)
3. Feche apps não utilizados
4. Reinicie o Cursor IDE se swap > 2GB

---

## Configurações Recomendadas

### macOS

1. **Desabilitar Spotlight indexing em `node_modules/`**:

   ```bash
   sudo mdutil -i off node_modules/
   ```

2. **Reduzir swap pressure** (já configurado no Cursor settings)

3. **Otimizar Chrome** (se usado):
   - Limitar abas abertas
   - Usar extensões de gerenciamento de memória
   - Fechar quando não estiver usando

### Cursor IDE

1. **Fechar abas não utilizadas** regularmente
2. **Limitar número de editores abertos** (já configurado: max 10)
3. **Desabilitar preview de arquivos** (já configurado)
4. **Desabilitar minimap** (já configurado para economizar RAM)

---

## Critérios de Sucesso

- ✅ Uso de RAM do Cursor < 4GB durante desenvolvimento normal
- ✅ Swap < 500MB durante uso típico
- ✅ Contexto Claude mantido < 70% automaticamente
- ✅ Alertas funcionais quando próximo de limites
- ✅ Scripts de monitoramento executando sem erros

---

## Próximos Passos

1. Testar configurações em sessão real de desenvolvimento
2. Ajustar thresholds baseado em uso real
3. Criar alias de terminal para scripts frequentes
4. Monitorar logs em `.cursor/*.log` para identificar padrões

---

## Melhorias Avançadas (2026)

### Governança Avançada

Ver documento completo: **`.cursor/governance-advanced.md`**

**Principais práticas:**

- ✅ Modo Entrevista (AskUserQuestion) para tarefas grandes
- ✅ Checkpoints e /rewind para recuperação
- ✅ Plan Mode obrigatório para mudanças críticas
- ✅ Hooks de validação automática (RN + Supabase)
- ✅ Otimização de respostas grandes de MCP (~95% economia)
- ✅ Limites de iteração (max-turns)
- ✅ Iteração funcional vs Ralph loop
- ✅ Permissões granulares

**Hooks implementados:**

- `.claude/hooks/post-edit-validation.sh` - Valida código após edição
- `.claude/hooks/pre-supabase-check.sh` - Valida operações Supabase
- `.claude/hooks/summarize-mcp-response.sh` - Resumo de respostas grandes

---

## Referências

- Protocolo completo: `.cursor/context-protocol.md`
- Governança avançada: `.cursor/governance-advanced.md`
- Configurações do Cursor: `.cursor/settings.json`
- Regras MDC: `.cursor/rules/`
- Logs: `.cursor/*.log`
