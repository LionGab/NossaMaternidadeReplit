# TestFlight Validation Guide - Nossa Maternidade

> Guia completo de validação para Build #52 (1.0.1) no TestFlight

**Data:** 2026-02-01
**Build ID:** 34a32ce9-7b8d-416d-9db2-28b9e431da4e
**Commit:** d9838a79 (feat: redesign HomeScreen com design premium Nathia 2026)

---

## 📋 Status Geral

| Item                  | Status | Notas                                     |
| --------------------- | ------ | ----------------------------------------- |
| **Build Completo**    | ✅     | Build #52 finished com sucesso            |
| **Quality Gate**      | ✅     | TypeScript + ESLint 100% PASS             |
| **Design System**     | ✅     | HomeScreen redesign premium aplicado      |
| **TestFlight Upload** | ⏳     | Aguardando processamento Apple (5-10 min) |
| **Validação Device**  | ⏳     | Pendente teste manual                     |

---

## 🎯 Gates de Release

### ✅ COMPLETOS (Automático)

| Gate     | Status | Validação                          |
| -------- | ------ | ---------------------------------- |
| **G-1**  | ✅     | Secrets scan clean                 |
| **G0**   | ✅     | Diagnose production ready          |
| **G1**   | ✅     | Quality gate 100% PASS             |
| **G2.5** | ✅     | AI consent unified (canUseAi)      |
| **G3**   | ✅     | RLS 35 tables, 113 policies        |
| **G5**   | ✅     | NathIA + Voice ID configured       |
| **G6**   | ✅     | Build #52 finished successfully    |
| **G7**   | ✅     | TestFlight submission em andamento |

### ⏳ PENDENTES (Teste Manual no Device)

#### **G2 - Authentication**

**Status:** ⏳ PENDING
**Requer:** Teste no device físico ou TestFlight

**Checklist:**

- [ ] **Email Login**
  - [ ] Criar conta nova com email
  - [ ] Confirmar email via link
  - [ ] Login com credenciais corretas
  - [ ] Logout e re-login
  - [ ] Recuperação de senha

- [ ] **Google Login**
  - [ ] Sign in with Google
  - [ ] Permissões solicitadas corretamente
  - [ ] Criação automática de profile
  - [ ] Logout e re-login
  - [ ] Múltiplas contas Google

- [ ] **Apple Login**
  - [ ] Sign in with Apple
  - [ ] "Hide my email" funciona
  - [ ] Criação automática de profile
  - [ ] Logout e re-login
  - [ ] Face ID/Touch ID prompt

**Como testar:**

```bash
# 1. Instalar via TestFlight
# 2. Abrir app e ir para login screen
# 3. Testar cada método de auth
# 4. Verificar criação de profile no Supabase
```

**Critérios de sucesso:**

- ✅ Todos os métodos funcionam sem crash
- ✅ Profile criado corretamente no Supabase
- ✅ Token JWT válido
- ✅ Session persiste após reabrir app

---

#### **G4 - RevenueCat (In-App Purchase)**

**Status:** ⏳ PENDING
**Requer:** Teste sandbox no device físico

**Checklist:**

- [ ] **Sandbox Configuration**
  - [ ] Testflight sandbox account configurado
  - [ ] Products configurados no App Store Connect
  - [ ] RevenueCat dashboard mostra produtos

- [ ] **Purchase Flow**
  - [ ] Paywall exibido corretamente
  - [ ] Preços localizados (R$ no Brasil)
  - [ ] Toque em "Assinar" abre sheet do iOS
  - [ ] Confirmação com Face ID/Touch ID
  - [ ] Sandbox purchase completa sem erros

- [ ] **Premium Unlock**
  - [ ] isPremium() retorna true após compra
  - [ ] UI atualiza automaticamente
  - [ ] Features premium desbloqueadas
  - [ ] Badge "Premium" aparece no profile

- [ ] **Restore Purchase**
  - [ ] Botão "Restaurar Compras" funciona
  - [ ] Premium restaurado em outro device
  - [ ] Mensagem de sucesso exibida

**Como testar:**

```bash
# 1. Configurar sandbox tester no device (Settings > App Store)
# 2. Instalar via TestFlight
# 3. Abrir app e ir para paywall
# 4. Tentar compra sandbox (grátis)
# 5. Verificar unlock de features
```

**Critérios de sucesso:**

- ✅ Purchase flow completo sem crash
- ✅ RevenueCat webhook recebido
- ✅ Entitlement "premium" ativo
- ✅ UI reflete status premium
- ✅ Restore purchase funciona

---

## 🎨 Validações de UI (Design Premium)

### HomeScreen V2 Premium

**Commit:** d9838a79
**Status:** ✅ Implementado e commitado

**Verificar no device:**

- [ ] **Header Premium**
  - [ ] Avatar 72x72 com gradiente (accent → teal)
  - [ ] Saudação com emoji correto (manhã/tarde/noite)
  - [ ] Nome do usuário truncado corretamente
  - [ ] Gradiente cream → white suave

- [ ] **Section Headers**
  - [ ] Ícones lucide renderizados (Heart, Sparkles, TrendingUp)
  - [ ] Subtítulos legíveis (neutral[500])
  - [ ] Spacing consistente (spacing.md)

- [ ] **Animações**
  - [ ] FadeInDown no header (600ms delay 100ms)
  - [ ] FadeInUp nos cards (600ms delays escalonados)
  - [ ] Smooth e sem lag (60fps)

- [ ] **Color Palette**
  - [ ] Background cream (maternal.warmth.cream)
  - [ ] Cards com sombras suaves
  - [ ] Contraste de texto adequado (WCAG AAA)
  - [ ] Dark mode (se habilitado)

- [ ] **Componentes**
  - [ ] EmotionalCheckInPrimary renderiza
  - [ ] DailyMicroActions mostra 8 hábitos
  - [ ] DailyProgressBar com SVG circle
  - [ ] DailyReminders sem erros

**Screenshot esperado:**

```
┌─────────────────────────────────┐
│ 🌅 Bom dia                      │
│ Mamãe                           │
│ [Avatar 72x72 com gradiente]    │
├─────────────────────────────────┤
│ ❤️  Como você está agora?       │
│ [Mood slider]                   │
├─────────────────────────────────┤
│ ✨ Micro-ações do dia           │
│ [8 habits checklist]            │
├─────────────────────────────────┤
│ 📈 Seu progresso                │
│ [Circle progress ring]          │
└─────────────────────────────────┘
```

---

## 🚀 Próximos Passos

### 1. Aguardar Processamento Apple (5-10 min)

```bash
# Verificar status do build
open "https://appstoreconnect.apple.com/apps/6756980888/testflight/ios"
```

**Aguardar:**

- ✅ "Processing" → "Ready to Submit"
- ✅ Export compliance OK
- ✅ Privacy manifest validado (iOS 17+)

### 2. Distribuir para Testadores Internos

**App Store Connect:**

1. Build → TestFlight
2. Selecionar Build #52 (1.0.1)
3. "Internal Testing" → Add testers
4. Enviar convite

**Testadores sugeridos:**

- gabrielvesz_@hotmail.com (owner)
- [adicionar outros]

### 3. Executar Validação Manual

**Prioridade:**

1. ✅ Validar crash fix (splash screen)
2. ⏳ G2 - Auth (Email, Google, Apple)
3. ⏳ G4 - RevenueCat (sandbox purchase)
4. ✅ UI - HomeScreen premium design

### 4. Reportar Resultados

**Template de report:**

```markdown
## TestFlight Validation - Build #52

**Device:** iPhone [modelo], iOS [versão]
**Tester:** [nome]
**Data:** 2026-02-01

### Crash Fix ✅/❌

- [ ] App abre sem crash
- [ ] Splash screen animado exibido
- [ ] Transição suave para HomeScreen

### G2 - Auth ✅/❌

- [ ] Email login OK
- [ ] Google login OK
- [ ] Apple login OK

### G4 - RevenueCat ✅/❌

- [ ] Paywall exibido
- [ ] Purchase sandbox OK
- [ ] Premium unlocked

### UI - HomeScreen ✅/❌

- [ ] Header premium OK
- [ ] Animações smooth
- [ ] Colors corretos
- [ ] Componentes renderizados

### Screenshots

[anexar screenshots]

### Issues encontrados

[descrever bugs]
```

---

## 📊 Métricas de Sucesso

| Métrica                 | Alvo  | Status |
| ----------------------- | ----- | ------ |
| **Crash-free rate**     | > 99% | ⏳ TBD |
| **Auth success rate**   | > 95% | ⏳ TBD |
| **Purchase completion** | > 80% | ⏳ TBD |
| **App Store rating**    | > 4.5 | ⏳ TBD |
| **Load time**           | < 3s  | ⏳ TBD |

---

## 🔗 Links Úteis

| Recurso                  | URL                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| **App Store Connect**    | https://appstoreconnect.apple.com/apps/6756980888/testflight/ios                                        |
| **EAS Build Dashboard**  | https://expo.dev/accounts/liongab/projects/nossamaternidade/builds/34a32ce9-7b8d-416d-9db2-28b9e431da4e |
| **RevenueCat Dashboard** | https://app.revenuecat.com                                                                              |
| **Supabase Dashboard**   | https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi                                             |
| **Sentry (Errors)**      | https://sentry.io/organizations/nossa-maternidade                                                       |

---

## 📝 Comandos Úteis

```bash
# Verificar último build
eas build:list --platform ios --limit 1

# Verificar submission
eas submit:list --platform ios --limit 1

# Quality gate
npm run quality-gate

# Gerar novo build (se necessário)
npm run build:prod:ios

# Submit para TestFlight
npm run submit:prod:ios
```

---

## ✅ Checklist Final

### Antes de TestFlight

- [x] Quality gate 100% PASS
- [x] Build #52 finished
- [x] HomeScreen redesign commitado
- [x] Documentation atualizada
- [x] Git push completo

### No TestFlight

- [ ] Build processado pela Apple
- [ ] Distribuído para testadores internos
- [ ] Crash fix validado
- [ ] G2 (Auth) testado e aprovado
- [ ] G4 (RevenueCat) testado e aprovado
- [ ] Screenshots coletados

### Após Validação

- [ ] Report de testes documentado
- [ ] Issues priorizados (se houver)
- [ ] GATES.md atualizado
- [ ] Decisão: External Testing ou Fix issues

---

**Status:** ⏳ Aguardando processamento Apple + testes manuais
**Next Action:** Verificar App Store Connect em 10 minutos
**Owner:** gabrielvesz_@hotmail.com

---

_Última atualização: 2026-02-01 - Build #52 (1.0.1)_
