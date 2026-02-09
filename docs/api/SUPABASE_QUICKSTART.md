# 🚀 Supabase - Guia de Setup Rápido

Configuração completa do Supabase em **5 minutos**.

---

## 📋 ANTES DE COMEÇAR

**Pré-requisitos:**

- ✅ Conta no Supabase ([criar aqui](https://app.supabase.com))
- ✅ Node.js 22+ instalado
- ✅ Git Bash (Windows) ou Terminal (Mac/Linux)

---

## 🎯 PASSO 1: Criar Projeto no Supabase

1. Acesse: https://app.supabase.com
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: Nossa Maternidade
   - **Database Password**: Crie uma senha forte (GUARDE!)
   - **Region**: South America (São Paulo)
   - **Plan**: Free (para desenvolvimento)
4. Aguarde ~2 minutos para provisionar

---

## 🔑 PASSO 2: Obter Credenciais

1. No seu projeto, vá em **Settings** → **API**
2. Copie as seguintes informações:

```
Project URL:    https://seu-projeto-id.supabase.co
anon public:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 PASSO 3: Configurar Variáveis Locais

1. **Copie o template:**

```bash
cp .env.example .env.local
```

2. **Edite `.env.local`** e preencha:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto-id.supabase.co/functions/v1
```

3. **Verifique se está correto:**

```bash
npm run check-env
```

Deve aparecer: ✅ Tudo configurado corretamente!

---

## 🗄️ PASSO 4: Aplicar Schema do Banco

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **"New query"**
3. Copie **TODO o conteúdo** de `supabase-setup.sql`
4. Cole no editor SQL
5. Clique em **"Run"**

**Resultado esperado:**

```
Success. No rows returned
```

---

## 🔐 PASSO 5: Habilitar Autenticação

1. Vá em **Authentication** → **Providers**
2. Habilite **Email** (já vem habilitado por padrão)
3. (Opcional) Configure **Google OAuth**:
   - Clique em Google
   - Adicione Client ID e Secret do Google Console
   - Salve

---

## 🧪 PASSO 6: Testar Conexão

Execute o app:

```bash
npm start
```

Pressione `w` para abrir no navegador.

**Teste:**

1. Crie uma conta no app (Onboarding)
2. Verifique no Supabase: **Authentication** → **Users**
3. Deve aparecer o usuário criado ✅

---

## 🚀 PASSO 7: Deploy Edge Functions (Opcional)

**Instale Supabase CLI:**

```bash
# Windows (Chocolatey)
choco install supabase

# Mac
brew install supabase/tap/supabase

# Linux
brew install supabase/tap/supabase
```

**Login e deploy:**

```bash
supabase login
supabase link --project-ref seu-projeto-id
supabase functions deploy
```

---

## ✅ CHECKLIST FINAL

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas
- [ ] `.env.local` configurado
- [ ] `npm run check-env` passou
- [ ] Schema SQL aplicado
- [ ] Autenticação por Email habilitada
- [ ] App conectando com sucesso

---

## 🔍 VERIFICAÇÃO DE SUCESSO

**Teste 1: Variáveis configuradas**

```bash
npm run check-env
# Esperado: ✅ Tudo configurado corretamente!
```

**Teste 2: TypeScript compilando**

```bash
npx tsc --noEmit
# Esperado: Sem erros
```

**Teste 3: App rodando**

```bash
npm start
# Pressione 'w' para web
# Esperado: App abre sem erros
```

**Teste 4: Criar conta**

- Abra o app
- Complete onboarding
- Crie uma conta
- Verifique no Supabase Dashboard → Authentication

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Supabase URL is undefined"

**Solução:**

```bash
# Verifique se .env.local existe
ls -la .env.local

# Verifique o conteúdo
cat .env.local

# Re-execute check-env
npm run check-env
```

### ❌ "Invalid API key"

**Solução:**

- Copie novamente a chave do Dashboard
- Certifique-se de copiar **anon public** (não service_role)
- Não deve ter espaços extras

### ❌ "relation 'users' does not exist"

**Solução:**

- Volte ao SQL Editor
- Execute `supabase-setup.sql` novamente
- Verifique se todas as tabelas foram criadas:
  - users, posts, comments, likes, habits, habit_completions

### ❌ "Row Level Security policy violation"

**Solução:**

- RLS está habilitado (correto!)
- Certifique-se de estar autenticado no app
- Verifique políticas no SQL Editor

---

## 📚 PRÓXIMOS PASSOS

Após configurar Supabase:

1. **Aplicar migrations:**

   ```bash
   # Execute cada arquivo em ordem (001, 002, 003...)
   # Via SQL Editor no Supabase Dashboard
   ```

2. **Configurar APIs de IA** (opcional):
   - OpenAI para NathIA
   - Ver `.env.example` para outras APIs

3. **Configurar EAS Secrets** (para build):
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "..."
   ```

---

## 🔗 LINKS ÚTEIS

- **Supabase Dashboard**: https://app.supabase.com
- **Documentação Supabase**: https://supabase.com/docs
- **SQL Editor**: https://app.supabase.com/project/_/sql
- **Auth Settings**: https://app.supabase.com/project/_/auth/users
- **API Keys**: https://app.supabase.com/project/_/settings/api

---

## 💡 DICAS

- 🔒 **NUNCA** commite `.env.local` no Git (já está no .gitignore)
- 📝 Salve a senha do banco em um gerenciador de senhas
- 🔄 Execute `npm run check-env` sempre que mudar variáveis
- 🚀 Use `npm run quality-gate` antes de cada PR

---

**Configuração completa!** 🎉

Agora você pode desenvolver com Supabase totalmente funcional.
