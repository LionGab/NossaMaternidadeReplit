# 📊 Visualização: Linha de Status Personalizada

## Saída do Script

Quando você roda `.\.claude\scripts\status-line.ps1`, a saída será algo como:

```
@ Claude 3.5 Sonnet | ████████████░░░░░░░░░░░░░░ 60% | [feature-nathia] | [NossaMaternidade]
```

### Breakdown Visual

```
┌─────────────────┬───────────────────────────────────┬──────────────────┬────────────────────┐
│      MODEL      │          TOKEN USAGE              │   GIT BRANCH     │    PROJECT NAME    │
├─────────────────┼───────────────────────────────────┼──────────────────┼────────────────────┤
│ @ Claude 3.5    │ ████████████░░░░░░░░░░░░░░ 60%  │ [feature-nathia] │ [NossaMaternidade] │
│   Sonnet        │ ▲                                 │ ▲                │ ▲                  │
│   (Cyan/Bold)   │ Barra Progresso                   │ Branch Git       │ Pasta do Projeto   │
│                 │ (Verde 0-50%                      │ (Magenta)        │ (Amarelo/Dimmed)   │
│                 │  Amarelo 50-75%                   │                  │                    │
│                 │  Vermelho 75%+)                   │                  │                    │
└─────────────────┴───────────────────────────────────┴──────────────────┴────────────────────┘
```

---

## Exemplos Reais

### Contexto Seguro (Verde)

```
@ Claude 3.5 Sonnet | ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░ 30% | [main] | [NossaMaternidade]
                      ^^^^^^^^^^
                      ✅ Seguro, apenas 30%
```

**O que fazer**: Continue trabalhando normalmente.

---

### Contexto em Aviso (Amarelo)

```
@ Claude 3.5 Sonnet | ████████████████░░░░░░░░░░░░░░░░░░░░░░░ 65% | [feature-oauth] | [NossaMaternidade]
                      ^^^^^^^^^^^^^^^^^^
                      ⚠️  Cuidado, 65% usado
```

**O que fazer**: Considere rodar `/compact` para optimizar contexto, ou prepare para `/clear` se precisar.

---

### Contexto Crítico (Vermelho)

```
@ Claude 3.5 Sonnet | ███████████████████████████████████░░░░░░░░░░░░░░░░░░░ 80% | [main] | [NossaMaternidade]
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                      🔴 CRÍTICO, 80% usado
```

**O que fazer**:

1. Rodar `/compact` imediatamente
2. Se não funcionar, rodar `/clear`
3. Se contexto crítico, considerar começar novo chat

---

## Sequência de Cores ao Longo do Tempo

```
Início de Sessão:
@ Claude 3.5 Sonnet | █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 5% | [main] | [NossaMaternidade]
                      (Verde)

Após 30 min de leitura:
@ Claude 3.5 Sonnet | ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░ 30% | [main] | [NossaMaternidade]
                      (Verde)

Após 2 horas de trabalho:
@ Claude 3.5 Sonnet | █████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░ 45% | [feature-nathia] | [NossaMaternidade]
                      (Verde)

Após muita exploração de código:
@ Claude 3.5 Sonnet | ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 62% | [feature-nathia] | [NossaMaternidade]
                      (Amarelo) ⚠️

Próximo ao limite:
@ Claude 3.5 Sonnet | ███████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 78% | [main] | [NossaMaternidade]
                      (Vermelho) 🔴
```

---

## Branch Diferentes

### Situação: Múltiplas Worktrees Abertas

```
Terminal 1:
@ Claude 3.5 Sonnet | ██████████░░░░░░░░░░░░░░░░░░ 40% | [main] | [NossaMaternidade]

Terminal 2:
@ Claude 3.5 Sonnet | █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25% | [feature-auth] | [feature-auth]

Terminal 3:
@ Claude 3.5 Sonnet | ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 35% | [feature-oauth] | [feature-oauth]
```

**Benefício**: Evita confundir qual terminal está qual branch! 🎯

---

## Modo Debug (-Debug)

Se algo estiver errado, use:

```powershell
.\.claude\scripts\status-line.ps1 -Debug
```

Output exemplo:

```
[WARN] Context warning: No context file found, using default 0%
@ Claude 3.5 Sonnet | ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% | [main] | [NossaMaternidade]
```

---

## Modo JSON (-ShowJson)

Para programação ou automação:

```powershell
.\.claude\scripts\status-line.ps1 -ShowJson
```

Output:

```json
{
  "model": "Claude 3.5 Sonnet",
  "context": {
    "percentUsed": 45,
    "tokensMax": 200000
  },
  "branch": "feature-nathia",
  "project": "NossaMaternidade",
  "timestamp": "2025-01-24T15:30:45Z"
}
```

**Use case**: Alertas automáticos se `percentUsed > 80`

---

## Com Alias PowerShell

Após configurar alias `status`:

```powershell
> status
@ Claude 3.5 Sonnet | ██████████░░░░░░░░░░░░░░░░░░ 40% | [main] | [NossaMaternidade]

> status -Debug
[WARN] Git warning: some issue
@ Claude 3.5 Sonnet | ██████████░░░░░░░░░░░░░░░░░░ 40% | [main] | [NossaMaternidade]

> status -ShowJson
{
  "model": "Claude 3.5 Sonnet",
  ...
}
```

---

## Integração no Shell Profile (Auto-Run)

Quando você abre um terminal novo:

```
Terminal aberto...

(Executa script automaticamente)

@ Claude 3.5 Sonnet | ██████████░░░░░░░░░░░░░░░░░░ 40% | [main] | [NossaMaternidade]

❯ (Seu prompt aqui)
```

---

## Legenda de Cores

| Cor                 | Significado | Uso                                 |
| ------------------- | ----------- | ----------------------------------- |
| 🟢 Verde            | 0-49%       | ✅ Seguro, trabalhe normalmente     |
| 🟡 Amarelo          | 50-74%      | ⚠️ Cuidado, prepare para `/compact` |
| 🔴 Vermelho         | 75%+        | 🛑 Crítico, considere `/clear`      |
| 🔵 Azul             | Percentual  | Informação                          |
| 🟣 Magenta          | Branch      | Navegação                           |
| 🟨 Amarelo (Dimmed) | Projeto     | Contexto                            |

---

**Status**: ✅ Implementado e testado no projeto Nossa Maternidade!

Próximo passo: Configure o alias no seu PowerShell profile para usar `status` em qualquer lugar.
