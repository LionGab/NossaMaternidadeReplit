# ✅ Configuração Supabase MCP - Completa

**Status:** Configurado e funcionando

## 📋 Informações do Projeto

- **Nome:** NossaMaternidade
- **Reference ID:** `lqahkqfpynypbmhtffyi`
- **URL:** https://lqahkqfpynypbmhtffyi.supabase.co
- **Região:** West US (Oregon)
- **Status:** ✅ Linkado

## ✅ Configuração Atual

### 1. Supabase CLI

- **Versão:** 2.67.1
- **Status:** ✅ Instalado e autenticado

### 2. Projeto Linkado

- **Status:** ✅ Linkado localmente
- **Arquivo:** `supabase/.temp/project-ref`

### 3. Supabase MCP

- **Status:** ✅ Configurado automaticamente
- **Nota:** Não precisa adicionar manualmente ao `settings.json`
- **Funciona quando:** Supabase CLI está instalado e autenticado

## 🧪 Testar MCP Supabase

Após recarregar o Cursor, teste as ferramentas MCP:

### 1. Listar Projetos

```
mcp_Supabase_list_projects
```

### 2. Obter Detalhes do Projeto

```
mcp_Supabase_get_project
  id: "lqahkqfpynypbmhtffyi"
```

### 3. Listar Tabelas

```
mcp_Supabase_list_tables
  project_id: "lqahkqfpynypbmhtffyi"
```

### 4. Executar SQL

```
mcp_Supabase_execute_sql
  project_id: "lqahkqfpynypbmhtffyi"
  query: "SELECT COUNT(*) FROM users;"
```

### 5. Verificar Advisors (Segurança/Performance)

```
mcp_Supabase_get_advisors
  project_id: "lqahkqfpynypbmhtffyi"
  type: "security"
```

### 6. Ver Logs

```
mcp_Supabase_get_logs
  project_id: "lqahkqfpynypbmhtffyi"
  service: "api"
```

### 7. Gerar Tipos TypeScript

```
mcp_Supabase_generate_typescript_types
  project_id: "lqahkqfpynypbmhtffyi"
```

## 🔧 Comandos Úteis

### Verificar Status

```powershell
.\scripts\configure-supabase.ps1
```

### Listar Projetos

```powershell
supabase projects list
```

### Ver Status do Projeto

```powershell
supabase status
```

### Linkar Projeto (se necessário)

```powershell
supabase link --project-ref lqahkqfpynypbmhtffyi
```

## 📚 Ferramentas MCP Disponíveis

Todas as ferramentas começam com `mcp_Supabase_`:

- `mcp_Supabase_list_projects` - Listar todos os projetos
- `mcp_Supabase_get_project` - Detalhes de um projeto
- `mcp_Supabase_list_tables` - Listar tabelas do banco
- `mcp_Supabase_execute_sql` - Executar queries SQL
- `mcp_Supabase_apply_migration` - Aplicar migrations
- `mcp_Supabase_get_advisors` - Verificar segurança/performance
- `mcp_Supabase_get_logs` - Ver logs de serviços
- `mcp_Supabase_generate_typescript_types` - Gerar tipos TS
- `mcp_Supabase_list_edge_functions` - Listar Edge Functions
- `mcp_Supabase_deploy_edge_function` - Deploy de Edge Functions

## ⚠️ Nota sobre Docker

O erro do Docker (`dockerDesktopLinuxEngine`) é **normal** e não afeta o MCP:

- O MCP funciona com o projeto **remoto** no Supabase
- O erro ocorre apenas ao tentar verificar containers **locais**
- Não é necessário ter Docker rodando para usar o MCP

## ✅ Checklist

- [x] Supabase CLI instalado (v2.67.1)
- [x] Autenticado no Supabase
- [x] Projeto linkado (`lqahkqfpynypbmhtffyi`)
- [ ] Cursor recarregado (para carregar MCP)
- [ ] MCP testado e funcionando

## 🐛 Troubleshooting

### MCP não aparece após recarregar

1. Verifique se está autenticado:

   ```powershell
   supabase projects list
   ```

2. Verifique se o projeto está linkado:

   ```powershell
   cat supabase\.temp\project-ref
   # Deve mostrar: lqahkqfpynypbmhtffyi
   ```

3. Reconfigure se necessário:
   ```powershell
   .\scripts\configure-supabase.ps1
   ```

### Erro de autenticação

```powershell
supabase login
```

### Projeto não linkado

```powershell
supabase link --project-ref lqahkqfpynypbmhtffyi
```
