# Setup Completo - Nossa Maternidade

Guia completo para deixar o app 100% funcional, pronto para desenvolvimento e produção.

**Última atualização**: Dezembro 2024

## Checklist Rápido

### Desenvolvimento Local

- [ ] Node.js 20+ instalado
- [ ] Dependências instaladas (`npm install` ou `bun install`)
- [ ] Variáveis de ambiente configuradas (`.env.local`)
- [ ] Expo autenticado (`npx expo login`)
- [ ] TypeScript compilando sem erros

### Produção

- [ ] Supabase Edge Functions configuradas
- [ ] RevenueCat configurado (iOS + Android)
- [ ] EAS secrets configurados
- [ ] Certificados iOS/Android prontos
- [ ] Quality gate passando

---

## 1. Configuração Inicial

### 1.1 Instalar Dependências

```bash
# Opção 1: npm (padrão)
npm install

# Opção 2: bun (mais rápido, recomendado)
bun install
```

### 1.2 Configurar Variáveis de Ambiente

**Opção A: Script interativo (recomendado)**

```bash
bash scripts/setup-secrets.sh
```

**Opção B: Manual**

```bash
cp .env.example .env.local
# Edite .env.local com seus valores
```

### 1.3 Variáveis Obrigatórias

| Variável                             | Onde Obter           | Obrigatório            |
| ------------------------------------ | -------------------- | ---------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`           | Supabase Dashboard   | Sim                    |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`      | Supabase Dashboard   | Sim                    |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY`     | RevenueCat Dashboard | Para Premium           |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat Dashboard | Para Premium           |
| `EXPO_PUBLIC_SENTRY_DSN`             | Sentry Dashboard     | Para Error Tracking    |
| `EXPO_PUBLIC_IMGUR_CLIENT_ID`        | Imgur API            | Para Upload de Imagens |

---

## 2. Configuração Supabase

### 2.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e Anon Key

### 2.2 Aplicar Migrations

```bash
# Linkar projeto local
supabase link --project-ref SEU_PROJECT_REF

# Aplicar migrations
supabase db push
```

### 2.3 Configurar Edge Functions Secrets

```bash
# Via Supabase CLI
supabase secrets set GEMINI_API_KEY=sua_chave
supabase secrets set OPENAI_API_KEY=sua_chave
supabase secrets set ANTHROPIC_API_KEY=sua_chave

# Opcional
supabase secrets set ELEVENLABS_API_KEY=sua_chave
supabase secrets set UPSTASH_REDIS_REST_URL=sua_url
supabase secrets set UPSTASH_REDIS_REST_TOKEN=seu_token
```

**Ou via Dashboard**: Supabase → Project Settings → Edge Functions → Secrets

### 2.4 Deployar Edge Functions

```bash
# Deploy todas as funções
supabase functions deploy ai
supabase functions deploy transcribe
supabase functions deploy notifications
supabase functions deploy upload-image
```

---

## 3. Configuração RevenueCat (Premium/IAP)

### 3.1 Criar Conta

1. Acesse [app.revenuecat.com](https://app.revenuecat.com)
2. Crie um novo projeto
3. Configure iOS e Android

### 3.2 iOS Setup

1. App Store Connect → Gerenciar → Assinaturas
2. Criar produtos: `nossa_maternidade_monthly`, `nossa_maternidade_yearly`
3. Adicionar no RevenueCat → iOS App

### 3.3 Android Setup

1. Google Play Console → Monetização → Produtos
2. Criar mesmos produtos
3. Adicionar no RevenueCat → Android App

### 3.4 Configurar Entitlements

No RevenueCat Dashboard:

1. Criar Entitlement: `premium`
2. Vincular aos produtos criados

---

## 4. Configuração EAS Build

### 4.1 Autenticar no EAS

```bash
npx eas-cli login
```

### 4.2 Configurar Secrets do EAS

```bash
# Secrets do projeto
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJxxx"
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_xxx"
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_xxx"

# Verificar
npx eas-cli secret:list
```

### 4.3 Configurar eas.json

Edite `eas.json` e substitua os placeholders:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "SEU_APP_ID_DO_APP_STORE_CONNECT",
        "appleTeamId": "SEU_APPLE_TEAM_ID"
      }
    }
  }
}
```

### 4.4 Configurar Android

1. Google Play Console → Configuração → Acesso à API
2. Criar conta de serviço
3. Baixar JSON e salvar como `google-play-service-account.json`
4. Adicionar ao `.gitignore` (já está)

---

## 5. Configuração de MCPs

### 5.1 Arquivo .mcp.json (já criado)

O projeto já contém `.mcp.json` com os MCPs configurados:

- **expo-mcp**: Expo SDK e EAS
- **context7**: Documentação atualizada
- **memory-keeper**: Persistência de contexto
- **supabase**: Gerenciamento de banco
- **playwright**: Testes visuais
- **github**: Issues e PRs

### 5.2 Instalar MCPs (opcional)

```bash
# Playwright (para testes visuais)
npx playwright install chromium

# Context7 (documentação)
npx -y @smithery/cli@latest install @upstash/context7-mcp --client claude
```

---

## 6. Verificação Final

### 6.1 Script de Verificação

```bash
bash scripts/verify-complete-setup.sh
```

### 6.2 Quality Gate

```bash
npm run quality-gate
```

Isso executa:

1. TypeScript check
2. ESLint check
3. Build readiness check
4. console.log detection

### 6.3 Build de Teste

```bash
# Preview build (teste interno)
npm run build:preview

# Development build (dev client)
npm run build:dev
```

---

## 7. Comandos Úteis

### Desenvolvimento

```bash
npm start              # Iniciar Expo
npm start:clear        # Limpar cache e iniciar
npm run ios            # Rodar no iOS Simulator
npm run android        # Rodar no Android Emulator
```

### Qualidade

```bash
npm run quality-gate   # Verificação completa
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm run lint:fix       # Auto-fix ESLint
```

### Builds

```bash
npm run build:dev      # Development
npm run build:preview  # Preview (testes internos)
npm run build:prod     # Production
```

### Deploy

```bash
npm run release:prod   # Build + Submit para lojas
```

---

## 8. Troubleshooting

### Variáveis de ambiente não carregam

```bash
npx expo start --clear
```

### TypeScript com erros

```bash
npm run clean
npm install
npm run typecheck
```

### Supabase não conecta

1. Verifique `.env.local`
2. Verifique RLS policies
3. Teste no Supabase Dashboard

### RevenueCat não funciona

1. Verifique se está em dev build (não Expo Go)
2. Verifique API keys
3. Verifique produtos no dashboard

### EAS build falha

```bash
npx eas-cli build:list
npx eas-cli build:view --latest
```

---

## 9. Estrutura de Arquivos Importantes

```
/
├── .env.local           # Variáveis de ambiente (não commitar!)
├── .mcp.json            # Configuração de MCPs
├── app.config.js        # Configuração do Expo
├── eas.json             # Configuração EAS Build
├── supabase/
│   ├── config.toml      # Configuração Supabase local
│   ├── migrations/      # Migrations do banco
│   └── functions/       # Edge Functions
└── scripts/
    ├── setup-secrets.sh        # Setup interativo de secrets
    ├── verify-complete-setup.sh # Verificação completa
    ├── quality-gate.sh          # Quality gate
    └── check-build-ready.sh     # Verificação de build
```

---

## 10. Próximos Passos

Após completar o setup:

1. **Testar localmente**: `npm start`
2. **Fazer build de teste**: `npm run build:preview`
3. **Testar em dispositivo real**
4. **Configurar produtos no RevenueCat**
5. **Submeter para as lojas**: `npm run release:prod`

---

## Links Úteis

- [Supabase Dashboard](https://app.supabase.com)
- [RevenueCat Dashboard](https://app.revenuecat.com)
- [EAS Dashboard](https://expo.dev)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

---

## Suporte

Se tiver problemas:

1. Execute `bash scripts/verify-complete-setup.sh`
2. Verifique os logs de erro
3. Consulte a documentação em `/docs`
