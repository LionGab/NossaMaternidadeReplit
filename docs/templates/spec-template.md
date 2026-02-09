# Spec: [Nome da Feature]

> Template de especificação para features não-triviais.

---

## Resumo

**Objetivo**: [O que esta feature faz em 1-2 frases]

**Solicitante**: [Nome/contexto de quem pediu]

**Data**: [YYYY-MM-DD]

---

## Contexto

### Problema

[Descreva o problema que esta feature resolve]

### Motivação

[Por que isso é importante agora?]

---

## Escopo

### O que ESTÁ incluído

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### O que NÃO está incluído (explicitamente)

- Item fora do escopo 1
- Item fora do escopo 2

---

## Requisitos

### Funcionais

1. [Requisito funcional 1]
2. [Requisito funcional 2]
3. [Requisito funcional 3]

### Não-Funcionais

- **Performance**: [ex: carregamento < 2s]
- **Acessibilidade**: [ex: tap target 44pt, labels]
- **Segurança**: [ex: RLS habilitado]

---

## Design Técnico

### Arquivos Afetados

```
src/screens/[Tela].tsx       # Nova tela / modificação
src/components/[Comp].tsx    # Novo componente
src/hooks/use[Hook].ts       # Novo hook
src/state/store.ts           # Mudanças no state
```

### Componentes Novos

| Componente | Responsabilidade |
| ---------- | ---------------- |
| `[Nome]`   | [O que faz]      |

### Estado (Zustand)

```typescript
interface [Feature]State {
  // Props
  // Actions
}
```

### API/Backend (se aplicável)

```
POST /api/[endpoint]
Body: { ... }
Response: { ... }
```

---

## Decisões de Design

### Decisão 1: [Título]

**Opções consideradas:**

1. Opção A — [pros/cons]
2. Opção B — [pros/cons]

**Escolha**: Opção [X]

**Justificativa**: [Por que esta opção]

---

## Riscos e Mitigações

| Risco     | Probabilidade    | Impacto          | Mitigação      |
| --------- | ---------------- | ---------------- | -------------- |
| [Risco 1] | Alta/Média/Baixa | Alto/Médio/Baixo | [Como mitigar] |

---

## Testes

### Cenários de Teste

1. [Cenário happy path]
2. [Cenário edge case]
3. [Cenário de erro]

### Como Testar Manualmente

1. Passo 1
2. Passo 2
3. Verificar resultado esperado

---

## Checklist Pré-Implementação

- [ ] Escopo aprovado
- [ ] Design técnico revisado
- [ ] Riscos avaliados
- [ ] Padrões existentes verificados (investigar antes de agir)

---

## Aprovação

| Papel       | Nome | Data | Status   |
| ----------- | ---- | ---- | -------- |
| Solicitante |      |      | Pendente |
| Tech Lead   |      |      | Pendente |

---

## Notas

[Observações adicionais, links úteis, referências]
