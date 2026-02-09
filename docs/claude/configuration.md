# Configuration Reference

> Nossa Maternidade — Configurações detalhadas

---

## EAS Build Profiles

### Profile Overview

| Profile                 | Distribution | Platform    | Purpose             |
| ----------------------- | ------------ | ----------- | ------------------- |
| `development`           | internal     | iOS/Android | Dev client          |
| `development-simulator` | internal     | iOS         | Simulator builds    |
| `preview`               | store        | iOS/Android | TestFlight/Internal |
| `ios_preview`           | internal     | iOS         | Internal testing    |
| `ios_testflight`        | store        | iOS         | TestFlight release  |
| `android_internal`      | internal     | Android     | Internal APK        |
| `staging`               | internal     | iOS/Android | Staging env         |
| `production`            | store        | iOS/Android | Production release  |

### Development

```json
{
  "development": {
    "extends": "base",
    "developmentClient": true,
    "distribution": "internal",
    "ios": {
      "simulator": false,
      "resourceClass": "m-medium",
      "image": "latest"
    },
    "android": {
      "buildType": "apk",
      "gradleCommand": ":app:assembleDebug"
    },
    "env": {
      "EXPO_PUBLIC_ENV": "development",
      "CI": "true",
      "EXPO_PUBLIC_ENABLE_AI_FEATURES": "true",
      "EXPO_PUBLIC_ENABLE_GAMIFICATION": "true",
      "EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED": "true",
      "SENTRY_DISABLE_AUTO_UPLOAD": "true"
    }
  }
}
```

### Production

```json
{
  "production": {
    "extends": "base",
    "autoIncrement": true,
    "ios": {
      "resourceClass": "m-medium",
      "credentialsSource": "remote",
      "image": "latest",
      "buildConfiguration": "Release"
    },
    "android": {
      "buildType": "app-bundle",
      "gradleCommand": ":app:bundleRelease"
    },
    "env": {
      "EXPO_PUBLIC_ENV": "production",
      "CI": "true",
      "EXPO_PUBLIC_ENABLE_AI_FEATURES": "true",
      "EXPO_PUBLIC_ENABLE_GAMIFICATION": "true",
      "EXPO_PUBLIC_ENABLE_ANALYTICS": "true",
      "EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED": "true"
    }
  }
}
```

### Submit Configuration

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "gabrielvesz_@hotmail.com",
        "ascAppId": "6756980888",
        "appleTeamId": "KZPW4S77UH"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal",
        "releaseStatus": "draft"
      }
    }
  }
}
```

---

## TypeScript Configuration

```json
{
  "extends": "expo/tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/screens/*": ["./src/screens/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/api/*": ["./src/api/*"],
      "@/state/*": ["./src/state/*"],
      "@/types/*": ["./src/types/*"],
      "@/theme/*": ["./src/theme/*"],
      "@/navigation/*": ["./src/navigation/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"],
  "exclude": [
    "node_modules",
    "backend/node_modules",
    ".expo",
    "supabase/functions/**/*",
    "dist",
    "build",
    "**/__tests__/**",
    "archive/**/*"
  ]
}
```

---

## NPM Scripts Reference

### Quality & Validation

```bash
# Quality gate (OBRIGATÓRIO)
npm run quality-gate          # Unix/Git Bash
npm run quality-gate:win      # Windows PowerShell

# Individual checks
npm run typecheck             # TypeScript only
npm run lint                  # ESLint check
npm run lint:fix              # ESLint auto-fix
npm run format                # Prettier format
npm run format:check          # Prettier check

# Validation
npm run validate              # typecheck + lint
npm run validate:full         # format + typecheck + lint
npm run diagnose:production   # Full environment check
```

### Development

```bash
# Start dev server
npm start                     # Basic start
npm start:clear               # Clear cache + start
npm run start:optimized       # Optimized (no dev, minify)

# Platform specific
npm run ios                   # iOS simulator (Mac)
npm run android               # Android emulator
npm run web                   # Web browser

# Dev client
npm run dev:android           # Start + run Android
```

### Testing

```bash
# Run tests
npm test                      # All tests
npm run test:watch            # Watch mode
npm run test:coverage         # With coverage
npm run test:ci               # CI mode

# Specific tests
npm run test:oauth            # OAuth providers
npm run test:gemini           # Gemini API key
npm run test:ai:consent       # AI consent flow
```

### EAS Builds

```bash
# Development builds
npm run build:dev:ios         # iOS dev client
npm run build:dev:android     # Android dev APK

# Preview builds
npm run build:preview:ios     # iOS preview
npm run build:preview:android # Android preview

# Production builds (includes quality-gate)
npm run build:prod:ios        # iOS production
npm run build:prod:android    # Android production
npm run build:prod:ios:win    # Windows variant
npm run build:prod:android:win

# Local builds
npm run build:local:ios       # Local iOS build
npm run build:local:android   # Local Android build

# Submit to stores
npm run submit:prod:ios       # App Store Connect
npm run submit:prod:android   # Google Play

# Release (build + submit)
npm run release:prod:ios      # Build + submit iOS
npm run release:prod:android  # Build + submit Android
```

### Supabase

```bash
# Types
npm run generate-types        # Regenerate TS types

# Functions
npm run deploy-functions      # Deploy all edge functions
npm run test:edge-functions   # Test edge functions

# Backend
npm run verify-backend        # Verify RLS and setup
```

### Environment & Secrets

```bash
# Environment
npm run check-env             # Validate .env
npm run validate-env          # Check required vars

# Secrets
npm run setup-all-secrets     # Setup all secrets
npm run validate-secrets      # Validate EAS secrets
npm run generate-webhook-secret # Generate webhook secret
```

### Utilities

```bash
# Clean
npm run clean                 # Clean metro/expo cache
npm run clean:all             # Clean + reinstall
npm run clean:ios             # Clean iOS artifacts
npm run reset:full            # Full reset

# nm-cli
npm run nm:dev                # Start development
npm run nm:fix                # Auto-fix issues
npm run nm:doctor             # Health check
npm run nm:status             # Project status
npm run nm:clean              # Clean caches
npm run nm:ship               # Prepare for shipping

# Design
npm run audit:a11y            # Accessibility audit
npm run design:check          # Design system check
npm run design:audit          # Full design audit
```

---

## Environment Variables

### Public Variables (Client)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://lqahkqfpynypbmhtffyi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1

# Environment
EXPO_PUBLIC_ENV=development|staging|production

# Features
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED=true

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
```

### Private Variables (EAS Secrets / Edge Functions)

```bash
# Supabase
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI
GEMINI_API_KEY=...
OPENAI_API_KEY=...

# Services
ELEVENLABS_API_KEY=...
SENTRY_AUTH_TOKEN=...
REVENUECAT_WEBHOOK_SECRET=...
```

### How to Set

```bash
# EAS Secrets (for builds)
eas secret:create --scope project --name VARIABLE_NAME --value "value"

# Supabase Secrets (for edge functions)
npx supabase secrets set VARIABLE_NAME=value

# Local (.env)
echo "EXPO_PUBLIC_VAR=value" >> .env
```

---

## Feature Flags

### Available Flags

| Flag                               | Default | Purpose            |
| ---------------------------------- | ------- | ------------------ |
| `EXPO_PUBLIC_ENABLE_AI_FEATURES`   | true    | NathIA chat        |
| `EXPO_PUBLIC_ENABLE_GAMIFICATION`  | true    | Habits, streaks    |
| `EXPO_PUBLIC_ENABLE_ANALYTICS`     | false   | Event tracking     |
| `EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED` | true    | Google/Apple login |

### Dev Bypass Flags

```typescript
// src/config/devBypass.ts

// Skip onboarding (dev only)
export const DEV_SKIP_ONBOARDING = __DEV__ && false;

// Skip auth (dev only)
export const DEV_SKIP_AUTH = __DEV__ && false;

// Mock premium (dev only)
export const DEV_MOCK_PREMIUM = __DEV__ && false;

// Enable debug logging
export const DEV_DEBUG_LOGGING = __DEV__ && true;
```

### Usage

```typescript
import { DEV_SKIP_ONBOARDING, DEV_MOCK_PREMIUM } from "@/config/devBypass";

// In navigation
if (DEV_SKIP_ONBOARDING) {
  return <MainTabs />;
}

// In premium check
if (DEV_MOCK_PREMIUM) {
  return true; // Always premium in dev
}
```

---

## Expo Configuration

### app.config.js

```javascript
export default ({ config }) => ({
  ...config,
  name: "Nossa Maternidade",
  slug: "nossa-maternidade",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#5B8FB9",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "app.nossamaternidade.app",
    buildNumber: "1",
    infoPlist: {
      NSCameraUsageDescription: "Para tirar fotos para seus posts",
      NSPhotoLibraryUsageDescription: "Para selecionar fotos para seus posts",
      NSMicrophoneUsageDescription: "Para gravar áudio para a NathIA",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#5B8FB9",
    },
    package: "com.nossamaternidade.app",
    versionCode: 1,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-secure-store",
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "13.4",
        },
        android: {
          minSdkVersion: 23,
          targetSdkVersion: 35,
        },
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        organization: "nossa-maternidade",
        project: "react-native",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "your-eas-project-id",
    },
  },
  updates: {
    url: "https://u.expo.dev/your-project-id",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
});
```

---

## Dependencies Overview

### Core Dependencies

```json
{
  "expo": "~54.0.31",
  "react": "19.1.0",
  "react-native": "^0.81.5",
  "typescript": "~5.9.2"
}
```

### Navigation

```json
{
  "@react-navigation/native": "^7.1.6",
  "@react-navigation/native-stack": "^7.3.2",
  "@react-navigation/bottom-tabs": "^7.3.10"
}
```

### UI/Styling

```json
{
  "nativewind": "^4.1.23",
  "tailwindcss": "^3.4.17",
  "@expo/vector-icons": "^15.0.3",
  "react-native-reanimated": "~4.1.1",
  "react-native-gesture-handler": "~2.28.0"
}
```

### State/Data

```json
{
  "zustand": "^5.0.4",
  "@react-native-async-storage/async-storage": "2.2.0",
  "@supabase/supabase-js": "^2.87.0"
}
```

### Premium

```json
{
  "react-native-purchases": "^9.6.10",
  "react-native-purchases-ui": "^9.6.10"
}
```

### Lists

```json
{
  "@shopify/flash-list": "2.0.2"
}
```

### Dev Tools

```json
{
  "jest": "^29.7.0",
  "jest-expo": "^54.0.16",
  "eslint": "^9.25.0",
  "prettier": "^3.4.2"
}
```
