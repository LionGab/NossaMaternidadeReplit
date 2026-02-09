# MCP para Navegação em Localhost - Guia Rápido

## ✅ Cursor IDE Browser MCP (Recomendado)

**Status**: ✅ **Já disponível** - Não requer configuração adicional

O **Cursor IDE Browser MCP** é o melhor para navegar e interagir com aplicações locais rodando no seu terminal/IDE.

### Funcionalidades Disponíveis

- ✅ Navegar URLs (localhost, 127.0.0.1, etc.)
- ✅ Capturar snapshots de acessibilidade
- ✅ Clicar em elementos
- ✅ Digitar em campos
- ✅ Ver console messages
- ✅ Ver network requests
- ✅ Redimensionar janela do browser

### Como Usar

#### 1. Navegar para Localhost

```
Navegue para http://localhost:8081 (Expo Web)
```

O Claude usará automaticamente:

- `mcp_cursor-ide-browser_browser_navigate({ url: "http://localhost:8081" })`

#### 2. Capturar Snapshot da Página

```
Me mostre o que está na página do Expo
```

O Claude capturará:

- `mcp_cursor-ide-browser_browser_snapshot()` - retorna estrutura de acessibilidade completa

#### 3. Interagir com Elementos

```
Clique no botão "Home" na página
```

O Claude usará:

- `mcp_cursor-ide-browser_browser_click({ element: "Home button", ref: "..." })`

#### 4. Ver Console/Network

```
Quais erros aparecem no console?
```

O Claude verificará:

- `mcp_cursor-ide-browser_browser_console_messages()`
- `mcp_cursor-ide-browser_browser_network_requests()`

### Exemplos Práticos

#### Expo Web (localhost:8081)

```
1. Navegue para http://localhost:8081
2. Capture um snapshot da página
3. Clique no tab "Comunidade"
4. Me mostre os erros do console
```

#### Supabase Studio (localhost:54323)

```
1. Navegue para http://localhost:54323
2. Capture snapshot
3. Clique em "Table Editor"
```

#### API Local (localhost:3000)

```
1. Navegue para http://localhost:3000/api/health
2. Capture snapshot
3. Verifique network requests para ver a resposta
```

## Alternativas

### Playwright MCP (Para Testes)

**Status**: ✅ Disponível

Melhor para:

- Testes automatizados
- Screenshots completos
- Validação de regressão visual

**Instalação** (se ainda não tiver):

```bash
claude mcp add playwright -- npx -y @anthropic/mcp-server-playwright
npx playwright install chromium
```

**Uso**:

```
Use Playwright para navegar em http://localhost:8081 e tirar um screenshot completo
```

### Filesystem MCP (Para Arquivos)

**Status**: ⚠️ Requer configuração

Melhor para:

- Navegar arquivos do projeto
- Ler/escrever arquivos
- Gerenciar estrutura de diretórios

**Instalação**:

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /caminho/do/projeto
```

## Comparação Rápida

| MCP                    | Localhost | Interação | Console | Screenshot | Setup             |
| ---------------------- | --------- | --------- | ------- | ---------- | ----------------- |
| **Cursor IDE Browser** | ✅        | ✅        | ✅      | ❌         | ✅ Já configurado |
| **Playwright**         | ✅        | ✅        | ✅      | ✅         | ⚠️ Requer install |
| **Filesystem**         | ❌        | ❌        | ❌      | ❌         | ⚠️ Requer config  |

## Recomendação Final

**Use o Cursor IDE Browser MCP** - já está disponível e é perfeito para:

- Debug de aplicações Expo Web
- Verificar erros no console
- Testar interações de UI
- Validar network requests

**Use Playwright MCP** quando precisar de:

- Screenshots completos de páginas
- Testes automatizados
- Validação visual de regressão

## Troubleshooting

### "MCP não encontrado"

O Cursor IDE Browser MCP já vem integrado no Cursor. Se não aparecer, verifique:

1. Você está usando Cursor IDE (não Claude Desktop)
2. Versão do Cursor atualizada

### "Não consigo navegar para localhost"

Verifique:

1. A aplicação está rodando? (`bun start` ou `npm start`)
2. A porta está correta? (Expo: 8081, Next.js: 3000, etc.)
3. Firewall não está bloqueando?

### "Snapshot vazio"

O snapshot de acessibilidade pode não capturar tudo. Use Playwright para screenshot completo se necessário.
