# Configuração de MCPs no Windows - Guia Rápido

Este guia é específico para **Windows** e mostra como configurar os MCPs necessários para o app iOS-Android.

## 🚀 Setup Automático

Execute o script PowerShell:

```powershell
.\scripts\setup-mcps.ps1
```

O script irá:

- ✅ Verificar instalações existentes
- ✅ Criar arquivo de exemplo de configuração
- ✅ Mostrar instruções para cada MCP

## 📋 Configuração Manual

### 1. Localizar Arquivo de Configuração

No Windows, o arquivo de configuração do Cursor fica em:

```
%APPDATA%\Cursor\User\settings.json
```

Ou alternativamente:

```
%APPDATA%\Cursor\User\globalStorage\mcp.json
```

**Caminho completo exemplo:**

```
C:\Users\SeuUsuario\AppData\Roaming\Cursor\User\settings.json
```

### 2. Adicionar MCPs ao settings.json

Abra o arquivo `settings.json` e adicione a seção `mcpServers`:

```json
{
  "mcpServers": {
    "expo-mcp": {
      "description": "Expo MCP Server para builds iOS/Android",
      "transport": "http",
      "url": "https://mcp.expo.dev/mcp"
    },
    "context7": {
      "description": "Documentação atualizada de libraries",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "memory-keeper": {
      "description": "Persistência de contexto entre sessões",
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"],
      "env": {
        "MCP_MEMORY_DB_PATH": ".claude/context.db"
      }
    },
    "playwright": {
      "description": "Testes visuais automatizados",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-playwright"]
    }
  }
}
```

### 3. Via Cursor Settings (Interface Gráfica)

1. Abra Cursor Settings: `Ctrl+,`
2. Busque por "MCP" ou "Model Context Protocol"
3. Clique em "Add Server" ou "Configure MCP Servers"
4. Adicione cada servidor:

   **Expo MCP:**
   - Name: `expo-mcp`
   - Transport: `HTTP`
   - URL: `https://mcp.expo.dev/mcp`

   **Context7:**
   - Name: `context7`
   - Command: `npx`
   - Args: `-y`, `@upstash/context7-mcp`

   **Memory Keeper:**
   - Name: `memory-keeper`
   - Command: `npx`
   - Args: `-y`, `mcp-memory-keeper`
   - Env: `MCP_MEMORY_DB_PATH` = `.claude/context.db`

## ✅ Verificação

Após configurar, verifique se os MCPs estão disponíveis:

1. **No Cursor**: As ferramentas MCP aparecem automaticamente (começam com `mcp_`)
2. **Teste Expo MCP**: Tente usar uma ferramenta como `mcp_Expo_*` (se disponível)
3. **Teste Context7**: Use `mcp_Context7_resolve-library-id` para testar

## 🔧 MCPs Essenciais para iOS/Android

### 1. Expo MCP ⭐ ESSENCIAL

**Por quê:** Gerencia builds iOS/Android via EAS, OTA updates, validação de config

**Configuração:**

```json
{
  "expo-mcp": {
    "transport": "http",
    "url": "https://mcp.expo.dev/mcp"
  }
}
```

**Autenticação:**

```powershell
# Login no Expo
npx expo login
# ou
eas login
```

### 2. Supabase MCP ✅ Já Disponível

**Status:** Configurado automaticamente quando Supabase CLI está instalado

**Verificação:**

```powershell
supabase --version
supabase login
supabase link --project-ref <SEU_PROJECT_REF>
```

### 3. Context7 MCP ✅ Já Disponível

**Status:** Já disponível via ferramentas MCP do Cursor

**Uso:** Documentação atualizada de React Navigation, Expo, Supabase, etc.

### 4. Cursor IDE Browser MCP ✅ Integrado

**Status:** Já disponível (integrado no Cursor)

**Uso:** Debug de localhost, testes visuais no Expo Web

## 🐛 Troubleshooting

### "MCP server not found"

1. Verifique se o arquivo `settings.json` está no local correto
2. Verifique a sintaxe JSON (use um validador online)
3. Reinicie o Cursor após modificar `settings.json`

### "Expo MCP authentication failed"

1. Execute: `npx expo login` ou `eas login`
2. Verifique se você tem acesso ao projeto Expo
3. Tente autenticar via OAuth 2.0 (se disponível na interface)

### "Context7 não funciona"

- Context7 já está disponível via ferramentas MCP
- Não requer configuração adicional
- Se não aparecer, reinicie o Cursor

### Arquivo settings.json não existe

1. Crie o diretório se necessário: `%APPDATA%\Cursor\User\`
2. Crie o arquivo `settings.json` com conteúdo mínimo:
   ```json
   {
     "mcpServers": {}
   }
   ```
3. Adicione os MCPs conforme o guia acima

## 📚 Referências

- **Documentação completa**: `docs/MCP_SETUP.md`
- **Arquivo de exemplo**: `.claude/mcp-settings-example.json`
- **Script de setup**: `scripts/setup-mcps.ps1`

## 🎯 Checklist Rápido

- [ ] Executei `.\scripts\setup-mcps.ps1`
- [ ] Configurei Expo MCP (essencial para builds)
- [ ] Verifiquei Supabase CLI (`supabase login`)
- [ ] Reiniciei o Cursor após configuração
- [ ] Testei uma ferramenta MCP (ex: `mcp_Context7_*`)
