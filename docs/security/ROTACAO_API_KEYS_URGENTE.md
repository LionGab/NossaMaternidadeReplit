# 🚨 AÇÃO URGENTE: Rotação de API Keys Expostas

**✅ PREPARADO EM**: 31 de Dezembro, 2025
**⚠️ STATUS**: Script fixado - AGUARDANDO rotação manual das keys

**Data**: 29 de Dezembro, 2025
**Prioridade**: CRÍTICA
**Tempo estimado**: 30-60 minutos

---

## ⚠️ SITUAÇÃO

As seguintes API keys foram **acidentalmente expostas no histórico git** antes de serem removidas:

| Provedor   | Key Exposta (parcial)    | Status     | Risco |
| ---------- | ------------------------ | ---------- | ----- |
| OpenAI     | `sk-proj-xR0FURr5...`    | 🔴 EXPOSTA | Alto  |
| Anthropic  | `sk-ant-api03-izSIj0...` | 🔴 EXPOSTA | Alto  |
| Perplexity | `pplx-2uVTtoNF...`       | 🔴 EXPOSTA | Alto  |
| ElevenLabs | `cce41c222612...`        | 🔴 EXPOSTA | Médio |
| Gemini     | `AIzaSyA5IQtfm8T...`     | 🔴 EXPOSTA | Alto  |

**Ação imediata**: Rotacionar TODAS as keys e atualizar nos sistemas.

---

## 🔄 ROTAÇÃO PASSO A PASSO

### 1. OpenAI (ChatGPT/GPT-4)

#### 1.1 Revogar key antiga

1. Acesse: https://platform.openai.com/api-keys
2. Login com sua conta OpenAI
3. Encontre a key `sk-proj-xR0FURr5...`
4. Clique em **⋮** (três pontos) → **Revoke**
5. Confirme a revogação

#### 1.2 Criar nova key

1. Clique em **+ Create new secret key**
2. Nome: `NossaMaternidade-Production-2025`
3. Permissions: **All** (ou específicas se preferir)
4. **COPIE A KEY IMEDIATAMENTE** (só aparece uma vez!)
5. Formato: `sk-proj-xxxxx...`

#### 1.3 Atualizar no Supabase

```bash
# Via CLI
supabase secrets set OPENAI_API_KEY="sk-proj-[NOVA_KEY_AQUI]" --project-ref lqahkqfpynypbmhtffyi

# OU via Dashboard
# https://app.supabase.com/project/lqahkqfpynypbmhtffyi/settings/functions
# Edge Functions → Secrets → OPENAI_API_KEY → Update
```

---

### 2. Anthropic (Claude)

#### 2.1 Revogar key antiga

1. Acesse: https://console.anthropic.com/settings/keys
2. Login com sua conta Anthropic
3. Encontre a key `sk-ant-api03-izSIj0...`
4. Clique em **Delete** ou **Revoke**
5. Confirme

#### 2.2 Criar nova key

1. Clique em **Create Key**
2. Nome: `NossaMaternidade-Production`
3. **COPIE A KEY IMEDIATAMENTE**
4. Formato: `sk-ant-api03-xxxxx...`

#### 2.3 Atualizar no Supabase

```bash
supabase secrets set ANTHROPIC_API_KEY="sk-ant-api03-[NOVA_KEY_AQUI]" --project-ref lqahkqfpynypbmhtffyi
```

---

### 3. Perplexity AI

#### 3.1 Revogar key antiga

1. Acesse: https://www.perplexity.ai/settings/api
2. Login
3. Encontre a key `pplx-2uVTtoNF...`
4. Clique em **Delete** ou **Revoke**

#### 3.2 Criar nova key

1. Clique em **Generate New API Key**
2. Nome: `NossaMaternidade-Prod`
3. **COPIE A KEY**
4. Formato: `pplx-xxxxx...`

#### 3.3 Atualizar no Supabase

```bash
supabase secrets set PERPLEXITY_API_KEY="pplx-[NOVA_KEY_AQUI]" --project-ref lqahkqfpynypbmhtffyi
```

---

### 4. ElevenLabs (Text-to-Speech)

#### 4.1 Revogar key antiga

1. Acesse: https://elevenlabs.io/app/settings/api-keys
2. Login
3. Encontre a key `cce41c222612...`
4. Clique em **Regenerate** ou **Delete**

#### 4.2 Criar nova key

1. Se deletou: **Generate API Key**
2. Se regenerou: Key é automaticamente atualizada
3. **COPIE A KEY**

#### 4.3 Atualizar no Supabase

```bash
supabase secrets set ELEVENLABS_API_KEY="[NOVA_KEY_AQUI]" --project-ref lqahkqfpynypbmhtffyi
```

---

### 5. Google Gemini

#### 5.1 Revogar key antiga

1. Acesse: https://makersuite.google.com/app/apikey
2. Login com Google Account
3. Encontre a key `AIzaSyA5IQtfm8T...`
4. Clique em **⋮** → **Delete key**

#### 5.2 Criar nova key

1. Clique em **Create API Key**
2. Projeto: Selecione seu projeto Google Cloud
3. **COPIE A KEY**
4. Formato: `AIzaSy...`

#### 5.3 Atualizar no Supabase

```bash
supabase secrets set GEMINI_API_KEY="AIzaSy[NOVA_KEY_AQUI]" --project-ref lqahkqfpynypbmhtffyi
```

---

## ✅ VERIFICAÇÃO PÓS-ROTAÇÃO

### Via Supabase CLI

```bash
# Verificar se todas as secrets estão configuradas
supabase secrets list --project-ref lqahkqfpynypbmhtffyi

# Deve mostrar (valores ocultos):
# OPENAI_API_KEY=sk-proj-***
# ANTHROPIC_API_KEY=sk-ant-api03-***
# PERPLEXITY_API_KEY=pplx-***
# ELEVENLABS_API_KEY=***
# GEMINI_API_KEY=AIzaSy***
```

### Testar Supabase Edge Function

```bash
# Testar função AI
curl -i --location --request POST \
  'https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/ai' \
  --header 'Authorization: Bearer [SEU_SUPABASE_ANON_KEY]' \
  --header 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"Teste"}]}'

# Resposta esperada: 200 OK com texto gerado
# Se erro 500: Keys não configuradas ou inválidas
```

---

## 📋 CHECKLIST FINAL

Marque conforme for completando:

- [ ] OpenAI key revogada
- [ ] OpenAI nova key criada e copiada
- [ ] OpenAI key atualizada no Supabase
- [ ] Anthropic key revogada
- [ ] Anthropic nova key criada e copiada
- [ ] Anthropic key atualizada no Supabase
- [ ] Perplexity key revogada
- [ ] Perplexity nova key criada e copiada
- [ ] Perplexity key atualizada no Supabase
- [ ] ElevenLabs key revogada/regenerada
- [ ] ElevenLabs key atualizada no Supabase
- [ ] Gemini key revogada
- [ ] Gemini nova key criada e copiada
- [ ] Gemini key atualizada no Supabase
- [ ] Testado chamada à Edge Function `ai`
- [ ] Todas as secrets listadas no Supabase

---

## 🔒 BOAS PRÁTICAS (Para o Futuro)

### 1. NUNCA commitar secrets

```bash
# Adicionar ao .gitignore
echo "*.env*" >> .gitignore
echo "*.p8" >> .gitignore
echo "*.p12" >> .gitignore
echo "**/secrets/" >> .gitignore
```

### 2. Usar variáveis de ambiente locais

```bash
# Criar .env.local (já no .gitignore)
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...
ELEVENLABS_API_KEY=...
GEMINI_API_KEY=AIzaSy...
```

### 3. Rodar scripts com variáveis de ambiente

```bash
# Exemplo
export OPENAI_API_KEY="sk-proj-..."
bash scripts/setup-all-secrets-quick.sh
```

### 4. Usar GitHub Secrets para CI/CD

- Settings → Secrets and variables → Actions
- Nunca expor em logs ou outputs

---

## 🚨 SE HOUVER PROBLEMAS

### Keys não funcionam após rotação

```bash
# 1. Verificar se foi salva corretamente
supabase secrets list --project-ref lqahkqfpynypbmhtffyi

# 2. Re-deploy das Edge Functions (aplica novas secrets)
npx supabase functions deploy ai --project-ref lqahkqfpynypbmhtffyi

# 3. Testar novamente
```

### Erro "Unauthorized" ou "Invalid API Key"

- Verificar se copiou a key completa (sem espaços)
- Verificar se a key tem permissões necessárias
- Aguardar 1-2 minutos (propagação)

---

## 📞 PRÓXIMA AÇÃO

Após completar esta rotação:

1. ✅ Marcar todas as checkboxes acima
2. ✅ Confirmar que testes passaram
3. ✅ Deletar este arquivo (já não será mais necessário)
4. ✅ Continuar com correções de acessibilidade

---

**⏱️ Tempo estimado total**: 30-60 minutos
**Prioridade**: FAZER AGORA antes de qualquer deploy

---

**Quando terminar, me avise para prosseguirmos com as correções de acessibilidade! 🚀**
