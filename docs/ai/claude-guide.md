# Claude Code — Guia rápido (on-demand)

Este arquivo é consulta manual (não carregado automaticamente). Use quando precisar de detalhes de agentes/MCP/comandos.

## Agentes e comandos

- Agentes mapeados em `.claude/agents/*.md` (design-ui, performance, database, mobile-deployer, code-reviewer, component-builder, type-checker, release-helper).
- Slash commands em `.claude/commands/*.md` (/verify, /typecheck, /test, /fix-lint, /build-eas, etc.).

## Configuração

- `claude.md` root = regras núcleo; memórias por subtree em `src/CLAUDE.md` e `supabase/CLAUDE.md`.
- Governança IA: `docs/AI_GOVERNANCE.md` e `docs/AI_SKILLS_GUIDE.md`.
- Settings em `.claude/settings.json` (autoCompact, MCPs, hooks, permissões).
- `.mcp-config.json` define MCPs extras do projeto.

## Boas práticas

- Sempre rodar `npm run quality-gate` antes de PR/build.
- Sem `console.log`; usar `logger.*`.
- Sem hardcoded colors; usar tokens/NativeWind.
- Sem `any`/`@ts-ignore` injustificado; preferir `unknown` + guards.

## Consulta pontual

- RN/Expo/NativeWind/TS: veja `src/CLAUDE.md`.
- Supabase/RLS/edge: veja `supabase/CLAUDE.md`.
- Fluxos longos, tutoriais e histórico: mantenha em `docs/` e referencie apenas quando necessário.

---

## Gestão de Contexto — Regra dos 70%

O modelo degrada significativamente quando a janela de contexto ultrapassa ~70%. Acima disso, aumentam confusões, alucinações e tentativas de encerrar tarefas prematuramente.

### Comandos essenciais

| Comando    | Função                                                     |
| ---------- | ---------------------------------------------------------- |
| `/compact` | Resume histórico (preserva decisões, descarta verbosidade) |
| `/clear`   | Reset completo (use após finalizar etapa)                  |
| `/rewind`  | Retrocede para estado anterior                             |

### Quando usar

- **Compactar** (`/compact`): Ao atingir ~60-70% do contexto, ou quando notar respostas mais confusas
- **Limpar** (`/clear`): Ao iniciar nova fase, módulo diferente, ou quando o histórico não é mais relevante
- **Rebobinar** (`/rewind`): Ao perceber caminho errado ou querer desfazer últimas interações

### Checkpoints externos

Para tarefas longas, persista decisões importantes fora do contexto:

1. **NOTES.md** — Arquivo temporário com decisões e conclusões parciais
2. **SPEC.md** — Especificação gerada após entrevista (ver seção abaixo)
3. **Comentários no código** — Para decisões arquiteturais críticas

Após `/clear`, reintroduza manualmente o resumo se necessário.

### Sinais de degradação

- Modelo tenta encerrar tarefas antes de completar
- Respostas repetitivas ou fora de contexto
- Esquece decisões tomadas anteriormente
- Gera código inconsistente com padrões já estabelecidos

---

## Modo Entrevista — "Interview First, Spec depois, Code por último"

Workflow para tarefas complexas que reduz drasticamente retrabalho e suposições incorretas.

### Fluxo de trabalho

```
1. Prompt mínimo + pedido de entrevista
2. Claude pergunta via AskUserQuestion (clarifica requisitos)
3. Especificação gerada com base nas respostas
4. Revisão e ajuste da spec
5. Código implementado seguindo a spec
```

### Exemplo de prompt inicial

```
Quero implementar [feature X]. Por favor, me entreviste para construir
a especificação antes de começar a codificar.
```

### Perguntas típicas do Claude

- Qual método/abordagem você prefere? (opções)
- Quais integrações são necessárias?
- Como deve se comportar em casos de erro?
- Existem restrições de performance/UX?

### Quando usar

| Cenário                               | Usar Entrevista? |
| ------------------------------------- | ---------------- |
| Feature nova com múltiplas abordagens | Sim              |
| Refatoração com impacto arquitetural  | Sim              |
| Integração com serviço externo        | Sim              |
| Bug fix simples e localizado          | Não              |
| Typo ou ajuste de estilo              | Não              |

### Benefícios

- **Evita suposições**: Claude pergunta em vez de adivinhar
- **Documenta decisões**: A spec serve como registro do "porquê"
- **Código alinhado**: Implementação correta de primeira
- **Reduz retrabalho**: Menos ciclos de "não era isso que eu queria"

---

## Referências

- [Claude Code Handbook - Context Management](https://nikiforovall.blog/claude-code-rules/fundamentals/manage-context/)
- [AskUserQuestion Tool Guide](https://www.atcyrus.com/stories/claude-code-ask-user-question-tool-guide)
- Governança interna: `docs/AI_GOVERNANCE.md`
