# .claude/ para MacBook 2020

> Como usar o sistema de agents/skills/hooks sem travar o Mac

---

## Problema Atual

O projeto tem **128 arquivos** em `.claude/`:
- 16 agents
- 8 skills
- 12 commands
- 24 rules
- 8 hooks
- Scripts Python/Shell

**Cada hook roda em CADA operação** → sobrecarga

---

## Solução: Hooks Condicionais

### Hooks que DEVEM estar desabilitados no MacBook 2020

```json
// .claude/settings.local.json (criar este arquivo)
{
  "hooks": {
    "PreToolUse": [], // DESABILITA validações antes de cada edit
    "PostToolUse": [], // DESABILITA auto-format (rodar manual)
    "UserPromptSubmit": [] // DESABILITA context gathering
  },
  "statusline": {
    "enabled": false // DESABILITA status line (economiza CPU)
  }
}
```

**Por quê?**:
- Cada edit → Python script valida → 2-3s delay
- Auto-format → ESLint/Prettier → 5-10s
- Status line → bash script a cada 10s → CPU usage

---

## Hooks Essenciais (manter)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session: $(date)' >> .claude/session.log"
          }
        ]
      }
    ]
  }
}
```

Apenas logging, zero overhead.

---

## Skills: Use Seletivamente

| Skill | MacBook 2020 | Cloud Agent |
|-------|--------------|-------------|
| `/deploy-testflight` | ✅ (cloud build) | ✅ |
| `/pre-commit` | ⚠️ Lento (2-3min) | ✅ Rápido |
| `/fix-types` | ⚠️ Lento | ✅ Rápido |
| `/verify` | ❌ Timeout (>5min) | ✅ |
| `/review` | ⚠️ Lento | ✅ |
| `/nathia` | ✅ (só leitura) | ✅ |
| `/gates` | ❌ Muito pesado | ✅ |

**Recomendação**: 
- Use skills apenas quando necessário
- Prefira comandos diretos: `npm run quality-gate`

---

## Agents: Desabilitar MCP para Performance

O projeto configura **Supabase MCP Server** e **Context7**:

```json
// .claude/settings.json
"mcp": {
  "servers": {
    "supabase": { ... }, // Roda processo Node.js constante
    "context7": { ... }   // Fetch documentação online
  }
}
```

**Para MacBook 2020**, criar `.claude/settings.local.json`:

```json
{
  "mcp": {
    "servers": {}  // DESABILITA todos os MCP servers
  }
}
```

**Por quê?**:
- MCP servers = processos Node.js rodando 24/7
- Supabase MCP = conexão DB constante
- Context7 = fetch documentação (rede + CPU)

**Alternativa**: Use quando realmente precisar:
```bash
# Temporário (apenas quando precisar de DB)
export SUPABASE_MCP_ENABLED=true
cursor .
```

---

## Commands: Prefer npm scripts

Em vez de `/build-ios` (loads markdown, parses, executes):

```bash
# Direto
npm run build:prod:ios
```

**Economia**: ~1-2s por comando.

---

## Rules: Simplificar

A pasta `rules/` tem 24 arquivos. Para MacBook 2020:

### Manter (essenciais)
- `always/00-nonnegotiables.mdc`
- `always/typescript-strict.mdc`
- `always/logging.mdc`

### Desabilitar (pesados)
- `always/build-standards.mdc` (complexo, só usar em builds)
- `backend/*` (quando não mexer em backend)
- `workflows/*` (workflow manual é melhor)

**Como desabilitar**: Renomear `.mdc` → `.mdc.disabled`

```bash
cd .claude/rules/workflows
mv bug-fixing.mdc bug-fixing.mdc.disabled
mv new-feature.mdc new-feature.mdc.disabled
```

---

## TL;DR - Setup Mínimo MacBook 2020

```bash
# 1. Criar config local
cat > .claude/settings.local.json << 'EOF'
{
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "UserPromptSubmit": []
  },
  "statusline": {
    "enabled": false
  },
  "mcp": {
    "servers": {}
  }
}
EOF

# 2. Desabilitar rules pesadas
cd .claude/rules/workflows
mv bug-fixing.mdc bug-fixing.mdc.disabled
mv new-feature.mdc new-feature.mdc.disabled

# 3. Verificar
ls -lh .claude/settings.local.json
```

---

## Quando Re-habilitar

**Em desktop potente** ou **CI/CD**:
```bash
# Remove override local
rm .claude/settings.local.json

# Reabilita rules
cd .claude/rules/workflows
mv *.disabled *.mdc 2>/dev/null
```

---

## Filosofia

> MacBook 2020 é como um sedan: eficiente para cidade (edição), ruim para corrida (builds).
> Configure para o que ele faz bem, delegue o resto para cloud.

