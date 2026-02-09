---
description: "Roda npm run typecheck (tsc --noEmit) para validar tipagem estrita."
---

# 📝 Typecheck (TypeScript)

Compila o projeto usando o TypeScript para detectar erros de tipagem sem gerar arquivos.

## Descrição

Ao rodar `/typecheck`, o Claude executa `npm run typecheck` (equivalente a `tsc --noEmit`). Isso percorre todos os arquivos `.ts` e `.tsx` no projeto e lista quaisquer erros do compilador TypeScript, como:

- Tipos incompatíveis
- Propriedades faltantes ou em excesso
- Usos indevidos de `any` (modo estrito)
- Quebras de contrato de interface

Esse comando **não modifica nenhum arquivo**, apenas coleta os erros de tipo.

## Execução

```bash
/typecheck  # roda npm run typecheck
```

## Exemplo de Uso

Durante o desenvolvimento de uma feature, você pode rodar:

```
/typecheck
```

Saída típica quando há erro:

```
src/screens/ProfileScreen.tsx:120:15 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.
Found 1 error.
```

Se nenhum erro for encontrado:

```
👍 No type errors found!
```

Use este comando frequentemente para manter o código sem erros de compilação.
