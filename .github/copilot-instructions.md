# GitHub Copilot Instructions — Nossa Maternidade (2026-01-26)

- Stack: React Native 0.81 + Expo SDK 54 + TS strict + Supabase; purpose: maternal health app (pt-BR), hospital-grade reliability.
- Workflow: Explore → Plan → Implement → Verify; always run `npm run quality-gate` before PR; common commands `npm start`, `npm test -- --watch`, `npm run typecheck`, `npm run lint`, `npm run generate-types`, `npm run deploy-functions`, `npm run test:gemini`.
- Path alias: `@/*` → `src/*` (use for all imports).
- Architecture: Navigation flow Auth → NotificationPermission → Onboarding → MainTabs (5 tabs); see [docs/claude/architecture.md](docs/claude/architecture.md) for route map and store inventory.
- State management: Server data via TanStack Query using factory keys in [src/api/queryKeys.ts](src/api/queryKeys.ts); UI/local via per-feature Zustand stores in [src/state](src/state). Do not import deprecated [src/state/store.ts](src/state/store.ts). Use individual selectors (no object destructuring) and keep persistence via `persist/createJSONStorage` with AsyncStorage.
- Services/APIs: Service calls live in [src/services](src/services); query/mutation hooks in [src/api/hooks](src/api/hooks). All responses follow `{ data, error }`; validate inputs with Zod schemas in [src/utils/validation.ts](src/utils/validation.ts). Supabase types in [src/types/database.types.ts](src/types/database.types.ts); regenerate after schema changes with `npm run generate-types`. Edge functions in [supabase/functions](supabase/functions) returning `{ data, error }`.
- Logging & security: `console.*` banned; use `logger.*` from [src/utils/logger.ts](src/utils/logger.ts). Never log PII or secrets; obey LGPD (no CPF/health data in logs). Secrets belong in EAS/`.env` (never committed). Prefer SecureStore for tokens; HTTPS only.
- TypeScript strict: zero `any`, zero `@ts-ignore/@ts-expect-error`; explicit return types; guard `unknown` before use; handle null/undefined.
- Design system & UI: Use Tokens or `useThemeColors` from [src/theme/tokens.ts](src/theme/tokens.ts); no hardcoded colors. Prefer `Pressable`, `SafeAreaView`; lists must be `FlashList/FlatList` (not `ScrollView + map`). Keep components <250 lines or split; memoize heavy pieces; provide pt-BR accessibility labels and 44pt+ touch targets.
- RevenueCat/premium: Products `nossa_maternidade_monthly` and `nossa_maternidade_yearly`; entitlement `premium`; free tier 6 AI messages/day. Premium state in [src/state/premium-store.ts](src/state/premium-store.ts).
- AI/NathIA: Model `gemini-2.0-flash-exp`; system prompt in [src/ai/nathiaPrompt.ts](src/ai/nathiaPrompt.ts); chat service in [src/api/chat-service.ts](src/api/chat-service.ts); edge entry in [supabase/functions/ai/index.ts](supabase/functions/ai/index.ts). Test with `npm run test:gemini`.
- Navigation/types: Use typed props from navigation types (see [docs/claude/architecture.md](docs/claude/architecture.md)); keep screens small and route-safe.
- Performance: Lists virtualized; prefer `React.memo` for heavy cells; use code-splitting (`React.lazy`) for 200+ line screens; avoid extra renders by stable selectors.
- Testing/quality: Tests in `src/**/__tests__`; run `npm test` or coverage. CI blocks on `quality-gate` (TS + ESLint + build + no console + no hardcoded colors).
- Immutable constants: Bundle ID `app.nossamaternidade.app`; RevenueCat product `premium`; Supabase project `lqahkqfpynypbmhtffyi`; Apple Team `KZPW4S77UH`.

## Copilot short rules
- Sempre sugira PRs que passem `npm run quality-gate`.
- Não exponha secrets nem credenciais.
- Priorize TypeScript strict e testes.

Ask for clarification if a pattern is unclear or undocumented before implementing.
