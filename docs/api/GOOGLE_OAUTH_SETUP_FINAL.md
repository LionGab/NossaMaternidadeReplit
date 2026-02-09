# 🔐 Google OAuth Setup (Final)

Para destravar o login com Google, siga EXATAMENTE estes passos:

## 1. Google Cloud Console

Acesse: https://console.cloud.google.com/apis/credentials

1. **Criar Credenciais** → **OAuth Client ID**
2. **Tipo de Aplicação**: Web application
3. **Nome**: Nossa Maternidade Production
4. **Authorized Redirect URIs** (Adicione TODAS):
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
   ```
5. **Copie**: Client ID e Client Secret

## 2. Supabase Dashboard

Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers

1. **Provedor Google**: Clique em "Enable"
2. **Client ID**: Cole o ID do passo anterior
3. **Client Secret**: Cole o Secret do passo anterior
4. **Salvar**

## 3. URL Configuration (CRÍTICO)

Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/url-configuration

1. **Site URL**: `https://nossamaternidade.com.br`
2. **Redirect URLs** (Adicione TODAS, uma por linha):
   ```
   nossamaternidade://auth/callback
   exp://192.168.x.x:8081/--/auth/callback
   http://localhost:8081/auth/callback
   https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
   ```
3. **Salvar**

---

## ✅ Teste Final

Após configurar, execute no terminal:
`npm run test:oauth`
