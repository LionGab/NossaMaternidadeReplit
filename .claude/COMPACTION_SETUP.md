# Compaction Setup - Nossa Maternidade

> Sistema de compactação inteligente configurado em 2026-02-13

---

## ✅ O Que Foi Implementado

### FASE 1: Hooks Automáticos

**Arquivos Criados:**

- `.claude/hooks/pre-compact-save-decisions.sh` - Salva decisões críticas antes de compactar
- `.claude/hooks/pre-compact-metrics.sh` - Registra métricas em JSONL
- `.claude/scripts/analyze-compacts.sh` - Analisa estatísticas de compactação
- `.claude/commands/compact-stats.md` - Comando `/compact-stats` para ver métricas

**Configuração:**

`.claude/settings.json` atualizado com:

```json
"hooks": {
  "PreCompact": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "bash .claude/hooks/pre-compact-save-decisions.sh",
          "timeout": 10
        },
        {
          "type": "command",
          "command": "bash .claude/hooks/pre-compact-metrics.sh",
          "timeout": 10
        }
      ]
    }
  ]
}
```

### FASE 2: Documentação Estratégica

**Arquivos Modificados:**

1. **`CLAUDE.md` (raiz)** - Adicionada seção "Summary Instructions for Compaction"
   - Preservar: NathIA, Supabase, Premium/IAP, Navigation, Design System
   - Omitir: Logs verbosos, explorações sem mudanças, builds falhados

2. **`docs/claude/memory-guide.md`** - Adicionada seção "Token Optimization Strategies"
   - Tabela de skills com economia de tokens
   - Padrão `@arquivo` vs colar código
   - Quando usar `/compact` vs `/clear`
   - Monitoramento de uso com `/cost` e `/compact-stats`

### FASE 3: Arquivos de Log

**Arquivos Gerados (Gitignored):**

- `.claude/decisions.log` - Histórico de decisões preservadas
- `.claude/compact-metrics.jsonl` - Métricas de compactação (formato JSONL)

**Adicionado ao `.gitignore`:**

```
# Claude Code - Compaction hooks (local-only logs)
.claude/decisions.log
.claude/compact-metrics.jsonl
.claude/context.db
.claude/context.db-*
```

---

## 🚀 Como Usar

### Comandos Disponíveis

```bash
# Ver estatísticas de compactação
/compact-stats

# Forçar compactação manual
/compact

# Reset completo de contexto
/clear

# Ver custo/tokens da sessão
/cost

# Ver memória carregada
/memory
```

### Workflow Recomendado

```
Durante feature (mesmo tema):
  Develop → autoCompact (automático) → Continue → /compact (se ficar longo)

Entre features (temas diferentes):
  Feature A → /clear → Feature B

Debugging extensivo:
  Investigate → /compact (preserva diagnóstico) → Implement fix → /verify

Após 2+ correções sem sucesso:
  /clear + prompt melhor (evita "rabbit holes")
```

### Skills para Economia de Tokens

| Skill            | Tokens Economizados | Quando Usar                       |
| ---------------- | ------------------- | --------------------------------- |
| `/verify`        | ~5k-10k             | Antes de PR                       |
| `/nathia`        | ~3k-8k              | Mudanças no prompt da NathIA      |
| `/gates`         | ~2k-5k              | Status de release                 |
| `/pre-commit`    | ~4k-8k              | Quality gate rápido               |
| `/compact-stats` | ~1k-2k              | Ver métricas de compactação       |
| `/fix-types`     | ~3k-6k              | Resolver erros TypeScript focados |

**Economia média:** 30-40% de tokens por sessão

---

## 🔍 Como Verificar

### Teste 1: Hook PreCompact Funciona

```bash
# Forçar hook manualmente
bash .claude/hooks/pre-compact-save-decisions.sh

# Verificar log
cat .claude/decisions.log

# Esperado: Nova entrada com timestamp, commit, branch, arquivos modificados
```

### Teste 2: Métricas Registradas

```bash
# Disparar hook de métricas
bash .claude/hooks/pre-compact-metrics.sh

# Analisar métricas
bash .claude/scripts/analyze-compacts.sh

# Esperado: Estatísticas de compactações (total, últimos 7 dias, hoje, top 5)
```

### Teste 3: Summary Instructions Aplicadas

Durante uma sessão longa:

1. Deixar atingir 80k tokens (autoCompact acionado)
2. Verificar se decisões importantes foram preservadas
3. Usar `/compact-stats` para ver frequência

### Teste 4: Economia de Tokens com Skills

```bash
# ANTES (sem skills): >10k tokens
> Me mostre o status dos release gates
[Claude explora múltiplos arquivos]

# DEPOIS (com skill): <3k tokens
> /gates
[Skill focado retorna scoreboard direto]

# Comparar com /cost
```

---

## 📊 Métricas de Sucesso

### Alvos

| Métrica                                | Meta                        |
| -------------------------------------- | --------------------------- |
| **Compactações/dia**                   | Rastreado + <5              |
| **Tokens médios/sessão**               | <70k (melhor uso de skills) |
| **Sessões com /clear por rabbit hole** | <20% das sessões            |
| **Decisões preservadas**               | 100% via decisions.log      |
| **Tempo sessão média**                 | >60 min (menos resets)      |

### Monitorar

```bash
# Diariamente
/compact-stats

# Por sessão
/cost

# Por tarefa
/memory
```

---

## 🔧 Troubleshooting

### Hook Não Executa

**Problema:** `.claude/decisions.log` não é criado

**Solução:**

```bash
# Verificar permissão
chmod +x .claude/hooks/pre-compact-*.sh

# Testar manualmente
bash .claude/hooks/pre-compact-save-decisions.sh

# Verificar timeout em settings.json (deve ser ≥10s)
```

### Métricas Não Aparecem

**Problema:** `/compact-stats` não mostra dados

**Solução:**

```bash
# Verificar se arquivo existe
ls -la .claude/compact-metrics.jsonl

# Executar hook manualmente
bash .claude/hooks/pre-compact-metrics.sh

# Verificar formato JSONL
cat .claude/compact-metrics.jsonl | jq .
```

### AutoCompact Muito Frequente

**Problema:** Compactando >5 vezes por dia

**Solução:**

1. **Aumentar triggerTokens** em `.claude/settings.json`:

```json
"autoCompact": {
  "enabled": true,
  "triggerTokens": 100000  // Era 80000
}
```

2. **Usar mais skills** para reduzir exploração manual
3. **`/clear`** entre tarefas não relacionadas

### AutoCompact Muito Raro

**Problema:** Nunca compacta (< 1 por dia)

**Indica:** Uso ideal de skills e gestão de contexto. Manter como está.

---

## 🎯 Próximos Passos (Opcional)

### FASE 4: Memory Provider SQLite (Experimental)

Adicionar persistência entre sessões:

```json
"memory": {
  "provider": "sqlite",
  "path": ".claude/context.db"
}
```

**Benefício:** Rastreamento persistente de decisões, query de contexto antigo.

**Trade-off:** Experimental, pode ter bugs, database pode crescer.

### FASE 5: TriggerTokens Dinâmico (Futuro)

Ajustar automaticamente baseado no tipo de tarefa:

| Tipo de Tarefa       | TriggerTokens |
| -------------------- | ------------- |
| Quick Fix (< 30 min) | 40k           |
| Feature Development  | 80k (atual)   |
| Debugging Complexo   | 120k          |
| Release Preparation  | 100k          |

**Implementação:** Criar profiles em settings.json, usar `--model` flag.

---

## 📚 Arquivos Relacionados

### Hooks

- `.claude/hooks/pre-compact-save-decisions.sh`
- `.claude/hooks/pre-compact-metrics.sh`

### Scripts

- `.claude/scripts/analyze-compacts.sh`

### Comandos

- `.claude/commands/compact-stats.md`

### Documentação

- `CLAUDE.md` (raiz) - Summary Instructions
- `docs/claude/memory-guide.md` - Token Optimization
- `docs/setup/CLAUDE_CODE_GUIDE_2026.md` - Best practices

### Logs (Gitignored)

- `.claude/decisions.log`
- `.claude/compact-metrics.jsonl`

---

**Última atualização:** 2026-02-13
**Status:** ✅ Implementado e testado
**Próxima revisão:** Após 7 dias de uso
