# 🚀 Configuração Supabase para TestFlight - Checklist Rápido

Guia rápido para resolver problemas de conexão com Supabase no TestFlight.

## ⚠️ Problema Comum

**Sintoma:** App instalado via TestFlight não consegue conectar ao Supabase (tela em branco, erros de autenticação, etc.)

**Causa:** Variáveis de ambiente do Supabase não estão configuradas como EAS Secrets ou não estão no `eas.json`.

---

## ✅ Checklist de Configuração

### 1. Verificar Status Atual

```bash
# Listar todos os secrets configurados
eas env:list
```

**Resultado esperado:** Deve mostrar pelo menos:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` ⚠️ **CRÍTICO**
- `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL`

---

### 2. Configurar EAS Secrets (se faltando)

Execute estes comandos **um por vez**:

```bash
# 1. Supabase URL
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co" --scope project

# 2. Supabase Anon Key (MAIS IMPORTANTE!)
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYWhrcWZweW55cGJtaHRmZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzcyMTQsImV4cCI6MjA4MTE1MzIxNH0.NBDr1-eUGnOeQIYnWOwxTBZwCzA7E7M_V88iRndajYc" --scope project

# 3. Supabase Functions URL
eas env:create --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1" --scope project
```

**Nota:** Se algum secret já existir, você verá um erro. Nesse caso:

```bash
# Deletar secret existente
eas env:delete EXPO_PUBLIC_SUPABASE_ANON_KEY

# Criar novamente
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..." --scope project
```

---

### 3. Verificar eas.json

O arquivo `eas.json` deve ter estas variáveis no profile `production`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://lqahkqfpynypbmhtffyi.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL": "https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1"
      }
    }
  }
}
```

**Status:** ✅ Já atualizado no projeto

---

### 4. Validar Configuração

```bash
# Verificar cada secret individualmente
eas env:get EXPO_PUBLIC_SUPABASE_URL
eas env:get EXPO_PUBLIC_SUPABASE_ANON_KEY
eas env:get EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL
```

**Resultado esperado:** Cada comando deve retornar o valor correto.

---

### 5. Fazer Novo Build

```bash
# Build de produção para iOS
eas build --platform ios --profile production
```

**Tempo estimado:** 15-30 minutos

**O que acontece:**

- EAS usa os secrets configurados + variáveis do `eas.json`
- Build é criado com todas as credenciais do Supabase
- Você receberá notificação quando concluir

---

### 6. Submeter para TestFlight

```bash
# Submeter build mais recente
eas submit --platform ios --latest
```

**Ou manualmente:**

- Build aparecerá automaticamente no App Store Connect → TestFlight
- Aguardar processamento (5-10 minutos)
- Testar conexão com Supabase no app instalado

---

## 🔍 Validação Final

Após instalar o app via TestFlight:

1. ✅ App abre sem tela em branco
2. ✅ Login funciona (email/senha ou OAuth)
3. ✅ Dados carregam do Supabase
4. ✅ Funcionalidades que dependem do Supabase funcionam

---

## 🆘 Troubleshooting

### Erro: "Secret already exists"

```bash
# Deletar secret existente
eas env:delete EXPO_PUBLIC_SUPABASE_ANON_KEY

# Criar novamente com valor correto
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..." --scope project
```

### App ainda não conecta após build

1. **Verificar profile usado:**

   ```bash
   # Deve usar --profile production
   eas build --platform ios --profile production
   ```

2. **Verificar scope dos secrets:**

   ```bash
   # Deve ser --scope project (não account)
   eas env:list
   ```

3. **Verificar logs do build:**
   - Acesse: https://expo.dev/accounts/[seu-usuario]/projects/nossamaternidade/builds
   - Verifique se há erros relacionados a variáveis de ambiente

4. **Testar localmente primeiro:**

   ```bash
   # Criar .env.local com as mesmas variáveis
   EXPO_PUBLIC_SUPABASE_URL=https://lqahkqfpynypbmhtffyi.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1

   # Testar no Expo Go ou Development Build
   npm start
   ```

---

## 📋 Resumo dos Comandos

```bash
# 1. Verificar
eas env:list

# 2. Configurar (se faltando)
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co" --scope project
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." --scope project
eas env:create --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1" --scope project

# 3. Validar
eas env:get EXPO_PUBLIC_SUPABASE_ANON_KEY

# 4. Build
eas build --platform ios --profile production

# 5. Submeter
eas submit --platform ios --latest
```

---

## 🔗 Links Relacionados

- [COMANDOS_EAS_SECRETS.txt](../../COMANDOS_EAS_SECRETS.txt) - Comandos prontos para copiar/colar
- [docs/EAS_SECRETS_SETUP.md](./EAS_SECRETS_SETUP.md) - Guia completo de configuração
- [eas.json](../../eas.json) - Configuração de builds

---

**Última atualização:** Janeiro 2025
