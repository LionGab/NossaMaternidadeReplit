# 🔧 Troubleshooting: Build Error

**Erro:** `Error: build command failed.`

**Contexto:**

- Build foi comprimido e enviado com sucesso
- Credenciais configuradas corretamente
- Erro após upload

---

## 🔍 Diagnosticar o Problema

### 1. Verificar Logs do Build

```bash
# Ver último build
eas build:list --platform ios --limit 1

# Ver detalhes do build específico
eas build:view <BUILD_ID>

# Ver logs completos
eas build:view <BUILD_ID> --json | jq '.logs'
```

### 2. Verificar EAS Dashboard

1. Acesse: https://expo.dev/accounts/nossa-maternidade/projects/nossamaternidade-3gmjtcwmjxn4ec-nzlri/builds
2. Clique no build que falhou
3. Veja os logs completos para identificar o erro específico

---

## ⚠️ Possíveis Causas

### 1. Limite do Plano Free (Mais Provável)

**Sintoma:**

```
This account has used its iOS builds from the Free plan this month
```

**Solução:**

- Aguardar reset (20 dias - Sun Feb 01 2026)
- OU fazer upgrade do plano: https://expo.dev/accounts/nossa-maternidade/settings/billing
- OU usar build local (se disponível)

**Build Local (Alternativa):**

```bash
# Build local (não conta no limite do plano)
eas build --platform ios --profile preview --local
```

### 2. Timeout do Build

**Sintoma:**

- Build falha após muito tempo
- Sem erro específico

**Solução:**

- Verificar logs no EAS Dashboard
- Tentar build local
- Verificar se há processos bloqueantes no código

### 3. Erro de Configuração

**Sintoma:**

- Build falha imediatamente
- Erro específico nos logs

**Solução:**

- Verificar logs completos no EAS Dashboard
- Verificar configuração do `eas.json`
- Verificar variáveis de ambiente

### 4. Erro de Dependências

**Sintoma:**

- Build falha durante instalação de dependências
- Erro relacionado a pods ou npm

**Solução:**

- Limpar cache e tentar novamente:
  ```bash
  bash scripts/clear-updates-cache.sh
  rm -rf ios/Pods ios/Podfile.lock
  eas build --platform ios --profile preview --clear-cache
  ```

### 5. Erro de Credenciais

**Sintoma:**

- Build falha durante signing
- Erro relacionado a certificados

**Solução:**

- Verificar credenciais no EAS Dashboard
- Tentar recriar credenciais:
  ```bash
  eas credentials
  ```

---

## ✅ Soluções Rápidas

### Opção 1: Verificar Logs (Recomendado)

```bash
# Ver último build
eas build:list --platform ios --limit 1

# Ver detalhes (substituir BUILD_ID)
eas build:view <BUILD_ID>
```

### Opção 2: Build Local (Se Disponível)

```bash
# Build local (não conta no limite)
eas build --platform ios --profile preview --local
```

**⚠️ IMPORTANTE:** Build local requer:

- Xcode instalado
- CocoaPods instalado
- Certificados configurados localmente

### Opção 3: Aguardar Reset do Plano Free

- Reset em 20 dias (Sun Feb 01 2026)
- Ou fazer upgrade do plano

### Opção 4: Tentar Novamente

```bash
# Tentar build novamente (pode ter sido erro temporário)
eas build --platform ios --profile preview --clear-cache
```

---

## 📊 Status do Plano Free

**Mensagem:**

```
This account has used its iOS builds from the Free plan this month
which will reset in 20 days (on Sun Feb 01 2026)
```

**Limites do Plano Free:**

- ✅ 30 builds/mês (iOS + Android combinados)
- ✅ Builds podem ser lentos
- ✅ Timeout limitado

**Upgrade do Plano:**

- Mais builds/mês
- Builds mais rápidos
- Timeout maior
- Builds concorrentes

---

## 🔍 Próximos Passos

1. **Verificar logs no EAS Dashboard** (recomendado)
   - Identificar erro específico
   - Ver se é erro de código ou limite

2. **Se for limite do plano:**
   - Aguardar reset OU
   - Fazer upgrade OU
   - Usar build local

3. **Se for erro de código:**
   - Corrigir erro específico
   - Tentar build novamente

---

## 📚 Referências

- [EAS Build Limits](https://docs.expo.dev/build/introduction/#build-limits)
- [EAS Build Troubleshooting](https://docs.expo.dev/build/troubleshooting/)
- [EAS Dashboard](https://expo.dev/accounts/nossa-maternidade/projects/nossamaternidade-3gmjtcwmjxn4ec-nzlri/builds)

---

**Última atualização:** Janeiro 2026
