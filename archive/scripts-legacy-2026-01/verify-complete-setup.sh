#!/bin/bash

# ===========================================
# Nossa Maternidade - Verificação Completa de Setup
# Verifica todos os aspectos necessários para produção
# ===========================================

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verificação Completa de Setup${NC}"
echo "=========================================="
echo ""

# Contadores
PASSED=0
FAILED=0
WARNINGS=0
SKIPPED=0

# Função para verificar e reportar
check() {
    local name="$1"
    local command="$2"
    local expected="$3"
    local fix_hint="$4"
    
    echo -n "Verificando $name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        ((PASSED++))
        return 0
    else
        if [ "$expected" = "required" ]; then
            echo -e "${RED}❌${NC}"
            if [ -n "$fix_hint" ]; then
                echo -e "  ${YELLOW}💡 $fix_hint${NC}"
            fi
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}⚠️${NC}"
            if [ -n "$fix_hint" ]; then
                echo -e "  ${YELLOW}💡 $fix_hint${NC}"
            fi
            ((WARNINGS++))
            return 1
        fi
    fi
}

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script da raiz do projeto${NC}"
    exit 1
fi

# ===========================================
# 1. VARIÁVEIS DE AMBIENTE
# ===========================================
echo -e "${BLUE}📋 1. Variáveis de Ambiente (.env.local)${NC}"
echo "----------------------------------------"

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Arquivo .env.local existe${NC}"
    ((PASSED++))
    
    # Verificar variáveis obrigatórias
    check "EXPO_PUBLIC_SUPABASE_URL" "grep -q 'EXPO_PUBLIC_SUPABASE_URL=' .env.local && ! grep -q 'EXPO_PUBLIC_SUPABASE_URL=$' .env.local && ! grep -q 'EXPO_PUBLIC_SUPABASE_URL=your-' .env.local" "required" "Configure EXPO_PUBLIC_SUPABASE_URL no .env.local"
    
    check "EXPO_PUBLIC_SUPABASE_ANON_KEY" "grep -q 'EXPO_PUBLIC_SUPABASE_ANON_KEY=' .env.local && ! grep -q 'EXPO_PUBLIC_SUPABASE_ANON_KEY=$' .env.local && ! grep -q 'EXPO_PUBLIC_SUPABASE_ANON_KEY=your-' .env.local" "required" "Configure EXPO_PUBLIC_SUPABASE_ANON_KEY no .env.local"
    
    check "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL" "grep -q 'EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=' .env.local && ! grep -q 'EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=$' .env.local" "required" "Configure EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL no .env.local"
    
    echo ""
    echo -e "${CYAN}💡 Execute: node scripts/check-env.js para verificação detalhada${NC}"
else
    echo -e "${RED}❌ Arquivo .env.local não encontrado${NC}"
    echo -e "  ${YELLOW}💡 Copie .env.example para .env.local e configure:${NC}"
    echo -e "  ${CYAN}cp .env.example .env.local${NC}"
    ((FAILED++))
fi

echo ""

# ===========================================
# 2. SUPABASE SCHEMAS + RLS POLICIES
# ===========================================
echo -e "${BLUE}🗄️  2. Supabase Schemas + RLS Policies${NC}"
echo "----------------------------------------"

# Verificar se migrations existem
MIGRATION_COUNT=$(find supabase/migrations -name "*.sql" -type f | wc -l | tr -d ' ')
if [ "$MIGRATION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ $MIGRATION_COUNT migrations encontradas${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Nenhuma migration encontrada${NC}"
    ((FAILED++))
fi

# Verificar se Supabase está linkado
if supabase link --help > /dev/null 2>&1; then
    echo -n "Verificando projeto Supabase linkado... "
    if grep -q "project_id" supabase/config.toml 2>/dev/null || supabase projects list > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC}"
        echo -e "  ${YELLOW}💡 Execute: supabase link --project-ref <SEU_PROJECT_REF>${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️${NC} Supabase CLI não disponível"
    ((WARNINGS++))
fi

echo ""
echo -e "${CYAN}💡 Para aplicar migrations:${NC}"
echo -e "  ${CYAN}supabase db push${NC}"
echo -e "  ${CYAN}ou via Dashboard: Supabase > Database > Migrations${NC}"

echo ""

# ===========================================
# 3. APIs: OpenAI/Claude para NathIA
# ===========================================
echo -e "${BLUE}🤖 3. APIs: OpenAI/Claude para NathIA${NC}"
echo "----------------------------------------"

# Verificar Edge Function existe
if [ -f "supabase/functions/ai/index.ts" ]; then
    echo -e "${GREEN}✅ Edge Function /ai existe${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Edge Function /ai não encontrada${NC}"
    ((FAILED++))
fi

# Verificar se secrets estão configurados (requer projeto linkado)
echo -n "Verificando secrets do Supabase... "
if supabase secrets list > /dev/null 2>&1; then
    SECRETS_COUNT=$(supabase secrets list 2>/dev/null | grep -c "API_KEY" || echo "0")
    if [ "$SECRETS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ ($SECRETS_COUNT secrets encontrados)${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC}"
        echo -e "  ${YELLOW}💡 Configure secrets:${NC}"
        echo -e "  ${CYAN}supabase secrets set GEMINI_API_KEY=<key>${NC}"
        echo -e "  ${CYAN}supabase secrets set OPENAI_API_KEY=<key>${NC}"
        echo -e "  ${CYAN}supabase secrets set ANTHROPIC_API_KEY=<key>${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️${NC} Não foi possível verificar secrets"
    echo -e "  ${YELLOW}💡 Configure via Dashboard: Supabase > Project Settings > Edge Functions > Secrets${NC}"
    ((WARNINGS++))
fi

echo ""

# ===========================================
# 4. ASSETS: Icon, Splash Screen
# ===========================================
echo -e "${BLUE}🎨 4. Assets: Icon, Splash Screen${NC}"
echo "----------------------------------------"

check "Icon (icon.png)" "[ -f 'assets/icon.png' ]" "required" "Crie assets/icon.png (1024x1024px)"
check "Splash Screen (splash.png)" "[ -f 'assets/splash.png' ]" "required" "Crie assets/splash.png"
check "Adaptive Icon (adaptive-icon.png)" "[ -f 'assets/adaptive-icon.png' ]" "required" "Crie assets/adaptive-icon.png (Android)"
check "Notification Icon" "[ -f 'assets/notification-icon.png' ]" "optional" "Crie assets/notification-icon.png"
check "Favicon" "[ -f 'assets/favicon.png' ]" "optional" "Crie assets/favicon.png (Web)"

echo ""

# ===========================================
# 5. SCRIPTS: Verificar Existência
# ===========================================
echo -e "${BLUE}📜 5. Scripts Bash${NC}"
echo "----------------------------------------"

SCRIPT_COUNT=$(find scripts -name "*.sh" -type f | wc -l | tr -d ' ')
if [ "$SCRIPT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ $SCRIPT_COUNT scripts encontrados${NC}"
    ((PASSED++))
    
    # Verificar scripts essenciais
    ESSENTIAL_SCRIPTS=(
        "scripts/setup-mcps-mac.sh"
        "scripts/verify-setup.sh"
        "scripts/quality-gate.sh"
        "scripts/check-build-ready.sh"
        "scripts/setup-secrets.sh"
    )
    
    for script in "${ESSENTIAL_SCRIPTS[@]}"; do
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                echo -e "  ${GREEN}✅${NC} $(basename "$script") (executável)"
            else
                echo -e "  ${YELLOW}⚠️${NC}  $(basename "$script") (não executável)"
                echo -e "    ${CYAN}chmod +x $script${NC}"
                ((WARNINGS++))
            fi
        else
            echo -e "  ${RED}❌${NC} $(basename "$script") (não encontrado)"
            ((FAILED++))
        fi
    done
else
    echo -e "${RED}❌ Nenhum script encontrado${NC}"
    ((FAILED++))
fi

echo ""

# ===========================================
# 6. CERTIFICADOS: iOS + Android
# ===========================================
echo -e "${BLUE}🔐 6. Certificados: iOS + Android${NC}"
echo "----------------------------------------"

# Verificar eas.json
if [ -f "eas.json" ]; then
    echo -e "${GREEN}✅ eas.json existe${NC}"
    ((PASSED++))
    
    # Verificar configuração iOS
    echo -n "Verificando configuração iOS... "
    if grep -q "appleTeamId\|ascAppId" eas.json 2>/dev/null; then
        if grep -q "YOUR_APPLE_TEAM_ID\|YOUR_APP_STORE_CONNECT_APP_ID" eas.json 2>/dev/null; then
            echo -e "${YELLOW}⚠️${NC}"
            echo -e "  ${YELLOW}💡 Configure appleTeamId e ascAppId no eas.json${NC}"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✅${NC}"
            ((PASSED++))
        fi
    else
        echo -e "${YELLOW}⚠️${NC} Configuração iOS não encontrada"
        ((WARNINGS++))
    fi
    
    # Verificar configuração Android
    echo -n "Verificando configuração Android... "
    if grep -q "google-play-service-account.json" eas.json 2>/dev/null; then
        if [ -f "google-play-service-account.json" ]; then
            echo -e "${GREEN}✅${NC}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠️${NC}"
            echo -e "  ${YELLOW}💡 Crie google-play-service-account.json (não commitar no git!)${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${YELLOW}⚠️${NC} Configuração Android não encontrada"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}❌ eas.json não encontrado${NC}"
    ((FAILED++))
fi

# Verificar EAS CLI
echo -n "Verificando EAS CLI... "
if command -v eas > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    ((PASSED++))
    
    # Verificar se está autenticado
    echo -n "Verificando autenticação EAS... "
    if eas whoami > /dev/null 2>&1; then
        EAS_USER=$(eas whoami 2>/dev/null || echo "desconhecido")
        echo -e "${GREEN}✅ (usuário: $EAS_USER)${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC}"
        echo -e "  ${YELLOW}💡 Execute: eas login${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️${NC}"
    echo -e "  ${YELLOW}💡 Instale: npm install -g eas-cli${NC}"
    ((WARNINGS++))
fi

echo ""

# ===========================================
# RESUMO FINAL
# ===========================================
echo -e "${BLUE}📊 Resumo${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Passou:${NC} $PASSED"
echo -e "${YELLOW}⚠️  Avisos:${NC} $WARNINGS"
echo -e "${RED}❌ Falhou:${NC} $FAILED"
echo "=========================================="
echo ""

# ===========================================
# 7. CONFIGURAÇÃO MCP
# ===========================================
echo -e "${BLUE}🔌 7. Configuração MCP${NC}"
echo "----------------------------------------"

check ".mcp.json" "[ -f '.mcp.json' ]" "optional" "Crie .mcp.json para configuração de MCPs"

if [ -f ".mcp.json" ]; then
    MCP_COUNT=$(grep -c '"command"\|"transport"' .mcp.json 2>/dev/null || echo "0")
    echo -e "  ${GREEN}✅ $MCP_COUNT MCPs configurados${NC}"
    ((PASSED++))
fi

echo ""

# ===========================================
# 8. DEPENDÊNCIAS NODE
# ===========================================
echo -e "${BLUE}📦 8. Dependências Node${NC}"
echo "----------------------------------------"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe${NC}"
    ((PASSED++))

    # Verificar dependências críticas
    CRITICAL_DEPS=(
        "expo"
        "react-native"
        "@supabase/supabase-js"
        "react-native-purchases"
        "zustand"
        "nativewind"
    )

    for dep in "${CRITICAL_DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo -e "  ${GREEN}✅${NC} $dep"
            ((PASSED++))
        else
            echo -e "  ${RED}❌${NC} $dep não instalado"
            ((FAILED++))
        fi
    done
else
    echo -e "${RED}❌ node_modules não existe${NC}"
    echo -e "  ${YELLOW}💡 Execute: npm install ou bun install${NC}"
    ((FAILED++))
fi

echo ""

# ===========================================
# 9. QUALITY GATE
# ===========================================
echo -e "${BLUE}🔍 9. Quality Gate${NC}"
echo "----------------------------------------"

echo -n "TypeScript (typecheck)... "
if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC} Erros de tipo encontrados"
    echo -e "  ${YELLOW}💡 Execute: npm run typecheck${NC}"
    ((WARNINGS++))
fi

echo -n "ESLint... "
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC} Avisos/erros de lint"
    echo -e "  ${YELLOW}💡 Execute: npm run lint${NC}"
    ((WARNINGS++))
fi

# Verificar console.log (excluindo logger.ts que é o sistema central de logging)
CONSOLE_COUNT=$(grep -r "console\.\(log\|warn\|error\)" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "logger\.ts" | grep -v "logger\." | grep -v "eslint-disable" | grep -v "// " | grep -v "\* " | wc -l | tr -d ' ')
if [ "$CONSOLE_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ Nenhum console.log encontrado${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  $CONSOLE_COUNT uso(s) de console.log (use logger.*)${NC}"
    ((WARNINGS++))
fi

echo ""

# ===========================================
# RESUMO FINAL
# ===========================================
echo -e "${BLUE}📊 Resumo Final${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Passou:${NC} $PASSED"
echo -e "${YELLOW}⚠️  Avisos:${NC} $WARNINGS"
echo -e "${RED}❌ Falhou:${NC} $FAILED"
echo "=========================================="
echo ""

TOTAL=$((PASSED + WARNINGS + FAILED))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASSED * 100 / TOTAL))
    echo -e "Completude: ${BOLD}${PERCENTAGE}%${NC}"
    echo ""
fi

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 Ambiente 100% configurado!${NC}"
        echo ""
        echo -e "${BLUE}Próximos passos:${NC}"
        echo "  1. Execute: npm run quality-gate"
        echo "  2. Faça build de teste: npm run build:preview"
        echo "  3. Submeta para lojas: npm run release:prod"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Configuração quase completa ($WARNINGS avisos)${NC}"
        echo ""
        echo -e "${BLUE}Próximos passos recomendados:${NC}"
        echo "  1. Revise os avisos acima"
        echo "  2. Configure secrets: bash scripts/setup-secrets.sh"
        echo "  3. Execute quality-gate: npm run quality-gate"
        exit 0
    fi
else
    echo -e "${RED}❌ $FAILED verificações críticas falharam${NC}"
    echo ""
    echo -e "${BLUE}Ações necessárias:${NC}"
    echo "  1. Corrija os erros indicados acima"
    echo "  2. Execute este script novamente"
    exit 1
fi

