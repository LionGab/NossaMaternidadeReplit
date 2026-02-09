---
name: build-testflight
description: Execute G6 + G7 - Production build and TestFlight submit
category: Release
---

# Build & Submit to TestFlight

Executes G6 (production build) and G7 (TestFlight configuration).

## Pre-requisites (CRITICAL)

**All G2-G5 must PASS before proceeding:**

- ✅ G2 (Auth) PASS
- ✅ G3 (RLS) PASS
- ✅ G4 (RevenueCat) PASS
- ✅ G5 (NathIA + Caching) PASS

**If any gate is PENDING or FAILED, STOP and fix before building.**

## G6: Production Build

### Step 1: Final Quality Gate

```bash
npm run quality-gate
# or (Windows)
npm run quality-gate:win
```

**Expected:**

- ✅ 0 TypeScript errors
- ✅ 0 ESLint errors
- ✅ 0 console.log statements
- ✅ Build ready: ALL PASS

**If fails:** Fix errors before proceeding.

### Step 2: Execute Production Build

```bash
npm run build:prod:ios
```

**What happens:**

1. Auto-increment build number (current → current + 1)
2. Compile on EAS servers (20-40 minutes)
3. Generate signed .ipa
4. Auto-upload to App Store Connect

**Monitor:** https://expo.dev/accounts/nossa-maternidade/projects/nossamaternidade

### Step 3: Wait for Apple Processing

1. Build status on EAS: "Building..." → "Finished" (30 min)
2. Apple processing: "Processing" → "Ready to Submit" (5-10 min)

**Total wait time:** ~35-50 minutes

**During wait:** Take a break, grab coffee ☕

### Step 4: Verify Build in App Store Connect

1. Open: https://appstoreconnect.apple.com/apps/6756980688
2. Navigate: TestFlight tab
3. Verify: Build appears with status "Ready to Submit"
4. Note build number (e.g., build 4)

## G7: TestFlight Configuration

### Step 1: Fill Test Information

In App Store Connect → TestFlight → Select Build → Test Information:

**What to Test:**

```
# Nossa Maternidade - Beta Interno

Testando funcionalidades principais:
- Autenticação (Email, Google, Apple)
- NathIA (assistente IA de saúde materna)
- Ciclo (rastreador menstrual)
- Comunidade (feed social)
- Meus Cuidados (conteúdo educativo)
- Premium/IAP (compras in-app)

Foco especial:
- Estabilidade do chat com NathIA
- Fluxo de onboarding (9 telas)
- Compras e restore purchases
- Navegação entre tabs
```

**Description:**

```
Nossa Maternidade é um aplicativo de apoio à saúde materna para
gestantes e mães no Brasil. Combina rastreamento de ciclo,
comunidade social, conteúdo educativo e assistente IA especializado.
```

**Feedback Email:** [insert your email]

**Privacy Policy URL:** (optional)

**Click:** Save

### Step 2: Add Internal Testers

1. TestFlight → Internal Testing → Create group "Team"
2. Add testers:
   - Your email + name
   - Team members (if any)
3. Select the build (just uploaded)
4. Click "Start Testing"

### Step 3: Receive & Install via TestFlight

1. Check email for "TestFlight invitation" from Apple
2. Click "View in TestFlight" link
3. Install TestFlight app (if not installed)
4. Install Nossa Maternidade beta

### Step 4: Smoke Test

On device (TestFlight install):

- [ ] App launches without crash
- [ ] Login works (test Email or Google)
- [ ] Navigate all 5 tabs (Home, Ciclo, NathIA, Comunidade, Meus Cuidados)
- [ ] Send 1 message to NathIA → receives response
- [ ] No crashes in first 10 interactions

**If crash occurs:** Check TestFlight → Crashes tab for logs

## Success Criteria

**G6:**

- ✅ Build completes without errors on EAS
- ✅ .ipa uploaded to App Store Connect
- ✅ Build status "Ready to Submit"

**G7:**

- ✅ Test Information filled
- ✅ At least 1 internal tester added
- ✅ App installed via TestFlight
- ✅ Smoke test passes

## Update Scoreboard

After validation, update `docs/release/GATES.md`:

```markdown
| G6 | ✅ PASS | 2026-01-XX | 30min | Auto | Build 4, uploaded successfully |
| G7 | ✅ PASS | 2026-01-XX | 15min | [Your Name] | TestFlight active, 1 tester |
```

## 🎉 Congratulations!

**TestFlight is now ACTIVE!**

Next steps:

1. Test thoroughly on TestFlight build
2. Collect feedback from internal testers
3. Fix critical bugs (if any)
4. Iterate: Make fixes → new build → repeat

## External Beta (Optional)

To add more testers:

**Beta Fechado (50-100 testers):**

- TestFlight → External Testing → Create group
- Add emails manually
- Requires Apple Review (~24-48h for first build)

**Beta Público (up to 10,000):**

- TestFlight → Enable "Public Link"
- Share link via social media, email, etc.
- Requires Apple Review

## Monitoring

**Crashes:**

- App Store Connect → TestFlight → Crashes

**Feedback:**

- App Store Connect → TestFlight → Feedback

**Metrics:**

- Install rate (% of invites → installs)
- Active testers (opened in last 24h)
- Sessions per tester

---

**Timeline:** G6 (30 min build + 10 min processing) + G7 (15 min config) = ~55 min active work + 40 min wait time

**Total:** ~1.5h from start to TestFlight active
