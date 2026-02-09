# ROLLBACK PROCEDURES - TestFlight Fix + Anti-Hang (v1.0.0)

## Emergency Kill Switches

```bash
# Disable IAP completely (all users → free tier)
EXPO_PUBLIC_DISABLE_IAP=true npm run build:prod:ios

# Adjust timeout (default 5000ms)
EXPO_PUBLIC_IAP_TIMEOUT_MS=10000 npm run build:prod:ios

# Rebuild and resubmit
npm run build:prod:ios && npm run submit:prod:ios
```

## Files Modified (Complete Rollback)

### Phase 0-1: Safety & Anti-Hang

- `src/utils/withTimeout.ts` (NEW - DELETE if needed)
- `src/utils/bootLogger.ts` (NEW - DELETE if needed)
- `src/services/revenuecat.ts` (MODIFIED - Restore: git checkout src/services/revenuecat.ts)
- `App.tsx` (MODIFIED - Restore: git checkout App.tsx)

### Phase 2: Navigation Fix

- `src/navigation/NathIAStackNavigator.tsx` (MODIFIED)

### Phase 3: Reanimated Conflicts

- 7 components with wrapper pattern (MODIFIED - all reversible)

### Phase 4: Design Cleanup

- `src/screens/HomeScreen.tsx` (MODIFIED - hardcoded colors → Tokens)

## Rollback Steps (Fastest)

```bash
# 1. Full revert to last stable commit
git log --oneline | head -5
git revert <commit-before-testflight-fix>

# 2. Or selective rollback per file
git checkout src/services/revenuecat.ts
git checkout App.tsx
git checkout src/navigation/NathIAStackNavigator.tsx

# 3. Rebuild and test locally
npm start:clear

# 4. If needed, submit emergency build
npm run build:prod:ios:win
npm run submit:prod:ios
```

## Monitoring Boot Sequence

```typescript
// Check boot sequence logs
import { bootLogger } from "@/utils/bootLogger";

console.log(bootLogger.exportForCrashReport());
// Output:
// [1704067200000] app_start
// [1704067200100] fonts_loaded +100ms
// [1704067200200] revenuecat_configure_start +100ms
// [1704067200500] revenuecat_configure_timeout (no exception, continue)
// ...
```

## Critical Metrics

| Metric             | Target  | Rollback If              |
| ------------------ | ------- | ------------------------ |
| Cold Start         | < 5s    | > 8s                     |
| RevenueCat Timeout | 5s      | Hangs                    |
| Console Warnings   | 0       | > 0 duplicate/reanimated |
| Build Size         | < 100MB | > 120MB                  |

## Production Monitoring

### Sentry Alerts

- `revenuecat_configure_timeout` → IAP unavailable
- `premium_status_check_timeout` → Cache fallback active
- `boot_time_slow` → > 5s cold start

### Crash Patterns to Watch

- App hang on splash (boot > 10s)
- RevenueCat initialization error
- Transform animation warnings in logs

## Post-Rollback Validation

```bash
npm run quality-gate          # Must PASS
npm run test                  # Must PASS
npm start && check console    # Must be CLEAN
```

---

**Last Updated:** January 20, 2026
**Version:** 1.0.0
**Release:** TestFlight Fix + Anti-Hang
