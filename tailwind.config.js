/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const themeColors = require("./src/theme/tailwind-bridge.cjs");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugins: {
    space: false,
  },
  theme: {
    // NOTE to AI: You can extend the theme with custom colors or styles here.
    extend: {
      colors: {
        // Nossa Maternidade - Sistema Premium FemTech 2025
        // Paleta Minimalista: Azul Pastel (calm) + Rosa Claro (accent)
        // Inspirado em Calm, Flo, Clue - Design de Cinema
        //
        // Primary: Azul Pastel Premium ✨ (serenidade, confiança, leveza)
        rosa: {
          50: "#FDF8F8",
          100: "#F5E6E8",
          200: "#EBCDD0",
          300: "#D4A5A5",
          400: "#C48E8E",
          500: "#B88B8B",
          600: "#A07676",
          700: "#876363",
          800: "#6E5050",
          900: "#5A4242",
          DEFAULT: "#D4A5A5",
        },
        menta: {
          50: "#F4F9F6",
          100: "#E5F0EB",
          200: "#C9E0D5",
          300: "#A8C5B5",
          400: "#8FB3A0",
          500: "#7A9E8E",
          600: "#648273",
          700: "#516A5E",
          800: "#42554C",
          900: "#36463F",
          DEFAULT: "#A8C5B5",
        },
        nude: {
          50: "#FDFCFB",
          100: "#F9F4F0",
          200: "#F3EBE4",
          300: "#E8DDD5",
          400: "#D9CCC2",
          500: "#C9BAB0",
          600: "#A99D94",
          700: "#8A8078",
          800: "#6B635C",
          900: "#56504A",
          DEFAULT: "#F9F4F0",
        },
        texto: {
          DEFAULT: "#4A4A4A",
          muted: "#7A7A7A",
        },
        primary: {
          50: "#F4F9F6",
          100: "#E5F0EB",
          200: "#C9E0D5",
          300: "#A8C5B5",
          400: "#8FB3A0",
          500: "#7A9E8E",
          600: "#648273",
          700: "#516A5E",
          800: "#42554C",
          900: "#36463F",
          DEFAULT: "#A8C5B5",
        },
        // Accent: Rosa Claro Premium ✨ (feminilidade suave, acolhimento)
        accent: {
          50: "#FDF8F8",
          100: "#F5E6E8",
          200: "#EBCDD0",
          300: "#D4A5A5",
          400: "#C48E8E",
          500: "#B88B8B",
          600: "#A07676",
          700: "#876363",
          800: "#6E5050",
          900: "#5A4242",
          DEFAULT: "#A07676",
        },
        // Secondary: Lilás/Roxo (apoio, meditação, introspecção)
        secondary: {
          DEFAULT: "#A855F7",
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7C3AED",
          800: "#6B21A8",
          900: "#581C87",
        },
        // Teal: Saúde, bem-estar físico
        teal: {
          DEFAULT: "#14B8A6",
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
        // NathAccent: Conteúdo exclusivo Nath (Mundo da Nath, badges premium)
        nath: {
          rose: "#F4A5B8",
          "rose-light": "#FAD4DE",
          "rose-dark": "#E88BA0",
          coral: "#FF6B6B",
          "coral-light": "#FF9E9E",
          "coral-dark": "#E85555",
        },
        // Rose (legacy compat - aponta para accent)
        rose: {
          50: "#FFF5F8",
          100: "#FFE5ED",
          200: "#FFD0E0",
          300: "#FFA8C5",
          400: "#FF7AA8",
          500: "#FF5C94",
          600: "#E84D82",
          700: "#CC3E6F",
          800: "#A8335B",
          900: "#852848",
        },
        blush: {
          50: "#FDF8F6",
          100: "#FAF0ED",
          200: "#F5E1DB",
          300: "#EFD0C7",
          400: "#E8B4A5",
          500: "#D4A394",
          600: "#BC8B7B",
          700: "#9E7269",
          800: "#7A584F",
          900: "#5C4238",
        },
        cream: {
          50: "#f8f5f7",
          100: "#FFF9F3",
          200: "#FFF3E8",
          300: "#FFEBD9",
          400: "#FFE0C7",
          500: "#FFD4B0",
          600: "#E8B88C",
          700: "#C9956A",
          800: "#A67548",
          900: "#7D5632",
        },
        sage: {
          50: "#F6FAF7",
          100: "#ECF5EE",
          200: "#D5E8D9",
          300: "#B8D9BF",
          400: "#8FC49A",
          500: "#6BAD78",
          600: "#4F9260",
          700: "#3F7550",
          800: "#345E42",
          900: "#2A4C36",
        },
        warmGray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
        // Cores de sentimentos (Daily Feelings) - Pastéis suaves
        feeling: {
          bem: {
            DEFAULT: "#FFE4B5", // Amarelo pastel (sol)
            light: "#FFEFC7",
          },
          cansada: {
            DEFAULT: "#BAE6FD", // Azul pastel (nuvem)
            light: "#D4E9FD",
          },
          indisposta: {
            DEFAULT: "#DDD6FE", // Lavanda (chuva)
            light: "#EDE9FE",
          },
          amada: {
            DEFAULT: "#FFD0E0", // Rosa pastel (coração)
            light: "#FFE5ED",
          },
          ansiosa: {
            DEFAULT: "#FED7AA", // Coral pastel
            light: "#FFE4C7",
          },
        },
        // Text colors - Hierarquia clara
        text: {
          dark: "#1F2937",
          DEFAULT: "#1F2937",
          light: "#6B7280",
          muted: "#9CA3AF",
          accent: "#FF5C94",
          link: "#007ACC",
        },
        // Background colors - Off-White Premium (mais clean e sofisticado)
        background: {
          DEFAULT: "#FAFCFD",
          primary: "#FAFCFD",
          secondary: "#FFFFFF",
          tertiary: "#F5F8FA",
          elevated: "#FFFFFF",
          soft: "#F8FAFC",
        },
        // Neutral colors
        neutral: {
          0: "#FFFFFF",
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        sans: ["Manrope_400Regular"],
        medium: ["Manrope_500Medium"],
        semibold: ["Manrope_600SemiBold"],
        bold: ["Manrope_700Bold"],
        extrabold: ["Manrope_800ExtraBold"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "16px", letterSpacing: "0.01em" }],
        sm: ["13px", { lineHeight: "18px", letterSpacing: "0.01em" }],
        base: ["15px", { lineHeight: "22px", letterSpacing: "0" }],
        lg: ["17px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "4xl": ["36px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        "5xl": ["48px", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      spacing: {
        18: "72px",
        22: "88px",
      },
    },
    // Dark mode colors - Blue Clean dark base
    dark: {
      colors: {
        primary: {
          DEFAULT: "#4AC8FF",
          50: "#0A1520",
          100: "#0F1E2D",
          200: "#15283A",
          300: "#1F3A4F",
          400: "#7DD8FF",
          500: "#4AC8FF",
          600: "#1AB8FF",
          700: "#0099E6",
          800: "#007ACC",
          900: "#005C99",
        },
        accent: {
          DEFAULT: "#FF7AA8",
          50: "#1A0A12",
          100: "#2D0F1A",
          200: "#4D1A2E",
          300: "#6D2542",
          400: "#FF7AA8",
          500: "#FF5C94",
          600: "#E84D82",
          700: "#CC3E6F",
          800: "#A8335B",
          900: "#852848",
        },
        secondary: {
          DEFAULT: "#C084FC",
          50: "#1A1025",
          100: "#2D1A3D",
          200: "#3D2A5A",
          300: "#5A3F8A",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7C3AED",
          800: "#6B21A8",
          900: "#581C87",
        },
        text: {
          dark: "#F3F5F7",
          DEFAULT: "#F3F5F7",
          light: "#9DA8B4",
          muted: "#7D8B99",
          accent: "#FF7AA8",
          link: "#4AC8FF",
        },
        background: {
          DEFAULT: "#0A1520",
          primary: "#0A1520",
          secondary: "#0F1E2D",
          tertiary: "#15283A",
          elevated: "#0F1E2D",
        },
        neutral: {
          0: "#0F1419",
          50: "#1A2027",
          100: "#242D36",
          200: "#2F3B46",
          300: "#3D4A57",
          400: "#5C6B7A",
          500: "#7D8B99",
          600: "#9DA8B4",
          700: "#C7CED5",
          800: "#E2E7EC",
          900: "#F3F5F7",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    // ============================================
    // SPACING PLUGIN - Gap utilities for RN
    // ============================================
    plugin(({ matchUtilities, theme }) => {
      const spacing = theme("spacing");

      // space-{n}  ->  gap: {n}
      matchUtilities(
        { space: (value) => ({ gap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-x-{n}  ->  column-gap: {n}
      matchUtilities(
        { "space-x": (value) => ({ columnGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-y-{n}  ->  row-gap: {n}
      matchUtilities(
        { "space-y": (value) => ({ rowGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );
    }),

    // ============================================
    // DESIGN SYSTEM PLUGIN - Nossa Maternidade
    // ============================================
    plugin(({ addUtilities, matchUtilities, theme }) => {
      // ===================
      // SHADOW UTILITIES
      // ===================
      addUtilities({
        // iOS-style shadows (soft, elevated)
        ".shadow-soft-sm": {
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        ".shadow-soft": {
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        },
        ".shadow-soft-md": {
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        },
        ".shadow-soft-lg": {
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 8,
        },
        ".shadow-soft-xl": {
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 12,
        },
        // Pink glow shadows (for accent elements)
        ".shadow-accent": {
          shadowColor: "#FF5C94",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        ".shadow-accent-lg": {
          shadowColor: "#FF5C94",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        },
        // Blue glow shadows (for primary elements)
        ".shadow-primary": {
          shadowColor: "#1AB8FF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
      });

      // ===================
      // GLASSMORPHISM
      // ===================
      addUtilities({
        ".glass": {
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
        },
        ".glass-dark": {
          backgroundColor: "rgba(15, 20, 25, 0.8)",
          backdropFilter: "blur(10px)",
        },
        ".glass-strong": {
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
        },
        ".glass-subtle": {
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(8px)",
        },
      });

      // ===================
      // CARD STYLES - Premium Minimalista
      // ===================
      addUtilities({
        // Card elevado: Sombra suave e elegante
        ".card-elevated": {
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          shadowColor: "#1F2937",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        },
        // Card flat: Borda muito sutil
        ".card-flat": {
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#F0F4F8",
        },
        // Card accent: Rosa pastel suave
        ".card-accent": {
          backgroundColor: "#FEF7F9",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#FBDDE5",
        },
        // Card primary: Azul pastel suave
        ".card-primary": {
          backgroundColor: "#F5FBFD",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#D1EDF5",
        },
        // Card glass: Efeito vidro premium
        ".card-glass": {
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(12px)",
        },
        // Card premium: Para conteúdo especial
        ".card-premium": {
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          shadowColor: "#F8B4C4",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 4,
        },
      });

      // ===================
      // BUTTON STYLES - Premium Minimalista
      // ===================
      addUtilities({
        // Botão primário: Rosa claro premium com sombra suave
        ".btn-primary": {
          backgroundColor: "#F8B4C4",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 28,
          shadowColor: "#F8B4C4",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        },
        // Botão secundário: Azul pastel premium
        ".btn-secondary": {
          backgroundColor: "#7EC8E3",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 28,
          shadowColor: "#7EC8E3",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 3,
        },
        // Botão outline: Borda fina e elegante
        ".btn-outline": {
          backgroundColor: "transparent",
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: "#F8B4C4",
          paddingVertical: 14,
          paddingHorizontal: 26,
        },
        // Botão ghost: Minimalista, sem fundo
        ".btn-ghost": {
          backgroundColor: "transparent",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 28,
        },
        // Botão soft: Fundo suave, sem sombra
        ".btn-soft": {
          backgroundColor: "#FEF7F9",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 28,
        },
        // Botão pill: Arredondado completo (para CTAs pequenos)
        ".btn-pill": {
          backgroundColor: "#F8B4C4",
          borderRadius: 9999,
          paddingVertical: 12,
          paddingHorizontal: 24,
          shadowColor: "#F8B4C4",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 2,
        },
      });

      // ===================
      // INPUT STYLES - Premium Minimalista
      // ===================
      addUtilities({
        // Input base: Clean e elegante
        ".input-base": {
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#E8F0F5",
          paddingVertical: 16,
          paddingHorizontal: 18,
          fontSize: 15,
        },
        // Input focus: Azul pastel suave
        ".input-focus": {
          borderColor: "#7EC8E3",
          shadowColor: "#7EC8E3",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        // Input error: Vermelho suave
        ".input-error": {
          borderColor: "#F8B4C4",
          backgroundColor: "#FEF2F2",
        },
      });

      // ===================
      // ACCESSIBILITY
      // ===================
      addUtilities({
        // Minimum tap target (44pt iOS HIG)
        ".tap-target": {
          minWidth: 44,
          minHeight: 44,
        },
        ".tap-target-lg": {
          minWidth: 48,
          minHeight: 48,
        },
        // Screen reader only
        ".sr-only": {
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
        },
      });

      // ===================
      // LAYOUT HELPERS
      // ===================
      addUtilities({
        ".safe-top": {
          paddingTop: 44, // Will be overridden by useSafeAreaInsets
        },
        ".safe-bottom": {
          paddingBottom: 34, // Will be overridden by useSafeAreaInsets
        },
        ".center-content": {
          alignItems: "center",
          justifyContent: "center",
        },
        ".stack-vertical": {
          flexDirection: "column",
          gap: 16,
        },
        ".stack-horizontal": {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        },
      });

      // ===================
      // OVERLAY UTILITIES
      // ===================
      addUtilities({
        ".overlay-light": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
        ".overlay-medium": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
        ".overlay-dark": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        ".overlay-heavy": {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
        ".overlay-backdrop": {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
        },
      });

      // ===================
      // ANIMATION PRESETS (for use with react-native-reanimated)
      // ===================
      addUtilities({
        ".animate-preset-bounce": {
          // Marker class for bounce animation
        },
        ".animate-preset-fade": {
          // Marker class for fade animation
        },
        ".animate-preset-slide-up": {
          // Marker class for slide up animation
        },
        ".animate-preset-scale": {
          // Marker class for scale animation
        },
      });
    }),

    // ============================================
    // TYPOGRAPHY PLUGIN
    // ============================================
    plugin(({ addUtilities }) => {
      addUtilities({
        // Heading styles
        ".heading-hero": {
          fontFamily: "Manrope_700Bold",
          fontSize: 36,
          lineHeight: 40,
          letterSpacing: -0.72,
        },
        ".heading-1": {
          fontFamily: "Manrope_700Bold",
          fontSize: 30,
          lineHeight: 36,
          letterSpacing: -0.6,
        },
        ".heading-2": {
          fontFamily: "Manrope_600SemiBold",
          fontSize: 24,
          lineHeight: 32,
          letterSpacing: -0.48,
        },
        ".heading-3": {
          fontFamily: "Manrope_600SemiBold",
          fontSize: 20,
          lineHeight: 28,
          letterSpacing: -0.2,
        },
        ".heading-4": {
          fontFamily: "Manrope_600SemiBold",
          fontSize: 17,
          lineHeight: 24,
          letterSpacing: -0.17,
        },
        // Body styles
        ".body-large": {
          fontFamily: "Manrope_400Regular",
          fontSize: 17,
          lineHeight: 24,
        },
        ".body-base": {
          fontFamily: "Manrope_400Regular",
          fontSize: 15,
          lineHeight: 22,
        },
        ".body-small": {
          fontFamily: "Manrope_400Regular",
          fontSize: 13,
          lineHeight: 18,
        },
        // Caption/Label styles
        ".caption": {
          fontFamily: "Manrope_500Medium",
          fontSize: 11,
          lineHeight: 16,
          letterSpacing: 0.11,
        },
        ".label": {
          fontFamily: "Manrope_600SemiBold",
          fontSize: 13,
          lineHeight: 18,
          letterSpacing: 0.13,
        },
        ".overline": {
          fontFamily: "Manrope_700Bold",
          fontSize: 11,
          lineHeight: 16,
          letterSpacing: 0.55,
          textTransform: "uppercase",
        },
      });
    }),
  ],
};
