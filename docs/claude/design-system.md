# Design System

> Nossa Maternidade — Calm FemTech Design System

---

## Overview

- **Philosophy**: Calm FemTech - calma, acolhedora, profissional
- **Primary**: Blue Clean (azul suave)
- **Accent**: Pink Clean (rosa feminino)
- **Font Display**: DM Serif Display
- **Font Body**: Manrope
- **Grid**: 8pt system
- **Accessibility**: WCAG AAA

---

## Color Tokens

### Brand Colors

```typescript
// Primary: Blue Clean
brand: {
  primary: "#5B8FB9",      // Blue Clean - cor principal
  primaryLight: "#89B4D4", // Hover/light state
  primaryDark: "#3D6A8C",  // Active/dark state

  // Accent: Pink Clean
  accent: "#E8A5B3",       // Pink Clean - acentos
  accentLight: "#F5D5DC",  // Light pink
  accentDark: "#C77E8E",   // Dark pink

  // Secondary: Lilás
  secondary: "#B8A9C9",    // Lilás suave
  secondaryLight: "#D4CBE0",
  secondaryDark: "#8E7FA8",
}
```

### Surface Colors

```typescript
surface: {
  background: "#FAFBFC",   // Background principal
  card: "#FFFFFF",         // Cards
  cardElevated: "#FFFFFF", // Cards com shadow
  modal: "#FFFFFF",        // Modals
  overlay: "rgba(0, 0, 0, 0.5)", // Overlay escuro
}
```

### Text Colors

```typescript
text: {
  primary: "#1A1D21",      // Texto principal
  secondary: "#6B7280",    // Texto secundario
  tertiary: "#9CA3AF",     // Texto terciario
  inverse: "#FFFFFF",      // Texto em bg escuro
  link: "#5B8FB9",         // Links
  error: "#DC2626",        // Erros
  success: "#059669",      // Sucesso
  warning: "#D97706",      // Avisos
}
```

### Semantic Colors

```typescript
semantic: {
  success: "#059669",
  successLight: "#D1FAE5",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  info: "#5B8FB9",
  infoLight: "#DBEAFE",
}
```

### Neutral Palette

```typescript
neutral: {
  50: "#FAFAFA",
  100: "#F4F4F5",
  200: "#E4E4E7",
  300: "#D4D4D8",
  400: "#A1A1AA",
  500: "#71717A",
  600: "#52525B",
  700: "#3F3F46",
  800: "#27272A",
  900: "#18181B",
  950: "#09090B",
}
```

### Premium Colors (Dark Immersive)

```typescript
premium: {
  background: "#0A0A0F",   // Dark background
  card: "#1A1A2E",         // Dark cards
  accent: "#FFD700",       // Gold accent
  text: "#FFFFFF",         // White text
  textMuted: "#A0A0B0",    // Muted text
}
```

---

## Typography

### Font Families

```typescript
fontFamily: {
  // Display (titulos impactantes)
  display: "DMSerifDisplay_400Regular",

  // Body (texto corrido)
  body: "Manrope_400Regular",
  bodyMedium: "Manrope_500Medium",
  bodySemiBold: "Manrope_600SemiBold",
  bodyBold: "Manrope_700Bold",
  bodyExtraBold: "Manrope_800ExtraBold",
}
```

### Font Sizes

```typescript
fontSize: {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
}
```

### Line Heights

```typescript
lineHeight: {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
}
```

### Typography Presets

```typescript
typography: {
  // Display (DM Serif Display)
  displayLarge: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 48,
    lineHeight: 1.1,
  },
  displayMedium: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 36,
    lineHeight: 1.2,
  },
  displaySmall: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 30,
    lineHeight: 1.2,
  },

  // Headings (Manrope Bold)
  h1: {
    fontFamily: "Manrope_700Bold",
    fontSize: 30,
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: "Manrope_700Bold",
    fontSize: 24,
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 20,
    lineHeight: 1.4,
  },
  h4: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 18,
    lineHeight: 1.4,
  },

  // Body (Manrope Regular)
  bodyLarge: {
    fontFamily: "Manrope_400Regular",
    fontSize: 18,
    lineHeight: 1.6,
  },
  bodyMedium: {
    fontFamily: "Manrope_400Regular",
    fontSize: 16,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    lineHeight: 1.5,
  },

  // Labels (Manrope Medium)
  labelLarge: {
    fontFamily: "Manrope_500Medium",
    fontSize: 16,
    lineHeight: 1.4,
  },
  labelMedium: {
    fontFamily: "Manrope_500Medium",
    fontSize: 14,
    lineHeight: 1.4,
  },
  labelSmall: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    lineHeight: 1.4,
  },

  // Caption
  caption: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    lineHeight: 1.4,
  },
}
```

---

## Spacing

### Base Scale (8pt grid)

```typescript
spacing: {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
}
```

### Semantic Spacing

```typescript
spacing: {
  // Screen padding
  screenPadding: 16,
  screenPaddingLarge: 24,

  // Card padding
  cardPadding: 16,
  cardPaddingLarge: 24,

  // Section spacing
  sectionGap: 24,
  sectionGapLarge: 32,

  // Item spacing (lists)
  itemGap: 12,
  itemGapLarge: 16,

  // Inline spacing
  inlineGap: 8,
  inlineGapLarge: 12,
}
```

---

## Border Radius

```typescript
radius: {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
}
```

### Semantic Radius

```typescript
radius: {
  button: 12,
  buttonSmall: 8,
  buttonLarge: 16,
  card: 16,
  cardLarge: 20,
  input: 12,
  modal: 24,
  avatar: 9999,
  badge: 9999,
}
```

---

## Shadows

```typescript
shadows: {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
}
```

---

## Gradients

```typescript
gradients: {
  // Primary gradient (Blue Clean)
  primary: ["#5B8FB9", "#89B4D4"],

  // Accent gradient (Pink Clean)
  accent: ["#E8A5B3", "#F5D5DC"],

  // Premium gradient (Gold)
  premium: ["#FFD700", "#FFA500"],

  // Background gradients
  backgroundLight: ["#FAFBFC", "#F0F4F8"],
  backgroundDark: ["#0A0A0F", "#1A1A2E"],

  // Card gradients
  cardHighlight: ["#FFFFFF", "#F8FAFC"],

  // Mood gradients
  calm: ["#E8F4FD", "#D1E9FC"],
  happy: ["#FEF3C7", "#FDE68A"],
  energetic: ["#FCE7F3", "#FBCFE8"],
}
```

---

## Animation Tokens

```typescript
animation: {
  // Duration
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  },

  // Easing (Reanimated)
  easing: {
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
  },
}
```

---

## Icons

### Icon Library

- **Primary**: `@expo/vector-icons` (Ionicons)
- **Secondary**: `lucide-react-native`

### Icon Sizes

```typescript
iconSize: {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 40,
}
```

### Common Icons

```typescript
// Navigation
icons: {
  home: "home-outline",
  homeFilled: "home",
  community: "people-outline",
  communityFilled: "people",
  chat: "chatbubble-outline",
  chatFilled: "chatbubble",
  care: "heart-outline",
  careFilled: "heart",
  profile: "person-outline",
  profileFilled: "person",

  // Actions
  add: "add",
  close: "close",
  back: "chevron-back",
  forward: "chevron-forward",
  check: "checkmark",
  search: "search",
  settings: "settings-outline",

  // Status
  success: "checkmark-circle",
  error: "alert-circle",
  warning: "warning",
  info: "information-circle",
}
```

---

## Component Tokens

### Button

```typescript
button: {
  // Heights
  height: {
    sm: 40,
    md: 48,
    lg: 56,
  },

  // Padding horizontal
  paddingX: {
    sm: 16,
    md: 24,
    lg: 32,
  },

  // Radius
  radius: 12,

  // Font
  fontSize: {
    sm: 14,
    md: 16,
    lg: 18,
  },
  fontWeight: "600",
}
```

### Input

```typescript
input: {
  height: 48,
  heightMultiline: 120,
  paddingX: 16,
  paddingY: 12,
  radius: 12,
  borderWidth: 1,
  borderColor: neutral[300],
  borderColorFocus: brand.primary,
  backgroundColor: neutral[50],
  fontSize: 16,
}
```

### Card

```typescript
card: {
  padding: 16,
  paddingLarge: 24,
  radius: 16,
  radiusLarge: 20,
  backgroundColor: surface.card,
  shadow: shadows.md,
}
```

### Avatar

```typescript
avatar: {
  size: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    "2xl": 80,
  },
  radius: 9999,
  borderWidth: 2,
  borderColor: neutral[200],
}
```

---

## Dark Mode

### Color Mapping

```typescript
darkMode: {
  surface: {
    background: "#0A0A0F",
    card: "#1A1A2E",
    cardElevated: "#252540",
    modal: "#1A1A2E",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A0A0B0",
    tertiary: "#6B6B7B",
  },
  brand: {
    primary: "#7BA8D1",     // Lighter blue
    accent: "#F0B8C4",      // Lighter pink
  },
}
```

### Usage

```typescript
// Hook
import { useThemeColors } from "@/hooks/useTheme";

function MyComponent() {
  const colors = useThemeColors();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
}
```

---

## Accessibility

### Touch Targets

```typescript
// Minimo 44pt para iOS, 48dp para Android
touchTarget: {
  min: 44,
  recommended: 48,
}
```

### Contrast Ratios

| Element       | Minimum    | Target      |
| ------------- | ---------- | ----------- |
| Body text     | 4.5:1 (AA) | 7:1 (AAA)   |
| Large text    | 3:1 (AA)   | 4.5:1 (AAA) |
| UI components | 3:1        | 4.5:1       |

### Focus States

```typescript
focus: {
  outlineColor: brand.primary,
  outlineWidth: 2,
  outlineOffset: 2,
}
```

---

## Usage Examples

### Applying Colors

```typescript
// NativeWind
<View className="bg-primary" />
<Text className="text-secondary" />

// Inline with Tokens
<View style={{ backgroundColor: Tokens.brand.primary }} />
<Text style={{ color: Tokens.text.primary }} />

// Dynamic with hook
const colors = useThemeColors();
<View style={{ backgroundColor: colors.background }} />
```

### Applying Typography

```typescript
// NativeWind
<Text className="font-display text-4xl" />
<Text className="font-body text-base" />

// Inline with Tokens
<Text style={Tokens.typography.displayLarge} />
<Text style={Tokens.typography.bodyMedium} />
```

### Applying Spacing

```typescript
// NativeWind (px values / 4)
<View className="p-4 m-2 gap-3" />  // 16px, 8px, 12px

// Inline with Tokens
<View style={{ padding: Tokens.spacing[4] }} />
```
