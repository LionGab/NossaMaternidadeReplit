# 🔧 Como Resolver Erro de API Key Inválida do Gemini

## Erro

```
API key not valid. Please pass a valid API key.
Status: INVALID_ARGUMENT
Reason: API_KEY_INVALID
```

## Diagnóstico Rápido

Execute o script de teste:

```bash
# Se você tem a API key em mãos
npm run test:gemini YOUR_API_KEY

# Ou se está em variável de ambiente
GEMINI_API_KEY=your_key npm run test:gemini
```

## Possíveis Causas

### 1. API Key Não Configurada no Supabase

**Sintoma**: Edge Function não consegue ler `GEMINI_API_KEY`

**Solução**:

```bash
# Verificar se está configurada
supabase secrets list

# Se não estiver, configurar:
supabase secrets set GEMINI_API_KEY="sua_chave_aqui"
```

**Via Dashboard**:

1. Acesse: https://app.supabase.com/project/_/settings/functions
2. Vá em **Secrets**
3. Adicione `GEMINI_API_KEY` com sua chave

### 2. API Key Inválida ou Expirada

**Sintoma**: Google retorna erro 400 "API key not valid"

**Solução**:

1. Acesse: https://makersuite.google.com/app/apikey
2. Verifique se a chave existe e está ativa
3. Se necessário, crie uma nova API key
4. Atualize no Supabase:
   ```bash
   supabase secrets set GEMINI_API_KEY="nova_chave"
   ```

### 3. API Key Sem Permissões

**Sintoma**: Google retorna erro 403 "Permission denied"

**Solução**:

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Encontre sua API key
3. Verifique se a API **"Generative Language API"** está habilitada
4. Se não estiver, habilite:
   - Vá em **APIs & Services** → **Library**
   - Procure por "Generative Language API"
   - Clique em **Enable**

### 4. API Key Copiada Incorretamente

**Sintoma**: Erro mesmo com chave aparentemente válida

**Solução**:

- Verifique espaços extras no início/fim
- Certifique-se de copiar a chave completa (começa com `AIza...`)
- Use aspas ao configurar:
  ```bash
  supabase secrets set GEMINI_API_KEY="AIzaSy..."
  ```

## Verificação Completa

### Passo 1: Testar API Key Localmente

```bash
# Teste direto com a API do Google
npm run test:gemini YOUR_API_KEY
```

Se funcionar localmente mas falhar na Edge Function, o problema é na configuração do Supabase.

### Passo 2: Verificar Secrets no Supabase

```bash
# Listar todos os secrets
supabase secrets list

# Deve mostrar algo como:
# GEMINI_API_KEY=AIzaSy...
```

### Passo 3: Verificar Edge Function

```bash
# Verificar se a função está deployada
supabase functions list

# Se não estiver, deployar:
supabase functions deploy ai
```

### Passo 4: Testar Edge Function

```bash
# Usar o script de teste completo
npm run test:edge-functions
```

## Formato Correto da API Key

- **Começa com**: `AIza`
- **Tamanho**: ~39 caracteres
- **Exemplo**: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456789`

## Checklist de Resolução

- [ ] API key obtida em https://makersuite.google.com/app/apikey
- [ ] API "Generative Language API" habilitada no Google Cloud Console
- [ ] API key configurada no Supabase (`supabase secrets set GEMINI_API_KEY=...`)
- [ ] Edge Function `/ai` está deployada (`supabase functions deploy ai`)
- [ ] Teste local passou (`npm run test:gemini`)
- [ ] Teste da Edge Function passou (`npm run test:edge-functions`)

## Suporte Adicional

Se o problema persistir:

1. Verifique os logs da Edge Function:

   ```bash
   supabase functions logs ai
   ```

2. Verifique se há limites de quota no Google Cloud Console

3. Verifique se a API key não foi restrita por IP/domínio no Google Cloud Console

## Referências

- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Google Cloud Console - APIs](https://console.cloud.google.com/apis/library)
- [Supabase Edge Functions Secrets](https://supabase.com/docs/guides/functions/secrets)
