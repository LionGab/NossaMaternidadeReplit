# Quality gate script (PowerShell para Windows)
# Roda antes de PR/build
# Uso: npm run quality-gate:win

$ErrorActionPreference = "Stop"

Write-Host "Running quality gates for Nossa Maternidade..." -ForegroundColor Cyan

# 1. TypeScript type check
Write-Host ""
Write-Host "[1/4] TypeScript type check..." -ForegroundColor Yellow
try {
    bun run typecheck
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: TypeScript errors found!" -ForegroundColor Red
        exit 1
    }
    Write-Host "OK: TypeScript check passed" -ForegroundColor Green
} catch {
    Write-Host "ERROR: TypeScript check failed!" -ForegroundColor Red
    exit 1
}

# 2. ESLint
Write-Host ""
Write-Host "[2/4] ESLint check..." -ForegroundColor Yellow
try {
    bun run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: ESLint errors found!" -ForegroundColor Red
        exit 1
    }
    Write-Host "OK: ESLint check passed" -ForegroundColor Green
} catch {
    Write-Host "ERROR: ESLint check failed!" -ForegroundColor Red
    exit 1
}

# 3. Build readiness
Write-Host ""
Write-Host "[3/4] Build readiness check..." -ForegroundColor Yellow
try {
    if ($IsWindows -or $env:OS -match "Windows") {
        powershell -ExecutionPolicy Bypass -File scripts/check-build-ready.ps1
    } else {
        bash scripts/check-build-ready.sh
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build readiness check failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "OK: Build readiness check passed" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Build readiness check failed!" -ForegroundColor Red
    exit 1
}

# 4. Verificar se não há console.log (exceto warn/error)
Write-Host ""
Write-Host "[4/4] Checking for console.log usage..." -ForegroundColor Yellow
$consoleLogs = Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx |
    Select-String -Pattern "console\.log" |
    Where-Object {
        $_.Path -notmatch "logger\.ts" -and
        $_.Path -notmatch "Toast\.tsx" -and
        $_.Path -notmatch "useToast\.ts" -and
        # Ignorar comentários JSDoc (linhas que começam com *)
        -not ($_.Line.TrimStart().StartsWith("*"))
    }

if ($consoleLogs) {
    Write-Host "WARNING: Found console.log usage (should use logger instead):" -ForegroundColor Yellow
    $consoleLogs | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber): $($_.Line.Trim())" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Replace with: import { logger } from '../utils/logger';" -ForegroundColor Cyan
    Write-Host "Example: logger.info('message', 'context');" -ForegroundColor Cyan
    exit 1
}
Write-Host "OK: No console.log found (using logger instead)" -ForegroundColor Green

Write-Host ""
Write-Host "SUCCESS: All quality gates passed! Ready for PR/build." -ForegroundColor Green
