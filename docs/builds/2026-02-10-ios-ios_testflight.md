# Build Checkpoint: 2026-02-10-ios-ios_testflight

## Metadata

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| Data         | 2026-02-10 11:29 (-04)                                           |
| Plataforma   | iOS                                                              |
| Profile      | ios_testflight                                                   |
| Branch       | main                                                             |
| Objetivo     | Submeter build iOS para TestFlight (Internal) via GitHub Actions |
| Build ID EAS | N/A (workflow usa `eas build --local`)                           |
| Auto-submit  | Sim                                                              |

## Pre-Build Interview

1. **Plataforma**: iOS
2. **Profile**: ios_testflight
3. **Auto-submit**: Sim
4. **Branch + Objetivo**: main - Build + submit TestFlight (Internal) via GitHub Actions

## Quality Gate Results

| Check                       | Status    | Observação                        |
| --------------------------- | --------- | --------------------------------- |
| TypeScript (`tsc --noEmit`) | PASS      | Executado localmente (2026-02-10) |
| ESLint                      | PASS      | Executado localmente (2026-02-10) |
| Build readiness             | PASS      | Executado localmente (2026-02-10) |
| console.log scan            | PASS      | `npm run quality-gate` passou     |
| Copy/UI P0                  | PASS/FAIL | Ver checklist abaixo              |

## P0 Checklist (Build Standards)

Build submetido no SHA `961b0b35b45ccfe5e6f4665885694b6e038bb5cb` (GitHub Actions run `21871151806`).

- [x] Nenhum `console.log` em src/ (fora `logger.*`)
- [x] Nenhum `: any` sem justificativa
- [ ] Nenhuma cor hardcoded (#xxx, rgba, 'white')
  - Violação no build: `src/navigation/MainTabNavigator.tsx:271` (`rgba(255,255,255,0.96)`)
- [ ] Copy correto: "Quando você começou a tentar?"
  - Observação: não encontrei essa copy no código (fluxo atual pula etapa de data para `TENTANTE`)
- [ ] Copy correto: "cada mês" (não "ciclo")
  - Violação no build:
    - `src/config/onboarding-data.ts:64` ("Cada ciclo é uma nova esperança")
    - `src/config/expanded-onboarding-data.ts:110` ("A ansiedade de cada ciclo...")
    - `src/config/nath-journey-onboarding-data.ts:31` ("...de cada ciclo")
- [ ] Emoji/ícones renderizando corretamente
  - Observação: não validado aqui (requer verificação em device/TestFlight)

## Trecho Mínimo de Erro (se houver)

N/A (workflow concluiu com sucesso).

## Resultado Final

| Campo         | Valor                                                                      |
| ------------- | -------------------------------------------------------------------------- |
| Status        | SUCCESS                                                                    |
| URL do Build  | https://github.com/LionGab/NossaMaternidadeReplit/actions/runs/21871151806 |
| Tempo total   | ~33 min                                                                    |
| Próximo passo | Instalar via TestFlight (Internal) e rodar smoke tests                     |

## Notas

- App Store Connect (via API): build `202602100415` com `processingState=VALID`.
- Build ID (ASC): `665ef95c-00d0-4034-b5ea-a87371dea0f7`.
- Follow-up recomendado: corrigir as violações P0 acima e disparar novo build TestFlight para incluir as correções.
