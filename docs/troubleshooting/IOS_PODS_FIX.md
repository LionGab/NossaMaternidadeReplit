# Fix: Problema com RCT-Folly no iOS

## Problema

```
Unable to find a specification for `RCT-Folly (= 2022.05.16.00)` depended upon by `react-native-ios-context-menu`
```

Isso acontece quando o CocoaPods não consegue encontrar a versão específica do `RCT-Folly` requerida por `react-native-ios-context-menu`.

## Soluções

### Solução 1: Script Automático (Recomendado)

```bash
bun run fix:ios
```

Ou manualmente:

```bash
bash scripts/fix-ios-pods.sh
```

### Solução 2: Limpeza Manual Completa

```bash
# 1. Limpar cache do CocoaPods
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/.cocoapods/repos/trunk

# 2. Limpar Pods do projeto
cd ios
rm -rf Pods
rm -f Podfile.lock

# 3. Atualizar repositório
pod repo update

# 4. Reinstalar
pod install --repo-update
```

### Solução 3: Forçar Versão Compatível (Se Solução 1 e 2 não funcionarem)

Se o problema persistir, pode ser necessário forçar uma versão compatível do RCT-Folly. Adicione ao `ios/Podfile` dentro do `target`:

```ruby
target 'NossaMaternidade' do
  # ... código existente ...

  # Forçar versão compatível do RCT-Folly
  pod 'RCT-Folly', '~> 2022.05.16.00'

  # ... resto do código ...
end
```

Depois execute:

```bash
cd ios
pod install
```

### Solução 4: Atualizar react-native-ios-context-menu

Verifique se há uma versão mais recente compatível:

```bash
npm info react-native-ios-context-menu versions
```

Se houver versão mais recente, atualize:

```bash
npm install react-native-ios-context-menu@latest
cd ios
pod install
```

### Solução 5: Usar EAS Build (Alternativa)

Se o problema persistir localmente, use EAS Build:

```bash
bun run eas:build:ios --profile development
```

Isso evita problemas locais de CocoaPods, pois o build acontece na nuvem.

## Prevenção

1. Sempre execute `pod install` após atualizar dependências nativas
2. Mantenha o CocoaPods atualizado: `sudo gem install cocoapods`
3. Limpe o cache periodicamente: `pod cache clean --all`

## Verificação

Após aplicar a solução, verifique:

```bash
cd ios
pod install
npx expo run:ios
```

Se ainda houver problemas, verifique:

- Versão do CocoaPods: `pod --version`
- Versão do React Native: `npm list react-native`
- Compatibilidade entre versões
