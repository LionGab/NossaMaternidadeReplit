# Configuração Completa de MCPs - Nossa Maternidade

**Última atualização**: 26 de dezembro de 2025

## 📊 Status Atual dos MCPs

### ✅ Servidores Ativos e Configurados

| Servidor                | Status           | Transport | Descrição                       |
| ----------------------- | ---------------- | --------- | ------------------------------- |
| **Filesystem**          | ✅ Rodando       | STDIO     | Acesso ao filesystem do projeto |
| **Supabase**            | ✅ Ativo         | -         | Gerenciamento de banco de dados |
| **Sequential Thinking** | ✅ Ativo         | -         | Raciocínio estruturado          |
| **Context7**            | ✅ Disponível    | -         | Documentação atualizada de libs |
| **Playwright**          | ✅ Disponível    | -         | Testes visuais web              |
| **Expo MCP**            | ✅ Configurado   | HTTP      | Integração com Expo             |
| **Figma DevMode**       | ⚠️ Configurado\* | SSE       | Design-to-code                  |

\*Figma requer: Desktop App aberto + Dev Mode habilitado

---

## 🔧 Configuração Detalhada

### 1. Filesystem MCP ✅

**Status**: Rodando e testado

**Configuração**:

```json
{
  "transport": "stdio",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-filesystem", "/Users/lion/Documents/Lion/NossaMaternidade"]
}
```

**Capabilities**:

- `read_file` - Ler arquivos do projeto
- `write_file` - Escrever arquivos
- `list_directory` - Listar diretórios
- `get_file_info` - Obter informações de arquivos

**Teste via Inspector**:

```bash
npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/lion/Documents/Lion/NossaMaternidade
```

**URL do Inspector**: `http://localhost:6274`

---

### 2. Figma DevMode MCP ⚠️

**Status**: Configurado, mas requer ação manual

**Pré-requisitos**:

1. Figma Desktop App instalado e aberto
2. Dev Mode MCP Server habilitado
3. Arquivo do design aberto no Figma

**Como habilitar**:

1. Abra o Figma Desktop App
2. Vá em: **Figma > Preferences > Developer**
3. Habilite: **"Enable Dev Mode MCP Server"**
4. O servidor roda em: `http://127.0.0.1:3845/sse`

**Configuração atual**:

```json
{
  "transport": "sse",
  "url": "http://127.0.0.1:3845/sse",
  "fileKey": "FIGMA_FILE_KEY_REQUIRED"
}
```

**Como obter o fileKey**:

1. Abra o arquivo do design no Figma
2. Copie a URL da barra de endereço:
   ```
   https://www.figma.com/design/{FILE_KEY}/Nome-do-Arquivo
   ```
3. O `FILE_KEY` é a string entre `/design/` e `/Nome-do-Arquivo`
4. Atualize em `.claude/mcp-config.json`:
   ```json
   "figmaFile": {
     "fileKey": "SEU_FILE_KEY_AQUI"
   }
   ```

**Capabilities disponíveis** (quando configurado):

- `figma_get_file` - Obter informações do arquivo
- `figma_get_node` - Obter detalhes de um nó específico
- `figma_get_styles` - Obter estilos (cores, tipografia)
- `figma_get_components` - Listar componentes
- `figma_get_variables` - Obter design tokens/variáveis
- `figma_screenshot` - Capturar screenshot

**Verificação**:

```bash
# Verificar se o servidor está rodando
curl http://127.0.0.1:3845/sse

# Ou testar via MCP
# (requer arquivo aberto no Figma)
```

---

### 3. Supabase MCP ✅

**Status**: Ativo e configurado

**Capabilities**:

- `list_projects` - Listar projetos Supabase
- `get_tables` - Obter tabelas do banco
- `run_query` - Executar queries SQL
- `create_migration` - Criar migrations
- `get_advisors` - Obter recomendações de segurança/performance

**Configuração**: Automática via Supabase CLI

---

### 4. Context7 MCP ✅

**Status**: Disponível

**Capabilities**:

- `get_library_docs` - Obter documentação atualizada

**Bibliotecas suportadas**:

- react-navigation
- expo-notifications
- supabase-js
- react-native-reanimated
- nativewind

---

### 5. Playwright MCP ✅

**Status**: Disponível

**Capabilities**:

- `browser_navigate` - Navegar em URLs
- `browser_snapshot` - Capturar snapshot acessível
- `browser_screenshot` - Tirar screenshot
- `browser_click` - Clicar em elementos
- `browser_type` - Digitar texto

---

### 6. Expo MCP ✅

**Status**: Configurado (HTTP remoto)

**URL**: `https://mcp.expo.dev/mcp`

**Requer**:

- Expo account autenticado
- SDK 54+

**Capabilities**:

- `learn` - Aprender sobre Expo
- `search_documentation` - Buscar documentação
- `add_library` - Adicionar bibliotecas
- `screenshot` (local) - Capturar screenshots
- `tap_automation` (local) - Automação de toques

---

## 📝 Checklist de Configuração

### MCPs Básicos (Já Configurados) ✅

- [x] Filesystem MCP
- [x] Supabase MCP
- [x] Context7 MCP
- [x] Playwright MCP
- [x] Expo MCP
- [x] Sequential Thinking

### MCPs que Requerem Ação Manual ⚠️

- [ ] **Figma DevMode** - Abrir Figma Desktop + Habilitar Dev Mode
- [ ] **Figma fileKey** - Obter da URL do arquivo e atualizar config

---

## 🚀 Como Usar os MCPs

### Via Cursor/Claude Code

Os MCPs estão automaticamente disponíveis quando você usa o Cursor. Basta mencionar o que precisa:

```
"Use o Supabase MCP para listar as tabelas do projeto"
"Use o Figma MCP para obter as cores do design"
"Use o Filesystem MCP para ler o arquivo package.json"
```

### Via MCP Inspector

Para testar e debugar servidores MCP:

```bash
# Filesystem
npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/lion/Documents/Lion/NossaMaternidade

# Outros servidores
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
```

---

## 🔍 Troubleshooting

### Figma MCP não conecta

1. Verifique se o Figma Desktop está aberto
2. Verifique se o Dev Mode MCP está habilitado:
   - Figma > Preferences > Developer > Enable Dev Mode MCP Server
3. Teste a conexão:
   ```bash
   curl http://127.0.0.1:3845/sse
   ```
4. Reinicie o Figma Desktop se necessário

### Filesystem MCP não funciona

1. Verifique se o caminho está correto em `.claude/mcp-config.json`
2. Verifique permissões do diretório
3. Teste via Inspector para ver erros detalhados

### Expo MCP não funciona

1. Verifique se está autenticado: `npx expo login`
2. Verifique se o projeto está linkado: `npx expo whoami`
3. Reinicie o Cursor após configurar

---

## 📚 Documentação Adicional

- [MCP Setup Guide](./MCP_SETUP.md) - Guia completo de setup
- [MCP Quick Start](./MCP_QUICK_START.md) - Início rápido
- [Figma Setup](./.claude/commands/figma-setup.md) - Setup específico do Figma

---

## 🎯 Próximos Passos

1. **Configurar Figma fileKey** (quando tiver o arquivo aberto)
2. **Testar capabilities** via Inspector
3. **Usar MCPs** no desenvolvimento diário

---

**Última verificação**: 26/12/2025
**Status geral**: ✅ 6/7 MCPs configurados e funcionando
