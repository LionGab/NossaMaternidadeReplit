# 🚀 Quick Reference - iOS Release Agent

> Referência rápida para executar releases iOS

## ⚡ Comando Rápido

```bash
# 1. Preparar release
npm run prepare-ios-preview

# 2. Build iOS Preview (Ad Hoc)
eas build --platform ios --profile ios_preview

# 3. Build iOS TestFlight (quando aprovado)
eas build --platform ios --profile ios_testflight

# 4. Submit para App Store
eas submit --platform ios --latest
```

## 📋 Checklist Rápido

### Antes do Build

- [ ] `npm run prepare-ios-preview` executado
- [ ] Build number incrementado em `app.config.js`
- [ ] UDIDs adicionados no Apple Developer Portal
- [ ] Provisioning profile atualizado

### Após o Build

- [ ] Build completado no EAS
- [ ] Link de instalação obtido
- [ ] Link enviado + guia `IOS_PREVIEW_INFLUENCER.md`
- [ ] Feedback coletado

## 🔗 Links Rápidos

- **App Store Connect**: https://appstoreconnect.apple.com/apps/6756980888
- **Apple Developer**: https://developer.apple.com/account
- **Expo Dashboard**: https://expo.dev

## 📱 Info do Projeto

- **Bundle ID**: `br.com.nossamaternidade.app`
- **Team ID**: `KZPW4S77UH`
- **UDID Teste**: `00008140-001655C03C50801C`

## 🆘 Ajuda Rápida

| Problema        | Solução                                            |
| --------------- | -------------------------------------------------- |
| Script não roda | `chmod +x scripts/release/prepare-ios-preview.mjs` |
| Build falha     | Verificar env vars e credenciais                   |
| Não instala     | Verificar UDID no provisioning profile             |
| "Não confiável" | Ajustes → Geral → Gerenciamento → Confiar          |

## 📖 Documentação Completa

- `docs/release/AGENT_README.md` - Runbook completo
- `docs/RELEASE_PACKET.md` - Template de release
- `docs/IOS_PREVIEW_INFLUENCER.md` - Guia do usuário
