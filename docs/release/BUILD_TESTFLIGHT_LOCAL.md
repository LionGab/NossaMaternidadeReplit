# Build Local para TestFlight - Guia Rápido

**Data:** 11 Jan 2026
**Contexto:** Setup completo para builds locais iOS com Fastlane e upload para TestFlight

---

## 📋 Pré-requisitos

- ✅ macOS com Xcode instalado
- ✅ CocoaPods instalado (`brew install cocoapods` ou via Gemfile)
- ✅ Fastlane instalado (via Gemfile)
- ✅ Apple Developer Account configurada

---

## 🚀 Setup Inicial (Uma Vez)

### 1. Instalar Dependências Ruby

```bash
# No diretório raiz do projeto
bundle install
```

Isso instalará:

- Fastlane (automação de build/upload)
- CocoaPods (gerenciador de dependências iOS)

### 2. Bootstrap CocoaPods

```bash
# Usando Makefile (recomendado)
make bootstrap

# OU manualmente
cd ios
bundle exec pod install
```

Isso criará:

- `ios/Pods/` (dependências nativas)
- `ios/NossaMaternidade.xcworkspace` (workspace do Xcode)
- Arquivos `.xcconfig` necessários (resolve erro "Base Configuration")

---

## 🏗️ Comandos Disponíveis

### Build para App Store

```bash
make build
```

**O que faz:**

- Atualiza Pods
- Faz build do app
- Gera `.ipa` para App Store
- Salva em `ios/build/`

### Build e Upload para TestFlight

```bash
make beta
```

**O que faz:**

- Incrementa build number automaticamente
- Atualiza Pods
- Faz build do app
- Faz upload para TestFlight
- Aguarda processamento (skip_waiting habilitado)

### Limpar Dependências

```bash
make clean
```

**O que faz:**

- Remove `ios/Pods/`
- Remove `ios/NossaMaternidade.xcworkspace`
- Remove `Podfile.lock`
- Remove builds antigos

### Reinstalar Pods

```bash
make pods
```

**O que faz:**

- Atualiza CocoaPods
- Reinstala dependências nativas

---

## 🔧 Configuração

### Variáveis de Ambiente (Opcional)

Configure no `ios/fastlane/Appfile` ou via env vars:

```bash
export APP_IDENTIFIER="br.com.nossamaternidade.app"
export APPLE_ID="gabrielvesz_@hotmail.com"
export TEAM_ID="KZPW4S77UH"
export SCHEME="NossaMaternidade"
```

### Valores Padrão (já configurados)

- **Bundle ID:** `br.com.nossamaternidade.app`
- **Apple ID:** `gabrielvesz_@hotmail.com`
- **Team ID:** `KZPW4S77UH`
- **Scheme:** `NossaMaternidade`

---

## 🐛 Troubleshooting

### Erro: "Bundle exec: command not found"

**Solução:**

```bash
# Instalar bundler se não tiver
gem install bundler

# Instalar dependências
bundle install
```

### Erro: "No code signing certificates available"

**Solução:**

1. Abrir Xcode: `open ios/NossaMaternidade.xcworkspace`
2. Verificar **Signing & Capabilities**:
   - Team: `Gabriel Vesz (KZPW4S77UH)`
   - Automatically manage signing: ✅ ON
3. Ou configurar certificados manualmente via EAS:
   ```bash
   eas credentials
   ```

### Erro: "Unable to open base configuration reference file"

**Solução:**

```bash
# Limpar e reinstalar Pods
make clean
make pods

# Verificar workspace foi criado
ls -la ios/NossaMaternidade.xcworkspace
```

### Erro: "Scheme 'NossaMaternidade' not found"

**Solução:**

1. Abrir workspace no Xcode:
   ```bash
   open ios/NossaMaternidade.xcworkspace
   ```
2. No Xcode, verificar que o scheme existe:
   - **Product > Scheme > Manage Schemes...**
   - Marcar "Shared" para o scheme NossaMaternidade

### Erro: Pod install falha

**Solução:**

```bash
# Limpar cache do CocoaPods
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/.cocoapods/repos/trunk

# Reinstalar
cd ios
bundle exec pod install --repo-update
```

---

## 📊 Fluxo Completo

### Primeira Vez

```bash
# 1. Instalar dependências Ruby
bundle install

# 2. Bootstrap CocoaPods
make bootstrap

# 3. Verificar workspace foi criado
ls ios/NossaMaternidade.xcworkspace

# 4. Build e upload para TestFlight
make beta
```

### Builds Subsequentes

```bash
# Apenas build e upload
make beta
```

---

## 🆚 Comparação: EAS Build vs Local Build

### EAS Build (Recomendado)

**Vantagens:**

- ✅ Não requer setup local complexo
- ✅ Gerencia certificados automaticamente
- ✅ Build na nuvem (não usa recursos locais)
- ✅ Mais rápido de configurar

**Comando:**

```bash
npm run build:prod:ios
```

### Local Build (Fastlane)

**Vantagens:**

- ✅ Controle total sobre o processo
- ✅ Não depende de limites EAS
- ✅ Debug mais fácil
- ✅ Customização completa

**Comando:**

```bash
make beta
```

---

## 📝 Notas Importantes

1. **Workspace vs Projeto:**
   - Sempre abra `NossaMaternidade.xcworkspace` (não `.xcodeproj`)
   - Workspace inclui Pods, projeto não

2. **Build Number:**
   - Fastlane tenta incrementar automaticamente
   - Se falhar, configure `CURRENT_PROJECT_VERSION` no Xcode manualmente

3. **Certificados:**
   - Fastlane usa "Automatically manage signing"
   - Certificados devem estar no Keychain ou configurados via EAS

4. **Primeira Build:**
   - Pode demorar 15-20 minutos (download de dependências)
   - Builds subsequentes são mais rápidos (~5-10 min)

---

## 🔗 Referências

- [Fastlane Documentation](https://docs.fastlane.tools/)
- [CocoaPods Guide](https://guides.cocoapods.org/)
- [EAS Build vs Local Build](https://docs.expo.dev/build/introduction/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

---

**Última atualização:** 11 Jan 2026
