# Security Policy - Nossa Maternidade

**Last Updated:** December 23, 2025
**Version:** 1.0.0

---

## Critical Security Principles

### 1. API Keys Management

**NEVER expose AI provider API keys in client-side code.**

#### ✅ CORRECT Architecture (Implemented)

```
User (Mobile App)
    ↓ JWT Auth
Edge Function /ai (Supabase)
    ↓ API Keys (Server Secrets)
AI Providers (Gemini, OpenAI, Claude, Grok)
```

**API keys live ONLY in:**

- Supabase Edge Functions secrets (configured via Dashboard or CLI)
- NEVER in client bundle (`app.config.js`, `.env.local`, etc.)

**Configuration:**

```bash
# Via Supabase CLI
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set ANTHROPIC_API_KEY=your_key

# Via Supabase Dashboard
Project Settings → Edge Functions → Secrets
```

#### ❌ WRONG (Security Breach)

```javascript
// app.config.js - NEVER DO THIS
extra: {
  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY, // ❌ EXPOSED IN BUNDLE
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY, // ❌ EXPOSED IN BUNDLE
}
```

**Why this is critical:**

- `EXPO_PUBLIC_*` variables are bundled in the app
- Anyone can extract keys using `strings app.aab` or JS bundle inspection
- Extracted keys = unlimited API usage charged to your account
- Keys can be revoked by providers, breaking production app

---

### 2. Environment Variables Rules

| Prefix          | Location      | Security   | Use Case                                   |
| --------------- | ------------- | ---------- | ------------------------------------------ |
| `EXPO_PUBLIC_*` | Client bundle | ⚠️ Public  | Non-sensitive config (URLs, feature flags) |
| `NO PREFIX`     | Server only   | 🔒 Private | API keys, secrets, database credentials    |

**Safe for `EXPO_PUBLIC_*`:**

- ✅ Supabase URL (public by design)
- ✅ Supabase Anon Key (protected by RLS)
- ✅ Feature flags (boolean)
- ✅ Legal pages URLs
- ✅ RevenueCat public keys (iOS/Android)
- ✅ Sentry DSN (public by design)

**NEVER use `EXPO_PUBLIC_*` for:**

- ❌ AI API Keys (Gemini, OpenAI, Claude, Grok)
- ❌ Stripe Secret Key (only publishable key)
- ❌ Supabase Service Role Key
- ❌ Database passwords
- ❌ OAuth secrets
- ❌ Any secret that costs money if leaked

---

### 3. Configuration File Security

#### `app.config.js`

- ✅ Can reference `EXPO_PUBLIC_*` vars (bundled in app)
- ❌ NEVER hardcode secrets
- ✅ Use `process.env.EXPO_PUBLIC_*` for public config

#### `.env.local`

- 🔒 MUST be in `.gitignore` (already configured)
- Local development only
- NEVER commit to repository

#### `.env.example`

- ✅ Safe to commit (placeholders only)
- Documentation for required variables
- NO real values

---

### 4. EAS Build & Secrets

**For production builds:**

```bash
# Set secrets via EAS CLI (encrypted, never in code)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..."

# List all secrets
eas secret:list

# Delete secret
eas secret:delete --name SECRET_NAME
```

**Build profiles** (`eas.json`):

- `development` - Local testing, minimal secrets
- `preview` - Internal testing, staging secrets
- `production` - Live app, production secrets

---

### 5. Recent Security Fixes (Dec 23, 2025)

#### Fixed: API Keys Exposure Vulnerability

**Problem:**

```javascript
// app.config.js (BEFORE - VULNERABLE)
geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
grokApiKey: process.env.EXPO_PUBLIC_GROK_API_KEY,
```

**Solution:**

1. ✅ Removed all AI API keys from `app.config.js`
2. ✅ Updated `.env.example` with correct instructions
3. ✅ Added security comments in code
4. ✅ Verified Edge Function `/ai` handles keys server-side

**Impact:**

- 🔒 Keys now secure in Supabase secrets
- ✅ Client calls Edge Function `/ai` with JWT
- ✅ Edge Function uses server-side keys to call AI providers
- ✅ Zero exposure risk

#### Fixed: EAS Project ID Conflict

**Problem:**

- `app.json`: `ceee9479-e404-47b8-bc37-4f913c18f270`
- `app.config.js`: `d22475be-2b7c-41a1-90e5-bfe531524f41` ❌

**Solution:**

- ✅ Unified to `ceee9479-e404-47b8-bc37-4f913c18f270` across all files

**Files affected:**

- `app.config.js` (corrected)
- `app.json` (already correct)
- `DEPLOY_STORES.md` (reference)
- `src/services/notifications.ts` (fallback)

---

### 6. Security Checklist Before Build

Before running `eas build`:

- [ ] Run `git status` - ensure no uncommitted secrets
- [ ] Check `app.config.js` - NO hardcoded keys
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Confirm Supabase secrets are set (via Dashboard or CLI)
- [ ] Review `eas.json` - correct profile selected
- [ ] Test Edge Function `/ai` with real keys (staging first)
- [ ] Verify JWT authentication works
- [ ] Run quality gate: `npm run quality-gate`

---

### 7. AI Provider Routing (Edge Function /ai)

**Provider Priority:**

1. **Gemini 2.5 Flash** (primary) - Fast, cost-effective
2. **Claude 3.5 Sonnet** (specialized) - Vision, crisis detection
3. **GPT-4o** (fallback) - High quality

**Rate Limiting:**

- Upstash Redis (20 req/min per user)
- Configured in Edge Function
- Future: differentiate FREE vs PRO users

**Guardian Agent:**

- Crisis detection (keywords: suicide, self-harm, baby harm)
- Blocked phrases (medical diagnosis, prescriptions)
- Logs security events to `audit_logs` table

---

### 8. LGPD Compliance

**Data Subject Rights:**

- ✅ Export data: Edge Function `/export-data`
- ✅ Delete account: Edge Function `/delete-account`
- ✅ Audit logs: Table `audit_logs` (RLS enabled)

**Sensitive Data:**

- Health data (cycle tracking, mood, symptoms)
- AI chat history
- Daily check-ins
- Requires explicit consent in onboarding

**Retention:**

- Active account: indefinite (user controls data)
- Deleted account: 30 days (then purged)
- Audit logs: 1 year

---

### 9. Vulnerability Reporting

**DO NOT create public GitHub issues for security vulnerabilities.**

**Contact:**

- Email: `privacidade@nossamaternidade.com.br`
- Subject: "SECURITY: [Brief description]"

**Include:**

1. Description of vulnerability
2. Steps to reproduce
3. Impact assessment
4. Suggested fix (optional)

**Response SLA:**

- Critical: 24 hours
- High: 72 hours
- Medium: 1 week

---

### 10. Security Audit Log

| Date       | Issue                                | Severity    | Status   |
| ---------- | ------------------------------------ | ----------- | -------- |
| 2025-12-23 | API keys exposed via `EXPO_PUBLIC_*` | 🔴 Critical | ✅ Fixed |
| 2025-12-23 | EAS Project ID mismatch              | 🟡 Medium   | ✅ Fixed |

---

## Security Best Practices

1. **Principle of Least Privilege**: Only expose what's absolutely necessary
2. **Defense in Depth**: Multiple layers (JWT + RLS + Edge Function + rate limiting)
3. **Secrets Rotation**: Rotate API keys every 90 days (calendar reminder)
4. **Monitoring**: Track Edge Function errors + rate limit hits (Sentry)
5. **Incident Response**: Have rollback plan (EAS updates can revert)

---

## References

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Secrets](https://docs.expo.dev/build-reference/variables/)
- [Supabase Edge Functions Secrets](https://supabase.com/docs/guides/functions/secrets)
- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)

---

**For questions:** Contact Tech Lead or Security Team

**Document Owner:** Lion (eugabrielmktd@gmail.com)
