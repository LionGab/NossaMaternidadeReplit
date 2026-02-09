# MCP Quick Start - Nossa Maternidade

Guia rápido para configurar e verificar MCPs no Cursor IDE.

## ✅ Configuração Automática (Windows)

Execute o script de configuração:

```powershell
.\scripts\configure-mcps-cursor-v2.ps1
```

Isso irá:

- ✅ Adicionar todos os MCPs necessários ao `settings.json` do Cursor
- ✅ Configurar Expo MCP (essencial para builds iOS/Android)
- ✅ Configurar Context7, Memory, Playwright e Figma MCPs

## 🔍 Verificação

Após configurar, verifique se os MCPs foram adicionados:

```powershell
.\scripts\verify-mcps.ps1
```

## 🔄 Reiniciar Cursor

**IMPORTANTE:** Após configurar, você **DEVE** reiniciar o Cursor para que os MCPs sejam carregados.

1. Feche completamente o Cursor
2. Abra novamente
3. Os MCPs estarão disponíveis nas ferramentas (começam com `mcp_`)

## 📋 MCPs Configurados

### 1. Expo MCP ⭐ ESSENCIAL

- **Transport:** HTTP
- **URL:** https://mcp.expo.dev/mcp
- **Uso:** Builds iOS/Android via EAS, OTA updates

### 2. Context7 MCP

- **Command:** npx @upstash/context7-mcp
- **Uso:** Documentação atualizada de libraries

### 3. Memory Keeper MCP

- **Command:** npx mcp-memory-keeper
- **Uso:** Persistência de contexto entre sessões

### 4. Playwright MCP

- **Command:** npx @anthropic/mcp-server-playwright
- **Uso:** Testes visuais automatizados

### 5. Figma DevMode MCP

- **Transport:** SSE
- **URL:** http://127.0.0.1:3845/sse
- **Uso:** Design-to-code (requer Figma Desktop)

## 🧪 Testar MCPs

Após reiniciar o Cursor, teste se os MCPs estão funcionando:

1. **Context7:** Use `mcp_Context7_resolve-library-id` para buscar docs
2. **Supabase:** Use `mcp_Supabase_list_projects` (se configurado)
3. **Browser:** Use `mcp_cursor-ide-browser_browser_navigate` para navegar

## 🐛 Troubleshooting

### MCPs não aparecem após reiniciar

1. Verifique o arquivo: `%APPDATA%\Cursor\User\settings.json`
2. Confirme que a seção `mcpServers` existe
3. Verifique a sintaxe JSON (use um validador)
4. Execute `.\scripts\verify-mcps.ps1` para diagnóstico

### Expo MCP não funciona

1. Autentique no Expo: `npx expo login` ou `eas login`
2. Verifique se a URL está correta: `https://mcp.expo.dev/mcp`
3. Reinicie o Cursor após autenticar

### Erro de permissão

Se o script não conseguir escrever em `settings.json`:

1. Feche o Cursor
2. Execute o script novamente
3. Abra o Cursor

## 📚 Documentação Completa

- **Guia Windows:** `docs/MCP_SETUP_WINDOWS.md`
- **Guia Geral:** `docs/MCP_SETUP.md`
- **Exemplo de Config:** `.claude/mcp-settings-example.json`
