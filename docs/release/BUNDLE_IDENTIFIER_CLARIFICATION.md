# Bundle Identifier Clarification

## Current Configuration

**iOS Bundle Identifier**: `br.com.nossamaternidade.app`

**Configured in**: `app.config.js` line 28

```javascript
ios: {
  bundleIdentifier: "br.com.nossamaternidade.app",
  buildNumber: "48",
}
```

## Historical Context

Some older documentation references `com.nossamaternidade.app`, but the actual configured and in-use bundle identifier is `br.com.nossamaternidade.app`.

## Why the "br.com" prefix?

Brazilian apps often use the `.br.com` reverse domain notation to indicate:

- **br**: Brazil (country code)
- **com**: Commercial
- **nossamaternidade**: App/company name

This follows the convention: `[country].[tld].[domain].[app]`

## Apple App Store Connect

The app registered in App Store Connect should use:

- **Bundle ID**: `br.com.nossamaternidade.app`
- **App Store ID**: `6756980888`
- **Team ID**: `KZPW4S77UH`

## ⚠️ CRITICAL: Do NOT Change

**DO NOT** change the bundle identifier unless you want to:

1. Create a completely new app in App Store Connect
2. Lose all existing builds, TestFlight history, and reviews
3. Require users to uninstall and reinstall the app

The bundle identifier is the permanent unique identifier for your app in the Apple ecosystem.

## Documentation Updates Needed

The following files should be updated to use `br.com.nossamaternidade.app` consistently:

- [ ] `docs/release/CHECKLIST_POS_APROVACAO_APPLE.md` - Line 38, 90
- [ ] `docs/release/DEPLOYMENT_CHECKLIST.md` - Line 80
- [ ] `docs/api/REVENUECAT_SETUP.md` - Bundle ID references

However, for **Android** the package name is different:

- **Android Package**: `com.liongab.nossamaternidade` (configured in app.config.js)

## Summary

✅ **Correct Bundle Identifier**: `br.com.nossamaternidade.app`  
✅ **Used in**: app.config.js, eas.json, Apple Developer account  
✅ **App Store Connect ID**: 6756980888  
❌ **Incorrect**: `com.nossamaternidade.app` (old documentation)

**No action needed** - current configuration is correct and working.

---

**Last Updated**: 2026-02-01
