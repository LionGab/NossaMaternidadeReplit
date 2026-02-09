# Guia de Correção - Apple Sign-In Erro 400

**Data**: 2026-01-10
**Problema**: Login com Apple retorna erro 400 "redirect_uri não autorizado"
**Build**: #21

---

## 🎯 Diagnóstico

O erro 400 indica que o **redirect URI** usado pelo app não está autorizado no Supabase Dashboard.

### Redirect URI Usado pelo App

```
nossamaternidade://auth/callback
```

Este é o URI definido em `src/api/social-auth.ts:62` e usado para callbacks OAuth nativos.

---

## ✅ PASSO 1: Verificar URL Configuration no Supabase

### 1.1 Acessar Dashboard

Abra o Supabase Dashboard:

```
https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/url-configuration
```

### 1.2 Verificar "Site URL"

Deve conter:

```
nossamaternidade://
```

### 1.3 Verificar "Additional Redirect URLs"

Deve conter TODAS estas URLs (uma por linha):

```
nossamaternidade://auth/callback
nossamaternidade://
http://localhost:8081
exp://localhost:8081
```

### 1.4 Adicionar se Ausente

Se alguma URL estiver faltando:

1. Clique em "Add URL" ou edite o campo de texto
2. Cole todas as URLs acima (uma por linha)
3. Clique em "Save"
4. **Aguarde 30-60 segundos** para as mudanças propagarem

---

## ✅ PASSO 2: Verificar Apple Provider Credentials

### 2.1 Acessar Providers

```
https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers
```

### 2.2 Clicar em "Apple"

Verificar que os seguintes campos estão preenchidos:

#### Services ID (Client ID)

- Deve começar com algo como `br.com.nossamaternidade.app.auth`
- É criado no Apple Developer Console
- **Atenção**: Não confunda com o Bundle ID!

#### Team ID

- ID do time da Apple Developer Account
- Formato: 10 caracteres alfanuméricos (ex: `A1B2C3D4E5`)
- Encontrado em: https://developer.apple.com/account/#/membership/

#### Key ID

- ID da chave .p8 criada no Apple Developer
- Formato: 10 caracteres alfanuméricos
- Encontrado em: https://developer.apple.com/account/resources/authkeys/list

#### Private Key (.p8)

- Chave privada baixada do Apple Developer
- Começa com `-----BEGIN PRIVATE KEY-----`
- **CRÍTICO**: Só pode ser baixada uma vez! Se perdeu, precisa criar nova

### 2.3 Se Algum Campo Estiver Vazio

**PARAR AQUI** e seguir o Passo 3 para configurar no Apple Developer primeiro.

---

## ✅ PASSO 3: Configurar no Apple Developer Console

### 3.1 Acessar Apple Developer

```
https://developer.apple.com/account/resources/identifiers/list
```

### 3.2 Criar Services ID (se não existir)

1. Clique no "+" para criar novo Identifier
2. Escolha "Services IDs"
3. Preencha:
   - **Description**: Nossa Maternidade Auth
   - **Identifier**: `br.com.nossamaternidade.app.auth` (ou similar)
4. Clique "Continue" → "Register"

### 3.3 Configurar Services ID

1. Clique no Services ID criado
2. Marque "Sign In with Apple"
3. Clique "Configure"
4. Em "Domains and Subdomains", adicione:
   ```
   lqahkqfpynypbmhtffyi.supabase.co
   ```
5. Em "Return URLs", adicione:
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
   ```
6. Clique "Save" → "Continue" → "Save" novamente

### 3.4 Criar Key (.p8) se não existir

1. Acesse: https://developer.apple.com/account/resources/authkeys/list
2. Clique no "+" para criar nova Key
3. Preencha:
   - **Key Name**: Nossa Maternidade Apple Sign In
   - Marque "Sign In with Apple"
4. Clique "Configure" ao lado de "Sign In with Apple"
5. Selecione o **Primary App ID** (`br.com.nossamaternidade.app`)
6. Clique "Save" → "Continue" → "Register"
7. **CRÍTICO**: Clique em "Download" e salve o arquivo .p8
   - **Você só pode baixar UMA VEZ!**
   - Se perder, terá que criar nova Key

### 3.5 Anotar Informações

Após criar/configurar, anote:

- **Services ID**: `br.com.nossamaternidade.app.auth` (ou o que você criou)
- **Team ID**: Visível em https://developer.apple.com/account/#/membership/
- **Key ID**: Visível ao lado da Key criada (10 caracteres)
- **Private Key**: Conteúdo do arquivo .p8 baixado

---

## ✅ PASSO 4: Atualizar Supabase com Credenciais

1. Volte para: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers
2. Clique em "Apple"
3. Preencha os campos com as informações do Passo 3.5
4. Clique "Save"
5. **Aguarde 1-2 minutos** para as mudanças propagarem

---

## ✅ PASSO 5: Testar Login

### 5.1 Testar Localmente (Expo Go NÃO funciona)

```bash
# Necessário Dev Client ou EAS Build
npm run build:dev:ios
```

### 5.2 Testar no TestFlight

1. Criar novo build (#22) com as correções de runtime
2. Distribuir via TestFlight
3. Abrir app → Tentar login com Apple
4. Verificar se redireciona corretamente

---

## 🔍 Troubleshooting

### Erro Persiste Após Configuração

**Motivo possível**: Cache de configuração

**Solução**:

1. Aguarde 2-3 minutos após salvar no Supabase
2. Force-quit o app e reabra
3. Se ainda falhar, verifique logs:
   ```bash
   npx expo start --clear
   # Abra app e tente login
   # Veja logs do terminal
   ```

### "Invalid Client" ou "Client Not Found"

**Motivo**: Services ID incorreto

**Solução**:

1. Verifique se o Services ID no Supabase corresponde exatamente ao criado no Apple Developer
2. Não use o Bundle ID (`br.com.nossamaternidade.app`) - deve ser o Services ID (`br.com.nossamaternidade.app.auth`)

### "Invalid Redirect URI"

**Motivo**: URL não configurada no Apple Developer

**Solução**:

1. Volte ao Passo 3.3
2. Certifique-se de que `https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback` está em "Return URLs"

---

## 📝 Checklist Final

Antes de testar, confirme:

- [ ] Site URL no Supabase: `nossamaternidade://`
- [ ] Redirect URLs no Supabase incluem: `nossamaternidade://auth/callback`
- [ ] Services ID criado no Apple Developer
- [ ] Services ID configurado com domínio Supabase + Return URL
- [ ] Key (.p8) criada e baixada
- [ ] Team ID, Key ID, Services ID preenchidos no Supabase
- [ ] Private Key (.p8 content) preenchido no Supabase
- [ ] Aguardou 1-2 minutos após salvar

---

## 🎯 Comando para Re-Testar OAuth

Após configurar, rode:

```bash
npm run test:oauth
```

Deve mostrar:

```
✅ Email/Senha: ATIVO
✅ Google: ATIVO
✅ Apple: ATIVO
```

---

## 📚 Referências

- [Supabase Apple Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Apple Services ID Configuration](https://developer.apple.com/documentation/sign_in_with_apple/configuring_your_environment_for_sign_in_with_apple)
- OAuth status atual: `docs/SUPABASE_OAUTH_STATUS_REPORT_2025-12-31.md`
