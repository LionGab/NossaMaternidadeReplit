# EAS Workflows - Nossa Maternidade

Este diretório contém workflows automáticos do EAS (Expo Application Services).

## Workflows Disponíveis

### 📱 build-ios-production.yml
- **Trigger**: Push na branch `release` (evita submit acidental em `main`)
- **Ações**: Build iOS + Submit para TestFlight
- **Profile**: production

### 🤖 build-android-production.yml  
- **Trigger**: Push na branch `release` (evita submit acidental em `main`)
- **Ações**: Build Android + Submit para Google Play (internal track)
- **Profile**: production

### 🔧 build-development.yml
- **Trigger**: Push em `develop`, `feat/**`, `fix/**`
- **Ações**: Build iOS e Android para desenvolvimento
- **Profile**: development

## Como Usar

Ver documentação completa em `docs/eas-workflows.md`
