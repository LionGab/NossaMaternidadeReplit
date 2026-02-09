# Script para configurar SUPABASE_ACCESS_TOKEN (Personal Access Token)
# Windows PowerShell
#
# IMPORTANTE: Este token é diferente das API keys do projeto!
# O Supabase CLI precisa de um Personal Access Token (formato: sbp_...)
# Obtenha em: https://app.supabase.com/account/tokens

Write-Host "🔑 Configuração do Supabase Access Token" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  ATENÇÃO: O Supabase CLI precisa de um Personal Access Token (PAT)" -ForegroundColor Yellow
Write-Host "   Formato correto: sbp_0102...1920" -ForegroundColor Yellow
Write-Host "   NÃO use service_role ou anon keys (eyJ...)" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Como obter:" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://app.supabase.com/account/tokens" -ForegroundColor White
Write-Host "   2. Clique em 'Generate new token'" -ForegroundColor White
Write-Host "   3. Dê um nome (ex: 'CLI Development')" -ForegroundColor White
Write-Host "   4. Copie o token gerado (começa com sbp_)" -ForegroundColor White
Write-Host ""

# Verificar se já existe um token configurado
$currentToken = [System.Environment]::GetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", "User")
if ($currentToken) {
    Write-Host "🔍 Token atual encontrado:" -ForegroundColor Yellow
    if ($currentToken.StartsWith("sbp_")) {
        Write-Host "   ✅ Formato correto (sbp_...)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Formato incorreto (deve começar com sbp_)" -ForegroundColor Red
        Write-Host "   Token atual começa com: $($currentToken.Substring(0, [Math]::Min(10, $currentToken.Length)))..." -ForegroundColor Gray
    }
    Write-Host ""
}

# Solicitar o token
$token = Read-Host "Cole o Personal Access Token (sbp_...) ou pressione Enter para pular"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host ""
    Write-Host "⏭️  Pulando configuração. Você pode configurar depois com:" -ForegroundColor Yellow
    Write-Host "   `$env:SUPABASE_ACCESS_TOKEN='sbp_...'  # Temporário" -ForegroundColor Gray
    Write-Host "   [System.Environment]::SetEnvironmentVariable('SUPABASE_ACCESS_TOKEN', 'sbp_...', 'User')  # Permanente" -ForegroundColor Gray
    exit 0
}

# Validar formato
$token = $token.Trim()
if (-not $token.StartsWith("sbp_")) {
    Write-Host ""
    Write-Host "❌ ERRO: Token inválido!" -ForegroundColor Red
    Write-Host "   O token deve começar com 'sbp_'" -ForegroundColor Red
    Write-Host "   Você provavelmente colou uma API key do projeto (eyJ...)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Obtenha um Personal Access Token em:" -ForegroundColor Yellow
    Write-Host "   https://app.supabase.com/account/tokens" -ForegroundColor Cyan
    exit 1
}

# Configurar variável de ambiente (permanente)
[System.Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", $token, "User")

Write-Host ""
Write-Host "✅ Token configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Feche e reabra o terminal PowerShell" -ForegroundColor White
Write-Host "   2. Verifique com: npx supabase projects list" -ForegroundColor White
Write-Host "   3. Faça deploy: npx supabase functions deploy ai" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para usar na sessão atual (sem reiniciar):" -ForegroundColor Yellow
Write-Host "   `$env:SUPABASE_ACCESS_TOKEN=`"$token`"" -ForegroundColor Gray
Write-Host ""
