# Correção: Build Local iOS Falhando (Fastlane Ausente)

**Data:** 11 Jan 2026
**Erro:** `spawn fastlane ENOENT` - Build local iOS falhou

## 🔴 Problema Identificado

Build local do iOS falhou porque **Fastlane não está instalado**:

```
Fastlane is not available, make sure it's installed and in your PATH
spawn fastlane ENOENT
Error: build command failed
```

## ✅ Soluções Disponíveis

### Opção 1: Instalar Fastlane (Para Build Local)

**Requisitos:**

- Ruby instalado (já deve ter via CocoaPods)
- Acesso de instalação (pode precisar de sudo)

```bash
# Instalar via Homebrew (Recomendado)
brew install fastlane

# OU via gem (se Ruby está configurado)
sudo gem install fastlane

# OU via gem sem sudo (se configurado)
gem install fastlane --user-install

# Verificar instalação
which fastlane
fastlane --version
```

**Nota:** Se instalar via `--user-install`, adicione ao PATH:

```bash
export PATH="$HOME/.gem/ruby/$(ruby -v | cut -d' ' -f2 | cut -d'p' -f1)/bin:$PATH"
```

### Opção 2: Usar Expo Go para Debugging (Mais Rápido)

**No terminal onde `npm start` está rodando:**

1. Pressione `s` para **switch to Expo Go**
2. Depois pressione `i` para abrir no iOS Simulator
3. OU escaneie o QR code com Expo Go no dispositivo físico

**Vantagens:**

- ✅ Não precisa instalar Fastlane
- ✅ Build instantâneo
- ✅ Perfeito para debugging
- ⚠️ Algumas features nativas podem não funcionar (notificações push, etc)

### Opção 3: Build via EAS Cloud (Quando Limite Resetar)

Aguarde reset do limite EAS (01/Feb/2026) ou faça upgrade do plano.

Builds via cloud não requerem Fastlane localmente.

### Opção 4: Usar `npx expo run:ios` (Build Nativo Direto)

```bash
# Build direto no simulador (não requer Fastlane)
npx expo run:ios

# Build para dispositivo físico (requer certificados)
npx expo run:ios --device
```

**Nota:** Este método faz build nativo direto, não usa EAS local build.

## 🎯 Recomendação

**Para Debugging Agora:**

- Use **Opção 2** (Expo Go) - é a mais rápida e não requer instalações

**Para Build de Produção:**

- Use **Opção 3** (EAS Cloud) após reset do limite
- OU instale Fastlane (**Opção 1**) se precisar de build local imediato

## 📋 Verificação Rápida

Após instalar Fastlane, teste:

```bash
# Verificar instalação
fastlane --version

# Tentar build local novamente
npx eas build --platform ios --profile production --local
```

## 🔗 Referências

- [Fastlane Installation Guide](https://docs.fastlane.tools/getting-started/ios/setup/)
- [EAS Local Build Requirements](https://docs.expo.dev/build-reference/local-builds/)
- [Expo Development Build vs Expo Go](https://docs.expo.dev/development/introduction/)
- [Guia Completo de Setup iOS Local](./IOS_LOCAL_BUILD_SETUP.md) - **VER ESTE GUIA PARA SETUP COMPLETO**

---

## 📚 Guia Completo Disponível

Para setup completo de code signing + Fastlane + Xcode, veja:

- **[docs/IOS_LOCAL_BUILD_SETUP.md](./IOS_LOCAL_BUILD_SETUP.md)** - Guia passo a passo completo

---

**Status Atual:**

- ✅ Credenciais iOS: Configuradas e válidas
- ✅ Pods: Instalados (162 dependências, 179 pods)
- ✅ Xcode: 26.2 instalado
- ✅ Projeto iOS: Gerado (`ios/` folder existe)
- ✅ Certificado Distribution: Válido até 05/Jan/2027
- ✅ Provisioning Profile: Ativo (BQBQ2FYH87)
- ❌ Fastlane: **NÃO INSTALADO** (causa do erro)
- ⚠️ Limite EAS: 30/30 builds usados (reset em 21 dias)
