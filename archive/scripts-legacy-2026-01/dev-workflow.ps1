# =============================================================================
# Nossa Maternidade - Development Workflow Script (PowerShell)
# Executa verificações de qualidade antes de commit/push
# Compatível com Windows PowerShell 5.1+ e PowerShell Core 7+
# =============================================================================

$ErrorActionPreference = "Stop"

# Cores para output
function Write-Header {
    param([string]$Text)
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $Text" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Section {
    param([string]$Text)
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "$Text" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Error {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Text)
    Write-Host "⚠️  $Text" -ForegroundColor Yellow
}

Write-Header "Our Maternity Dev Workflow"

# Diretório temporário para logs
$tempDir = $env:TEMP
$typecheckLog = Join-Path $tempDir "typecheck.log"
$lintLog = Join-Path $tempDir "lint.log"
$lintFixLog = Join-Path $tempDir "lint-fix.log"
$lintCheckLog = Join-Path $tempDir "lint-check.log"
$formatLog = Join-Path $tempDir "format.log"

# =============================================================================
# 1. TypeScript Check
# =============================================================================
Write-Section "Step 1: TypeScript Compilation Check"

npm run typecheck 2>&1 | Out-File -FilePath $typecheckLog -Encoding UTF8
$typecheckExitCode = $LASTEXITCODE

if ($typecheckExitCode -eq 0) {
    Write-Success "TypeScript: All types are correct"
} else {
    Write-Error "TypeScript errors found:"
    if (Test-Path $typecheckLog) {
        Get-Content $typecheckLog
    } else {
        Write-Host "Could not read typecheck log. Run 'npm run typecheck' manually to see errors." -ForegroundColor Yellow
    }
    exit 1
}

# =============================================================================
# 2. ESLint Check & Fix
# =============================================================================
Write-Section "Step 2: Linting & Code Quality"

# Executar lint e capturar saída
npm run lint 2>&1 | Out-File -FilePath $lintLog -Encoding UTF8
$lintExitCode = $LASTEXITCODE

if ($lintExitCode -eq 0) {
    Write-Success "ESLint: No violations found"
} else {
    Write-Warning "ESLint found issues. Attempting auto-fix..."

    # Tentar auto-fix
    npm run lint:fix 2>&1 | Out-File -FilePath $lintFixLog -Encoding UTF8

    # Verificar novamente após fix
    npm run lint 2>&1 | Out-File -FilePath $lintCheckLog -Encoding UTF8
    $lintCheckExitCode = $LASTEXITCODE

    if ($lintCheckExitCode -eq 0) {
        Write-Success "ESLint: Fixed automatically"
    } else {
        Write-Error "ESLint still has issues after auto-fix:"
        if (Test-Path $lintCheckLog) {
            Get-Content $lintCheckLog
        } else {
            # Fallback: tentar ler o log original se o check log não existir
            if (Test-Path $lintLog) {
                Write-Host "Showing original lint errors:" -ForegroundColor Yellow
                Get-Content $lintLog
            } else {
                Write-Host "Could not read lint logs. Run 'npm run lint' manually to see errors." -ForegroundColor Yellow
            }
        }
        exit 1
    }
}

# =============================================================================
# 3. Code Format Check
# =============================================================================
Write-Section "Step 3: Code Formatting"

npm run format:check 2>&1 | Out-File -FilePath $formatLog -Encoding UTF8
$formatCheckExitCode = $LASTEXITCODE

if ($formatCheckExitCode -eq 0) {
    Write-Success "Prettier: Code is properly formatted"
} else {
    Write-Warning "Code needs formatting. Formatting now..."
    npm run format 2>&1 | Out-File -FilePath $formatLog -Encoding UTF8
    Write-Success "Prettier: Code formatted"
}

# =============================================================================
# 4. Build Configuration Validation
# =============================================================================
Write-Section "Step 4: Build Configuration"

try {
    $expoConfig = npx expo config 2>&1 | Out-String
    if ($expoConfig -match '"name"') {
        Write-Success "app.config.js: Valid configuration"
    } else {
        Write-Error "app.config.js: Invalid configuration"
        exit 1
    }
} catch {
    Write-Error "app.config.js: Failed to validate configuration"
    exit 1
}

try {
    $easConfig = npx eas config 2>&1 | Out-String
    if ($easConfig -match '"builds"') {
        Write-Success "eas.json: Valid configuration"
    } else {
        Write-Error "eas.json: Invalid configuration"
        exit 1
    }
} catch {
    Write-Error "eas.json: Failed to validate configuration"
    exit 1
}

# =============================================================================
# 5. Environment Check
# =============================================================================
Write-Section "Step 5: Environment Variables"

try {
    $envCheck = npm run check-env 2>&1 | Out-String
    Write-Success "Environment: All required variables present"
} catch {
    Write-Warning "Some environment variables may be missing"
    $envCheck
}

# =============================================================================
# 6. Console.log Scan
# =============================================================================
Write-Section "Step 6: Debug Code Detection"

$consoleLogs = Select-String -Path "src\**\*.ts", "src\**\*.tsx" -Pattern "console\.log" -ErrorAction SilentlyContinue

if ($consoleLogs) {
    Write-Error "console.log statements found in source code"
    Write-Host "  Remove all console.log before committing" -ForegroundColor Red
    $consoleLogs | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
    }
    exit 1
} else {
    Write-Success "No console.log found in code"
}

# =============================================================================
# 7. Optional: Run Tests (Comment out if slow)
# =============================================================================
Write-Section "Step 7: Unit Tests (Optional)"

# Uncomment lines below to run tests in workflow
# try {
#     $null = npm run test:ci 2>&1 | Out-File -FilePath "$tempDir\tests.log" -Encoding UTF8
#     Write-Success "All tests passed"
# } catch {
#     Write-Error "Some tests failed:"
#     Get-Content "$tempDir\tests.log"
#     exit 1
# }

Write-Host "⏭️  Tests skipped (run: npm run test:watch locally)" -ForegroundColor Gray

# =============================================================================
# 8. Summary
# =============================================================================
Write-Section "✨ Workflow Complete"

Write-Host ""
Write-Host "All checks passed! Your code is ready to commit." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. git add ."
Write-Host "  2. git commit -m `"feat: your message here`""
Write-Host "  3. git push origin feature/branch-name"
Write-Host ""
Write-Host "GitHub Actions will run final CI checks on your PR." -ForegroundColor Gray
Write-Host ""

# Show any modified files
Write-Host "Modified files:" -ForegroundColor Cyan
git status --porcelain | Select-Object -First 10

exit 0
