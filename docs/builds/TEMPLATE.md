# Build Checkpoint: {YYYY-MM-DD}-{platform}-{profile}

## Metadata

| Campo        | Valor                              |
| ------------ | ---------------------------------- |
| Data         | {YYYY-MM-DD HH:MM}                 |
| Plataforma   | iOS / Android / Ambos              |
| Profile      | development / preview / production |
| Branch       | {branch-name}                      |
| Objetivo     | {descrição curta}                  |
| Build ID EAS | {id ou "N/A"}                      |
| Auto-submit  | Sim / Não                          |

## Pre-Build Interview

1. **Plataforma**: {resposta}
2. **Profile**: {resposta}
3. **Auto-submit**: {resposta}
4. **Branch + Objetivo**: {resposta}

## Quality Gate Results

| Check                       | Status    | Observação |
| --------------------------- | --------- | ---------- |
| TypeScript (`tsc --noEmit`) | PASS/FAIL |            |
| ESLint                      | PASS/FAIL |            |
| Build readiness             | PASS/FAIL |            |
| console.log scan            | PASS/FAIL |            |
| Copy/UI P0                  | PASS/FAIL |            |

## P0 Checklist (Build Standards)

- [ ] Nenhum `console.log` em src/
- [ ] Nenhum `: any` sem justificativa
- [ ] Nenhuma cor hardcoded (#xxx, rgba, 'white')
- [ ] Copy correto: "Quando você começou a tentar?"
- [ ] Copy correto: "cada mês" (não "ciclo")
- [ ] Emoji/ícones renderizando corretamente

## Trecho Mínimo de Erro (se houver)

```
{Apenas ~20 linhas: erro + contexto acima/abaixo}
```

**Log completo**: [logs/{build-id}.txt](./logs/{build-id}.txt)

## Resultado Final

| Campo         | Valor                        |
| ------------- | ---------------------------- |
| Status        | SUCCESS / FAILED / CANCELLED |
| URL do Build  | {link EAS}                   |
| Tempo total   | {X min}                      |
| Próximo passo | {ação}                       |

## Notas

{Observações relevantes para histórico}
