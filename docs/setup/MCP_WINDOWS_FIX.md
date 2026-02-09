# Correções de MCP para Windows - Nossa Maternidade

**Data:** 04 Jan 2026
**Status:** ✅ Configurações corrigidas

---

## ✅ Problemas Corrigidos

### 1. Wrapper `cmd /c` Adicionado

Todos os servidores MCP que usam `npx` agora têm o wrapper `cmd /c` para Windows:

**Antes:**

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

**Depois:**

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]
}
```

**Arquivos atualizados:**

- `.mcp.json` ✅
- `.claude/settings.json` ✅

---

### 2. Caminho do Memory Keeper Corrigido

O caminho do `MCP_MEMORY_DB_PATH` foi atualizado para Windows:

**Antes (macOS):**

```json
"MCP_MEMORY_DB_PATH": "/Users/lion/NossaMaternidade/.claude/context.db"
```

**Depois (Windows):**

```json
"MCP_MEMORY_DB_PATH": "C:\\Users\\User\\Desktop\\NossaMaternidade\\NossaMaternidade-1\\.claude\\context.db"
```

**Nota:** Se você estiver em outro diretório, atualize o caminho conforme necessário.

---

### 3. Variáveis de Ambiente do Supabase

O MCP do Supabase requer duas variáveis de ambiente:

- `SUPABASE_DB_URL` - URL de conexão do banco de dados
- `SUPABASE_ACCESS_TOKEN` - Token de acesso do Supabase

**Como configurar:**

#### Opção 1: Variáveis de Ambiente do Sistema (Windows)

1. Abra **Configurações do Sistema** → **Variáveis de Ambiente**
2. Adicione as variáveis:
   - `SUPABASE_DB_URL` = `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
   - `SUPABASE_ACCESS_TOKEN` = `seu-access-token-aqui`

3. Reinicie o Cursor/Claude Code

#### Opção 2: Arquivo `.env.local` (Recomendado) ✅ CONFIGURADO

O arquivo `.env.local` já foi criado com todas as variáveis necessárias:

```bash
# Supabase MCP (para Claude Code)
SUPABASE_DB_URL="postgres://postgres.igacnomjrgvdwycxlyla:wnRrL8o1YY1RAUDC@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
SUPABASE_ACCESS_TOKEN="***REMOVED***"
```

**Status:** ✅ Variáveis configuradas automaticamente

**Onde obter:**

- **SUPABASE_DB_URL**:
  - Acesse: https://app.supabase.com/project/[seu-projeto]/settings/database
  - Copie a **Connection string** (URI mode)
  - Substitua `[YOUR-PASSWORD]` pela senha do banco

- **SUPABASE_ACCESS_TOKEN**:
  - Acesse: https://app.supabase.com/account/tokens
  - Crie um novo token ou use um existente
  - Copie o token

**⚠️ IMPORTANTE:**

- NUNCA commite essas variáveis no git
- `.env.local` já está no `.gitignore`
- Use apenas para desenvolvimento local

---

### 4. Plugin Problemático

O plugin `compounding-engineering@every-marketplace` não foi encontrado no marketplace.

**Solução:** O plugin não está configurado no `.claude/settings.json` atual. Se você vê esse erro, pode ser de uma configuração global do Cursor. Para remover:

1. Abra Cursor Settings: `Ctrl+,`
2. Busque por "MCP" ou "Plugins"
3. Remova o plugin `compounding-engineering` se estiver listado

---

## 📋 Verificação Pós-Correção

Execute o diagnóstico MCP novamente no Claude Code para verificar:

```
MCP Config Diagnostics
```

**Resultado esperado:**

- ✅ Sem warnings de wrapper `cmd /c`
- ✅ Sem warnings de caminho do memory-keeper
- ⚠️ Warnings de variáveis de ambiente do Supabase (se não configuradas ainda)

---

## 🔧 Próximos Passos

1. **Configurar variáveis de ambiente do Supabase** (veja seção acima)
2. **Reiniciar Claude Code/Cursor** para aplicar mudanças
3. **Verificar diagnóstico MCP** novamente

---

## 📚 Referências

- **MCP Setup Windows:** `docs/MCP_SETUP_WINDOWS.md`
- **MCP Setup Geral:** `docs/MCP_SETUP.md`
- **Supabase Secrets:** `docs/EAS_SECRETS_SETUP.md`

---

**Última atualização:** 04 Jan 2026
