# Script para testar MCPs apos recarregar Cursor

Write-Host "Teste de MCPs - Nossa Maternidade" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "IMPORTANTE: Este script verifica apenas a configuracao." -ForegroundColor Yellow
Write-Host "Para testar os MCPs de verdade, voce precisa:" -ForegroundColor Yellow
Write-Host "1. Recarregar o Cursor (Ctrl+Shift+P > 'reload window')" -ForegroundColor White
Write-Host "2. Usar as ferramentas MCP no Cursor (comecam com 'mcp_')" -ForegroundColor White
Write-Host ""

# Verificar configuracao
Write-Host "Verificando configuracao..." -ForegroundColor Cyan
.\scripts\verify-mcps.ps1

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testes Disponiveis no Cursor:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Context7 MCP:" -ForegroundColor Yellow
Write-Host "   - Ferramenta: mcp_Context7_resolve-library-id" -ForegroundColor Gray
Write-Host "   - Teste: Buscar documentacao de 'react-navigation'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Cursor IDE Browser MCP:" -ForegroundColor Yellow
Write-Host "   - Ferramenta: mcp_cursor-ide-browser_browser_navigate" -ForegroundColor Gray
Write-Host "   - Teste: Navegar para 'http://localhost:8081'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Supabase MCP (se configurado):" -ForegroundColor Yellow
Write-Host "   - Ferramenta: mcp_Supabase_list_projects" -ForegroundColor Gray
Write-Host "   - Teste: Listar projetos Supabase" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Expo MCP (apos autenticar):" -ForegroundColor Yellow
Write-Host "   - Ferramenta: mcp_Expo_* (varia)" -ForegroundColor Gray
Write-Host "   - Teste: Gerenciar builds EAS" -ForegroundColor Gray
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Para ver todas as ferramentas MCP disponiveis:" -ForegroundColor Cyan
Write-Host "  - No Cursor, as ferramentas aparecem automaticamente" -ForegroundColor Gray
Write-Host "  - Procure por ferramentas que comecam com 'mcp_'" -ForegroundColor Gray
Write-Host ""

