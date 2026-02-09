# Detalhes dos Gates

## G1 - Quality Gate

**Objetivo**: Código compila e passa lint

```bash
npm run quality-gate
```

**Verifica**:

- TypeScript compila
- ESLint passa
- Expo configs válidas
- Sem console.log

**Critério de Sucesso**: Zero erros

---

## G2 - Authentication

**Objetivo**: Auth providers funcionam

**Testes manuais no device**:

1. Email/Password signup
2. Email/Password login
3. Google Sign-In
4. Apple Sign-In
5. Logout
6. Session persistence

**Critério de Sucesso**: Todos os providers funcionam

---

## G3 - RLS (Row Level Security)

**Objetivo**: Dados protegidos no Supabase

**Verificar**:

```sql
-- Todas tabelas têm RLS
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN (
  SELECT tablename FROM pg_policies
);
```

**Critério de Sucesso**: Todas tabelas com RLS

---

## G4 - RevenueCat

**Objetivo**: IAP funciona em sandbox

**Testes manuais**:

1. Paywall exibe corretamente
2. Compra sandbox funciona
3. Premium ativa após compra
4. Restore purchase funciona
5. Free tier limits funcionam

**Setup Sandbox**:

```
iPhone → Settings → App Store → Sandbox Account
```

**Critério de Sucesso**: Fluxo completo funciona

---

## G5 - NathIA

**Objetivo**: Chat IA funciona corretamente

```bash
npm run test:gemini
```

**Verificar**:

- Respostas chegam
- Tom está correto
- Cache funciona
- Disclaimers aparecem

**Critério de Sucesso**: Chat responsivo e autêntico

---

## G6 - Build

**Objetivo**: Build produção compila

```bash
npm run build:prod:ios
```

**Verificar**:

- Build completa sem erro
- IPA gerado
- Secrets configurados

**Critério de Sucesso**: Build FINISHED

---

## G7 - Submit

**Objetivo**: App no TestFlight

```bash
npm run submit:prod:ios
```

**Verificar**:

- Upload completa
- Processing Apple OK
- Disponível no TestFlight

**Critério de Sucesso**: Build disponível para testers
