# Script para corrigir erros do Expo Go iOS
# WorkletsError e outros problemas comuns

Write-Host "Corrigindo erros do Expo Go iOS..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Parar servidor Expo se estiver rodando
Write-Host "1. Verificando servidor Expo..." -ForegroundColor Yellow
$expoProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*expo*" }
if ($expoProcess) {
    Write-Host "   Parando servidor Expo..." -ForegroundColor Gray
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 2. Limpar cache do Metro
Write-Host "2. Limpando cache do Metro..." -ForegroundColor Yellow
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
    Write-Host "   Cache .expo removido" -ForegroundColor Gray
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
    Write-Host "   Cache node_modules removido" -ForegroundColor Gray
}

# 3. Limpar watchman (se instalado)
Write-Host "3. Limpando Watchman..." -ForegroundColor Yellow
$watchmanInstalled = Get-Command watchman -ErrorAction SilentlyContinue
if ($watchmanInstalled) {
    watchman watch-del-all 2>&1 | Out-Null
    Write-Host "   Watchman limpo" -ForegroundColor Gray
} else {
    Write-Host "   Watchman nao instalado (pular)" -ForegroundColor Gray
}

# 4. Verificar versoes
Write-Host "4. Verificando versoes..." -ForegroundColor Yellow
$workletsVersion = npm list react-native-worklets --depth=0 2>&1 | Select-String "react-native-worklets@"
$reanimatedVersion = npm list react-native-reanimated --depth=0 2>&1 | Select-String "react-native-reanimated@"

Write-Host "   $workletsVersion" -ForegroundColor Gray
Write-Host "   $reanimatedVersion" -ForegroundColor Gray

# 5. Reinstalar dependencias (opcional)
Write-Host ""
Write-Host "5. Reinstalar dependencias?" -ForegroundColor Yellow
Write-Host "   Execute manualmente se necessario:" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor White
Write-Host ""

# 6. Instrucoes finais
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Iniciar Expo com cache limpo:" -ForegroundColor Cyan
Write-Host "   npx expo start --clear" -ForegroundColor White
Write-Host ""
Write-Host "2. No iOS Simulator/Dispositivo:" -ForegroundColor Cyan
Write-Host "   - Feche completamente o Expo Go" -ForegroundColor White
Write-Host "   - Reabra o Expo Go" -ForegroundColor White
Write-Host "   - Escaneie o QR code novamente" -ForegroundColor White
Write-Host ""
Write-Host "3. Se o erro persistir:" -ForegroundColor Cyan
Write-Host "   - Use Development Build (recomendado)" -ForegroundColor White
Write-Host "   - Veja: docs/EXPO_GO_IOS_ERRORS_FIX.md" -ForegroundColor White
Write-Host ""
Write-Host "NOTA: WorkletsError e comum no Expo Go devido a versoes fixas." -ForegroundColor Yellow
Write-Host "      Para desenvolvimento completo, use Development Build." -ForegroundColor Yellow
Write-Host ""

