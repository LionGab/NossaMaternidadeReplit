# Archive — Fevereiro 2026

> Docs arquivadas durante consolidação de documentação (Issue #14 / PR3)

---

## Contexto

Em **14 de fevereiro de 2026**, consolidamos múltiplos docs de TestFlight em um único guia oficial:

- **`docs/RELEASE_TESTFLIGHT.md`** (novo) — Guia único e atualizado

Docs antigas movidas para este diretório para referência histórica.

---

## Docs Arquivadas

### TestFlight (8 docs consolidadas)

| Doc Antiga                      | Motivo do Archive                                          |
| ------------------------------- | ---------------------------------------------------------- |
| `TESTFLIGHT_SETUP_COMPLETE.md`  | Status check antigo, info duplicada                       |
| `TESTFLIGHT_GUIA_COMPLETO.md`   | Base para novo RELEASE_TESTFLIGHT.md, mas desatualizado   |
| `TESTFLIGHT_BUILD_GUIDE.md`     | Duplicado com GUIA_COMPLETO                                |
| `TESTFLIGHT_DEPLOY.md`          | Info redundante, agora em RELEASE_TESTFLIGHT.md            |
| `TESTFLIGHT_GATES_v1.md`        | Gates v1 antigas, substituídas por gates atuais            |
| `TESTFLIGHT_READY.md`           | Checklist antiga, agora em RELEASE_TESTFLIGHT.md           |
| `TESTFLIGHT_SOURCE_OF_TRUTH.md` | Config tracking, info agora em eas.json + package.json     |
| `TESTFLIGHT_SUPABASE_SETUP.md`  | Setup específico, now part of main setup docs             |

---

## Guias Atuais (Usar Estes!)

### Release

- **`docs/RELEASE_TESTFLIGHT.md`** — Guia oficial TestFlight (único)

### Setup

- **`docs/DEV_SETUP_WINDOWS.md`** — Setup Windows (Git Bash, Node, Expo)
- **`docs/DEV_SETUP_MAC.md`** — Setup macOS (Xcode, Homebrew, etc.)

---

## Quando Consultar Archive?

- **Se precisar entender decisões históricas** (ex: por que mudamos de X para Y)
- **Se novo RELEASE_TESTFLIGHT.md estiver faltando info** (reportar Issue!)
- **Referência de como era antes** (arqueologia de docs)

❌ **Não use para desenvolvimento ativo** — sempre consulte docs atuais.

---

**Data do archive**: 14/02/2026
**Issue relacionada**: #14 (PR3 — Cursor cockpit + docs essenciais)
**PR**: #TBD
