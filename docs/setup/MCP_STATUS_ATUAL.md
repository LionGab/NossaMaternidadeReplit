# Status Atual dos MCPs - Nossa Maternidade

**Data**: 26 de dezembro de 2025
**Ambiente**: Desenvolvimento Local (Mac)

---

## ✅ MCPs Funcionando

### 1. Filesystem MCP

- **Status**: ✅ Rodando
- **Versão**: secure-filesystem-server v0.2.0
- **Inspector**: http://localhost:6274
- **Testado**: Sim

### 2. Supabase MCP

- **Status**: ✅ Ativo
- **Configuração**: Automática via CLI

### 3. Context7 MCP

- **Status**: ✅ Disponível
- **Bibliotecas**: 5 suportadas

### 4. Playwright MCP

- **Status**: ✅ Disponível
- **Capabilities**: 5 tools disponíveis

### 5. Expo MCP

- **Status**: ✅ Configurado
- **URL**: https://mcp.expo.dev/mcp

### 6. Sequential Thinking

- **Status**: ✅ Ativo

---

## ⚠️ MCPs que Precisam de Ação

### Figma DevMode MCP

- **Status**: ⚠️ Configurado, mas não rodando
- **Motivo**: Figma Desktop precisa estar aberto + Dev Mode habilitado
- **Ação necessária**:
  1. Abrir Figma Desktop
  2. Habilitar: Figma > Preferences > Developer > Enable Dev Mode MCP Server
  3. Abrir arquivo do design
  4. Obter fileKey da URL e atualizar `.claude/mcp-config.json`

---

## 📊 Resumo

- **Total de MCPs**: 7
- **Funcionando**: 6
- **Pendentes**: 1 (Figma - requer ação manual)

---

## 🔗 Links Úteis

- Inspector: http://localhost:6274
- Config: `.claude/mcp-config.json`
- Docs: `docs/MCP_SETUP.md`
