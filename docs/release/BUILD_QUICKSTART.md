# Build Quickstart - Nossa Maternidade

Guia rápido para fazer builds e validações do projeto.

---

## 📋 Pré-requisitos

1. **Node.js 20.11.1** (conforme `eas.json`)
2. **Bun** instalado (recomendado) ou npm
3. **EAS CLI** instalado: `npm install -g eas-cli`
4. **Login no EAS:** `eas login`

---

## 🚀 Rodar Local (Desenvolvimento)

```bash
# Instalar dependências
bun install
# ou: npm install

# Iniciar Expo Dev Server
bun run start
# ou: npm run start

# Limpar cache e iniciar
bun run start:clear
```

---

## ✅ Rodar Validações (Quality Gate)

### Validação Completa

```bash
# Quality gate completo (typecheck + lint + check-build-ready + console.log check)
bun run quality-gate
```

### Validações Individuais

```bash
# Formatação
bun run format:check

# TypeScript
bun run typecheck

# ESLint
bun run lint

# Testes CI
bun run test:ci

# Build readiness (valida eas.json, app.config.js, assets, etc.)
bun run check-build-ready

# Verificar variáveis de ambiente
bun run check-env
```

### Diagnóstico de Produção

```bash
# Validação completa + build readiness
bun run diagnose:production
```

**Nota:** No Windows, `check-build-ready` requer Git Bash ou WSL. No CI (Linux) funciona normalmente.

---

## 🏗️ Fazer Build EAS

### Preview (Internal Testing)

```bash
# Build para iOS e Android
bun run build:preview

# Apenas iOS
bun run build:preview:ios

# Apenas Android
bun run build:preview:android
```

### Staging

```bash
# Build para iOS e Android
bun run build:staging

# Apenas iOS
bun run build:staging:ios

# Apenas Android
bun run build:staging:android
```

### Production (com quality gate)

```bash
# Build para iOS e Android (roda quality-gate antes)
bun run build:prod

# Apenas iOS
bun run build:prod:ios

# Apenas Android
bun run build:prod:android
```

**Nota:** O script `build:prod` executa `quality-gate` automaticamente antes do build.

---

## 📤 Submeter para App Stores

### Production

```bash
# Submeter iOS e Android
bun run submit:prod

# Apenas iOS (App Store)
bun run submit:prod:ios

# Apenas Android (Google Play)
bun run submit:prod:android
```

### Staging

```bash
# Submeter para TestFlight (iOS) e Internal Testing (Android)
bun run submit:staging
```

---

## 🔐 Configurar Secrets no EAS

**⚠️ IMPORTANTE:** Secrets devem ser configurados via EAS CLI, não no `eas.json`.

### Secrets Obrigatórios

```bash
# Supabase URL
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxxxx.supabase.co" --scope project

# Supabase Anon Key
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." --scope project

# Supabase Functions URL
eas env:create --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://xxxxx.supabase.co/functions/v1" --scope project
```

### Secrets Recomendados

```bash
# RevenueCat iOS
eas env:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_xxxxx" --scope project

# RevenueCat Android
eas env:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_xxxxx" --scope project
```

### Verificar Secrets Configurados

```bash
# Listar todos os secrets
eas env:list

# Ver valor de um secret específico
eas env:get EXPO_PUBLIC_SUPABASE_URL
```

**Documentação completa:** Veja `docs/EAS_SECRETS_SETUP.md`

---

## 🔧 Configurar Secrets no GitHub Actions

Para CI/CD, configure os seguintes secrets no GitHub:

1. Acesse: `https://github.com/[org]/[repo]/settings/secrets/actions`

2. Adicione:
   - `EXPO_TOKEN` - Token do Expo (obter em https://expo.dev/accounts/[account]/settings/access-tokens)
   - `CODECOV_TOKEN` - Token do Codecov (opcional, se usar coverage)
   - `GOOGLE_PLAY_SERVICE_ACCOUNT` - Service account do Google Play (base64 encoded, para submit Android)

**Nota:** Secrets do EAS são diferentes dos secrets do GitHub. EAS Secrets são usados nos builds, GitHub Secrets são usados nos workflows.

---

## 🐛 Troubleshooting

### Build falha com "Secrets not found"

**Solução:** Configure os secrets via `eas env:create` (veja seção acima)

### Build falha com "TypeScript errors"

**Solução:** Execute `bun run typecheck` localmente e corrija os erros antes de fazer build

### Build falha com "ESLint errors"

**Solução:** Execute `bun run lint` localmente e corrija os erros

### `check-build-ready` não funciona no Windows

**Solução:** Use Git Bash ou WSL, ou execute apenas no CI (Linux)

### App não conecta ao Supabase no TestFlight

**Solução:** Verifique se `EXPO_PUBLIC_SUPABASE_ANON_KEY` está configurado como EAS Secret e não hardcoded no `eas.json`

---

## 📚 Referências

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Secrets:** `docs/EAS_SECRETS_SETUP.md`
- **Environment Variables:** `docs/ENV_QUICK_REFERENCE.md`
- **Quality Gate:** `scripts/quality-gate.sh`
- **Build Readiness:** `scripts/check-build-ready.sh`

---

**Última atualização:** 04 Jan 2026
