#!/bin/bash

# 🚀 Build Script para TestFlight
# Este script automatiza o processo de build e upload para TestFlight

set -e # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
SCHEME="YourAppName"
PROJECT="YourAppName.xcodeproj"
WORKSPACE="YourAppName.xcworkspace" # Use se tiver CocoaPods
CONFIGURATION="Release"
ARCHIVE_PATH="./build/YourAppName.xcarchive"
EXPORT_PATH="./build/ipa"

# Funções
print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║           TestFlight Build & Upload Script            ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${GREEN}▶ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Verificar pré-requisitos
check_prerequisites() {
    print_step "Verificando pré-requisitos..."
    
    # Verificar Xcode
    if ! command -v xcodebuild &> /dev/null; then
        print_error "Xcode não encontrado!"
        exit 1
    fi
    
    # Verificar xcpretty (opcional, para output bonito)
    if command -v xcpretty &> /dev/null; then
        USE_XCPRETTY=true
    else
        USE_XCPRETTY=false
        print_warning "xcpretty não instalado. Output será verboso."
        print_warning "Instale com: gem install xcpretty"
    fi
    
    print_success "Pré-requisitos OK"
}

# Limpar builds anteriores
clean_build() {
    print_step "Limpando builds anteriores..."
    
    if [ -d "build" ]; then
        rm -rf build
    fi
    
    xcodebuild clean \
        -scheme "$SCHEME" \
        -configuration "$CONFIGURATION" \
        > /dev/null 2>&1
    
    print_success "Build anterior limpo"
}

# Incrementar build number
increment_build_number() {
    print_step "Incrementando build number..."
    
    # Obter build number atual
    CURRENT_BUILD=$(xcrun agvtool what-version -terse)
    NEW_BUILD=$((CURRENT_BUILD + 1))
    
    # Incrementar
    xcrun agvtool next-version -all > /dev/null 2>&1
    
    print_success "Build number: $CURRENT_BUILD → $NEW_BUILD"
}

# Rodar testes
run_tests() {
    print_step "Rodando testes..."
    
    if [ "$USE_XCPRETTY" = true ]; then
        xcodebuild test \
            -scheme "$SCHEME" \
            -destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
            | xcpretty
    else
        xcodebuild test \
            -scheme "$SCHEME" \
            -destination 'platform=iOS Simulator,name=iPhone 15 Pro'
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Todos os testes passaram"
    else
        print_error "Testes falharam!"
        exit 1
    fi
}

# Rodar SwiftLint
run_swiftlint() {
    print_step "Rodando SwiftLint..."
    
    if command -v swiftlint &> /dev/null; then
        swiftlint
        
        if [ $? -eq 0 ]; then
            print_success "SwiftLint OK"
        else
            print_warning "SwiftLint encontrou problemas"
            read -p "Continuar mesmo assim? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    else
        print_warning "SwiftLint não instalado. Pulando..."
    fi
}

# Archive
create_archive() {
    print_step "Criando archive..."
    
    mkdir -p build
    
    if [ "$USE_XCPRETTY" = true ]; then
        xcodebuild archive \
            -scheme "$SCHEME" \
            -configuration "$CONFIGURATION" \
            -archivePath "$ARCHIVE_PATH" \
            -destination 'generic/platform=iOS' \
            CODE_SIGN_STYLE=Automatic \
            | xcpretty
    else
        xcodebuild archive \
            -scheme "$SCHEME" \
            -configuration "$CONFIGURATION" \
            -archivePath "$ARCHIVE_PATH" \
            -destination 'generic/platform=iOS' \
            CODE_SIGN_STYLE=Automatic
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Archive criado com sucesso"
    else
        print_error "Falha ao criar archive!"
        exit 1
    fi
}

# Export IPA
export_ipa() {
    print_step "Exportando IPA..."
    
    # Criar ExportOptions.plist
    cat > ./build/ExportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>manageAppVersionAndBuildNumber</key>
    <true/>
</dict>
</plist>
EOF
    
    xcodebuild -exportArchive \
        -archivePath "$ARCHIVE_PATH" \
        -exportPath "$EXPORT_PATH" \
        -exportOptionsPlist ./build/ExportOptions.plist
    
    if [ $? -eq 0 ]; then
        print_success "IPA exportado com sucesso"
    else
        print_error "Falha ao exportar IPA!"
        exit 1
    fi
}

# Upload para TestFlight
upload_to_testflight() {
    print_step "Fazendo upload para TestFlight..."
    
    # Encontrar IPA
    IPA_PATH=$(find "$EXPORT_PATH" -name "*.ipa" | head -n 1)
    
    if [ -z "$IPA_PATH" ]; then
        print_error "IPA não encontrado!"
        exit 1
    fi
    
    print_warning "Upload pode levar alguns minutos..."
    
    xcrun altool --upload-app \
        --type ios \
        --file "$IPA_PATH" \
        --username "$APPLE_ID" \
        --password "$APP_SPECIFIC_PASSWORD"
    
    if [ $? -eq 0 ]; then
        print_success "Upload concluído com sucesso!"
        print_success "Aguarde processamento no App Store Connect (10-30 min)"
    else
        print_error "Falha no upload!"
        print_warning "Você pode fazer upload manual pelo Xcode Organizer"
        exit 1
    fi
}

# Abrir App Store Connect
open_app_store_connect() {
    print_step "Abrindo App Store Connect..."
    open "https://appstoreconnect.apple.com/apps"
}

# Main
main() {
    print_header
    
    # Verificar argumentos
    SKIP_TESTS=false
    SKIP_UPLOAD=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-upload)
                SKIP_UPLOAD=true
                shift
                ;;
            --help)
                echo "Uso: $0 [OPTIONS]"
                echo ""
                echo "Opções:"
                echo "  --skip-tests     Pula execução dos testes"
                echo "  --skip-upload    Apenas cria o archive, não faz upload"
                echo "  --help           Mostra esta mensagem"
                exit 0
                ;;
            *)
                print_error "Opção desconhecida: $1"
                echo "Use --help para ver opções disponíveis"
                exit 1
                ;;
        esac
    done
    
    # Pipeline
    check_prerequisites
    clean_build
    
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    else
        print_warning "Pulando testes..."
    fi
    
    run_swiftlint
    increment_build_number
    create_archive
    export_ipa
    
    if [ "$SKIP_UPLOAD" = false ]; then
        # Verificar credenciais
        if [ -z "$APPLE_ID" ] || [ -z "$APP_SPECIFIC_PASSWORD" ]; then
            print_warning "Credenciais não configuradas!"
            print_warning "Configure:"
            print_warning "  export APPLE_ID='seu-email@icloud.com'"
            print_warning "  export APP_SPECIFIC_PASSWORD='xxxx-xxxx-xxxx-xxxx'"
            print_warning ""
            print_warning "Você pode fazer upload manual pelo Xcode Organizer"
            
            read -p "Abrir Organizer? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                open "$ARCHIVE_PATH"
            fi
        else
            upload_to_testflight
        fi
    fi
    
    open_app_store_connect
    
    echo ""
    print_success "✨ Build concluído com sucesso! ✨"
    echo ""
    echo "Próximos passos:"
    echo "1. Aguardar processamento no App Store Connect"
    echo "2. Configurar TestFlight testing"
    echo "3. Adicionar beta testers"
    echo "4. Coletar feedback"
    echo ""
}

# Executar
main "$@"
