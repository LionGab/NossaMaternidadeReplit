---
description: "Roda npm run test (Jest com preset Expo) para toda a suíte."
---

# 🧪 Run Tests (Jest)

Roda a suíte de testes do projeto para garantir que todas as funcionalidades permanecem com comportamento esperado.

## O que faz?

Ao invocar `/test`, o Claude executa `npm run test` (Jest com preset do Expo). Isso:

- Executa todos os arquivos `*.test.ts` e `*.test.tsx`
- Usa o preset `jest-expo` para lidar com React Native/Expo
- Retorna quantos testes passaram/falharam e detalhes de falhas

## Execução

```bash
/test  # roda npm run test
```

## Exemplo de Saída

```
 PASS  src/utils/logger.test.ts
 PASS  src/components/ui/__tests__/AnimatedBadge.test.tsx
 FAIL  src/screens/LoginScreen.test.tsx (5 tests, 1 failed)
  ✕ should display error on invalid email
```

Use essa saída para corrigir o código ou o teste e rodar novamente até tudo passar.
