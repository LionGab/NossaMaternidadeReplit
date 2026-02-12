/**
 * Design Tokens 2026 - Nossa Maternidade
 * "Pink Clean + Blue Clean" - Cores vibrantes e Instagram-worthy
 *
 * FONTE UNICA DE VERDADE para cores, tipografia, espacamento.
 *
 * Principios:
 * - Blue Clean: Ceu limpo, agua cristalina, frescor digital
 * - Pink Clean: Flores frescas, blush natural, feminilidade moderna
 * - Paleta Instagram-worthy, perfeita para influenciadoras
 * - WCAG AAA por padrao, accessibility-first
 *
 * Hierarquia:
 * - brand.primary = Blue Clean (#1AB8FF) - sky blue vibrante
 * - brand.accent = Pink Clean (#FF5C94) - rosa fresco e moderno
 * - brand.secondary = Lilas suave (apoio)
 *
 * Tipografia:
 * - Display/Brand: Poppins (SemiBold 600 + Medium 500)
 * - Body/UI: System font (sem fontFamily no iOS; sans-serif no Android)
 * - Data: System font + fontVariant tabular-nums
 *
 * @see https://developer.apple.com/design/human-interface-guidelines
 * @see https://m3.material.io
 */

import { Platform } from "react-native";

// ===========================================
// BRAND TOKENS - Light Blue Clean (Flo + I Am inspired) ✨
// ===========================================

export const brand = {
  /**
   * Primary: Light Blue Clean ✨
   * - Transmite: serenidade, pureza, frescor, leveza absoluta
   * - Uso: superfícies, navegação, estrutura, elementos principais
   * - Inspiração: Flo, I Am, Calm - apps de wellness premium
   * - Paleta: Sky blue, powder blue, baby blue
   */
  primary: {
    50: "#F0F9FF", // Background principal - quase branco azulado ✨
    100: "#E0F2FE", // Cards, surfaces - azul claríssimo
    200: "#BAE6FD", // Borders sutis, destaques leves
    300: "#7DD3FC", // Elementos interativos hover
    400: "#38BDF8", // Accent principal (botões, links) ✨
    500: "#0EA5E9", // CTA principal - sky blue vibrante
    600: "#0284C7", // CTA hover/pressed
    700: "#0369A1", // Links, ícones ativos
    800: "#075985", // Textos sobre claro
    900: "#0C4A6E", // Headings
  },

  /**
   * Accent: Rosa Suave Premium ✨
   * - Transmite: feminilidade suave, acolhimento, ternura
   * - Uso: CTAs principais, badges especiais, "momentos de alegria"
   * - REGRA: usar pontualmente (máx 10-15% da tela)
   * - Inspiração: Flo - rosa coral soft
   */
  accent: {
    50: "#FFF1F3", // Background accent suave - quase branco rosado
    100: "#FFE4E9", // Highlight rosa - rosa muito claro
    200: "#FECDD6", // Border rosa - rosa pastel suave
    300: "#FDA4B8", // Hover - rosa pastel médio
    400: "#FB7196", // Active - rosa coral
    500: "#F43F68", // CTA PRINCIPAL - rosa vibrante ✨
    600: "#E11D50", // CTA pressed - rosa intenso
    700: "#BE123C", // CTA pressed darker
    800: "#9F1239", // Text accent
    900: "#881337", // Heading accent (raro)
  },

  /**
   * Secondary: Lilás/Roxo Suave
   * - Transmite: serenidade, introspecção, bem-estar
   * - Uso: elementos secundários, tags, badges, meditação
   */
  secondary: {
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7", // Principal
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
  },

  /**
   * Teal: Accent Secundário
   * - Transmite: saúde, natureza, bem-estar físico
   * - Uso: indicadores de saúde, progresso, badges especiais
   */
  teal: {
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
} as const;

// ===========================================
// NATH ACCENT TOKENS - Conteúdo exclusivo Nath
// Cores para Mundo da Nath, badges premium, highlights especiais
// ===========================================

export const nathAccent = {
  /**
   * Rose: Tom principal Nath/NAVA
   * - Uso: CTAs especiais, badges premium, Mundo da Nath
   * - Contraste: AA com texto dark (#1F2937)
   */
  rose: "#F4A5B8",
  roseLight: "#FAD4DE",
  roseDark: "#E88BA0",
  /** Rosa suave para estados de baixa energia */
  roseSoft: "#E8B4BC",

  /**
   * Coral: Tom vibrante para highlights
   * - Uso: Hover states, active elements, notifications
   * - Contraste: AA com texto dark
   */
  coral: "#FF6B6B",
  coralLight: "#FF9E9E",
  coralDark: "#E85555",

  /**
   * Close Friends: Paleta exclusiva para seção Close Friends
   * - Uso: Mundo da Nath, conteúdo exclusivo, badges premium
   */
  closeFriends: {
    purple: "#9B59B6",
    purpleDark: "#4A2060",
    purpleGradient: "#8E44AD",
    purpleLight: "#E8D4F0",
    purpleMuted: "#7B5D8F",
    purpleGray: "#5D4E6D",
    panelGlass: "rgba(255, 255, 255, 0.7)",
    badge: "rgba(155, 89, 182, 0.15)",
    border: "rgba(155, 89, 182, 0.2)",
  },
} as const;

// ===========================================
// MOCKUP COLORS - Paleta específica dos mockups HTML
// Rosa Suave + Azul Tiffany / Rosa Pétala + Azul Céu
// ===========================================

export const mockupColors = {
  /**
   * Rosa Suave - Tons dos mockups
   * - V4: Rosa Flor
   * - V5: Rosa Pétala
   * - V7: Rosa Suave
   */
  rosa: {
    petala: "#F8D4DC",
    suave: "#FFDDE5",
    blush: "#FFF5F7",
    claro: "#FFE4E8",
    flor: "#F8D4DC",
  },
  /**
   * Azul - Tons dos mockups
   * - V4: Azul Sereno
   * - V5: Azul Céu
   * - V7: Azul Tiffany
   */
  azul: {
    ceu: "#7BB8D8",
    sereno: "#A8C8E8",
    tiffany: "#81D4D8",
    lavanda: "#B8D4E8",
  },
  /**
   * Gradientes dos mockups
   */
  gradients: {
    background: ["#FEF8F9", "#F2FAFA"] as const,
    card: ["#FFFBFC", "#F8FDFD"] as const,
    cardBack: ["#E8F8F8", "#D8F0F0"] as const,
    cardMiddle: ["#FFF0F2", "#FFE8EC"] as const,
  },
} as const;

// ===========================================
// MATERNAL TOKENS - Auto-cuidado & Acolhimento
// Cores que transmitem: segurança, amor, cuidado, crescimento
// ===========================================

export const maternal = {
  /**
   * Acolhimento - Tons quentes que abraçam
   * Para momentos de conexão, boas-vindas, conforto
   */
  warmth: {
    blush: "#FFEEF2", // Abraço suave
    peach: "#FFE4D6", // Carinho maternal
    honey: "#FFF4E6", // Doçura, lar
    cream: "#FFFBF5", // Aconchego
  },

  /**
   * Serenidade - Tons que acalmam
   * Para meditação, respiração, momentos de paz
   */
  calm: {
    lavender: "#F5F0FF", // Tranquilidade
    mist: "#F0F7FF", // Clareza mental
    sage: "#F0FDF4", // Natureza, renovação
    cloud: "#F8FAFC", // Leveza
  },

  /**
   * Força - Tons que empoderam
   * Para conquistas, progresso, superação
   */
  strength: {
    rose: "#FCE7F3", // Força feminina
    coral: "#FFF1F0", // Energia positiva
    gold: "#FFFBEB", // Conquista, valor
    mint: "#ECFDF5", // Renovação, crescimento
  },

  /**
   * Conexão - Tons para momentos de vínculo
   * Para interações, comunidade, compartilhamento
   */
  bond: {
    heart: "#FDF2F8", // Amor incondicional
    nurture: "#FEF3F2", // Cuidado mútuo
    trust: "#EFF6FF", // Confiança
    together: "#F5F3FF", // Comunidade
  },

  /**
   * Jornada - Fases da maternidade
   * Cores específicas para cada momento
   */
  journey: {
    tentando: "#FFF7ED", // Esperança dourada
    gravidez: "#FDF4FF", // Magia lilás
    posNatal: "#FEF2F2", // Rosa acolhedor
    amamentacao: "#F0FDF4", // Verde nutritivo
    maternidade: "#FFF1F2", // Rosa maduro
  },

  /**
   * Autocuidado - Rituais e bem-estar
   */
  selfCare: {
    rest: "#F8F4FF", // Descanso
    hydrate: "#F0F9FF", // Água, frescor
    nourish: "#FFFBEB", // Nutrição
    move: "#ECFDF5", // Movimento
    breathe: "#F0FDFA", // Respiração
    reflect: "#FDF4FF", // Reflexão
  },

  /**
   * Respiração - Cores e gradientes para exercícios
   */
  breathing: {
    box: {
      color: "#60A5FA",
      bgColors: ["#DBEAFE", "#BFDBFE", "#93C5FD"] as const,
    },
    technique478: {
      bgColors: ["#EDE9FE", "#DDD6FE", "#C4B5FD"] as const,
    },
    calm: {
      bgColors: ["#DCFCE7", "#BBF7D0", "#86EFAC"] as const,
    },
  },

  /**
   * Gradientes maternais suaves (light backgrounds)
   */
  gradients: {
    embrace: ["#FFEEF2", "#FFF4E6", "#FFFBF5"] as const, // Abraço
    serenity: ["#F5F0FF", "#F0F7FF", "#F8FAFC"] as const, // Paz
    growth: ["#ECFDF5", "#F0FDF4", "#FFFBEB"] as const, // Crescimento
    love: ["#FDF2F8", "#FCE7F3", "#FFF1F2"] as const, // Amor
    journey: ["#FFF7ED", "#FDF4FF", "#FEF2F2"] as const, // Jornada
  },

  /**
   * Gradientes para Stories/Onboarding (dark immersive)
   * Cada etapa tem sua própria atmosfera
   */
  stories: {
    welcome: ["#1A1A2E", "#16213E", "#0F3460"] as const, // Noite acolhedora
    moment: ["#2D1B4E", "#462B7C", "#5B3A9B"] as const, // Lilás introspectivo
    date: ["#3D2B54", "#5C3D7A", "#7B4F9F"] as const, // Roxo mágico
    objectives: ["#1E3A5F", "#2E5A8F", "#3E7ABF"] as const, // Azul sereno
    emotional: ["#4A2040", "#6B3060", "#8C4080"] as const, // Rosa profundo
    checkIn: ["#1F4E5F", "#2F6E8F", "#3F8EAF"] as const, // Azul teal
    reward: ["#0D0D0D", "#1A1A1A", "#2D2D2D"] as const, // Premium escuro
  },
} as const;

// ===========================================
// CLEAN DESIGN TOKENS - Ultra-Clean Flo/I Am Style ✨
// ===========================================

export const cleanDesign = {
  /**
   * Flo Clean Pink Palette
   * Rosa pastel dominante - inspirado em Flo Health
   */
  pink: {
    50: "#FFF5F7", // Background principal (rosa muito claro)
    100: "#FFE4EC", // Cards, surfaces
    200: "#FFD0E0", // Borders sutis
    300: "#FFB6C1", // Shadows
    400: "#FF8FA8", // Accent light
    500: "#FF6B8A", // CTA principal
    600: "#E5526F", // CTA pressed
  },

  /**
   * Gradientes Flo Clean (rosa)
   * Suaves e aconchegantes
   */
  gradients: {
    /** Background principal - rosa suave */
    background: ["#FFF5F7", "#FFE4EC", "#FFFFFF"] as const,
    /** Hero suave - toque de rosa */
    hero: ["#FFF5F7", "#FFE4EC", "#FFFFFF"] as const,
    /** Card highlight */
    cardHighlight: ["#FFFFFF", "#FFF5F7"] as const,
    /** Rosa sereno */
    sky: ["#FFF5F7", "#FFE4EC", "#FFD0E0"] as const,
  },

  /**
   * Sombras Rosadas (Flo Clean style)
   * @deprecated Use shadows.flo instead (unified shadow system)
   * This is kept for backward compatibility - prefer using shadows.flo directly
   * @see shadows.flo for the canonical pink shadow definitions
   */
  shadows: {
    /** @deprecated Use shadows.flo.minimal */
    get minimal() {
      return {
        shadowColor: "#FFB6C1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 1,
      };
    },
    /** @deprecated Use shadows.flo.soft */
    get soft() {
      return {
        shadowColor: "#FFB6C1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 2,
      };
    },
    /** @deprecated Use shadows.flo.cta */
    get cta() {
      return {
        shadowColor: "#FF6B8A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 4,
      };
    },
  },

  /**
   * Cards Ultra-Clean
   */
  card: {
    background: "#FFFFFF",
    border: "#FFE4EC",
    borderRadius: 24,
    padding: 24,
  },

  /**
   * Spacing Generoso (estilo Flo)
   * Mais whitespace = mais premium
   */
  spacing: {
    screenPadding: 28,
    sectionGap: 32,
    cardPadding: 24,
    elementGap: 16,
  },
} as const;

// ===========================================
// SURFACE TOKENS - Superfícies e Backgrounds
// ===========================================

export const surface = {
  light: {
    /** Base: Light blue clean (Flo style) */
    base: "#F8FCFF",
    /** Cards: branco puro */
    card: "#FFFFFF",
    /** Elevated: cards com elevação */
    elevated: "#FFFFFF",
    /** Tertiary: separadores, dividers - azul sutil */
    tertiary: "#F0F9FF",
    /** Subtle: superfícies neutras sutis */
    subtle: "#F9FAFB",
    /** Muted: superfícies de apoio */
    muted: "#F3F4F6",
    /** Soft: background alternativo suave - azul claríssimo */
    soft: "#F0F9FF",
    /** Accent soft: highlights rosados discretos */
    accentSoft: "rgba(244, 63, 104, 0.08)",
    /** Accent medium: highlights rosados de média intensidade */
    accentMedium: "rgba(244, 63, 104, 0.15)",
    /** Overlay: modais, sheets */
    overlay: "rgba(0, 0, 0, 0.4)",
    /** Glass: elementos com blur - toque de azul */
    glass: "rgba(240, 249, 255, 0.92)",
    /** Card com transparência */
    cardAlpha: "rgba(255, 255, 255, 0.97)",
  },
  dark: {
    /** Base: Blue Clean escuro (não preto puro - OLED friendly) */
    base: "#0A1520",
    /** Cards: elevação 1 */
    card: "#0F1E2D",
    /** Elevated: elevação 2 */
    elevated: "#15283A",
    /** Tertiary: separadores */
    tertiary: "#1F3A4F",
    /** Subtle: superfícies quase transparentes */
    subtle: "rgba(255, 255, 255, 0.02)",
    /** Muted: superfícies de apoio dark */
    muted: "rgba(255, 255, 255, 0.04)",
    /** Elevated soft: cards dark levemente elevados */
    elevatedSoft: "rgba(255, 255, 255, 0.06)",
    /** Elevated medium: cards dark com mais destaque */
    elevatedMedium: "rgba(255, 255, 255, 0.08)",
    /** Accent soft: destaque rosado discreto em dark */
    accentSoft: "rgba(244, 63, 104, 0.15)",
    /** Accent medium: destaque rosado médio em dark */
    accentMedium: "rgba(244, 63, 104, 0.2)",
    /** Accent strong: destaque rosado forte em dark */
    accentStrong: "rgba(244, 63, 104, 0.3)",
    /** Secondary soft: destaque roxo discreto em dark */
    secondarySoft: "rgba(168, 85, 247, 0.15)",
    /** Overlay */
    overlay: "rgba(0, 0, 0, 0.7)",
    /** Glass */
    glass: "rgba(15, 30, 45, 0.72)",
    /** Card alpha */
    cardAlpha: "rgba(15, 30, 45, 0.95)",
  },
} as const;

// ===========================================
// GLASS TOKENS - Glassmorphism helpers
// ===========================================

export const glass = {
  light: {
    ultraLight: "rgba(255, 255, 255, 0.7)",
    soft: "rgba(255, 255, 255, 0.8)",
    medium: "rgba(255, 255, 255, 0.9)",
    strong: "rgba(255, 255, 255, 0.95)",
    border: "rgba(255, 255, 255, 0.6)",
  },
  dark: {
    subtle: "rgba(255, 255, 255, 0.02)",
    ultraLight: "rgba(255, 255, 255, 0.04)",
    light: "rgba(255, 255, 255, 0.06)",
    medium: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.1)",
    heavy: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.12)",
    text60: "rgba(255, 255, 255, 0.6)",
    text80: "rgba(255, 255, 255, 0.8)",
    text90: "rgba(255, 255, 255, 0.9)",
  },
} as const;

// ===========================================
// TEXT TOKENS - Hierarquia de Texto
// ===========================================

export const text = {
  light: {
    /** Primary: títulos, headings (contraste ~14:1) */
    primary: "#1F2937",
    /** Secondary: corpo de texto (contraste ~5.5:1) */
    secondary: "#6B7280",
    /** Tertiary: hints, placeholders (contraste ~3.5:1) */
    tertiary: "#9CA3AF",
    /** Muted: disabled/decorative text (contraste ~2.2:1 — legivel mas suave) */
    muted: "#B0B8C1",
    /** Inverse: texto em fundo escuro */
    inverse: "#F9FAFB",
    /** Accent: texto rosa (links CTA) */
    accent: "#FF5C94",
    /** Link: texto azul (links normais) */
    link: "#007ACC",
  },
  dark: {
    primary: "#F3F5F7",
    secondary: "#9DA8B4",
    tertiary: "#7D8B99",
    muted: "#5C6B7A",
    inverse: "#1F2937",
    accent: "#FF7AA8",
    link: "#4AC8FF",
  },
} as const;

// ===========================================
// SEMANTIC TOKENS - Feedback do Sistema
// ===========================================

export const semantic = {
  light: {
    success: "#10B981",
    successLight: "#D1FAE5",
    successText: "#065F46",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    warningVeryLight: "#FFFBEB",
    warningText: "#92400E",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    errorBorder: "rgba(239, 68, 68, 0.3)",
    errorText: "#B91C1C",
    info: "#3B82F6",
    infoLight: "#DBEAFE",
    infoText: "#1E40AF",
  },
  dark: {
    success: "#34D399",
    successLight: "rgba(16, 185, 129, 0.15)",
    successBorder: "rgba(16, 185, 129, 0.3)",
    successText: "#A7F3D0",
    warning: "#FBBF24",
    warningLight: "rgba(245, 158, 11, 0.15)",
    warningBorder: "rgba(245, 158, 11, 0.3)",
    warningIconBg: "rgba(245, 158, 11, 0.25)",
    warningButtonBg: "rgba(245, 158, 11, 0.2)",
    warningButtonBorder: "rgba(245, 158, 11, 0.4)",
    warningText: "#FDE68A",
    error: "#F87171",
    errorLight: "rgba(239, 68, 68, 0.15)",
    errorBorder: "rgba(239, 68, 68, 0.3)",
    errorText: "#FECACA",
    info: "#60A5FA",
    infoLight: "rgba(59, 130, 246, 0.15)",
    infoText: "#BFDBFE",
  },
} as const;

// ===========================================
// NEUTRAL TOKENS - Tons Neutros
// ===========================================

export const neutral = {
  0: "#FFFFFF",
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
  950: "#0A0E13",
} as const;

// ===========================================
// FEELING TOKENS - Check-in Emocional
// ===========================================

export const feeling = {
  /** Bem/Feliz - Amarelo pastel (sol) */
  bem: {
    color: "#FFE4B5",
    active: "#FFEFC7",
    icon: "#F59E0B",
  },
  /** Cansada - Azul pastel (nuvem) */
  cansada: {
    color: "#BAE6FD",
    active: "#D4E9FD",
    icon: "#60A5FA",
  },
  /** Indisposta - Lavanda (chuva) */
  indisposta: {
    color: "#DDD6FE",
    active: "#EDE9FE",
    icon: "#A855F7",
  },
  /** Amada - Rosa (coração) */
  amada: {
    color: "#FFD0E0",
    active: "#FFE5ED",
    icon: "#FF5C94",
  },
  /** Ansiosa - Coral (urgência suave) */
  ansiosa: {
    color: "#FED7AA",
    active: "#FFE4C7",
    icon: "#F97316",
  },
  /** Enjoada - Lavanda (indisposição) - alias for indisposta */
  enjoada: {
    color: "#DDD6FE",
    active: "#EDE9FE",
    icon: "#A855F7",
  },
} as const;

// ===========================================
// TYPOGRAPHY TOKENS - Unified Typography Hierarchy
// ===========================================
/**
 * Typography Hierarchy (UNIFIED SYSTEM)
 *
 * Nossa Maternidade uses a dual font system for premium feel:
 *
 * FONTS:
 * - DMSerifDisplay (serif):  Display/hero text only, elegant & refined
 * - Manrope (sans-serif):    Everything else - UI, body, labels
 *
 * WEIGHT HIERARCHY (strict rules):
 * ┌─────────────────┬────────┬───────────────────────────────────────┐
 * │ Style           │ Weight │ When to use                           │
 * ├─────────────────┼────────┼───────────────────────────────────────┤
 * │ Display         │ 400    │ Hero titles (use DMSerifDisplay font) │
 * │ Headline (H1)   │ 700    │ Page titles, main sections            │
 * │ Headline (H2)   │ 600    │ Section headers                       │
 * │ Headline (H3)   │ 600    │ Subsection headers                    │
 * │ Title           │ 600    │ Card titles, subtitles                │
 * │ Body            │ 400    │ Paragraphs, descriptions              │
 * │ Body Emphasis   │ 500    │ Inline emphasis, important text       │
 * │ Label           │ 600    │ Buttons, tags, input labels           │
 * │ Caption         │ 400    │ Small text, hints, timestamps         │
 * └─────────────────┴────────┴───────────────────────────────────────┘
 *
 * USAGE EXAMPLES:
 *
 * @example Hero/Display title (serif)
 * <Text style={{ fontFamily: typography.fontFamily.display, ...typography.displayLarge }}>
 *   Bem-vinda, mamãe
 * </Text>
 *
 * @example H1 title (sans-serif bold)
 * <Text style={{ fontFamily: typography.fontFamily.bold, ...typography.headlineLarge }}>
 *   Configurações
 * </Text>
 *
 * @example Body text
 * <Text style={{ fontFamily: typography.fontFamily.base, ...typography.bodyMedium }}>
 *   Sua jornada começa aqui...
 * </Text>
 *
 * @example Button label
 * <Text style={{ fontFamily: typography.fontFamily.semibold, ...typography.labelLarge }}>
 *   Continuar
 * </Text>
 */

export const typography = {
  /**
   * Sistema Dual de Fontes - Design de Alto Padrão
   *
   * Sans-serif (UI/Body): Manrope
   * - Geometric sans-serif moderna e amigável
   * - Excelente legibilidade em mobile
   * - Uso: Body text, UI elements, labels, botões
   *
   * Serif (Display/Headlines): DMSerifDisplay
   * - Elegant serif clássico para títulos
   * - Personalidade refinada e premium
   * - Uso: ONLY for display/hero text (large decorative titles)
   */
  fontFamily: {
    // ===== POPPINS (Display/Brand) - Headlines + CTAs =====
    /** SemiBold (600) - H1, H2 headlines, display titles */
    poppinsDisplay: "Poppins_600SemiBold",
    /** Medium (500) - Buttons, labels, brand elements */
    poppinsLabel: "Poppins_500Medium",

    // ===== SYSTEM FONT (Body/UI) - Maximum legibility =====
    /** System default - body text, descriptions (best native rendering) */
    system: Platform.select({ android: "sans-serif", default: undefined }),
    /** System medium - body emphasis */
    systemMedium: Platform.select({ android: "sans-serif-medium", default: undefined }),

    // ===== MANROPE (Legacy sans-serif) - Kept for backward compat =====
    /** Regular (400) - body text, descriptions */
    base: "Manrope_400Regular",
    /** Medium (500) - body emphasis, important inline text */
    medium: "Manrope_500Medium",
    /** Semibold (600) - headlines H2/H3, titles, labels, buttons */
    semibold: "Manrope_600SemiBold",
    /** Bold (700) - H1 headlines, page titles */
    bold: "Manrope_700Bold",
    /** ExtraBold (800) - RARE: only for extreme emphasis */
    extrabold: "Manrope_800ExtraBold",

    // ===== LEGACY ALIASES (for compatibility) =====
    sans: "Manrope_400Regular",
    sansMedium: "Manrope_500Medium",
    sansSemibold: "Manrope_600SemiBold",
    sansBold: "Manrope_700Bold",

    // ===== SERIF (DMSerifDisplay) - Display text only =====
    /** Serif for display/hero titles - elegant, premium feel */
    serif: "DMSerifDisplay_400Regular",
    /** Alias for serif - use for large decorative titles */
    display: "DMSerifDisplay_400Regular",
  },

  /**
   * Cross-platform letterSpacing helper.
   * iOS handles negative letterSpacing well; Android can break kerning.
   */
  letterSpacing: {
    /** Tight - display/headlines (iOS: -0.5, Android: -0.2) */
    tight: Platform.select({ ios: -0.5, default: -0.2 }),
    /** Normal - body text */
    normal: 0,
    /** Wide - labels, buttons (iOS: 0.3, Android: 0.5) */
    wide: Platform.select({ ios: 0.3, default: 0.5 }),
  },

  // ===== DISPLAY STYLES (use with fontFamily.poppinsDisplay) =====
  /** Hero titles, splash screens - FONT: Poppins SemiBold */
  displayLarge: { fontSize: 28, lineHeight: 34, fontWeight: "600" as const },
  /** Section hero, onboarding titles - FONT: Poppins SemiBold */
  displayMedium: { fontSize: 24, lineHeight: 30, fontWeight: "600" as const },
  /** Card hero titles - FONT: Poppins SemiBold */
  displaySmall: { fontSize: 22, lineHeight: 28, fontWeight: "600" as const },

  // ===== HEADLINE STYLES (use with fontFamily.bold/semibold) =====
  /** H1 - Page titles, main sections - WEIGHT: 700 (bold) */
  headlineLarge: { fontSize: 22, lineHeight: 28, fontWeight: "700" as const },
  /** H2 - Section headers - WEIGHT: 600 (semibold) */
  headlineMedium: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  /** H3 - Subsection headers - WEIGHT: 600 (semibold) */
  headlineSmall: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },

  // ===== TITLE STYLES (use with fontFamily.semibold) =====
  /** Card titles, dialog titles - WEIGHT: 600 (semibold) */
  titleLarge: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  /** Subtitle, list item titles - WEIGHT: 600 (semibold) */
  titleMedium: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
  /** Small titles, compact cards - WEIGHT: 600 (semibold) */
  titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },

  // ===== BODY STYLES (use with fontFamily.base/medium) =====
  /** Large body text, featured descriptions - WEIGHT: 400 (regular) */
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  /** Default body text, paragraphs - WEIGHT: 400 (regular) */
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  /** Compact body, secondary text - WEIGHT: 400 (regular) */
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  /** Emphasized body text - WEIGHT: 500 (medium) - use for inline emphasis */
  bodyEmphasis: { fontSize: 15, lineHeight: 22, fontWeight: "500" as const },

  // ===== LABEL STYLES (use with fontFamily.semibold) =====
  /** Button text, large labels - WEIGHT: 600 (semibold) */
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },
  /** Form labels, tags - WEIGHT: 600 (semibold) */
  labelMedium: { fontSize: 13, lineHeight: 18, fontWeight: "600" as const },
  /** Small labels, badges - WEIGHT: 600 (semibold) */
  labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: "600" as const },

  // ===== CAPTION STYLES (use with fontFamily.system) =====
  /** Captions, hints, timestamps - WEIGHT: 400 (regular) */
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },

  // ===== DATA STYLES (use with fontFamily.system + tabular-nums) =====
  /** Large metrics, stats - system font with tabular figures */
  dataLarge: { fontSize: 24, lineHeight: 30, fontWeight: "600" as const },
  /** Default data display, counters - system font with tabular figures */
  dataMedium: { fontSize: 16, lineHeight: 22, fontWeight: "500" as const },
  /** Compact data, timestamps, badges - system font with tabular figures */
  dataSmall: { fontSize: 13, lineHeight: 18, fontWeight: "500" as const },
} as const;

// ===========================================
// SPACING TOKENS (8pt Grid)
// ===========================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  "7xl": 80,
  "8xl": 96,
} as const;

// ===========================================
// RADIUS TOKENS
// ===========================================

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  full: 9999,
} as const;

// ===========================================
// SHADOW TOKENS - Unified Shadow Hierarchy
// ===========================================
/**
 * Shadow Hierarchy (UNIFIED SYSTEM)
 *
 * Use this guide for consistent shadow usage:
 *
 * NEUTRAL SHADOWS (for general UI):
 * - none:   No shadow (flat elements)
 * - sm:     Subtle depth (text inputs, small cards)
 * - md:     Standard depth (cards, elevated surfaces)
 * - lg:     Strong depth (modals, sheets)
 * - xl:     Maximum depth (floating actions, overlays)
 *
 * ACCENT/GLOW SHADOWS (for CTAs and highlights):
 * - accentGlow:     Pink glow for primary CTAs
 * - glow(color):    Custom color glow (use sparingly)
 *
 * FLO CLEAN SHADOWS (pink-tinted for floClean preset):
 * - flo.minimal:    Very subtle pink (dividers, subtle cards)
 * - flo.soft:       Soft pink (standard cards)
 * - flo.elevated:   Medium pink (elevated cards)
 * - flo.cta:        Strong pink (buttons, CTAs)
 *
 * @example
 * // Neutral shadow for card
 * style={shadows.md}
 *
 * // Pink shadow for floClean preset
 * style={shadows.flo.soft}
 *
 * // Glow for accent button
 * style={shadows.accentGlow}
 */

export const shadows = {
  // ===== NEUTRAL SHADOWS =====
  /** No shadow - flat elements */
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Subtle depth - text inputs, small cards, subtle elevation */
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  /** Standard depth - cards, elevated surfaces */
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  /** Strong depth - modals, sheets, dropdowns */
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  /** Maximum depth - floating actions, overlays */
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },

  // ===== ACCENT/GLOW SHADOWS =====
  /** Custom color glow - use for special highlights */
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  }),
  /** Pink glow for primary CTAs (accent color) */
  accentGlow: {
    shadowColor: "#FF5C94",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  // ===== FLO CLEAN SHADOWS (Pink-tinted) =====
  /**
   * Flo Clean preset shadows - pink-tinted for warm, maternal feel
   * Use these when presetMode === 'floClean'
   */
  flo: {
    /** Minimal pink shadow - dividers, very subtle cards */
    minimal: {
      shadowColor: "#FFB6C1",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 1,
    },
    /** Soft pink shadow - standard cards in floClean mode */
    soft: {
      shadowColor: "#FFB6C1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 2,
    },
    /** Elevated pink shadow - elevated cards, prominent elements */
    elevated: {
      shadowColor: "#FFB6C1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 4,
    },
    /** CTA pink shadow - buttons, action elements */
    cta: {
      shadowColor: "#FF6B8A",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 4,
    },
    /** Button pink shadow - strong emphasis for floClean buttons */
    button: {
      shadowColor: "#FF6B8A",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 6,
    },
  },

  // ===== LEGACY ALIASES (for backward compatibility) =====
  /** @deprecated Use shadows.flo instead */
  floClean: {
    card: {
      shadowColor: "#FFB6C1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 4,
    },
    button: {
      shadowColor: "#FF6B8A",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 6,
    },
  },
} as const;

// ===========================================
// BORDER TOKENS - Unified Border Hierarchy
// ===========================================
/**
 * Border Hierarchy
 *
 * - subtle:   Barely visible dividers, section separators
 * - default:  Standard card borders, input borders
 * - strong:   Emphasized borders, focus states
 * - accent:   Accent color borders (pink)
 * - primary:  Primary color borders (blue)
 *
 * @example
 * // Use with theme hook for mode-aware borders
 * const { border } = useTheme();
 * borderColor: border.subtle
 */
export const border = {
  light: {
    /** Barely visible - dividers, section separators */
    subtle: neutral[200],
    /** Standard - card borders, input borders */
    default: neutral[300],
    /** Emphasized - focus states, strong separation */
    strong: neutral[400],
    /** Accent color - pink highlights */
    accent: brand.accent[200],
    /** Primary color - blue highlights */
    primary: brand.primary[200],
  },
  dark: {
    /** Barely visible - dividers */
    subtle: "#2A3A4A",
    /** Standard - card borders */
    default: "#3A4A5A",
    /** Emphasized - focus states */
    strong: "#4A5A6A",
    /** Accent color - pink highlights */
    accent: brand.accent[400],
    /** Primary color - blue highlights */
    primary: brand.primary[400],
  },
} as const;

// ===========================================
// GRADIENT TOKENS
// ===========================================

export const gradients = {
  // Brand gradients
  primary: [brand.primary[500], brand.primary[600]] as const,
  primarySoft: [brand.primary[50], brand.primary[100]] as const,
  accent: [brand.accent[300], brand.accent[400]] as const, // Cores mais suaves
  accentVibrant: [brand.accent[400], brand.accent[500]] as const, // Versão vibrante
  accentSoft: [brand.accent[50], brand.accent[100]] as const,
  secondary: [brand.secondary[400], brand.secondary[500]] as const,
  secondarySoft: [brand.secondary[50], brand.secondary[100]] as const,

  // Hero backgrounds
  heroLight: [brand.primary[50], "#FFFFFF", brand.primary[100]] as const,
  heroAccent: [brand.accent[50], "#FFFFFF", brand.primary[50]] as const,
  heroWarm: [brand.accent[50], "#FFF9F3", brand.primary[50]] as const,

  // Mood gradients
  calm: [brand.primary[100], brand.primary[50], "#FFFFFF"] as const,
  warmth: [brand.accent[100], brand.accent[50], "#FFFFFF"] as const,
  serenity: [brand.secondary[100], brand.secondary[50], "#FFFFFF"] as const,

  // Additional hero backgrounds
  warm: [brand.accent[50], "#FFF9F3", brand.primary[50]] as const,
  cool: [brand.primary[100], brand.primary[50], "#FFFFFF"] as const,
  sunset: ["#FDE68A", "#FBBF24", "#F59E0B"] as const,

  // NathIA Onboarding gradient
  nathiaOnboarding: [brand.accent[400], brand.accent[500]] as const,

  // Glass/Overlay
  glass: ["rgba(255,255,255,0.8)", "rgba(247,251,253,0.4)"] as const,
  overlay: ["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)"] as const,

  // Affirmations gradients (for affirmation cards/backgrounds)
  affirmations: {
    oceano: ["#1E3A8A", "#3B82F6", "#60A5FA"] as const,
    ametista: ["#4C1D95", "#7C3AED", "#A78BFA"] as const,
    lavanda: ["#6B21A8", "#A855F7", "#C4B5FD"] as const,
    poente: ["#9A3412", "#EA580C", "#FDBA74"] as const,
    floresta: ["#166534", "#22C55E", "#86EFAC"] as const,
    nuvem: ["#1E40AF", "#60A5FA", "#BFDBFE"] as const,
    coral: ["#9F1239", "#FB7185", "#FECDD3"] as const,
    amanhecer: ["#B45309", "#FBBF24", "#FEF3C7"] as const,
    noite: ["#312E81", "#4F46E5", "#818CF8"] as const,
    esperanca: ["#0F766E", "#14B8A6", "#99F6E4"] as const,
  },

  // Cycle gradients (for menstrual cycle phases)
  cycle: {
    menstrual: ["#F43F5E", "#FB7185"] as const,
    follicular: ["#60A5FA", "#93C5FD"] as const,
    ovulation: ["#34D399", "#6EE7B7"] as const,
    luteal: ["#FBBF24", "#FDE68A"] as const,
    fertile: ["#A78BFA", "#C4B5FD"] as const, // Lilac for fertile window
  },
} as const;

// ===========================================
// ANIMATION TOKENS
// ===========================================

export const animation = {
  duration: {
    instant: 80,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
    glow: 1500,
    particle: 2000,
  },
  easing: {
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    spring: { damping: 15, stiffness: 150 },
    springSnappy: { damping: 12, stiffness: 200 },
    springBouncy: { damping: 8, stiffness: 180 },
  },
} as const;

// ===========================================
// MICRO-INTERACTION TOKENS
// ===========================================

export const micro = {
  /** Escala quando pressionado (0.97 = 3% menor) */
  pressScale: 0.97,
  /** Escala no hover/focus */
  hoverScale: 1.02,
  /** Escala para pop/destaque */
  popScale: 1.15,
  /** Distância de float para partículas (px) */
  floatDistance: 10,
  /** Ângulo de tilt sutil (graus) */
  tiltAngle: 3,
  /** Opacidade de glow */
  glow: {
    min: 0.3,
    max: 0.7,
  },
  /** Delay entre itens em stagger (ms) */
  staggerDelay: 50,
} as const;

// ===========================================
// ACCESSIBILITY TOKENS
// ===========================================

export const accessibility = {
  minTapTarget: 44,
  contrastRatioAA: 4.5,
  contrastRatioAAA: 7,
  minTouchSpacing: 8,
} as const;

// ===========================================
// COMPONENT STYLE TOKENS
// ===========================================

export const components = {
  // Button Primary: ROSA (CTA principal)
  buttonPrimary: {
    backgroundColor: brand.accent[500],
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    minHeight: accessibility.minTapTarget,
  },

  // Button Secondary: AZUL outline
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: brand.primary[500],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    minHeight: accessibility.minTapTarget,
  },

  // Button Ghost: sem fundo
  buttonGhost: {
    backgroundColor: "transparent",
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: accessibility.minTapTarget,
  },

  // Card: fundo branco com sombra suave
  card: {
    backgroundColor: surface.light.card,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    ...shadows.md,
  },

  // Card Outlined: borda sutil
  cardOutlined: {
    backgroundColor: surface.light.card,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: neutral[200],
    padding: spacing["2xl"],
  },

  // Input
  input: {
    backgroundColor: neutral[50],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral[200],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: accessibility.minTapTarget + 8,
  },

  // Chip
  chip: {
    backgroundColor: brand.primary[50],
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 32,
  },

  // Tab Bar
  tabBar: {
    backgroundColor: "rgba(240, 250, 255, 0.95)",
    borderTopWidth: 0.5,
    borderTopColor: brand.primary[200],
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    ...shadows.sm,
  },
} as const;

// ===========================================
// LAYOUT TOKENS
// ===========================================

export const layout = {
  screenPaddingHorizontal: spacing["2xl"],
  screenPaddingVertical: spacing["2xl"],
  sectionGap: spacing["4xl"],
  cardGap: spacing.lg,
  heroHeight: {
    small: 180,
    medium: 240,
    large: 320,
  },
} as const;

// ===========================================
// ELEVATION (z-index)
// ===========================================

export const elevation = {
  base: 0,
  raised: 1,
  overlay: 10,
  dropdown: 20,
  modal: 30,
  tooltip: 40,
  toast: 50,
} as const;

// ===========================================
// OVERLAY TOKENS
// ===========================================

export const overlay = {
  light: "rgba(0, 0, 0, 0.1)",
  lightInverted: "rgba(255, 255, 255, 0.1)",
  lightInvertedLight: "rgba(255, 255, 255, 0.08)",
  lightInvertedMedium: "rgba(255, 255, 255, 0.15)",
  lightInvertedVeryLight: "rgba(255, 255, 255, 0.05)",
  darkVeryLight: "rgba(0, 0, 0, 0.05)",
  medium: "rgba(0, 0, 0, 0.3)",
  mediumDark: "rgba(0, 0, 0, 0.4)",
  dark: "rgba(0, 0, 0, 0.5)",
  heavy: "rgba(0, 0, 0, 0.7)",
  backdrop: "rgba(0, 0, 0, 0.85)",
  cardHighlight: "rgba(255, 255, 255, 0.95)",
  semiWhite: "rgba(255, 255, 255, 0.5)",
  shimmer: "rgba(255, 255, 255, 0.3)",
  textShadow: "rgba(0, 0, 0, 0.15)",
  // Home screen decorative elements
  accentLight: "rgba(244, 63, 104, 0.08)",
  accentVeryLight: "rgba(244, 63, 104, 0.05)",
  secondaryLight: "rgba(168, 85, 247, 0.06)",
} as const;

// ===========================================
// ACCENT TOKENS - Alpha accent helpers
// ===========================================

export const accent = {
  light: {
    subtle: "rgba(244, 63, 104, 0.08)",
    soft: "rgba(244, 63, 104, 0.12)",
    medium: "rgba(244, 63, 104, 0.2)",
    strong: "rgba(244, 63, 104, 0.3)",
    secondaryVeryLight: "rgba(168, 85, 247, 0.06)",
    secondarySoft: "rgba(168, 85, 247, 0.15)",
  },
  dark: {
    subtle: "rgba(244, 63, 104, 0.1)",
    soft: "rgba(244, 63, 104, 0.15)",
    medium: "rgba(244, 63, 104, 0.2)",
    strong: "rgba(244, 63, 104, 0.3)",
    secondaryVeryLight: "rgba(168, 85, 247, 0.06)",
    secondarySoft: "rgba(168, 85, 247, 0.15)",
    secondarySubtle: "rgba(168, 85, 247, 0.05)",
    primarySoft: "rgba(56, 189, 248, 0.15)",
    primarySubtle: "rgba(56, 189, 248, 0.05)",
    warningSoft: "rgba(251, 191, 36, 0.15)",
    warningSubtle: "rgba(251, 191, 36, 0.05)",
    whiteSubtle: "rgba(255, 255, 255, 0.02)",
    whiteLight: "rgba(255, 255, 255, 0.04)",
    whiteSoft: "rgba(255, 255, 255, 0.06)",
    whiteMedium: "rgba(255, 255, 255, 0.08)",
    whiteStrong: "rgba(255, 255, 255, 0.1)",
    whiteHeavy: "rgba(255, 255, 255, 0.15)",
    whiteText60: "rgba(255, 255, 255, 0.6)",
    whiteText80: "rgba(255, 255, 255, 0.8)",
    whiteText90: "rgba(255, 255, 255, 0.9)",
    blackSubtle: "rgba(0, 0, 0, 0.02)",
    blackSoft: "rgba(0, 0, 0, 0.04)",
  },
} as const;

// ===========================================
// PREMIUM TOKENS - Dark Immersive Screens
// (Paywall, Premium features, Cinematic UI)
// ===========================================

export const premium = {
  /**
   * Premium Gradient Background
   * Soft, elegant gradient for luxurious feel
   * Used in: Paywall, Premium features
   */
  gradient: {
    top: "#1A1525",
    mid: "#251D35",
    bottom: "#2D2340",
    accent: "#3D2D55",
  },

  /**
   * Glow effects for premium screens
   * Rosa claro e azul pastel premium
   */
  glow: {
    accent: "rgba(248, 180, 196, 0.3)",
    secondary: "rgba(168, 221, 240, 0.25)",
    primary: "rgba(126, 200, 227, 0.25)",
  },

  /**
   * Aurora effects for cinematic screens (Login, onboarding)
   * Tons pastel suaves
   */
  aurora: {
    pink: "rgba(248, 180, 196, 0.35)",
    purple: "rgba(200, 180, 230, 0.3)",
    blue: "rgba(126, 200, 227, 0.3)",
  },

  /**
   * Input styles for dark premium screens
   */
  input: {
    background: "rgba(255, 255, 255, 0.06)",
    border: "rgba(255, 255, 255, 0.12)",
  },

  /**
   * Glass morphism for premium cards
   */
  glass: {
    ultraLight: "rgba(255, 255, 255, 0.06)",
    light: "rgba(255, 255, 255, 0.08)",
    base: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.2)",
    strong: "rgba(255, 255, 255, 0.25)",
    progressActive: "rgba(255, 255, 255, 0.95)",
    accentLight: "rgba(255, 92, 148, 0.15)",
    accentMedium: "rgba(255, 92, 148, 0.2)",
    dark: "rgba(0, 0, 0, 0.3)",
    // Legacy aliases
    background: "rgba(255, 255, 255, 0.08)",
    selected: "rgba(255, 92, 148, 0.15)",
    highlight: "rgba(255, 255, 255, 0.2)",
  },

  /**
   * Text colors on premium dark backgrounds
   */
  text: {
    primary: "#FFFFFF",
    bright: "rgba(255, 255, 255, 0.9)",
    secondary: "rgba(255, 255, 255, 0.8)",
    muted: "rgba(255, 255, 255, 0.7)",
    subtle: "rgba(255, 255, 255, 0.6)",
    disabled: "rgba(255, 255, 255, 0.5)",
    hint: "rgba(255, 255, 255, 0.4)",
    accent: brand.accent[400],
  },

  /**
   * CTA gradient for premium buttons
   */
  cta: {
    start: brand.accent[400],
    end: brand.accent[600],
  },

  /**
   * Special colors for premium UI
   */
  special: {
    success: "#34D399",
    gold: "#FCD34D",
    goldDark: "#D97706",
    crown: "#FCD34D",
  },
} as const;

// ===========================================
// STREAK/HABIT TOKENS
// ===========================================

export const streak = {
  /** Streak badge background (warm pink - Flo style) */
  background: "#FFF1F3",
  /** Streak flame icon color */
  icon: "#F43F5E",
  /** Streak text color */
  text: "#BE123C",
  /** Completion states (pink tones) */
  completion: {
    light: "#FECDD3",
    medium: "#FDA4AF",
    full: "#F43F5E",
  },
  /** Premium gradient for habits header (rosa - Flo style) */
  gradient: ["#F43F68", "#E11D48", "#BE123C"] as const,
} as const;

// ===========================================
// MOOD TOKENS (for emotion/mood tracking)
// ===========================================

export const mood = {
  happy: "#10B981",
  calm: "#6366F1",
  energetic: "#F59E0B",
  anxious: "#EF4444",
  sad: "#3B82F6",
  irritated: "#F97316",
  sensitive: "#EC4899",
  tired: "#8B5CF6",
} as const;

// ===========================================
// CYCLE PHASE COLORS (single colors for cycle tracking)
// ===========================================

export const cycleColors = {
  menstrual: "#F43F5E",
  follicular: "#60A5FA",
  ovulation: "#34D399",
  luteal: "#FBBF24",
  fertile: "#A78BFA",
} as const;

// ===========================================
// THEME HELPER - Resolve tokens por modo
// ===========================================

export type ThemeMode = "light" | "dark";

/**
 * Resolve todos os tokens para o modo especificado
 */
export const getThemeTokens = (mode: ThemeMode) => ({
  brand,
  surface: surface[mode],
  glass: glass[mode],
  accent: accent[mode],
  text: text[mode],
  semantic: semantic[mode],
  neutral,
  feeling,
  typography,
  spacing,
  radius,
  shadows,
  gradients,
  animation,
  accessibility,
  components,
  layout,
  elevation,
});

/**
 * Hook helper para usar com useTheme()
 */
export const resolveToken = <T>(lightValue: T, darkValue: T, isDark: boolean): T =>
  isDark ? darkValue : lightValue;

// ===========================================
// EXPORTS COMPATÍVEIS (backward compatibility)
// ===========================================

/**
 * @deprecated Use `brand` diretamente
 */
export const COLORS = {
  primary: brand.primary,
  secondary: brand.secondary,
  accent: brand.teal,
  neutral,
  background: {
    primary: "#F0FAFF",
    secondary: "#FFFFFF",
    tertiary: "#E0F4FF",
    warm: "#F0FAFF",
    card: "rgba(255, 255, 255, 0.96)",
    glass: "rgba(240, 250, 255, 0.85)",
  },
  text: {
    primary: text.light.primary,
    secondary: text.light.secondary,
    tertiary: text.light.tertiary,
    muted: text.light.muted,
    inverse: text.light.inverse,
  },
  semantic: {
    success: semantic.light.success,
    successLight: semantic.light.successLight,
    warning: semantic.light.warning,
    warningLight: semantic.light.warningLight,
    error: semantic.light.error,
    errorLight: semantic.light.errorLight,
    info: semantic.light.info,
    infoLight: semantic.light.infoLight,
  },
  feeling: {
    bem: feeling.bem.color,
    cansada: feeling.cansada.color,
    indisposta: feeling.indisposta.color,
    amada: feeling.amada.color,
  },
  mood: {
    happy: "#10B981",
    calm: "#6366F1",
    energetic: "#F59E0B",
    anxious: "#EF4444",
    sad: "#3B82F6",
    irritated: "#F97316",
    sensitive: "#EC4899",
    tired: "#8B5CF6",
  },
  legacyAccent: {
    sage: "#86EFAC",
    peach: "#FED7AA",
    sky: "#BAE6FD",
    lavender: "#DDD6FE",
    coral: "#FECACA",
  },
} as const;

export const COLORS_DARK = {
  primary: brand.primary,
  secondary: brand.secondary,
  accent: brand.teal,
  neutral: {
    0: "#0A1520",
    50: "#0F1E2D",
    100: "#15283A",
    200: "#1F3A4F",
    300: "#2A4A60",
    400: "#4A6A80",
    500: "#6A8A9F",
    600: "#8AAABF",
    700: "#AACADE",
    800: "#D0EAFF",
    900: "#F0FAFF",
  },
  background: {
    primary: "#0A1520",
    secondary: "#0F1E2D",
    tertiary: "#15283A",
    warm: "#0F1A25",
    card: "rgba(15, 30, 45, 0.95)",
    glass: "rgba(15, 30, 45, 0.72)",
  },
  text: text.dark,
  semantic: semantic.dark,
  feeling: {
    bem: "rgba(255, 228, 181, 0.2)",
    cansada: "rgba(26, 184, 255, 0.25)",
    indisposta: "rgba(167, 139, 250, 0.2)",
    amada: "rgba(255, 208, 224, 0.2)",
  },
  mood: COLORS.mood,
  legacyAccent: COLORS.legacyAccent,
} as const;

export const TYPOGRAPHY = typography;
export const SPACING = spacing;
export const RADIUS = radius;
export const SHADOWS = shadows;
export const GRADIENTS = gradients;

/**
 * CTA Primary Token
 * - Centraliza a cor do CTA para evitar hardcode em componentes.
 * - Não inclui cor de texto: use `useTheme().text.onAccent` (AAA no calmFemtech).
 */
export const ctaPrimary = {
  main: brand.accent[500], // F43F68 - CTA principal
  light: brand.accent[400], // FB7196 - Light state
  pressed: brand.accent[600], // E11D50 - Pressed state
} as const;

/**
 * Default Check-in Time
 * - Horário padrão para check-in diário da NathIA (notificação "oi, tudo bem?")
 * - Alinhado com copy do onboarding: "às 21h"
 * - Formato: HH:MM (24h)
 */
export const DEFAULT_CHECKIN_TIME = "21:00" as const;

/**
 * Tokens - Objeto agregado para fácil importação
 * Uso: import { Tokens } from '@/theme/tokens'
 */
export const Tokens = {
  brand,
  nathAccent,
  maternal,
  neutral,
  text,
  semantic,
  surface,
  glass,
  accent,
  gradients,
  ctaPrimary,
  DEFAULT_CHECKIN_TIME,
  typography,
  spacing,
  radius,
  shadows,
  border, // NEW: Unified border tokens
  feeling,
  animation,
  micro,
  accessibility,
  components,
  layout,
  elevation,
  overlay,
  premium,
  mood,
  streak,
  cycleColors,
  cleanDesign,
} as const;

// ===========================================
// TYPE EXPORTS - For better TypeScript DX
// ===========================================

/** All available neutral color shades */
export type NeutralShade = keyof typeof neutral;

/** All available overlay variants */
export type OverlayVariant = keyof typeof overlay;

/** All available spacing sizes */
export type SpacingSize = keyof typeof spacing;

/** All available radius sizes */
export type RadiusSize = keyof typeof radius;

/** All available semantic color categories */
export type SemanticCategory = keyof typeof semantic.light;
