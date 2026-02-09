# 📁 Supabase - Estrutura do Projeto

Este diretório contém toda configuração do Supabase backend.

---

## 📂 Estrutura

```
supabase/
├── config.toml              # Configuração Supabase CLI
├── functions/               # Edge Functions (Deno)
│   ├── ai/                  # Chat com IA
│   ├── notifications/       # Push notifications
│   ├── delete-account/      # Deleção de conta (LGPD)
│   ├── upload-image/        # Upload de imagens
│   ├── analytics/           # Analytics tracking
│   ├── webhook/             # Webhooks externos
│   ├── export-data/         # Exportação LGPD
│   └── moderate-content/    # Moderação de conteúdo
└── migrations/              # Database migrations
    ├── 001_profiles.sql
    ├── 002_community.sql
    └── ... (13 migrations)
```

---

## 🚀 Como Usar

### Desenvolvimento Local

```bash
supabase start    # Iniciar local
supabase stop     # Parar local
supabase db reset # Resetar database
```

### Deploy

```bash
supabase link --project-ref seu-projeto-id
supabase db push
supabase functions deploy
```

---

Ver: SUPABASE_QUICKSTART.md para setup completo.
