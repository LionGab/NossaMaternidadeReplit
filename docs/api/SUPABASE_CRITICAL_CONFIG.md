# 🔴 Configurações Críticas Supabase (Manual)

**Status:** ⏳ Pendente configuração manual no Dashboard

---

## ⚠️ CRÍTICO - App não funciona sem isso

### P0.1 – URL Configuration

**Por quê é crítico:** Sem as URLs corretas, o login OAuth não redireciona de volta ao app.

**Onde fazer:** Supabase Dashboard → Authentication → URL Configuration

**Link direto:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/url-configuration

#### Site URL:

```
https://nossamaternidade.com.br
```

#### Additional Redirect URLs (adicionar TODAS, uma por linha):

```
nossamaternidade://auth/callback
nossamaternidade://
http://localhost:8081
exp://localhost:8081
```

**→ Clicar "Save"**

---

### P0.2 – Ativar Google OAuth

**Por quê é crítico:** Sem isso, usuários Android (maioria) não conseguem logar.

**Onde fazer:** Supabase Dashboard → Authentication → Providers → Google

**Link direto:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers

#### Pré-requisito: Criar credenciais no Google Cloud Console

1. Acesse: https://console.cloud.google.com/apis/credentials
2. **Criar Credenciais** → **OAuth 2.0 Client ID**
3. **Application type:** `Web application`
4. **Name:** `Nossa Maternidade App`
5. **Authorized redirect URIs** (Adicionar):
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
   ```
6. **Create** → **Copiar Client ID e Client Secret**

#### No Supabase Dashboard:

1. Encontrar **Google** na lista de providers
2. **Toggle "Enable Sign in with Google"** → ATIVAR
3. Colar:
   - **Client ID (for OAuth):** (do Google Cloud Console)
   - **Client Secret (for OAuth):** (do Google Cloud Console)
4. **Save**

---

### P0.3 – Testar Apple Sign-In

**Por quê é crítico:** Obrigatório para login iOS funcionar.

**Onde fazer:** Testar em device físico iOS

**Comando:**

```bash
eas build --profile development --platform ios
```

**Depois:** Instalar no device e testar com conta Apple real.

---

## ✅ Checklist de Validação

Após configurar, execute:

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

## 📋 Documentação Relacionada

- `docs/SUPABASE_OAUTH_SETUP.md` - Guia completo
- `docs/OAUTH_VALIDATION_CHECKLIST.md` - Checklist detalhado
- `docs/OAUTH_EXECUCAO_ASSERTIVA.md` - Passo a passo assertivo
- `docs/GOOGLE_OAUTH_SETUP_FINAL.md` - Setup Google específico

---

## 🚨 Notas Importantes

1. **URL Configuration deve ser feita ANTES de testar OAuth**
2. **Google OAuth é necessário para Android** (maioria dos usuários)
3. **Apple Sign-In requer device físico** para teste completo
4. **Todas as configurações são manuais** no Supabase Dashboard
5. **Código já está implementado** - só falta configurar no Dashboard

---

**Última atualização:** 2025-01-XX
**Status:** ⏳ Aguardando configuração manual no Supabase Dashboard
