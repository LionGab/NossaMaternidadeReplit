# ===========================================
# Nossa Maternidade - MCP Setup Script (Windows)
# Dezembro 2025
# ===========================================

Write-Host "Nossa Maternidade - Setup de MCPs" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se esta na raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: Execute este script da raiz do projeto" -ForegroundColor Red
    exit 1
}

# Caminho do arquivo de configuracao do Cursor (Windows)
$CURSOR_SETTINGS_FILE = "$env:APPDATA\Cursor\User\settings.json"

Write-Host "Verificando MCPs necessarios..." -ForegroundColor Yellow
Write-Host ""

# 1. Supabase MCP
Write-Host "1. Supabase MCP" -ForegroundColor Yellow
Write-Host "----------------" -ForegroundColor Yellow
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue
if ($supabaseInstalled) {
    try {
        $version = supabase --version 2>&1 | Select-Object -First 1
        Write-Host "OK Supabase CLI instalado" -ForegroundColor Green
        Write-Host "  Versao: $version" -ForegroundColor Gray
    } catch {
        Write-Host "OK Supabase CLI encontrado" -ForegroundColor Green
    }
    Write-Host ""
    Write-Host "Para linkar seu projeto, execute:" -ForegroundColor Cyan
    Write-Host "  supabase login"
    Write-Host "  supabase link --project-ref SEU_PROJECT_REF"
} else {
    Write-Host "X Supabase CLI nao encontrado" -ForegroundColor Red
    Write-Host "Instale com: npm install -g supabase"
}
Write-Host ""

# 2. Context7 MCP
Write-Host "2. Context7 MCP (Documentacao)" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow
Write-Host "OK Ja disponivel via ferramentas MCP" -ForegroundColor Green
Write-Host ""

# 3. Expo MCP
Write-Host "3. Expo MCP (ESSENCIAL para builds iOS/Android)" -ForegroundColor Yellow
Write-Host "------------------------------------------------" -ForegroundColor Yellow
Write-Host "ATENCAO: Requer configuracao manual" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para adicionar:" -ForegroundColor Cyan
Write-Host "1. Abrir Cursor Settings (Ctrl+Virgula)"
Write-Host "2. Buscar por 'MCP' ou 'Model Context Protocol'"
Write-Host "3. Adicionar servidor HTTP:"
Write-Host "   - Name: expo-mcp"
Write-Host "   - URL: https://mcp.expo.dev/mcp"
Write-Host "   - Transport: HTTP"
Write-Host ""
Write-Host "OU editar manualmente o arquivo:" -ForegroundColor Cyan
Write-Host "  $CURSOR_SETTINGS_FILE"
Write-Host ""

# 4. Memory MCP
Write-Host "4. Memory MCP (Persistencia de contexto)" -ForegroundColor Yellow
Write-Host "------------------------------------------" -ForegroundColor Yellow
Write-Host "Para manter contexto entre sessoes" -ForegroundColor Cyan
Write-Host ""

# 5. Cursor IDE Browser MCP
Write-Host "5. Cursor IDE Browser MCP" -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow
Write-Host "OK Ja disponivel (integrado no Cursor)" -ForegroundColor Green
Write-Host ""

# 6. Playwright MCP
Write-Host "6. Playwright MCP (Testes visuais)" -ForegroundColor Yellow
Write-Host "------------------------------------" -ForegroundColor Yellow
if (Test-Path "node_modules\playwright-core") {
    Write-Host "OK Playwright instalado" -ForegroundColor Green
} else {
    Write-Host "Instalando Playwright..." -ForegroundColor Cyan
    npx playwright install chromium
}
Write-Host ""

# Gerar arquivo de configuracao de exemplo
Write-Host "Gerando arquivo de configuracao de exemplo..." -ForegroundColor Yellow
$EXAMPLE_CONFIG = @'
{
  "mcpServers": {
    "expo-mcp": {
      "description": "Expo MCP Server para builds iOS/Android",
      "transport": "http",
      "url": "https://mcp.expo.dev/mcp",
      "requires": ["Expo account autenticado", "SDK 54+"]
    },
    "context7": {
      "description": "Documentacao atualizada de libraries",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "memory-keeper": {
      "description": "Persistencia de contexto entre sessoes",
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
    },
    "figma-devmode": {
      "description": "Figma Dev Mode MCP Server (local)",
      "transport": "sse",
      "url": "http://127.0.0.1:3845/sse",
      "requires": ["Figma Desktop App com Dev Mode MCP habilitado"]
    }
  }
}
'@

$EXAMPLE_FILE = ".claude\mcp-settings-example.json"
New-Item -ItemType Directory -Force -Path ".claude" | Out-Null
$EXAMPLE_CONFIG | Out-File -FilePath $EXAMPLE_FILE -Encoding UTF8
Write-Host "OK Arquivo de exemplo criado: $EXAMPLE_FILE" -ForegroundColor Green
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Setup concluido!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure Supabase:"
Write-Host "   supabase login"
Write-Host "   supabase link --project-ref SEU_PROJECT_REF"
Write-Host "2. Adicione Expo MCP via Cursor Settings (Ctrl+Virgula) ou edite:"
Write-Host "   $CURSOR_SETTINGS_FILE"
Write-Host "3. Consulte o exemplo: $EXAMPLE_FILE"
Write-Host ""
Write-Host "Documentacao completa: docs/MCP_SETUP.md" -ForegroundColor Cyan
Write-Host "Guia Windows: docs/MCP_SETUP_WINDOWS.md" -ForegroundColor Cyan
