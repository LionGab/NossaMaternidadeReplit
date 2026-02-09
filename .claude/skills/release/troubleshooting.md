# Troubleshooting de Deploy

## Build Failures

### TypeScript Errors

```bash
# Diagnóstico
npm run typecheck

# Se falhar, corrigir antes de retry
```

### CocoaPods / iOS

```bash
# Limpar cache
eas build --platform ios --clear-cache

# Verificar credentials
eas credentials --platform ios
```

### Provisioning Profile

```bash
# Reset credentials
eas credentials --platform ios

# Selecionar: "Remove all credentials"
# Depois: "Set up new credentials"
```

### Missing Secrets

```bash
# Listar secrets
eas secret:list

# Adicionar secret
eas secret:create --name SECRET_NAME --value "value"
```

## Submission Failures

### App Store Connect

1. Verificar status em App Store Connect
2. Verificar se app está configurado
3. Verificar se screenshots estão completos

### Binary Rejected

1. Ler feedback da Apple
2. Corrigir issues apontados
3. Incrementar buildNumber
4. Rebuild e resubmit

## Problemas Comuns

| Erro                | Causa            | Solução              |
| ------------------- | ---------------- | -------------------- |
| `EAS_BUILD_FAILED`  | TypeScript error | `npm run typecheck`  |
| `INVALID_BUNDLE`    | Bundle ID errado | Verificar `app.json` |
| `MISSING_PROVISION` | Profile expirado | `eas credentials`    |
| `UPLOAD_FAILED`     | Conexão          | Retry `eas submit`   |
