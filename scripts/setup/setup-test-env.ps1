# Script para configurar variaveis de ambiente para testes de AI Consent
# Windows PowerShell

Write-Host "Configuracao de Variaveis para Testes AI Consent" -ForegroundColor Cyan
Write-Host ""

# Variaveis ja conhecidas
$SUPABASE_URL = "https://lqahkqfpynypbmhtffyi.supabase.co"
$SUPABASE_ANON_KEY = "***REMOVED***"
$USER_ID = "78167252-961b-4102-a907-f082ea6d83a0"

# Configurar variaveis conhecidas
$env:SUPABASE_URL = $SUPABASE_URL
$env:SUPABASE_ANON_KEY = $SUPABASE_ANON_KEY
$env:USER_ID = $USER_ID

Write-Host "Variaveis configuradas:" -ForegroundColor Green
Write-Host "   SUPABASE_URL: $SUPABASE_URL" -ForegroundColor Gray
Write-Host "   SUPABASE_ANON_KEY: Configurado" -ForegroundColor Gray
Write-Host "   USER_ID: $USER_ID" -ForegroundColor Gray
Write-Host ""

# Verificar se SERVICE_ROLE_KEY ja esta configurada
if ($env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "SUPABASE_SERVICE_ROLE_KEY: Ja configurada" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pronto para executar testes!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Comandos disponiveis:" -ForegroundColor Yellow
    Write-Host "   npm run test:ai:set-metadata accepted true" -ForegroundColor Gray
    Write-Host "   npm run test:ai:consent" -ForegroundColor Gray
} else {
    Write-Host "SUPABASE_SERVICE_ROLE_KEY nao configurada" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Como obter:" -ForegroundColor Cyan
    Write-Host "   1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/settings/api" -ForegroundColor White
    Write-Host "   2. Na secao Project API keys, procure por service_role (secret)" -ForegroundColor White
    Write-Host "   3. Clique em Reveal para mostrar a chave completa" -ForegroundColor White
    Write-Host "   4. Copie a chave (comeca com eyJ...)" -ForegroundColor White
    Write-Host ""
    Write-Host "Depois de obter, configure com:" -ForegroundColor Yellow
    Write-Host '   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."' -ForegroundColor Gray
    Write-Host ""
    Write-Host "IMPORTANTE: SERVICE_ROLE_KEY e uma chave secreta!" -ForegroundColor Red
    Write-Host "   - Nunca compartilhe publicamente" -ForegroundColor Red
    Write-Host "   - Tem acesso total ao banco (bypassa RLS)" -ForegroundColor Red
    Write-Host "   - Use apenas para testes/administracao" -ForegroundColor Red
}

Write-Host ""
Write-Host "Para obter USER_JWT:" -ForegroundColor Cyan
Write-Host "   npm run print:session" -ForegroundColor Gray
Write-Host ""
