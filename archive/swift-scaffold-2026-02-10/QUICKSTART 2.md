# ⚡ QUICK START GUIDE - 5 MINUTOS PARA TESTFLIGHT

## 🎯 DO ZERO AO TESTFLIGHT EM 5 PASSOS

### 1️⃣ CONFIGURAR PROJETO (2 min)

```bash
# Clone ou navegue até o projeto
cd seu-projeto

# Copiar environment variables
cp .env.example .env

# Editar .env com suas credenciais Supabase
nano .env  # ou usar seu editor favorito
```

**Adicione suas credenciais:**

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 2️⃣ ABRIR NO XCODE (30 seg)

```bash
# Abrir projeto
open *.xcodeproj
```

**No Xcode:**

1. Selecionar seu Time em "Signing & Capabilities"
2. Verificar Bundle Identifier é único
3. Verificar Version (1.0.0) e Build (1)

### 3️⃣ TESTAR CÓDIGO (1 min)

```bash
# Rodar testes
⌘ + U

# Ou rodar app no simulador
⌘ + R
```

**Verificar:**

- ✅ Testes passam
- ✅ App compila sem warnings
- ✅ UI aparece corretamente

### 4️⃣ BUILD PARA TESTFLIGHT (1 min)

**Opção A - Script Automático:**

```bash
chmod +x build_for_testflight.sh
./build_for_testflight.sh
```

**Opção B - Manual no Xcode:**

1. Product → Archive (⌘ + Shift + B)
2. Window → Organizer
3. Distribute App → App Store Connect
4. Upload

### 5️⃣ CONFIGURAR TESTFLIGHT (30 seg)

1. Abrir [App Store Connect](https://appstoreconnect.apple.com)
2. Aguardar processamento (10-30 min)
3. TestFlight → Adicionar testers
4. Enviar convites!

---

## 🚀 COMANDOS ÚTEIS

### Desenvolvimento:

```bash
# Limpar build
⌘ + Shift + K

# Rodar testes
⌘ + U

# Rodar app
⌘ + R

# Archive
⌘ + Shift + B
```

### Terminal:

```bash
# Incrementar build number
xcrun agvtool next-version -all

# Ver build number atual
xcrun agvtool what-version

# Rodar SwiftLint
swiftlint

# Limpar DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

---

## 📋 CHECKLIST RÁPIDO

### Antes do Build:

- [ ] Version e Build number corretos
- [ ] Team selecionado
- [ ] Bundle ID único
- [ ] Testes passando (⌘ + U)
- [ ] Zero warnings

### Depois do Upload:

- [ ] Build apareceu no App Store Connect
- [ ] Status mudou para "Ready to Submit"
- [ ] Beta Testing configurado
- [ ] Testers adicionados
- [ ] Convites enviados

---

## 🆘 PROBLEMAS COMUNS

### "No signing certificate found"

**Solução:**

1. Xcode → Settings → Accounts
2. Adicionar Apple ID
3. Download Manual Profiles

### "Build failed to upload"

**Solução:**

1. Verificar internet
2. Tentar novamente
3. Usar Xcode Organizer (manual)

### "Archive não aparece no Organizer"

**Solução:**

1. Verificar scheme está em Release
2. Clean Build Folder (⌘ + Shift + K)
3. Archive novamente

### "Tests failing"

**Solução:**

1. Verificar simulador está instalado
2. Reset simulador: Device → Erase All Content
3. Rodar testes novamente

---

## 📱 TESTAR NO DEVICE FÍSICO

1. Conectar iPhone via USB
2. Selecionar device no Xcode
3. ⌘ + R
4. "Trust this computer" no iPhone
5. Settings → General → VPN & Device Management → Trust

---

## 🎓 RECURSOS

- **README.md** - Documentação completa
- **TESTFLIGHT_GUIDE.md** - Guia detalhado
- **EXECUTIVE_SUMMARY.md** - Visão geral do projeto

---

## ⚡ ONE-LINER PARA TESTFLIGHT

```bash
chmod +x build_for_testflight.sh && ./build_for_testflight.sh
```

---

## 🎉 PRONTO!

Seu app está no TestFlight em **5 minutos**! 🚀

Agora é só:

1. Aguardar processamento
2. Adicionar beta testers
3. Coletar feedback
4. Iterar e melhorar

**Boa sorte com seu lançamento!** ✨
