# OAuth Validation Checklist

**Data:** 2025-12-29
**Status:** Implementacao pronta | Pendente config + smoke test

## Status Atual

| Provider      | Implementacao | Config Supabase | Smoke Test          | Final |
| ------------- | ------------- | --------------- | ------------------- | ----- |
| Email/Senha   | OK            | OK              | OK                  | ✅    |
| Apple Sign In | OK            | Habilitado      | Pendente iOS device | ⏳    |
| Google OAuth  | OK            | **INATIVO**     | Pendente            | ❌    |

---

## A) URL Configuration (CRITICO)

**Supabase Dashboard:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/url-configuration

### Site URL

```
https://nossamaternidade.com.br
```

> Usar dominio HTTPS real. Scheme mobile fica em Additional Redirect URLs.

### Additional Redirect URLs (adicionar TODAS)

```
nossamaternidade://auth/callback
nossamaternidade://
http://localhost:8081
exp://localhost:8081/--/auth/callback
```

**Validacao:**

- [ ] Site URL configurado (https://...)
- [ ] Redirect `nossamaternidade://auth/callback` adicionado
- [ ] Redirect `nossamaternidade://` adicionado
- [ ] Redirect `http://localhost:8081` adicionado
- [ ] (Opcional) Redirect Expo Go adicionado

---

## B) Google OAuth

### B1. Google Cloud Console

**Link:** https://console.cloud.google.com

- [ ] Projeto criado/selecionado
- [ ] OAuth consent screen configurado
  - [ ] User Type: External
  - [ ] App name: Nossa Maternidade
  - [ ] Support email preenchido
  - [ ] **Publishing status:** Testing (adicionar test users) OU Production
- [ ] OAuth 2.0 Client ID criado
  - [ ] Application type: **Web application**
  - [ ] Name: Nossa Maternidade (Supabase)
  - [ ] Authorized redirect URIs:
    ```
    https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
    ```
- [ ] Client ID copiado
- [ ] Client Secret copiado

### B2. Supabase Providers

**Link:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/providers

- [ ] Google provider habilitado
- [ ] Client ID colado
- [ ] Client Secret colado
- [ ] Salvo

### B3. Validacao Automatica

```bash
npm run test:oauth
# Esperado: Google ✅ ATIVO, exit code 0
```

- [ ] `npm run test:oauth` retorna exit 0

---

## C) Apple Sign In

### C1. Supabase (ja configurado)

- [x] Provider Apple habilitado
- [ ] Credenciais verificadas (Service ID, Key ID, Team ID, .p8)

### C2. Smoke Test iOS

**Requisito:** Development build (NAO Expo Go)

```bash
# Criar build de desenvolvimento
eas build --profile development --platform ios

# Instalar no device e testar
```

- [ ] Build instalado em device iOS real
- [ ] Botao "Continuar com Apple" funciona
- [ ] Sheet nativa do iOS aparece
- [ ] Autenticacao completa
- [ ] Sessao criada no Supabase
- [ ] Usuario redirecionado para home

---

## D) Smoke Tests Finais

### D1. iOS Device (Development Build)

| Teste                  | Resultado           |
| ---------------------- | ------------------- |
| Apple Sign In (nativo) | [ ] Pass / [ ] Fail |
| Google OAuth (browser) | [ ] Pass / [ ] Fail |
| Deep link callback     | [ ] Pass / [ ] Fail |

### D2. Android Device (Development Build)

| Teste                  | Resultado           |
| ---------------------- | ------------------- |
| Google OAuth (browser) | [ ] Pass / [ ] Fail |
| Apple OAuth (browser)  | [ ] Pass / [ ] Fail |
| Deep link callback     | [ ] Pass / [ ] Fail |

### D3. Validacao Final

```bash
npm run test:oauth
npm run quality-gate
```

- [ ] `test:oauth` exit 0
- [ ] `quality-gate` pass
- [ ] Todos smoke tests passaram

---

## Troubleshooting

### "OAuth autentica mas nao volta pro app"

**Causa:** URL Configuration incompleta
**Solucao:** Verificar secao A acima

### "Google: only test users can access"

**Causa:** OAuth consent screen em modo Testing
**Solucao:** Adicionar usuarios de teste OU publicar app

### "Apple: Invalid client"

**Causa:** Service ID/Key ID incorretos
**Solucao:** Verificar credenciais no Apple Developer + Supabase

### "400 Bad Request"

**Causa:** Redirect URI nao autorizado
**Solucao:** Adicionar URI exato em Google Cloud + Supabase URL Config

---

## Criterio de "100% Funcional"

Todos os itens abaixo devem estar marcados:

- [ ] URL Configuration completa (secao A)
- [ ] Google habilitado e testado (secao B)
- [ ] Apple testado em iOS device real (secao C)
- [ ] Smoke tests passaram (secao D)
- [ ] `npm run test:oauth` exit 0
- [ ] `npm run quality-gate` pass

**Somente apos todos os checks acima:** OAuth esta 100% funcional.
