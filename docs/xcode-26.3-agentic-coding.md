# Xcode 26.3 - Agentic Coding (Guia de uso no repositorio)

## O que mudou

Xcode 26.3 introduz fluxo agentic: agentes podem atuar com mais autonomia no contexto do IDE para:

- explorar estrutura do projeto
- sugerir e aplicar alteracoes de codigo/configuracao
- iterar em ciclos de build/fix
- validar ajustes de UI com previews

## Impacto pratico para este repositorio (Expo/React Native)

1. Velocidade maior para diagnostico/refactor de partes iOS e pipeline.
2. Necessidade de manter guardrails de engenharia: build/test gates continuam obrigatorios.
3. Para distribuicao em TestFlight/App Store, usar pipeline oficial Expo/EAS do repositorio.

## Guardrails obrigatorios

- Nao inserir segredos em prompts.
- Toda mudanca relevante deve passar por lint/typecheck/testes aplicaveis.
- Evitar mudancas amplas sem escopo: preferir alteracoes incrementais.
- Em PR, registrar:
  - objetivo e escopo da mudanca
  - comandos executados para validar
  - riscos e plano de rollback (quando aplicavel)

## Prompts de trabalho recomendados

### Refactor seguro

"Refatore <arquivo/modulo> reduzindo complexidade sem alterar comportamento. Mantenha padroes existentes do repositorio e rode os checks relevantes."

### Testes

"Adicione testes para <modulo> cobrindo cenarios X/Y/Z. Nao criar mocks irreais. Ajustar codigo apenas no minimo necessario para testabilidade."

### Build iOS

"Diagnostique erro de build iOS e proponha correcao minima. Reexecute o build e reporte resultado objetivo."

## Quando nao usar agente sem revisao adicional

- Mudancas em billing, autenticacao, seguranca, credenciais e compliance.
- Alteracoes de infra/producao sem revisao humana linha a linha.

## Pipeline oficial para iOS/TestFlight neste repo

- Workflow CI: `.github/workflows/ios-testflight.yml`
- Perfis EAS: `eas.json`
- Comando base:

```bash
eas build -p ios --profile ios_testflight --auto-submit
```
