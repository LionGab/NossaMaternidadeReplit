# Figma Design System Rules — Nossa Maternidade

> **For Claude Code AI Integration via MCP**
> Version: 1.0 | Last Updated: 2026-01-22

---

## Table of Contents

1. [Design System Structure](#design-system-structure)
2. [Token Definitions](#token-definitions)
3. [Component Library](#component-library)
4. [Frameworks & Libraries](#frameworks--libraries)
5. [Asset Management](#asset-management)
6. [Icon System](#icon-system)
7. [Styling Approach](#styling-approach)
8. [Project Structure](#project-structure)
9. [Figma-to-Code Mapping](#figma-to-code-mapping)

---

## Design System Structure

### Overview

Nossa Maternidade uses a **hybrid design system** combining:

- **Centralized design tokens** (`src/theme/tokens.ts`) as the single source of truth
- **NativeWind 4.x** (Tailwind CSS for React Native) for utility-first styling
- **Theme presets** for different visual modes (calmFemtech, floClean)
- **Dark mode support** via theme switching

### Design Philosophy

**"Pink Clean + Blue Clean Premium"** — Instagram-worthy colors with WCAG AAA accessibility.

Key principles:

- **Blue Clean (Primary)**: Sky blue, water, digital freshness (`#1AB8FF` family)
- **Pink Clean (Accent)**: Fresh flowers, natural blush, modern femininity (`#FF5C94` family)
- **WCAG AAA by default**: Accessibility-first design
- **8pt grid system**: All spacing follows 8pt baseline
- **Premium minimalism**: Inspired by Flo Health, I Am, Calm

---

## Token Definitions

### Primary Location

**File**: `src/theme/tokens.ts`

This is the **single source of truth** for all design tokens. NEVER hardcode colors, spacing, or typography directly.

### Color Tokens

#### Brand Colors (Primary Palette)

```typescript
// Blue Clean (Primary) — Serenity, purity, freshness
brand.primary[50]; // #F0F9FF - Background principal
brand.primary[100]; // #E0F2FE - Cards, surfaces
brand.primary[400]; // #38BDF8 - Interactive elements ✨
brand.primary[500]; // #0EA5E9 - CTA principal
brand.primary[900]; // #0C4A6E - Headings

// Pink Clean (Accent) — Femininity, warmth
brand.accent[50]; // #FFF1F3 - Background accent
brand.accent[500]; // #F43F68 - CTA PRINCIPAL ✨
brand.accent[600]; // #E11D50 - CTA pressed

// Secondary (Lilac) — Serenity, introspection
brand.secondary[500]; // #A855F7 - Main secondary

// Teal — Health, wellness
brand.teal[500]; // #14B8A6 - Health indicators
```

#### Semantic Colors

```typescript
// Light mode
semantic.light.success; // #10B981 - Green
semantic.light.successLight; // #D1FAE5 - Background
semantic.light.warning; // #F59E0B - Amber
semantic.light.error; // #EF4444 - Red

// Dark mode
semantic.dark.success; // #34D399
semantic.dark.warning; // #FBBF24
semantic.dark.error; // #F87171
```

#### Surface/Background Colors

```typescript
// Light mode
surface.light.base; // #F8FCFF - App background
surface.light.card; // #FFFFFF - Cards
surface.light.elevated; // #FFFFFF - Elevated cards
surface.light.soft; // #F0F9FF - Soft backgrounds

// Dark mode
surface.dark.base; // #0A1520 - Blue dark base (OLED friendly)
surface.dark.card; // #0F1E2D - Card elevation 1
surface.dark.elevated; // #15283A - Card elevation 2
```

#### Text Colors

```typescript
// Light mode
text.light.primary; // #1F2937 - Headings, primary text
text.light.secondary; // #6B7280 - Body text
text.light.tertiary; // #9CA3AF - Hints, placeholders
text.light.accent; // #FF5C94 - Accent text (links CTA)

// Dark mode
text.dark.primary; // #F3F5F7
text.dark.secondary; // #9DA8B4
text.dark.tertiary; // #7D8B99
```

### Typography Tokens

**Font System**: Dual font approach

```typescript
// Sans-serif (Manrope) — UI/Body text
typography.fontFamily.base; // Manrope_400Regular (400)
typography.fontFamily.medium; // Manrope_500Medium (500)
typography.fontFamily.semibold; // Manrope_600SemiBold (600)
typography.fontFamily.bold; // Manrope_700Bold (700)

// Serif (DMSerifDisplay) — Display/Hero text only
typography.fontFamily.serif; // DMSerifDisplay_400Regular
typography.fontFamily.display; // Alias for serif
```

**Typography Hierarchy**:

| Style           | Font           | Weight | Size | Line Height | Usage              |
| --------------- | -------------- | ------ | ---- | ----------- | ------------------ |
| Display Large   | DMSerifDisplay | 400    | 28px | 34px        | Hero titles        |
| Headline Large  | Manrope        | 700    | 22px | 28px        | H1 page titles     |
| Headline Medium | Manrope        | 600    | 18px | 24px        | H2 section headers |
| Title Large     | Manrope        | 600    | 18px | 24px        | Card titles        |
| Body Medium     | Manrope        | 400    | 15px | 22px        | Default body text  |
| Label Large     | Manrope        | 600    | 14px | 20px        | Button labels      |
| Caption         | Manrope        | 400    | 12px | 16px        | Timestamps, hints  |

### Spacing Tokens (8pt Grid)

```typescript
spacing.xs; // 4px
spacing.sm; // 8px
spacing.md; // 12px
spacing.lg; // 16px ← Most common for elements
spacing.xl; // 20px
spacing["2xl"]; // 24px ← Most common for sections
spacing["3xl"]; // 32px
spacing["4xl"]; // 40px
spacing["6xl"]; // 64px
```

### Radius Tokens

```typescript
radius.xs; // 4px
radius.sm; // 8px
radius.md; // 12px  ← Standard for small elements
radius.lg; // 16px  ← Standard for cards/buttons
radius.xl; // 20px
radius["2xl"]; // 24px  ← Premium cards
radius.full; // 9999px (pill shape)
```

### Shadow Tokens

```typescript
// Neutral shadows (for general UI)
shadows.sm; // Subtle depth
shadows.md; // Standard cards
shadows.lg; // Modals, sheets
shadows.xl; // Floating actions

// Accent shadows (pink glow for CTAs)
shadows.accentGlow; // Pink glow for primary CTAs

// Flo Clean shadows (pink-tinted for floClean preset)
shadows.flo.soft; // Standard pink shadow
shadows.flo.elevated; // Elevated pink shadow
shadows.flo.cta; // Button pink shadow
```

---

## Component Library

### Location

**Directory**: `src/components/ui/`

### Core Components

All components are **NativeWind-based** with preset-aware theming via `useTheme()` hook.

#### Button (`Button.tsx`)

**Variants**:

- `accent` — Pink CTA (maximum emphasis)
- `glow` — Pink CTA with animated glow
- `gradient` — Pink gradient (premium)
- `primary` — Blue pastel (primary action)
- `secondary` — Blue outline
- `ghost` — No background
- `soft` — Soft blue background

**Sizes**: `sm`, `md`, `lg`

**Example**:

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="glow" onPress={handleCTA}>
  Começar Agora
</Button>

<Button variant="primary" size="lg" icon="arrow-forward">
  Próximo
</Button>
```

**Key Features**:

- Animated press feedback (scale)
- Haptic feedback integration
- WCAG AAA compliant tap targets (44pt minimum)
- Icon support (left/right positioning)
- Loading state

#### Card (`Card.tsx`)

**Variants**:

- `default` — White background, subtle border
- `elevated` — Soft shadow, white background
- `outlined` — Visible border
- `soft` — Blue/pink soft background
- `accent` — Pink highlight with border
- `glass` — Glassmorphism effect

**Padding**: `none`, `sm`, `md`, `lg`
**Radius**: `sm`, `md`, `lg`, `xl`, `full`

**Example**:

```tsx
import { Card } from '@/components/ui/Card';

<Card variant="elevated" padding="lg" animated>
  <Text>Card content</Text>
</Card>

<Card variant="accent" onPress={handlePress} radius="xl">
  <Text>Interactive card</Text>
</Card>
```

**Key Features**:

- Pressable support (haptic feedback)
- Animation on mount
- Dark mode support via NativeWind classes

#### Text (`Text.tsx`)

Custom text component with theme integration.

**Example**:

```tsx
import { Text } from '@/components/ui/Text';

<Text variant="headlineLarge" color="primary">
  Título Principal
</Text>

<Text variant="bodyMedium" color="secondary">
  Corpo de texto padrão
</Text>
```

### Additional UI Components

- **FloCleanCard** — Flo Health-inspired clean card
- **FloHeader** — Minimalist header with pink accents
- **Badge** — Status badges (color-coded)
- **Chip** — Filter/tag chips
- **Input** — Text inputs with focus states
- **IconButton** — Icon-only buttons
- **Avatar** — User avatars
- **EmptyState** / **ErrorState** — Feedback states
- **LoadingDots** / **LoadingState** — Loading indicators
- **GradientBackground** — Gradient wrappers
- **PremiumCard** — Premium content cards

---

## Frameworks & Libraries

### UI Framework

**React Native 0.81.5** + **Expo SDK 54**

### Styling Libraries

1. **NativeWind 4.1.23** — Primary styling system
   - Tailwind CSS for React Native
   - Utility-first CSS classes
   - Dark mode via `dark:` prefix
   - JIT compilation

2. **Tailwind CSS 3.4.17** — Configuration
   - Custom design tokens in `tailwind.config.js`
   - Extended color palette
   - Custom utilities (shadows, cards, buttons)
   - Dark mode variants

3. **tailwind-merge** — Class merging utility
   - `cn()` helper function in `src/utils/cn.ts`
   - Conflict resolution for className strings

### Animation Libraries

- **react-native-reanimated 4.1.1** — Performant animations
- **react-native-gesture-handler 2.28** — Gesture system
- **expo-haptics** — Haptic feedback

### Build System

- **Metro Bundler** (Expo default)
- **LightningCSS 1.30** — CSS processing
- **TypeScript 5.9.2** — Strict type checking

---

## Asset Management

### Asset Locations

```
assets/
├── icon.png              # App icon (1024x1024)
├── adaptive-icon.png     # Android adaptive icon
├── splash.png            # Splash screen
├── logo.png              # Nossa Maternidade logo
└── notification-icon.png # Push notification icon
```

### Asset Optimization

- **Images**: PNG, WebP supported
- **SVG**: Via `react-native-svg` (imported as components)
- **Optimization**: EAS Build handles compression
- **Loading**: Use `expo-image` for lazy loading + caching

### Image Component

```tsx
import { Image } from "expo-image";

<Image
  source={require("@/assets/logo.png")}
  style={{ width: 100, height: 100 }}
  contentFit="contain"
  transition={200}
/>;
```

### No CDN

Assets are bundled directly with the app (no external CDN).

---

## Icon System

### Primary Icon Library

**@expo/vector-icons (Ionicons)**

```tsx
import { Ionicons } from "@expo/vector-icons";

<Ionicons name="heart" size={24} color={brand.accent[500]} />;
```

### Secondary Icon Library

**lucide-react-native** (Modern icon set)

```tsx
import { Heart, Home, Settings } from "lucide-react-native";

<Heart color={brand.accent[500]} size={24} />;
```

### Icon Usage Guidelines

1. **Color**: Use tokens (`brand.accent[500]`, `text.light.primary`)
2. **Size**: Follow spacing tokens (16px, 20px, 24px)
3. **Accessibility**: Always include `accessibilityLabel` for screen readers
4. **Consistency**: Prefer Ionicons for UI, Lucide for decorative

### Icon Naming Convention

- Ionicons: Kebab-case with suffix (`heart-outline`, `arrow-forward`)
- Lucide: PascalCase component names (`Heart`, `ArrowRight`)

---

## Styling Approach

### CSS Methodology

**NativeWind (Tailwind for React Native)** — Utility-first approach

### Global Styles

Global styles are **NOT used**. All styling is component-scoped via:

1. NativeWind `className` utilities
2. Inline `style` props for dynamic values
3. Design tokens from `tokens.ts`

### Responsive Design

React Native doesn't use media queries. Instead:

```tsx
import { useWindowDimensions } from "react-native";

const { width, height } = useWindowDimensions();

// Conditional styling based on screen size
const cardWidth = width < 375 ? "100%" : "90%";
```

### Dark Mode Implementation

#### Method 1: NativeWind Classes

```tsx
<View className="bg-white dark:bg-neutral-900">
  <Text className="text-gray-900 dark:text-gray-100">Dark mode text</Text>
</View>
```

#### Method 2: useTheme Hook

```tsx
import { useTheme } from "@/hooks/useTheme";

const { text, surface, isDark } = useTheme();

<View style={{ backgroundColor: surface.base }}>
  <Text style={{ color: text.primary }}>Theme-aware text</Text>
</View>;
```

### Component Pattern

**Hybrid Approach** — Combine NativeWind utilities with dynamic tokens:

```tsx
import { cn } from "@/utils/cn";
import { useTheme } from "@/hooks/useTheme";
import { spacing, radius } from "@/theme/tokens";

export function MyComponent({ className }) {
  const { surface, text } = useTheme();

  return (
    <View
      className={cn(
        "flex-1 p-4", // NativeWind utilities
        className // User overrides
      )}
      style={{
        backgroundColor: surface.card, // Dynamic token
        borderRadius: radius.lg, // Static token
      }}
    >
      <Text style={{ color: text.primary }}>Content</Text>
    </View>
  );
}
```

---

## Project Structure

```
src/
├── api/                 # API clients (Supabase, AI, transcribe)
├── ai/                  # AI prompts (NathIA system prompt)
├── components/          # React components
│   ├── ui/             # Atomic UI components (Button, Card, etc.)
│   ├── features/       # Feature-specific components
│   └── screens/        # (Legacy, prefer src/screens/)
├── config/             # Configuration (env, constants)
├── context/            # React Context providers
├── hooks/              # Custom hooks (useTheme, useAuth, etc.)
├── navigation/         # React Navigation setup
├── screens/            # Screen components (Home, NathIA, etc.)
├── services/           # Business logic services
├── state/              # Zustand stores (useAppStore, etc.)
├── theme/              # Design tokens
│   ├── tokens.ts       # ← SINGLE SOURCE OF TRUTH
│   ├── presets/        # Theme presets (calmFemtech, floClean)
│   └── tailwind-bridge.cjs # Tailwind ↔ tokens bridge
├── types/              # TypeScript types
└── utils/              # Utilities (cn, logger, haptics, etc.)

Root:
├── tailwind.config.js  # Tailwind configuration
├── CLAUDE.md           # Project documentation
└── docs/claude/        # Detailed documentation
```

### Key Files for Figma Integration

| File                    | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `src/theme/tokens.ts`   | **SINGLE SOURCE OF TRUTH** for all tokens |
| `src/hooks/useTheme.ts` | Theme hook for dynamic values             |
| `src/utils/cn.ts`       | TailwindCSS class merging                 |
| `tailwind.config.js`    | Tailwind configuration + custom utilities |
| `src/components/ui/`    | Atomic UI component library               |

---

## Figma-to-Code Mapping

### Design Token Mapping

When translating Figma designs to code:

#### Colors

| Figma Variable         | Code Token           | Value     |
| ---------------------- | -------------------- | --------- |
| `Primary/500`          | `brand.primary[500]` | `#0EA5E9` |
| `Accent/500`           | `brand.accent[500]`  | `#F43F68` |
| `Surface/Base` (light) | `surface.light.base` | `#F8FCFF` |
| `Text/Primary` (light) | `text.light.primary` | `#1F2937` |

**RULE**: NEVER hardcode color values. Always reference tokens.

#### Typography

| Figma Text Style | Code Token                 | Font           | Weight | Size |
| ---------------- | -------------------------- | -------------- | ------ | ---- |
| `Display/Large`  | `typography.displayLarge`  | DMSerifDisplay | 400    | 28px |
| `Headline/Large` | `typography.headlineLarge` | Manrope        | 700    | 22px |
| `Body/Medium`    | `typography.bodyMedium`    | Manrope        | 400    | 15px |
| `Label/Large`    | `typography.labelLarge`    | Manrope        | 600    | 14px |

**Implementation**:

```tsx
<Text
  style={{
    fontFamily: typography.fontFamily.bold,
    ...typography.headlineLarge,
  }}
>
  Título
</Text>
```

#### Spacing

| Figma Auto Layout Gap | Code Token       | Value |
| --------------------- | ---------------- | ----- |
| 4px                   | `spacing.xs`     | 4     |
| 8px                   | `spacing.sm`     | 8     |
| 16px                  | `spacing.lg`     | 16    |
| 24px                  | `spacing["2xl"]` | 24    |

**NativeWind Classes**: `gap-4`, `p-4`, `mt-6`

#### Border Radius

| Figma Corner Radius | Code Token      | Value |
| ------------------- | --------------- | ----- |
| 12px                | `radius.md`     | 12    |
| 16px                | `radius.lg`     | 16    |
| 24px                | `radius["2xl"]` | 24    |

**NativeWind Classes**: `rounded-lg`, `rounded-2xl`

### Component Mapping

| Figma Component | Code Component              | Location                       |
| --------------- | --------------------------- | ------------------------------ |
| Button/Primary  | `<Button variant="accent">` | `src/components/ui/Button.tsx` |
| Card/Elevated   | `<Card variant="elevated">` | `src/components/ui/Card.tsx`   |
| Input/Default   | `<Input />`                 | `src/components/ui/Input.tsx`  |
| Badge/Success   | `<Badge variant="success">` | `src/components/ui/Badge.tsx`  |

### Shadow Mapping

| Figma Effect       | Code Token           | iOS/Android                       |
| ------------------ | -------------------- | --------------------------------- |
| Soft Shadow (card) | `shadows.md`         | Cross-platform                    |
| Pink Glow (CTA)    | `shadows.accentGlow` | iOS (shadow), Android (elevation) |
| Flo Clean Shadow   | `shadows.flo.soft`   | Pink-tinted                       |

**Implementation**:

```tsx
<View style={shadows.md}>{/* Card content */}</View>
```

### Preset Modes

Nossa Maternidade supports **2 visual presets**:

1. **calmFemtech** (default) — Blue + Pink balanced
2. **floClean** — Pink-dominant (Flo Health inspired)

**Accessing preset tokens**:

```tsx
const { preset } = useTheme();

<View style={{
  backgroundColor: preset.surface.base,
  borderColor: preset.border.default
}}>
```

### Accessibility Mapping

| Figma Constraint                | Code Enforcement                  |
| ------------------------------- | --------------------------------- |
| Minimum tap target: 44pt        | `accessibility.minTapTarget` (44) |
| Contrast ratio: WCAG AA (4.5:1) | `accessibility.contrastRatioAA`   |
| Contrast ratio: WCAG AAA (7:1)  | `accessibility.contrastRatioAAA`  |

**All buttons/pressables automatically enforce 44pt minimum**.

### Animation Mapping

| Figma Interaction  | Code Implementation                      |
| ------------------ | ---------------------------------------- |
| Press (scale down) | `micro.pressScale` (0.97) via Reanimated |
| Fade in            | `FadeIn` from `react-native-reanimated`  |
| Slide up           | `FadeInUp.springify()`                   |
| Glow pulse         | `withRepeat(withTiming(...))`            |

---

## Best Practices for AI Integration

### When Implementing Figma Designs

1. **Token-First Approach**
   - ALWAYS check `src/theme/tokens.ts` for existing tokens
   - NEVER hardcode colors, spacing, or typography
   - Use `useTheme()` for dynamic values

2. **Component Reusability**
   - Check `src/components/ui/` for existing components
   - Extend existing components rather than creating new ones
   - Follow the hybrid NativeWind + tokens pattern

3. **Dark Mode by Default**
   - All new components must support dark mode
   - Test with `dark:` classes or `isDark` from `useTheme()`

4. **Accessibility**
   - Minimum 44pt tap targets (enforced by design)
   - WCAG AAA contrast (use `text.light.primary` vs `surface.light.base`)
   - Screen reader labels (`accessibilityLabel`)

5. **Type Safety**
   - Zero `any` types (strict TypeScript)
   - Use preset types from `tokens.ts`

6. **Performance**
   - Use `FlashList` for lists (never `ScrollView + map`)
   - Optimize animations with `useOptimizedAnimation()` hook
   - Lazy load images with `expo-image`

### Code Quality Gates

Before committing Figma-inspired code:

```bash
npm run quality-gate  # TypeScript + ESLint + build check
```

This enforces:

- Zero TypeScript errors
- Zero ESLint warnings
- No hardcoded colors/styles
- No `console.log` (use `logger.*`)

---

## Summary

**Nossa Maternidade Design System** is:

- **Token-driven**: Single source of truth in `tokens.ts`
- **NativeWind-powered**: Utility-first styling with Tailwind
- **Preset-aware**: Switch between calmFemtech/floClean
- **Accessible**: WCAG AAA, 44pt tap targets, screen readers
- **Type-safe**: Strict TypeScript, zero `any`
- **Premium**: Instagram-worthy, inspired by Flo/Calm/I Am

**For Figma → Code**:

1. Map Figma variables to `tokens.ts`
2. Use existing `src/components/ui/` components
3. Apply NativeWind classes + dynamic tokens
4. Test dark mode + accessibility
5. Run `npm run quality-gate` before commit

---

**Questions? Reference**:

- CLAUDE.md (project overview)
- docs/claude/design-system.md (detailed tokens)
- docs/claude/code-patterns.md (component patterns)
