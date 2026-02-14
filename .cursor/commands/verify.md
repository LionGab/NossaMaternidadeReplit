---
description: "Executa npm run quality-gate (tsc + eslint + build check + scan de console.log)."
---

# ✅ Verify (Quality Gate)

Executa a verificação completa de qualidade de código do projeto, garantindo que nada quebre os padrões antes de um commit ou build.

## O que faz?

Quando você executa `/verify`, o Claude irá rodar o script **quality-gate** do projeto, que por sua vez inclui:

1. **TypeScript** – Compilação com `tsc --noEmit` (checa erros de tipo).
2. **ESLint** – Linter para achar violações de estilo e práticas (incluindo uso de `any`, `console.log`, etc.).
3. **Build Check** – Valida as configurações do Expo e EAS (assegura que `app.config.js` e `eas.json` não têm erros).
4. **Console Log Scan** – Busca qualquer `console.log` residual no código (não permitido).

Em resumo, `/verify` é o "garante que está tudo certo". Se alguma etapa falhar, os detalhes do erro serão exibidos na saída para que você corrija.

## Execução

```bash
/verify  # roda npm run quality-gate
```

## Exemplo de Uso

Antes de abrir um PR:

```
/verify
```

🔍 Rodando Quality Gate...
✅ TypeScript: nenhum erro.
✅ ESLint: passou.
✅ Build check: ok.
✅ Logs: nenhum console.log encontrado.

Se houvesse erros, eles apareceriam, por exemplo:

```
❌ TypeScript: 3 erros encontrados (ver detalhes acima).
❌ ESLint: uso de 'any' detectado em 2 arquivos.
```

Então você saberia acionar o agente @type-checker ou corrigir conforme necessário.
