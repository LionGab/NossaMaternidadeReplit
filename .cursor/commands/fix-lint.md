---
description: "Roda npm run lint:fix e formata com Prettier para limpar estilo."
---

# 🔧 Fix Lint & Format

Aplica correções automáticas de lint e formatação de código em todo o projeto.

## O que faz?

`/fix-lint` executa dois passos em sequência:

1. **ESLint --fix**: Corrige problemas simples conforme regras do projeto.
2. **Prettier**: Formata arquivos para o padrão definido.

## Execução

```bash
/fix-lint  # roda npm run lint:fix e, se necessário, npm run format
```

## Exemplo de Uso

```
✅ ESLint fixes applied.
✅ Prettier reformatted files.
```

Use depois de grandes edições para limpar o estilo. Sempre revise o diff.
