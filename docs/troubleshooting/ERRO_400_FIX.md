# 🔧 Correção Erro 400 - OAuth Supabase

## ❌ Problema

Erro **400 Bad Request** ao tentar fazer login com Google/Apple.

## 🔍 Causa Raiz

O erro 400 geralmente acontece por **uma destas causas**:

1. **Redirect URI não autorizado** (90% dos casos)
   - O redirect URI não está na lista de URLs permitidas no Supabase Dashboard
2. **QueryParams conflitantes**
   - Passar `queryParams` junto com `skipBrowserRedirect: true` pode causar conflito
   - O Supabase usa PKCE automaticamente quando `skipBrowserRedirect: true`

3. **Formato incorreto do redirect URI**
   - Deve ser exatamente: `nossamaternidade://auth-callback` (sem barras extras)

## ✅ Correções Aplicadas

### 1. Removido queryParams do Google OAuth

**Antes**:

```typescript
options: {
  redirectTo: REDIRECT_URI,
  skipBrowserRedirect: true,
  queryParams: {  // ❌ Pode causar erro 400
    access_type: "offline",
    prompt: "consent",
  },
}
```

**Depois**:

```typescript
options: {
  redirectTo: REDIRECT_URI,
  skipBrowserRedirect: true,
  // PKCE é habilitado automaticamente pelo Supabase
}
```

### 2. Melhorado tratamento de erro 400

Agora o código detecta especificamente erro 400 e mostra mensagem clara:

```typescript
if (errorMessage.includes("400") || errorMessage.includes("bad request")) {
  return {
    success: false,
    error: `Erro 400: Redirect URI não autorizado. Adicione "${REDIRECT_URI}" em Supabase Dashboard → Authentication → URL Configuration → Additional Redirect URLs`,
  };
}
```

### 3. Adicionado log do redirect URI

O código agora loga o redirect URI gerado para facilitar debug:

```typescript
logger.info("Redirect URI gerado", "SocialAuth", { uri: finalUri, platform: Platform.OS });
```

---

## 🚨 AÇÃO URGENTE NECESSÁRIA

### ⚠️ Configurar Redirect URI no Supabase Dashboard

**PASSO A PASSO**:

1. Acesse: https://app.supabase.com → Seu Projeto
2. Vá em: **Authentication** → **URL Configuration**
3. Em **"Additional Redirect URLs"**, adicione:
   ```
   nossamaternidade://auth-callback
   ```
4. **Salve** (botão "Save" no final da página)

**IMPORTANTE**:

- O redirect URI deve ser **exatamente** como acima (sem espaços, sem barras extras)
- Se você estiver testando em diferentes ambientes, pode precisar adicionar múltiplos:
  ```
  nossamaternidade://auth-callback
  exp://localhost:8081/--/auth-callback
  ```

---

## 🧪 Como Verificar se Está Correto

### 1. Verificar Redirect URI Gerado

Execute o app e procure nos logs:

```
[SocialAuth] Redirect URI gerado: { uri: 'nossamaternidade://auth-callback', platform: 'ios' }
```

### 2. Testar Login

1. Executar: `npm run ios` ou `npm run android`
2. Clicar em "Continuar com Google"
3. **Se der erro 400**: Verificar se o redirect URI está configurado no Supabase
4. **Se funcionar**: Login deve abrir browser e voltar pro app com sessão criada

### 3. Verificar Erro Específico

O código agora mostra mensagem específica para erro 400:

```
Erro 400: Redirect URI não autorizado. Adicione "nossamaternidade://auth-callback" em Supabase Dashboard → Authentication → URL Configuration → Additional Redirect URLs
```

---

## 📋 Checklist de Configuração Completo

- [ ] ✅ Redirect URI configurado no Supabase Dashboard
- [ ] ✅ Google OAuth habilitado no Supabase (se usando Google)
- [ ] ✅ Apple Sign In habilitado no Supabase (se usando Apple)
- [ ] ✅ Google Cloud Console: OAuth Client tipo "Web application"
- [ ] ✅ Google Cloud Console: Redirect URI do Supabase adicionado
- [ ] ✅ app.config.js: `scheme: "nossamaternidade"` configurado

---

## 🔗 Referências

- [Supabase OAuth Redirect URLs](https://supabase.com/docs/guides/auth/oauth-redirect-urls)
- [Supabase Expo OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google#expo)

---

**Última atualização**: 24/12/2025
**Status**: ✅ Código corrigido - Requer configuração no Supabase Dashboard
