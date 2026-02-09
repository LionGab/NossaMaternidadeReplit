# Como Obter Supabase Access Token

## 📋 O que é

O **Supabase Access Token** (formato `sbp_...`) é necessário para usar o Supabase CLI para gerenciar secrets, deployments, etc.

## 🔑 Como Obter

### Opção 1: Dashboard do Supabase

1. Acesse: https://app.supabase.com/account/tokens
2. Clique em **"Generate new token"**
3. Dê um nome (ex: "CLI Development")
4. Copie o token gerado (formato: `sbp_0102...1920`)

### Opção 2: Via CLI (se já estiver logado)

```bash
# Verificar se está logado
npx supabase projects list

# Se não estiver, fazer login
npx supabase login
```

## ⚙️ Como Configurar

### Windows PowerShell

```powershell
# Temporário (apenas para esta sessão)
$env:SUPABASE_ACCESS_TOKEN="sbp_0102...1920"

# Permanente (adiciona ao perfil do PowerShell)
[System.Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", "sbp_0102...1920", "User")
```

### Windows CMD

```cmd
# Temporário
set SUPABASE_ACCESS_TOKEN=sbp_0102...1920

# Permanente
setx SUPABASE_ACCESS_TOKEN "sbp_0102...1920"
```

### Linux/Mac

```bash
# Temporário
export SUPABASE_ACCESS_TOKEN="sbp_0102...1920"

# Permanente (adiciona ao ~/.bashrc ou ~/.zshrc)
echo 'export SUPABASE_ACCESS_TOKEN="sbp_0102...1920"' >> ~/.bashrc
source ~/.bashrc
```

## ✅ Verificar se Funcionou

```bash
# Deve listar os projetos sem erro
npx supabase projects list

# Deve listar os secrets
npx supabase secrets list
```

## 🔒 Segurança

- **NUNCA** commite o token no git
- **NUNCA** compartilhe o token publicamente
- Use tokens diferentes para desenvolvimento e produção
- Revogue tokens antigos quando não precisar mais

## 📚 Referências

- [Supabase CLI Docs](https://supabase.com/docs/reference/cli/introduction)
- [Access Tokens](https://app.supabase.com/account/tokens)
