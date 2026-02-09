# Script para configurar variáveis de ambiente do Supabase para MCP
# Windows PowerShell

Write-Host "🔧 Configurando variáveis de ambiente do Supabase para MCP..." -ForegroundColor Cyan
Write-Host ""

# Variáveis do Supabase (do projeto fornecido)
$SUPABASE_DB_URL = "postgresql://postgres.igacnomjrgvdwycxlyla:wnRrL8o1YY1RAUDC@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
$SUPABASE_ACCESS_TOKEN = "***REMOVED***"

# Configurar para usuário atual (persistente)
[System.Environment]::SetEnvironmentVariable("SUPABASE_DB_URL", $SUPABASE_DB_URL, "User")
[System.Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", $SUPABASE_ACCESS_TOKEN, "User")

Write-Host "✅ Variáveis de ambiente configuradas:" -ForegroundColor Green
Write-Host "   SUPABASE_DB_URL: Configurado" -ForegroundColor Green
Write-Host "   SUPABASE_ACCESS_TOKEN: Configurado" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - Reinicie o Cursor/Claude Code para aplicar as mudanças" -ForegroundColor Yellow
Write-Host "   - As variáveis estão configuradas apenas para este usuário" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Verificar configuração:" -ForegroundColor Cyan
Write-Host "   [System.Environment]::GetEnvironmentVariable('SUPABASE_DB_URL', 'User')" -ForegroundColor Gray
Write-Host "   [System.Environment]::GetEnvironmentVariable('SUPABASE_ACCESS_TOKEN', 'User')" -ForegroundColor Gray
