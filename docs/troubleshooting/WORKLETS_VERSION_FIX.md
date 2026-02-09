# Fix: Worklets Version Mismatch

## Problema

```
WorkletsError: [Worklets] Mismatch between JavaScript part and native part of Worklets (0.7.1 vs 0.5.1)
```

Isso acontece quando a parte JavaScript do Worklets está atualizada, mas a parte nativa (iOS/Android) ainda está com a versão antiga.

## Soluções

### Solução 1: Limpar Cache e Reconstruir (Recomendado)

1. **Parar o servidor Expo** (Ctrl+C)

2. **Limpar todos os caches**:

   ```bash
   # Limpar cache do Metro
   npx expo start --clear

   # Limpar cache do npm (opcional)
   npm cache clean --force
   ```

3. **Reinstalar dependências**:

   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Se estiver usando Expo Go**:
   - Feche completamente o app no dispositivo
   - Reabra o app
   - Escaneie o QR code novamente

5. **Se estiver usando Development Build**:

   ```bash
   # iOS
   npx expo run:ios

   # Android
   npx expo run:android
   ```

### Solução 2: Rebuild Nativo (Se Solução 1 não funcionar)

Se você tem um development build configurado:

```bash
# Limpar builds anteriores
npx expo prebuild --clean

# Reconstruir iOS
cd ios && pod install && cd ..
npx expo run:ios

# Ou Android
npx expo run:android
```

### Solução 3: Verificar Versões Compatíveis

Certifique-se de que as versões são compatíveis:

```bash
npm list react-native-worklets react-native-worklets-core react-native-reanimated
```

Versões esperadas:

- `react-native-worklets@0.7.1`
- `react-native-worklets-core@1.6.2`
- `react-native-reanimated@4.1.6`

### Solução 4: Downgrade Temporário (Se nada funcionar)

Se o problema persistir, pode ser necessário fazer downgrade temporário:

```bash
npm install react-native-worklets@0.5.1 --legacy-peer-deps
```

Mas isso não é recomendado, pois pode causar outros problemas.

## Prevenção

Para evitar isso no futuro:

1. Sempre limpe o cache após atualizar dependências nativas
2. Reconstrua o app nativo após atualizar `react-native-reanimated` ou `react-native-worklets`
3. Use `npx expo install` para garantir compatibilidade de versões

## Referências

- [Worklets Troubleshooting](https://docs.swmansion.com/react-native-worklets/docs/guides/troubleshooting#mismatch-between-javascript-part-and-native-part-of-worklets)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
