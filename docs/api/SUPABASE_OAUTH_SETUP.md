# Configuracao OAuth - Supabase (Google e Apple Sign In)

**Projeto:** NossaMaternidade
**Project ID:** `lqahkqfpynypbmhtffyi`
**URL:** https://lqahkqfpynypbmhtffyi.supabase.co
**Ultima verificacao:** 2025-12-29

## Status Atual (via API)

| Provider   | Status API | Acao Necessaria            |
| ---------- | ---------- | -------------------------- |
| **Email**  | Habilitado | Nenhuma                    |
| **Apple**  | Habilitado | Verificar credenciais      |
| **Google** | Inativo    | **HABILITAR NO DASHBOARD** |

> **Verificar status atual:**
>
> ```bash
> npm run test:oauth
> # ou manualmente:
> curl -s "https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/settings" \
>   -H "apikey: $(grep EXPO_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)" | jq '.external'
> ```

## Acao Imediata: Habilitar Google OAuth

**Link direto:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers

---

## CRITICO: URL Configuration (Deep Links)

**OBRIGATORIO** para o deep link funcionar apos autenticacao OAuth.

1. Acesse: **Authentication** -> **URL Configuration**
   https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/url-configuration

2. Configure **Site URL**:

   ```
   nossamaternidade://
   ```

3. Configure **Redirect URLs** (adicione todas):
   ```
   nossamaternidade://auth/callback
   nossamaternidade://
   http://localhost:8081
   exp://192.168.x.x:8081/--/auth/callback
   ```

> **IMPORTANTE:** Sem estas configuracoes, o OAuth completa mas o app nao recebe o callback!

---

## Como Configurar

### 1. Acessar Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: **NossaMaternidade**
3. Va em: **Authentication** -> **Providers**

### 2. Configurar Google OAuth

Google usa OAuth em TODAS as plataformas (iOS, Android, Web).

#### 2.1 Criar Credenciais no Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto ou selecione existente
3. Va em **APIs & Services** -> **Credentials**
4. Clique em **Create Credentials** -> **OAuth client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** Nossa Maternidade
   - **Authorized redirect URIs:**
     ```
     https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
     ```
6. Copie **Client ID** e **Client Secret**

#### 2.2 Configurar no Supabase

1. No Supabase Dashboard -> **Authentication** -> **Providers**
2. Encontre **Google** e clique para editar
3. **Enable Google provider:** Ativar
4. Cole:
   - **Client ID (for OAuth):** (cole o Client ID do Google)
   - **Client Secret (for OAuth):** (cole o Client Secret do Google)
5. Clique em **Save**

### 3. Configurar Apple Sign In

**NOTA:** No iOS, Apple Sign In usa sheet NATIVA (nao browser).
Android/Web usam OAuth via browser como fallback.

#### 3.1 Criar Service ID no Apple Developer

1. Acesse: https://developer.apple.com/account
2. Va em **Certificates, Identifiers & Profiles**
3. Clique em **Identifiers** -> **+** (criar novo)
4. Selecione **Services IDs** -> **Continue**
5. Configure:
   - **Description:** Nossa Maternidade
   - **Identifier:** `com.liongab.nossamaternidade.service` (ou similar)
6. Marque **Sign in with Apple** -> **Configure**
7. Configure:
   - **Primary App ID:** Selecione seu App ID
   - **Website URLs:**
     - **Domains:** `lqahkqfpynypbmhtffyi.supabase.co`
     - **Return URLs:**
       ```
       https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
       ```
8. Salve e copie o **Service ID**

#### 3.2 Criar Key no Apple Developer

1. Va em **Keys** -> **+** (criar nova)
2. Configure:
   - **Key Name:** Nossa Maternidade Sign In
   - **Enable:** Sign in with Apple
3. Baixe o arquivo `.p8` (voce so pode baixar uma vez!)
4. Anote o **Key ID**

#### 3.3 Configurar no Supabase

1. No Supabase Dashboard -> **Authentication** -> **Providers**
2. Encontre **Apple** e clique para editar
3. **Enable Apple provider:** Ativar
4. Cole:
   - **Services ID:** (cole o Service ID criado)
   - **Secret Key:** (cole o conteudo do arquivo .p8)
   - **Key ID:** (cole o Key ID)
   - **Team ID:** (encontre em Membership no Apple Developer)
5. Clique em **Save**

---

## Verificar Configuracao

Apos configurar cada provider:

1. No Supabase Dashboard -> **Authentication** -> **Providers**
2. Verifique se o provider esta **Enabled** (verde)
3. Teste no app:
   - **iOS:** Apple usa sheet nativa, Google abre browser
   - **Android:** Ambos abrem browser
   - **Web:** Redireciona para o provider

## URLs de Redirect Necessarias

Todos os providers precisam ter esta URL configurada:

### Google Cloud Console

```
https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
```

### Apple Developer

```
https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
```

---

## Troubleshooting

### Erro: "Provider is not enabled"

**Solucao:** Verifique se o provider esta habilitado no Supabase Dashboard.

### Erro: "Invalid redirect URI"

**Solucao:** Verifique se a URL de redirect esta configurada corretamente nos providers (Google/Apple).

### Erro: "Invalid client credentials"

**Solucao:** Verifique se Client ID e Client Secret estao corretos no Supabase Dashboard.

### OAuth completa mas app nao recebe callback

**Solucao:** Verifique a secao **URL Configuration** acima. O Supabase precisa saber para onde redirecionar.

### OAuth funciona no mobile mas nao no web

**Solucao:** Verifique se as URLs de redirect incluem o dominio do Supabase corretamente.

### Apple funciona no iOS mas falha no Android

**Solucao:** No iOS usa autenticacao nativa. No Android usa OAuth via browser - verifique as credenciais do Services ID.

---

## Notas

- **Google:** Mais facil de configurar, recomendado para comecar
- **Apple:** Requer Apple Developer Account ($99/ano)
- **Apple iOS:** Usa sheet nativa do sistema (nao browser)
- **Apple Android/Web:** Usa OAuth via browser (fallback)

## Links Uteis

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Apple Sign In Setup](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Deep Linking Expo](https://docs.expo.dev/guides/deep-linking/)
