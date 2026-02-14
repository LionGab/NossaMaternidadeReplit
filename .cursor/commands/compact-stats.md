---
name: compact-stats
description: Mostra estatísticas de compactação
aliases: ["compacts", "stats"]
---

# Compact Stats

Exibe métricas sobre compactações automáticas realizadas pelo Claude Code.

## Uso

```bash
bash .claude/scripts/analyze-compacts.sh
```

## O Que Mostra

- **Total de compactações**: Quantas vezes autoCompact foi acionado
- **Últimos 7 dias**: Compactações na última semana
- **Última compactação**: Timestamp da última compactação
- **Hoje**: Compactações realizadas hoje
- **Top 5 dias**: Dias com mais compactações

## Interpretação

### Compactações Frequentes (>5 por dia)

Possíveis causas:

- Sessões muito longas (considerar `/clear` entre tarefas)
- Exploração excessiva de código (usar skills focados como `/verify`)
- Logs verbosos inflamando contexto

### Compactações Raras (<1 por dia)

Indica:

- Uso adequado de skills (economia de tokens)
- Sessões focadas e curtas
- Boa gestão de contexto

## Arquivos Relacionados

- `.claude/compact-metrics.jsonl` - Métricas em formato JSONL
- `.claude/decisions.log` - Log de decisões preservadas
- `.claude/hooks/pre-compact-metrics.sh` - Hook que coleta métricas

## Ver Também

- `/cost` - Exibe custo e tokens da sessão atual
- `/compact` - Força compactação manual
- `/clear` - Reset completo de contexto
