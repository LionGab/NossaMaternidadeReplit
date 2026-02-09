# Environment Variables Quick Reference - Nossa Maternidade

Referência rápida de todas as variáveis de ambiente usadas no projeto.

---

## 🔴 Obrigatórias

Essas variáveis são **necessárias** para o app funcionar.

| Variável                             | Descrição                       | Onde Obter                                      |
| ------------------------------------ | ------------------------------- | ----------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`           | URL do projeto Supabase         | https://app.supabase.com/project/_/settings/api |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`      | Chave anônima (anon/public key) | https://app.supabase.com/project/_/settings/api |
| `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL` | URL das Edge Functions          | `https://[projeto].supabase.co/functions/v1`    |

---

## 🟡 Recomendadas

Essas variáveis são **recomendadas** para features principais funcionarem.

| Variável                             | Descrição                        | Feature                    | Onde Obter                                                  |
| ------------------------------------ | -------------------------------- | -------------------------- | ----------------------------------------------------------- |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY`     | Chave pública RevenueCat iOS     | In-App Purchases (iOS)     | https://app.revenuecat.com/apps/[app-ios]/configuration     |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | Chave pública RevenueCat Android | In-App Purchases (Android) | https://app.revenuecat.com/apps/[app-android]/configuration |

---

## 🟢 Opcionais

Essas variáveis são **opcionais** e habilitam features específicas.

| Variável                          | Descrição              | Feature           | Onde Obter                              |
| --------------------------------- | ---------------------- | ----------------- | --------------------------------------- |
| `EXPO_PUBLIC_IMGUR_CLIENT_ID`     | Client ID do Imgur     | Upload de imagens | https://api.imgur.com/oauth2/addclient  |
| `EXPO_PUBLIC_ELEVENLABS_VOICE_ID` | Voice ID do ElevenLabs | Voz da NathIA     | https://elevenlabs.io/app/voice-library |

---

## 🎛️ Feature Flags

Variáveis booleanas para habilitar/desabilitar features.

| Variável                           | Padrão  | Descrição                |
| ---------------------------------- | ------- | ------------------------ |
| `EXPO_PUBLIC_ENABLE_AI_FEATURES`   | `true`  | Habilitar features de IA |
| `EXPO_PUBLIC_ENABLE_GAMIFICATION`  | `true`  | Habilitar gamificação    |
| `EXPO_PUBLIC_ENABLE_ANALYTICS`     | `false` | Habilitar analytics      |
| `EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED` | `true`  | Habilitar login social   |

---

## ⚠️ Variáveis NÃO Expostas ao Cliente

**NUNCA** use `EXPO_PUBLIC_*` para essas variáveis. Elas devem ficar **somente** em **Supabase Secrets** e serem usadas **apenas** dentro das **Supabase Edge Functions**.

| Variável Supabase    | Provedor           | Uso                         |
| -------------------- | ------------------ | --------------------------- |
| `OPENAI_API_KEY`     | OpenAI             | Edge Function `/ai`         |
| `GEMINI_API_KEY`     | Google AI (Gemini) | Edge Function `/ai`         |
| `ANTHROPIC_API_KEY`  | Anthropic (Claude) | Edge Function `/ai`         |
| `PERPLEXITY_API_KEY` | Perplexity         | Edge Function `/ai`         |
| `ELEVENLABS_API_KEY` | ElevenLabs         | Edge Function `/elevenlabs` |

**Fluxo correto:**

```
✅ App → Edge Function → Provedor de IA (secrets no Supabase)
❌ App → Provedor de IA (key embutida no bundle)
```

---

## 📝 Como Configurar

### Desenvolvimento Local

1. Copie `.env.example` para `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha os valores reais em `.env.local`

3. **NUNCA** commite `.env.local` (já está no `.gitignore`)

### Builds EAS (Production/Staging/Preview)

Configure via EAS CLI:

```bash
# Criar secret
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxxxx.supabase.co" --scope project

# Listar secrets
eas env:list

# Ver valor de um secret
eas env:get EXPO_PUBLIC_SUPABASE_URL

# Atualizar secret
eas env:update EXPO_PUBLIC_SUPABASE_URL --value "https://novo-valor.supabase.co"

# Deletar secret
eas env:delete EXPO_PUBLIC_SUPABASE_URL
```

**Documentação completa:** Veja `docs/EAS_SECRETS_SETUP.md`

---

## 🔍 Validação

### Verificar Variáveis Configuradas

```bash
# Verificar variáveis locais (.env.local)
bun run check-env

# Verificar secrets EAS
eas env:list
```

### Script de Validação

O script `scripts/check-env.js` verifica:

- ✅ Se `.env.local` existe
- ✅ Se variáveis obrigatórias estão configuradas
- ✅ Se valores não são placeholders
- ⚠️ Se variáveis recomendadas estão configuradas (warning se não)

---

## 🚨 Segurança

### ✅ Fazer

- ✅ Usar `EXPO_PUBLIC_*` apenas para chaves **públicas** (Supabase anon key, RevenueCat public keys)
- ✅ Colocar API keys privadas em **Supabase Secrets** (não em `EXPO_PUBLIC_*`)
- ✅ Usar Edge Functions para chamadas que requerem API keys privadas
- ✅ Validar variáveis antes de fazer build (`bun run check-env`)

### ❌ NÃO Fazer

- ❌ Commitar `.env.local` no git
- ❌ Colocar API keys privadas em `EXPO_PUBLIC_*`
- ❌ Hardcodear secrets no `eas.json` (usar EAS Secrets)
- ❌ Expor secrets em logs ou PRs

---

## 📚 Referências

- **Template:** `.env.example`
- **Validação:** `scripts/check-env.js`
- **EAS Secrets:** `docs/EAS_SECRETS_SETUP.md`
- **Build Guide:** `docs/BUILD_QUICKSTART.md`

---

**Última atualização:** 04 Jan 2026
