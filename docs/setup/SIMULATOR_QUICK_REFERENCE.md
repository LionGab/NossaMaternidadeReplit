# 📱 Simulador iOS - Guia Rápido

## 🚀 Comandos Rápidos

### Listar Simuladores (Recomendado)

```bash
# Lista formatada com status
npm run simulator:list
# ou
bash scripts/list-ios-simulators.sh
```

### Reset do Simulador

```bash
# Reset automático (usa primeiro disponível)
npm run simulator:reset
# ou
bash scripts/reset-ios-simulator.sh

# Reset de simulador específico
bash scripts/reset-ios-simulator.sh "iPhone 17 Pro Max"
```

### Limpar Apps (Manter apenas básico)

```bash
npm run simulator:clean
# ou
bash scripts/clean-ios-simulator.sh
```

### Corrigir Simulador Inválido

```bash
npm run simulator:fix
# ou
bash scripts/fix-ios-simulator.sh
```

## 📋 Listar Simuladores

```bash
# Lista formatada e útil (recomendado)
bash scripts/list-ios-simulators.sh

# Todos os simuladores (raw)
xcrun simctl list devices

# Apenas iPhones disponíveis
xcrun simctl list devices available | grep -i "iphone"
```

## 🔧 Iniciar/Parar Simulador

```bash
# Iniciar por nome
xcrun simctl boot "iPhone 17 Pro"

# Iniciar por UUID
xcrun simctl boot 7785FB58-DBCD-4AEE-A74E-9281267E7AE6

# Abrir app Simulator
open -a Simulator

# Parar simulador
xcrun simctl shutdown "iPhone 17 Pro"

# Parar todos
xcrun simctl shutdown all
```

## 🗑️ Reset Completo

```bash
# Reset por nome
xcrun simctl erase "iPhone 17 Pro"

# Reset por UUID
xcrun simctl erase 7785FB58-DBCD-4AEE-A74E-9281267E7AE6

# Reset todos (CUIDADO!)
xcrun simctl erase all
```

## 🐛 Troubleshooting

### Erro: "Invalid device or device pair"

```bash
# Solução rápida
bash scripts/fix-ios-simulator.sh
```

### Simulador não inicia

```bash
# Limpar dispositivos inválidos
xcrun simctl delete unavailable

# Resetar simulador
bash scripts/reset-ios-simulator.sh
```

### App não abre no simulador

```bash
# Limpar cache do Expo
npm run clean

# Resetar simulador
bash scripts/reset-ios-simulator.sh

# Rodar no simulador específico
npm run ios:16e
# ou
bash scripts/ci/run-ios-simulator.sh "iPhone 16e"
```

### Erro: "No code signing certificates are available to use"

O Xcode precisa de um **Development Team** configurado mesmo para simulador:

1. Abra o **Xcode**
2. **Xcode > Settings** (ou Preferences) > **Accounts**
3. Adicione seu **Apple ID** (gratuito)
4. Selecione a conta > **Manage Certificates** > **+** > **Apple Development**
5. Ou no projeto: abra `ios/NossaMaternidade.xcworkspace` no Xcode, selecione o target **NossaMaternidade** > **Signing & Capabilities** > marque **Automatically manage signing** e escolha seu **Team**

Depois rode novamente: `npm run ios`

### Erro: "Unknown arguments: --simulator"

O Expo não aceita `--simulator` diretamente. Use:

```bash
# Método 1: Script helper (recomendado)
npm run ios
# ou simulador específico:
npm run ios:16e
npm run ios:17pro

# Método 2: Usar flag -d do Expo
npx expo run:ios -d "iPhone 16e"

# Método 3: Iniciar simulador primeiro, depois rodar
xcrun simctl boot "iPhone 16e"
open -a Simulator
npm run ios
```

## 💡 Dicas

1. **Use reset antes de testes importantes** - Garante estado limpo
2. **Feche simulador quando não usar** - Economiza RAM
3. **Use UUID para precisão** - Nomes podem ter variações
4. **Mantenha apenas simuladores necessários** - Delete os não usados

## 📊 Simuladores Recomendados

Para desenvolvimento:

- ✅ **iPhone 17 Pro** - Padrão moderno
- ✅ **iPhone 15** - Base de mercado
- ✅ **iPhone SE** - Tela pequena (teste crítico)

Para testes:

- ✅ **iPhone 17 Pro Max** - Tela grande
- ✅ **iPhone 13** - Base instalada
