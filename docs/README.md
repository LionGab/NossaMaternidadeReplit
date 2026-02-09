# Documentação - Nossa Maternidade

## Estrutura Organizada

```
docs/
├── README.md              # Este arquivo (índice)
├── setup/                 # Guias de configuração local
├── release/               # Build, deploy, TestFlight, Play Store
├── security/              # Secrets, RLS, segurança
├── api/                   # Supabase, RevenueCat, OAuth, webhooks
├── troubleshooting/       # Resolução de problemas
├── specs/                 # Especificações técnicas
├── audits/                # Relatórios de auditoria
├── ios/                   # Documentação específica iOS
├── screenshots/           # Screenshots do app
├── store-metadata/        # Metadados das stores (App Store, Play)
├── templates/             # Templates de documentos
├── prompts/               # Prompts de IA (Claude, etc)
└── archive/               # Documentos históricos
    ├── sessions/          # Transcripts de sessões
    ├── reports/           # Relatórios antigos
    └── old-guides/        # Guias desatualizados
```

---

## Quick Start

### Desenvolvimento Local

```bash
npm install
npm start           # Expo dev server
npm run ios         # iOS Simulator
npm run android     # Android Emulator
```

### Validação

```bash
npm run validate    # TypeScript + Lint
npm test            # Testes unitários
```

### Build & Deploy

```bash
# TestFlight (iOS)
eas build --profile ios_testflight --platform ios
eas submit --platform ios --latest

# Play Store (Android)
eas build --profile production --platform android
eas submit --platform android --latest
```

---

## Links Rápidos

| Categoria      | Documento                                                                  |
| -------------- | -------------------------------------------------------------------------- |
| **Setup**      | [setup/QUICKSTART.md](setup/QUICKSTART.md)                                 |
| **Variáveis**  | [setup/ENV_QUICK_REFERENCE.md](setup/ENV_QUICK_REFERENCE.md)               |
| **Release**    | [release/RELEASE_GUIDE.md](release/RELEASE_GUIDE.md)                       |
| **TestFlight** | [release/TESTFLIGHT_GUIA_COMPLETO.md](release/TESTFLIGHT_GUIA_COMPLETO.md) |
| **Segurança**  | [security/EAS_SECRETS_SETUP.md](security/EAS_SECRETS_SETUP.md)             |
| **Auditoria**  | [audits/AUDIT_2026-01-15.md](audits/AUDIT_2026-01-15.md)                   |

---

## Secrets Necessários (EAS)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY

# Features
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
```

---

_Última atualização: 15/01/2026_
