# Build Notes

> Resumo compacto de builds. Detalhes em arquivos individuais.

## Formato

Cada build deve ter **apenas 3 bullets** aqui + links:

```
## {YYYY-MM-DD} - {platform} {profile}
- **Status**: SUCCESS/FAILED
- **Objetivo**: {1 linha}
- **Resultado**: {1 linha}
- Checkpoint: [link](./YYYY-MM-DD-platform-profile.md)
- Log completo: [link](./logs/build-id.txt) (se aplicável)
```

---

## Histórico de Builds

<!-- Adicionar novos builds no topo -->

## 2026-02-10 - iOS ios_testflight
- **Status**: SUCCESS
- **Objetivo**: Submeter build iOS para TestFlight (Internal) via GitHub Actions
- **Resultado**: GitHub Actions run `21871151806` (SHA `961b0b3`), ASC build `202602100415` (VALID)
- Checkpoint: [link](./2026-02-10-ios-ios_testflight.md)
