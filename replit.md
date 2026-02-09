# Nossa Maternidade

## Overview
Nossa Maternidade is a React Native/Expo mobile application designed for maternity support. It uses Expo SDK 54 with React Native 0.81 and supports iOS, Android, and Web platforms.

## Project Status
- **Environment**: Configured and running in Replit
- **Tests**: 422/422 passing
- **TypeScript**: 0 errors
- **ESLint**: 0 errors (5 minor warnings)
- **Supabase**: Connected and initialized

## App Information
- **Bundle ID**: br.com.nossamaternidade.app
- **SKU**: nossamaternidade001
- **Apple ID**: 6756980888
- **Team**: Gabriel Vesz (Individual) - KZPW4S77UH

## Project Structure
- `App.tsx` - Main application entry point
- `src/` - Source code directory
  - `screens/` - App screens
    - `home/` - HomeScreen (consolidated), _archive/ for legacy versions
    - `community/` - CommunityScreen (consolidated)
    - `profile/` - ProfileScreen, _archive/ for unused redesign
    - `onboarding/` - Feature-flagged screens (Nathia + original versions)
  - `navigation/` - Navigation configuration
  - `components/` - Reusable components
    - `home/` - Home screen components (PremiumHeader, SectionHeader, etc.)
    - `ui/` - UI components using shadowPresets for cross-platform shadows
  - `api/` - API integration (auth, supabase, moderation)
  - `config/` - Configuration files (env.ts, reactotron.ts)
  - `stores/` - State management (Zustand)
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions (shadow.ts, profanity-filter.ts)
  - `services/` - Business logic services (community.ts with moderation)
- `assets/` - Static assets (images, icons)
- `supabase/` - Supabase edge functions and configuration

## Technology Stack
- **Framework**: Expo SDK 54, React Native 0.81
- **Language**: TypeScript
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: Zustand, TanStack Query
- **Backend**: Supabase (authentication, database, edge functions)
- **Navigation**: React Navigation v7
- **Payments**: RevenueCat
- **Validation**: Zod 4.3.6

## Development

### Running the App
The app runs on port 5000 with:
```bash
npx expo start --web --port 5000 --host lan --clear
```

### Available Scripts
- `npm test` - Run all tests
- `npm run lint` - Run linter
- `npm run typecheck` - Run TypeScript check
- `npm run format` - Format code with Prettier

### Environment Variables Required
Set these as Replit Secrets:
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL` - Supabase functions URL

Optional:
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` - RevenueCat iOS API key
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` - RevenueCat Android API key
- `EXPO_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- `EXPO_PUBLIC_ENABLE_AI_FEATURES` - Enable AI features (true/false)
- `EXPO_PUBLIC_ENABLE_GAMIFICATION` - Enable gamification (true/false)

### Key Dependencies
- expo: ~54.0.33
- react: 19.1.0
- react-native: ^0.81.5
- nativewind: ^4.1.23
- @supabase/supabase-js: 2.93.3
- zustand: ^5.0.4
- zod: ^4.3.6

## Recent Changes
- **2026-02-03**: Quality Gate Achieved (ESLint 0 Errors)
  - Fixed 46 ESLint errors → 0 errors (5 minor warnings remain)
  - Replaced hardcoded colors with design tokens in App.tsx, HeartMoodSlider.tsx, CloseFriendsSection.tsx
  - Fixed 'any' types in community.ts and highlights.ts with proper TypeScript types
  - Design system: All colors now use tokens from src/theme/tokens.ts
  - TypeScript: 0 errors, ESLint: 0 errors

- **2026-02-03**: Fixed NathIA AI Edge Function Endpoint
  - Issue: Client was calling `/ai` endpoint but Supabase has `nathia-chat` deployed
  - Fixed ai-service.ts and useStreaming.ts to use correct endpoint `/nathia-chat`
  - Restored privacy store default state (unknown consent + not enabled)
  - All 422 tests passing, TypeScript clean
  
- **2026-02-03**: Legal Compliance Complete (Privacy Policy & Terms)
  - Created PrivacyPolicyScreen with LGPD-compliant content (10 sections)
  - Created TermsOfServiceScreen with complete legal coverage (13 sections)
  - Added screens to RootNavigator with lazy loading
  - Fixed TypeScript errors in comments.ts and community.ts (type assertions)
  - All 422 tests passing, TypeScript clean

- **2026-02-03**: Database Schema Complete for AI Moderation
  - Created `community_posts` table (was missing!) for community content
  - Added AI moderation columns to `moderation_queue`: post_id, quality_score, flagged_terms, categories
  - Added foreign key constraints linking moderation_queue → community_posts
  - Added RLS policies for community_posts (users see approved posts + own posts)
  - Full moderation pipeline now functional end-to-end
  - All 422 tests passing, TypeScript clean
  
- **2026-02-03**: Database Table Alignment Fix (Likes & Comments)
  - Fixed togglePostLike: changed `post_likes` → `community_likes` table
  - Fixed fetchComments/createComment: changed `author_id` → `user_id` column
  - Fixed profile name field: `profiles.name` → `profiles.full_name`
  - Removed non-existent columns: `is_deleted`, `parent_id` from queries
  - Fixed comment likes: `comment_likes` → `community_likes` table
  - All 422 tests passing, TypeScript clean
  
- **2026-02-03**: AI-Powered Content Moderation System (Complete)
  - Created profanity filter with Portuguese Brazilian support (profanity-filter.ts)
  - Implemented quality scoring algorithm (0-100) for ranking posts
  - Built ModerationScreen with premium design for team review
  - Added moderation API with auto-block, queue-for-review, auto-approve logic
  - Spam detection: links, phone numbers, monetary values, excessive caps
  - Navigation: Added Moderation route accessible from Admin Dashboard
  - Full integration: post creation → moderation analysis → queue/publish
  - Approve/reject updates both queue AND community_posts.status
  - Queue items include postId, qualityScore, flaggedTerms, categories
  - All 422 tests passing, TypeScript clean
  
- **2026-02-03**: Premium Design Polish (HabitosScreen + WeeklyHighlights)
  - Fixed Math.random() in weekly overview - now uses real habit data from store
  - Added AbortController for safe unmount in WeeklyHighlights fetch
  - Added accessibility labels to interactive elements
  - Weekly progress derived from completedDates (deterministic)
  - All 422 tests passing, TypeScript clean
  
- **2026-02-03**: Tab Naming and Avatar Update
  - Renamed tabs: Comunidade→MãesValente, Mundo→Mundo Nath, Hábitos→Meus Cuidados
  - Updated all screen titles and quick actions to match new naming
  - Added new Nath avatar illustration to profile header
  - All 422 tests passing, TypeScript clean
  
- **2026-02-03**: Navigation and Test Fixes
  - Fixed Close Friends navigation to use getParent() for root stack routes
  - Fixed OnboardingSummaryNathia test to use waitFor for async navigation
  - All 422 tests passing, TypeScript clean
  
- **2026-02-03**: Premium Close Friends Feature
  - Created CloseFriendsSection component with premium UI (gradients, animations)
  - Added useCloseFriends hook to check premium subscription status
  - Integrated Close Friends section in MundoScreenNathia (Mundo da Nath)
  - Connected paywall navigation for non-premium users
  - Uses RevenueCat entitlements for closeFriendSince date

- **2026-02-03**: App-wide improvements and consolidation
  - Migrated deprecated shadow* props to use shadowPresets utility (cross-platform)
  - Consolidated CommunityScreen (merged Nathia version as primary)
  - Archived ProfileScreenRedesign to _archive folder
  - Fixed GlowEffect unused variable warning
  - All 420 tests still passing, TypeScript clean
  
- **2026-02-03**: HomeScreen consolidation
  - Consolidated 5 HomeScreen variants into single unified HomeScreen.tsx
  - Extracted PremiumHeader and SectionHeader as reusable components
  - Archived legacy versions to src/screens/home/_archive/
  - Updated MainTabNavigator to use consolidated HomeScreen
  - All 420 tests still passing

- **2026-02-02**: Complete Replit environment setup
  - Configured Expo Web workflow on port 5000 with Metro bundler
  - Installed all dependencies (react-native-css-interop, zod, @jest/globals)
  - Fixed Jest configuration for pnpm structure (transformIgnorePatterns)
  - Fixed Zod 4.x API compatibility (errors -> issues in validation.ts, auth.ts)
  - Configured Supabase credentials via Replit Secrets
  - All 420 tests passing

## Supabase Configuration
- **Project URL**: https://mnszbkeuerjcevjvdqme.supabase.co
- **Functions URL**: https://mnszbkeuerjcevjvdqme.supabase.co/functions/v1
- **Webhook**: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat

## Known Issues & Improvements
1. **RevenueCat**: Runs in browser mode on web (payments not available)
2. **Push Notifications**: Not supported on web platform
3. **Reactotron**: Shows warning on web (react-native-web import)

## Deployment
For production deployment, use:
```bash
npx expo export --platform web
npx serve dist -l 5000
```

## Notes
- The app uses Metro bundler for web (not webpack)
- NativeWind requires react-native-css-interop for styling
- Environment variables are read via src/config/env.ts
- Secrets are managed via Replit Secrets panel
