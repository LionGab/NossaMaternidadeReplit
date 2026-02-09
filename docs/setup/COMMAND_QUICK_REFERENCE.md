# 📋 Referência Rápida de Comandos

**⚠️ IMPORTANTE:** Sempre execute comandos npm/npx no diretório do projeto!

---

## 🚨 Erro Comum: Diretório Errado

**❌ ERRADO:**

```bash
# Está no diretório raiz (/)
/ % npm install
# Erro: Could not read package.json: Error: ENOENT: no such file or directory, open '/package.json'
```

**✅ CORRETO:**

```bash
# Primeiro, vá para o diretório do projeto
cd /Users/lion/Applications/NossaMaternidade-1

# Agora execute os comandos
npm install
```

---

## 📍 Verificar Diretório Atual

```bash
# Ver onde você está
pwd

# Deve mostrar:
# /Users/lion/Applications/NossaMaternidade-1

# Se não, vá para o projeto:
cd /Users/lion/Applications/NossaMaternidade-1
```

---

## ✅ Comandos Corretos

### Build iOS Local

```bash
# 1. Ir para o diretório do projeto
cd /Users/lion/Applications/NossaMaternidade-1

# 2. Executar build local
npm run build:local:ios

# OU
npx eas build --platform ios --profile preview --local
```

### Verificar Instalação (Expo Doctor)

```bash
# 1. Ir para o diretório do projeto
cd /Users/lion/Applications/NossaMaternidade-1

# 2. Executar expo-doctor (com hífen, não "expo doctor")
npx expo-doctor

# ❌ ERRADO: npx expo doctor (não funciona)
# ✅ CORRETO: npx expo-doctor (com hífen)

# OU
npm run validate
```

### Instalar Dependências

```bash
# 1. Ir para o diretório do projeto
cd /Users/lion/Applications/NossaMaternidade-1

# 2. Instalar dependências
npm install

# OU se usar bun
bun install
```

---

## 🔧 Comandos Úteis

### Verificar onde está

```bash
pwd
```

### Ir para o projeto

```bash
cd /Users/lion/Applications/NossaMaternidade-1
```

### Ver scripts disponíveis

```bash
cd /Users/lion/Applications/NossaMaternidade-1
npm run
```

### Ver package.json

```bash
cd /Users/lion/Applications/NossaMaternidade-1
cat package.json | grep -A 50 '"scripts"'
```

---

## 📚 Comandos do Projeto

### Builds

```bash
# Build iOS local
npm run build:local:ios

# Build iOS preview (EAS Cloud)
npm run build:preview:ios

# Build iOS TestFlight
npm run build:preview:ios:testflight

# Build iOS produção
npm run build:prod:ios
```

### Validação

```bash
# TypeScript check
npm run typecheck

# Lint
npm run lint

# Validar tudo
npm run validate

# Expo doctor
npx expo-doctor
```

### Desenvolvimento

```bash
# Iniciar dev server
npm start

# Iniciar com cache limpo
npm run start:clear

# Rodar no iOS (simulador)
npm run ios

# Rodar no Android (emulador)
npm run android
```

---

## ⚠️ Problemas Comuns

### Erro: "Could not read package.json"

**Causa:** Você não está no diretório do projeto

**Solução:**

```bash
cd /Users/lion/Applications/NossaMaternidade-1
```

### Erro: "expo doctor is not supported"

**Causa:** Comando errado (espaço em vez de hífen)

**Solução:** Use `npx expo-doctor` (com hífen), não `npx expo doctor` (com espaço)

### Erro: "expo-install-check not found"

**Causa:** Comando não existe

**Solução:** Use `npx expo-doctor` (comando correto)

### Erro: "xcrun: unable to find utility simctl"

**Causa:** Xcode não está instalado ou Command Line Tools não configurados

**Solução:**

```bash
# Instalar Xcode Command Line Tools
xcode-select --install

# OU se Xcode está instalado, definir path:
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

---

## 🎯 Resumo

1. **Sempre** vá para o diretório do projeto primeiro:

   ```bash
   cd /Users/lion/Applications/NossaMaternidade-1
   ```

2. **Depois** execute os comandos npm/npx

3. **Verifique** onde está com `pwd` se não tiver certeza

---

**Última atualização:** Janeiro 2026
