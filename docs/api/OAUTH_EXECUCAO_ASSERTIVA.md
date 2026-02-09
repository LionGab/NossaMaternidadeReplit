# 🚀 OAuth - Execução Assertiva

**Data:** 2025-12-30
**Status Atual:** Google OAuth INATIVO | Apple ATIVO | Email ATIVO

---

## ✅ STATUS ATUAL (Verificado via API)

```bash
npm run test:oauth
```

**Resultado:**

- ✅ **Email/Senha:** ATIVO
- ❌ **Google OAuth:** INATIVO (HABILITAR)
- ✅ **Apple Sign In:** ATIVO (verificar credenciais)

---

## 🎯 AÇÕES NECESSÁRIAS (Ordem de Execução)

### ETAPA 1: URL Configuration (CRÍTICO - FAZER PRIMEIRO)

**Link Direto:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/url-configuration

#### Site URL:

```
https://lqahkqfpynypbmhtffyi.supabase.co
```

#### Additional Redirect URLs (Adicionar TODAS, uma por linha):

```
nossamaternidade://auth/callback
nossamaternidade://
exp://localhost:8081/--/auth/callback
exp://127.0.0.1:8081/--/auth/callback
```

**→ Clicar "Save"**

---

### ETAPA 2: Google Cloud Console

**Link Direto:** https://console.cloud.google.com/apis/credentials

1. **Criar Credenciais** → **OAuth 2.0 Client ID**
2. **Application type:** `Web application`
3. **Name:** `Nossa Maternidade App`
4. **Authorized redirect URIs** (Adicionar):
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
   ```
5. **Create** → **Copiar Client ID e Client Secret**

**⚠️ IMPORTANTE:** Se já existe um OAuth Client ID, edite e adicione a redirect URI acima.

---

### ETAPA 3: Habilitar Google no Supabase

**Link Direto:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers

1. Encontrar **Google** na lista de providers
2. **Toggle "Enable Sign in with Google"** → ATIVAR
3. Colar:
   - **Client ID (for OAuth):** (do passo anterior)
   - **Client Secret (for OAuth):** (do passo anterior)
4. **Save**

---

### ETAPA 4: Validação Automática

```bash
npm run test:oauth
```

**Esperado:**

```
✅ Google OAuth: ATIVO
✅ Apple Sign In: ATIVO
✅ Redirect URLs: Configuradas
```

---

## 🔍 VERIFICAÇÃO MANUAL (Opcional)

### Verificar Redirect URLs via API:

```bash
curl -s "https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/settings" \
  -H "apikey: $(grep EXPO_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2 | tr -d '\"')" | \
  jq '{site_url, redirect_to}'
```

### Verificar Providers via API:

```bash
curl -s "https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/settings" \
  -H "apikey: $(grep EXPO_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2 | tr -d '\"')" | \
  jq '.external'
```

---

## ⚡ TEMPO ESTIMADO

- **Etapa 1 (URL Config):** ~2 minutos
- **Etapa 2 (Google Console):** ~5 minutos
- **Etapa 3 (Supabase):** ~2 minutos
- **Etapa 4 (Validação):** ~1 minuto

**Total:** ~10 minutos

---

## 🚨 TROUBLESHOOTING

### Erro: "Provider is not enabled"

→ Verificar se Google está habilitado no Supabase Dashboard

### Erro: "Invalid redirect URI"

→ Verificar se a URL está configurada no Google Cloud Console E no Supabase URL Configuration

### OAuth completa mas app não recebe callback

→ Verificar se `nossamaternidade://auth/callback` está em Additional Redirect URLs

---

## 📋 CHECKLIST FINAL

- [ ] Site URL configurado no Supabase
- [ ] Redirect URLs adicionadas (4 URLs)
- [ ] Google OAuth Client ID criado no Google Console
- [ ] Redirect URI adicionada no Google Console
- [ ] Google provider habilitado no Supabase
- [ ] Client ID e Secret colados no Supabase
- [ ] `npm run test:oauth` passando
- [ ] Teste real no app (opcional)

---

**Próximo passo:** Após configurar, executar `npm run test:oauth` para validar.
