# Configurar EAS Submit - Windows

## 📋 Resumo

O **EAS Submit** permite automatizar o upload do build para o App Store Connect, eliminando a necessidade do Transporter manual.

**Status Atual:**

- ✅ Build concluído: `f6c0d106-b7da-4115-94c6-02c7f66f811d`
- ✅ Arquivo .ipa baixado: `nossa-maternidade-build.ipa` (47.72 MB)
- ❌ App Store Connect API Key: **NÃO configurada** (necessária para EAS Submit)

---

## 🎯 Duas Opções

### Opção A: EAS Submit Automático (Recomendado - Futuro)

**Vantagens:**

- ✅ Automatiza upload (um comando apenas)
- ✅ Funciona em CI/CD
- ✅ Não precisa Transporter manual

**Requisitos:**

- App Store Connect API Key (.p8)

**Como fazer:**

1. Criar/baixar API Key (ver abaixo)
2. Configurar no EAS
3. Rodar `npm run submit:prod:ios`

---

### Opção B: Upload Manual via Transporter (Atual)

**Vantagens:**

- ✅ Funciona imediatamente (sem API Key)
- ✅ Mais controle visual

**Como fazer:**

- Ver `INSTRUCOES_UPLOAD_WINDOWS.md`

---

## 🔑 Passo a Passo: Configurar API Key

### 1. Obter App Store Connect API Key

#### Opção 1: Verificar se já existe

1. Acesse: https://appstoreconnect.apple.com
2. Login: `gabrielvesz_@hotmail.com` (ou `nath@nossamaternidade.com.br`)
3. Vá em: **Users and Access** → **Integrations** → **Keys**
4. Procure por:
   - **Key ID:** `E7IV510UXU7D`
   - **Nome:** "Nossa Maternidade EAS"

**Se encontrar:**

- Status: **Active** → Key existe mas você não tem o arquivo
- ⚠️ **Problema:** Não é possível baixar novamente
- **Solução:** Criar nova key (Opção 2)

**Se NÃO encontrar:**

- Key nunca foi criada
- **Solução:** Criar nova key (Opção 2)

---

#### Opção 2: Criar Nova Key

1. No App Store Connect: **Users and Access** → **Integrations** → **Keys**
2. Clique em **"+"** (Generate API Key)
3. Preencha:
   - **Name:** `Nossa Maternidade EAS`
   - **Access:** **Admin** (necessário para submit)
4. Clique em **Generate**
5. **BAIXE IMEDIATAMENTE** → Arquivo `.p8` será baixado
   - ⚠️ Você só pode baixar **UMA VEZ**!
   - Exemplo: `AuthKey_XXXXXXXX.p8`
6. **COPIE o Key ID** que aparece (ex: `E7IV510UXU7D`)

**Salvar o arquivo:**

```powershell
# Copiar do Downloads para o projeto
Copy-Item "$env:USERPROFILE\Downloads\AuthKey_XXXXXXXX.p8" -Destination ".\ApiKey_XXXXXXXX.p8"

# Ou renomear para o padrão esperado
Rename-Item "AuthKey_XXXXXXXX.p8" -NewName "ApiKey_XXXXXXXX.p8"
```

---

### 2. Configurar no EAS

#### 2.1. Colocar arquivo no projeto

```powershell
# Certifique-se que o arquivo .p8 está na raiz do projeto
# Formato esperado: ApiKey_XXXXXXXX.p8 (onde XXXXXXXX é o Key ID)

# Exemplo:
# ApiKey_E7IV510UXU7D.p8
```

#### 2.2. Configurar no eas.json

O `eas.json` já está parcialmente configurado, mas precisamos adicionar a referência à API Key.

**Configuração atual:**

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "gabrielvesz_@hotmail.com",
        "ascAppId": "6756980888",
        "appleTeamId": "KZPW4S77UH"
      }
    }
  }
}
```

**Após obter a API Key, adicionar:**

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "gabrielvesz_@hotmail.com",
        "ascAppId": "6756980888",
        "appleTeamId": "KZPW4S77UH",
        "ascApiKeyPath": "./ApiKey_E7IV510UXU7D.p8", // ← ADICIONAR ESTA LINHA
        "ascApiKeyIssuerId": "f483d4df-0161-497b-8936-729c4674d1ab", // ← ADICIONAR ESTA LINHA
        "ascApiKeyId": "E7IV510UXU7D" // ← ADICIONAR ESTA LINHA (o Key ID)
      }
    }
  }
}
```

**Onde encontrar:**

- **ascApiKeyId:** Key ID que você copiou (ex: `E7IV510UXU7D`)
- **ascApiKeyPath:** Caminho relativo ao arquivo `.p8` na raiz do projeto
- **ascApiKeyIssuerId:** Em **Users and Access** → **Integrations** → **Keys** → **Issuer ID** (geralmente já está no documento: `f483d4df-0161-497b-8936-729c4674d1ab`)

---

### 3. Testar Configuração

```powershell
# Verificar se o arquivo existe
Get-Item "ApiKey_*.p8"

# Validar configuração
npm run validate-launch
```

---

### 4. Usar EAS Submit

```powershell
# Submeter build mais recente
npm run submit:prod:ios

# Ou diretamente
npx eas-cli submit --profile production --platform ios --latest
```

**O que acontece:**

1. EAS usa a API Key configurada
2. Faz upload do `.ipa` para App Store Connect
3. Build aparece automaticamente em **TestFlight**
4. Aguarde processamento (5-15 minutos)

---

## 📊 Comparação: Manual vs Automatizado

| Aspecto            | Manual (Transporter) | Automatizado (EAS Submit) |
| ------------------ | -------------------- | ------------------------- |
| **Setup inicial**  | Instalar Transporter | Configurar API Key        |
| **Tempo de setup** | 5 minutos            | 10-15 minutos             |
| **Upload**         | Arrastar arquivo     | Comando único             |
| **CI/CD**          | ❌ Não               | ✅ Sim                    |
| **Automação**      | ❌ Manual            | ✅ Automático             |

---

## ✅ Checklist de Configuração

- [ ] App Store Connect API Key criada/baixada
- [ ] Arquivo `.p8` salvo no projeto (raiz)
- [ ] Key ID copiado (ex: `E7IV510UXU7D`)
- [ ] `eas.json` atualizado com:
  - [ ] `ascApiKeyPath`
  - [ ] `ascApiKeyId`
  - [ ] `ascApiKeyIssuerId`
- [ ] Testado: `npm run validate-launch`
- [ ] Testado: `npm run submit:prod:ios`

---

## 🆘 Troubleshooting

### "Could not find App Store Connect API Key"

**Problema:** Arquivo `.p8` não encontrado

**Solução:**

```powershell
# Verificar se o arquivo existe
Get-Item "ApiKey_*.p8"

# Verificar caminho no eas.json
# Deve ser: "./ApiKey_XXXXXXXX.p8"
```

---

### "Invalid API Key"

**Problema:** Key ID ou Issuer ID incorretos

**Solução:**

1. Verificar Key ID no App Store Connect
2. Verificar Issuer ID (deve ser: `f483d4df-0161-497b-8936-729c4674d1ab`)
3. Verificar se o arquivo `.p8` corresponde ao Key ID

---

### "Unauthorized" ou "Access Denied"

**Problema:** API Key sem permissão Admin

**Solução:**

1. Criar nova API Key com **Access: Admin**
2. Atualizar `eas.json` com novo Key ID

---

## 🎯 Recomendação

**Para agora (primeiro upload):**

- ✅ Use **Opção B** (Transporter manual)
- Rápido e funciona imediatamente

**Para o futuro (automação):**

- ✅ Configure **Opção A** (EAS Submit)
- Facilita muito builds e CI/CD

---

## 📚 Referências

- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [App Store Connect API Keys](https://appstoreconnect.apple.com/access/api)
- [EAS Submit iOS Guide](https://docs.expo.dev/submit/ios/)

---

**Última atualização:** 12/01/2026
