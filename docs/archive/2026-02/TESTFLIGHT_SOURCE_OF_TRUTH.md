# TestFlight Source of Truth (Expo/EAS)

This repository ships iOS builds to TestFlight using Expo + EAS.

## Canonical Pipeline

- Build profiles: `eas.json`
- Runtime app config: `app.config.js`
- CI workflow: `.github/workflows/ios-testflight.yml`
- Local/CLI command:

```bash
eas build -p ios --profile ios_testflight --auto-submit
```

## Scope Decision

- Swift scaffolding files generated outside the Expo flow were archived to:
  `archive/swift-scaffold-2026-02-10/`
- They are not part of the active production pipeline.
- Do not use ad-hoc `xcodebuild` scripts from archived scaffolding for release.

## Release Rule

- For production/TestFlight, always use EAS profiles and EAS submit.
- Keep `version`/`ios.buildNumber` aligned in `app.config.js` before release.
- For Xcode 26.3 agentic coding guidance, see `docs/xcode-26.3-agentic-coding.md`.
