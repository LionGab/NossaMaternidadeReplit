# 🤖 ReleasePreparerIOS - Agente de Preparação de Release iOS

> **Agente automatizado** para preparar builds iOS (EAS + nativo) até o ponto de apenas enviar para App Store/TestFlight

## 📋 Missão

Preparar uma versão instalável fora do TestFlight para teste (influenciadora) e deixar tudo pronto para, depois, subir para TestFlight/Play com 1 confirmação humana.

## 🎯 Objetivo

Este agente automatiza todo o processo de preparação de release iOS, desde a validação de configurações até a geração de instruções precisas para build e distribuição. O resultado é um processo repetível e confiável que reduz erros humanos.

## 📦 Componentes do Agente

### 1. Perfis EAS (`eas.json`)

Três perfis especializados para diferentes estágios de release:

#### `ios_preview` - Ad Hoc / Internal Distribution

- **Uso**: Testes internos com influenciadores e beta testers
- **Distribuição**: Ad Hoc (requer UDID dos dispositivos)
- **Build**: Release configuration
- **Auto-increment**: Não (controle manual)

```bash
eas build --platform ios --profile ios_preview
```

#### `ios_testflight` - TestFlight / Store

- **Uso**: Distribuição via TestFlight antes da App Store
- **Distribuição**: Store (não requer UDID)
- **Build**: Release configuration
- **Auto-increment**: Sim (build number automático)

```bash
eas build --platform ios --profile ios_testflight
```

#### `android_internal` - Internal Testing

- **Uso**: Testes internos Android
- **Distribuição**: Internal (APK)
- **Build**: Debug/Release

```bash
eas build --platform android --profile android_internal
```

### 2. Templates de Documentação

#### `docs/RELEASE_PACKET.md`

Template completo para documentar cada release:

- Informações gerais (versão, build number, data)
- Configuração iOS/Android
- Comandos de build
- Checklists de preparação
- Instruções de distribuição
- Smoke tests obrigatórios
- Notas da release

#### `docs/IOS_PREVIEW_INFLUENCER.md`

Guia passo-a-passo para influenciadores instalarem o app:

- Pré-requisitos
- Instruções de instalação detalhadas
- Como confiar no desenvolvedor
- Checklist de testes
- Como reportar problemas
- Problemas comuns e soluções

### 3. Issue Template (`release_ios_preview.yml`)

GitHub Issue template estruturado para releases:

- Campos para versão e build number
- Seleção do tipo de release (ios_preview / ios_testflight)
- Lista de UDIDs de teste
- Checklists interativas para:
  - Pré-build
  - Apple Developer Portal
  - Pós-build
  - Smoke tests
- Campos para documentar distribuição e resultados

### 4. Script de Preparação (`scripts/release/prepare-ios-preview.mjs`)

Script Node.js que executa 7 etapas de validação e preparação:

1. **Auditoria do Repositório**: Verifica presença de arquivos essenciais
2. **Configuração do App**: Valida bundle ID, versão e build number
3. **Instruções de Build**: Gera comandos EAS corretos
4. **Verificação de Build Number**: Alerta se precisa incrementar
5. **Checklist Apple Developer**: Lista tarefas no portal Apple
6. **Bloco Markdown**: Gera markdown para colar na issue
7. **Smoke Test Checklist**: Lista testes obrigatórios

**Uso**:

```bash
npm run prepare-ios-preview
```

## 🚀 Workflow Completo

### Fase 1: Preparação (5-10 minutos)

1. **Execute o script de preparação**:

   ```bash
   npm run prepare-ios-preview
   ```

2. **Revise as validações**:
   - ✅ Arquivos essenciais existem
   - ✅ Bundle ID correto
   - ✅ Versão e build number identificados

3. **Incremente o build number** (se necessário):
   - Abra `app.config.js`
   - Encontre `buildNumber: "3"`
   - Altere para o próximo número sequencial

### Fase 2: Apple Developer Portal (10-15 minutos)

1. **Acesse**: https://developer.apple.com/account
2. **Vá em**: Certificates, Identifiers & Profiles
3. **Adicione UDIDs** dos dispositivos de teste:
   - Devices → Register Device
   - UDID: `00008140-001655C03C50801C`
4. **Crie/atualize o Provisioning Profile**:
   - Profiles → + (novo) ou edite existente
   - Tipo: Ad Hoc
   - Adicione os dispositivos registrados
   - Download e instale (se necessário)

### Fase 3: Build no EAS (20-40 minutos)

1. **Execute o build**:

   ```bash
   eas build --platform ios --profile ios_preview
   ```

2. **Aguarde a conclusão** (monitorar em https://expo.dev)

3. **Obtenha o link de instalação** quando completar

### Fase 4: Distribuição (5 minutos)

1. **Copie o link de instalação** do EAS
2. **Envie para a influenciadora** via WhatsApp/Email:
   - Link de instalação
   - Guia: `docs/IOS_PREVIEW_INFLUENCER.md`
3. **Instrua a seguir** as etapas do guia

### Fase 5: Testes e Feedback (variável)

1. **Aguarde a instalação** pela influenciadora
2. **Colete feedback** usando a checklist:
   - [ ] App instala corretamente
   - [ ] App abre sem crashes
   - [ ] Login/Signup funciona
   - [ ] Navegação principal funciona
   - [ ] Features críticas testadas

3. **Documente problemas** encontrados

### Fase 6: TestFlight (quando aprovado)

Após aprovação nos testes internos:

1. **Execute build para TestFlight**:

   ```bash
   eas build --platform ios --profile ios_testflight
   ```

2. **Submeta para App Store Connect**:
   ```bash
   eas submit --platform ios --latest
   ```

## ⚙️ Configuração do Projeto

### Variáveis de Ambiente Necessárias

```bash
# Expo
EXPO_PUBLIC_ENV=preview

# Apple
EXPO_APPLE_ID=gabrielvesz_@hotmail.com
EXPO_APPLE_TEAM_ID=KZPW4S77UH

# Se usar RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=...

# Se usar Supabase
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

### Credenciais EAS

Configure as credenciais no EAS:

```bash
eas credentials
```

## 📊 Entradas (Inputs)

| Parâmetro              | Valor                           | Descrição                       |
| ---------------------- | ------------------------------- | ------------------------------- |
| `repo`                 | `LionGab/NossaMaternidade`      | Repositório GitHub              |
| `bundleId`             | `br.com.nossamaternidade.app`   | Bundle identifier iOS           |
| `appleTeamId`          | `KZPW4S77UH`                    | Apple Developer Team ID         |
| `appStoreConnectAppId` | `6756980888`                    | ID do app no App Store Connect  |
| `testDeviceUdids`      | `["00008140-001655C03C50801C"]` | UDIDs dos dispositivos de teste |
| `releaseChannel`       | `ios_preview`                   | Canal de release                |
| `sku`                  | `nossamaternidade001`           | SKU do produto                  |

## 📤 Saídas (Outputs)

1. **Validações completas** de configuração
2. **Comandos EAS** precisos para executar
3. **Checklist interativa** para Apple Developer Portal
4. **Bloco markdown** pronto para issue do GitHub
5. **Guia de instalação** para enviar aos testadores
6. **Link de build** do EAS após conclusão

## 🔒 Regras de Segurança

### ⚠️ Nunca:

1. ❌ Publicar em loja automaticamente
2. ❌ Imprimir segredos no console
3. ❌ Fazer commits de credenciais

### ✅ Sempre:

1. ✅ Validar bundle ID antes do build
2. ✅ Confirmar build number incrementado
3. ✅ Exigir checklist de teste se tocar billing/auth (RevenueCat/Supabase)
4. ✅ Documentar UDIDs usados em cada build

## 🧪 Checklist de Smoke Tests

### Obrigatórios (sempre)

- [ ] App instala corretamente
- [ ] App abre sem crashes
- [ ] Splash screen aparece
- [ ] Login/Signup funciona
- [ ] Navegação principal funciona

### Se tocar Billing (RevenueCat)

- [ ] Paywall é exibido corretamente
- [ ] Pode iniciar processo de assinatura
- [ ] Status de assinatura é verificado

### Se tocar Auth (Supabase)

- [ ] Login com email funciona
- [ ] OAuth (Google/Apple) funciona
- [ ] Logout funciona
- [ ] Session é persistida

## 🔧 Troubleshooting

### Build falha no EAS

- Verifique se todas as env vars estão configuradas
- Verifique se as credenciais estão válidas: `eas credentials`
- Verifique logs completos no painel EAS

### App não instala no dispositivo

- Confirme que o UDID está no provisioning profile
- Baixe e instale o profile atualizado
- Verifique se o certificado de distribuição está válido

### "Desenvolvedor não confiável"

- Vá em Ajustes → Geral → Gerenciamento de Dispositivo
- Toque no perfil KZPW4S77UH
- Toque em "Confiar"

### Build number já existe

- Incremente o build number em `app.config.js`
- Ou use o perfil `ios_testflight` que tem auto-increment

## 📚 Recursos e Links

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **App Store Connect**: https://appstoreconnect.apple.com/apps/6756980888
- **Apple Developer**: https://developer.apple.com/account
- **Expo Dashboard**: https://expo.dev/accounts/nossa-maternidade/projects/nossamaternidade-3gmjtcwmjxn4ec-nzlri

## 🎯 Próximos Passos

Depois de usar este agente:

1. ✅ **Build iOS Preview** gerado com sucesso
2. ✅ **Link de instalação** enviado para influenciadora
3. ✅ **Feedback** coletado e documentado
4. → **Build TestFlight** quando aprovado
5. → **Submissão App Store** quando validado
6. → **Launch** 🚀

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Consulte este runbook
2. Verifique a documentação no diretório `docs/`
3. Entre em contato com o time de desenvolvimento

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026  
**Mantido por**: LionGab Team
