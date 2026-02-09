#!/usr/bin/env node

/**
 * Auditoria de Acessibilidade Profunda v1.1
 *
 * Sistema completo de auditoria WCAG 2.2 + React Native 2025
 * Gera relatórios estruturados com fingerprints estáveis para CI
 *
 * @author Claude Code
 * @version 1.1.0
 */

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { glob } = require("glob");

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const CONFIG = {
  srcDir: path.resolve(__dirname, "../src"),
  outputDir: path.resolve(__dirname, "../docs"),
  baselineFile: path.resolve(__dirname, "../docs/a11y-baseline.json"),

  // Padrões de arquivo
  filePatterns: ["**/*.tsx", "**/*.jsx"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/*.test.*",
    "**/*.spec.*",
    "**/__tests__/**",
    "**/__mocks__/**",
    "**/coverage/**",
  ],

  // Componentes que já garantem a11y internamente (whitelist)
  // Esses componentes têm accessibilityLabel/Role/State definidos no componente
  exemptComponents: {
    AppPressable: ["accessibilityLabel"],
    IconButton: ["accessibilityLabel"],
    ThemedText: [], // Texto puro, não precisa de label
    Text: [], // Texto puro
    // Componentes customizados com a11y interna
    SocialButton: ["accessibilityLabel", "accessibilityRole", "accessibilityState"],
    CTAButton: ["accessibilityLabel", "accessibilityRole", "accessibilityState"],
    EmailInput: ["accessibilityLabel"],
    CommunityPostCard: ["accessibilityLabel"], // Wrapper para post cards
    HeroCard: ["accessibilityLabel"], // Hero section com CTA
    ProgressSection: ["accessibilityLabel"], // Progress indicator section
    FeatureCard: ["accessibilityLabel"], // Feature cards na home
    PressableScale: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // Pressable animado
    AnimatedPressable: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // Pressable animado
    DailyLogCard: ["accessibilityLabel"], // Card de registro diário
    CheckInCard: ["accessibilityLabel"], // Card de check-in
    HabitCard: ["accessibilityLabel"], // Card de hábito
    // Componentes UI base
    IconButton: ["accessibilityLabel", "accessibilityRole"],
    Card: ["accessibilityRole"], // Card pressable
    Input: ["accessibilityLabel"], // Input com label
    GlassButton: ["accessibilityLabel", "accessibilityRole"],
    StageCard: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // Onboarding stage card
    ConcernCard: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // Concern selection
    PlanCard: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // Paywall plan card
    QuickComposerCard: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // Quick composer
    NathIACenterButton: ["accessibilityLabel"], // Tab bar center button
    DateTimePicker: ["accessibilityLabel"], // Date picker
    PremiumCard: ["accessibilityLabel"], // Premium card
    // Componentes com a11y interna verificada (2025-12-30)
    QuickActionButton: ["accessibilityLabel", "accessibilityRole"], // QuickActionsBar.tsx L75-76
    MoodButton: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // EmotionalCheckInPrimary.tsx L125-127
    TypeButton: ["accessibilityLabel", "accessibilityRole", "accessibilityState"], // PostTypeSelector.tsx L102-104
  },

  // Tamanhos de tap target
  tapTargets: {
    wcag: 24, // WCAG 2.5.8 AA
    projectHig: 44, // iOS HIG / Projeto
  },

  // Exceções de cores permitidas
  colorExceptions: ["transparent", "inherit", "currentColor"],
};

// ============================================================================
// TIPOS E SCHEMA v1.1
// ============================================================================

/**
 * @typedef {'BLOCKER' | 'MAJOR' | 'MINOR'} Severity
 * @typedef {'A' | 'AA' | 'AAA' | 'BP'} WcagLevel
 * @typedef {'WCAG22' | 'PROJECT_HIG'} Standard
 * @typedef {'HIGH' | 'MEDIUM' | 'LOW'} Confidence
 * @typedef {'ios' | 'android' | 'web' | 'all'} Platform
 * @typedef {'NAME' | 'ROLE' | 'STATE' | 'TARGET' | 'CONTRAST' | 'MODAL' | 'IMAGE' | 'FORM' | 'MOTION'} Category
 */

/**
 * @typedef {Object} Location
 * @property {string} file
 * @property {number} line
 * @property {number} [column]
 */

/**
 * @typedef {Object} Finding
 * @property {string} fingerprint
 * @property {Location} location
 * @property {Severity} severity
 * @property {string} ruleId
 * @property {string} wcag
 * @property {WcagLevel} wcagLevel
 * @property {Standard} standard
 * @property {Platform} platform
 * @property {Confidence} confidence
 * @property {Category} category
 * @property {string} component
 * @property {string[]} props
 * @property {string} evidence
 * @property {string} message
 * @property {string} fix
 * @property {boolean} autofixable
 */

/**
 * @typedef {Object} CoverageStat
 * @property {number} count
 * @property {number} total
 * @property {number} percent
 */

/**
 * @typedef {Object} AuditReport
 * @property {'1.1'} version
 * @property {string} timestamp
 * @property {string} [baselineHash]
 * @property {Object} summary
 * @property {Finding[]} findings
 * @property {Finding[]} manualChecks
 * @property {number} filesAnalyzed
 * @property {number} componentsAnalyzed
 */

// ============================================================================
// PROPS INTERATIVOS E A11Y
// ============================================================================

const INTERACTIVE_PROPS = [
  "onPress",
  "onLongPress",
  "onPressIn",
  "onPressOut",
  "onAccessibilityTap",
  "onAccessibilityAction",
  "onMagicTap",
  "href",
  "onChange",
  "onValueChange",
];

const ACCESSIBILITY_LABEL_PROPS = [
  "accessibilityLabel",
  "aria-label",
  "accessibilityLabelledBy",
  "aria-labelledby",
];

const ACCESSIBILITY_ROLE_PROPS = ["role", "accessibilityRole"];

const DECORATIVE_MARKERS = [
  { prop: "accessible", value: false },
  { prop: "accessibilityElementsHidden", value: true },
  { prop: "importantForAccessibility", value: "no" },
  { prop: "importantForAccessibility", value: "no-hide-descendants" },
  { prop: "aria-hidden", value: true },
];

const IMAGE_COMPONENTS = ["Image", "FastImage", "ImageBackground", "SvgUri"];

const INPUT_COMPONENTS = ["TextInput", "Input", "TextField"];

const BUTTON_LIKE_COMPONENTS = [
  "Pressable",
  "TouchableOpacity",
  "TouchableHighlight",
  "TouchableWithoutFeedback",
  "TouchableNativeFeedback",
];

const MODAL_COMPONENTS = ["Modal", "BottomSheet", "ActionSheet", "Dialog"];

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Gera fingerprint estável para um finding
 */
function generateFingerprint(ruleId, file, component, evidence) {
  const normalized = `${ruleId}|${file}|${component}|${normalizeEvidence(evidence)}`;
  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

/**
 * Normaliza evidence removendo espaços e variações
 */
function normalizeEvidence(evidence) {
  return evidence.replace(/\s+/g, " ").replace(/["']/g, "").trim().slice(0, 100);
}

/**
 * Extrai nome do componente de um nó JSX
 */
function getComponentName(node) {
  if (t.isJSXIdentifier(node.openingElement?.name)) {
    return node.openingElement.name.name;
  }
  if (t.isJSXMemberExpression(node.openingElement?.name)) {
    const obj = node.openingElement.name.object.name || "";
    const prop = node.openingElement.name.property.name || "";
    return `${obj}.${prop}`;
  }
  return "Unknown";
}

/**
 * Verifica se um nó tem uma prop específica
 */
function hasProp(node, propName) {
  if (!node.openingElement?.attributes) return false;
  return node.openingElement.attributes.some((attr) => {
    if (t.isJSXAttribute(attr)) {
      return attr.name?.name === propName;
    }
    return false;
  });
}

/**
 * Obtém o valor de uma prop
 */
function getPropValue(node, propName) {
  if (!node.openingElement?.attributes) return undefined;

  const attr = node.openingElement.attributes.find((attr) => {
    if (t.isJSXAttribute(attr)) {
      return attr.name?.name === propName;
    }
    return false;
  });

  if (!attr) return undefined;

  if (t.isJSXAttribute(attr)) {
    const value = attr.value;
    if (t.isStringLiteral(value)) {
      return value.value;
    }
    if (t.isJSXExpressionContainer(value)) {
      if (t.isBooleanLiteral(value.expression)) {
        return value.expression.value;
      }
      if (t.isNumericLiteral(value.expression)) {
        return value.expression.value;
      }
      if (t.isStringLiteral(value.expression)) {
        return value.expression.value;
      }
      if (t.isIdentifier(value.expression)) {
        return `{${value.expression.name}}`;
      }
      if (t.isObjectExpression(value.expression)) {
        return extractObjectProps(value.expression);
      }
      return "{expression}";
    }
    // Boolean prop sem valor (ex: disabled)
    if (value === null) {
      return true;
    }
  }

  return undefined;
}

/**
 * Extrai propriedades de um ObjectExpression
 */
function extractObjectProps(objExpr) {
  const result = {};
  if (!t.isObjectExpression(objExpr)) return result;

  for (const prop of objExpr.properties) {
    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
      const key = prop.key.name;
      if (t.isNumericLiteral(prop.value)) {
        result[key] = prop.value.value;
      } else if (t.isStringLiteral(prop.value)) {
        result[key] = prop.value.value;
      } else if (t.isBooleanLiteral(prop.value)) {
        result[key] = prop.value.value;
      } else if (t.isIdentifier(prop.value)) {
        // Handle: { disabled: disabled }, { selected: isSelected }
        result[key] = `{${prop.value.name}}`;
      } else if (t.isUnaryExpression(prop.value)) {
        // Handle: { disabled: !!disabled }, { selected: !isDisabled }
        result[key] = "{expression}";
      } else if (t.isMemberExpression(prop.value)) {
        // Handle: { disabled: props.disabled }
        result[key] = "{expression}";
      } else if (t.isConditionalExpression(prop.value)) {
        // Handle: { disabled: loading ? true : disabled }
        result[key] = "{expression}";
      } else if (t.isBinaryExpression(prop.value)) {
        // Handle: { selected: selectedPlan === "monthly" }
        result[key] = "{expression}";
      }
    }
    // Handle shorthand: { disabled } (same as { disabled: disabled })
    if (t.isObjectProperty(prop) && prop.shorthand && t.isIdentifier(prop.key)) {
      result[prop.key.name] = `{${prop.key.name}}`;
    }
  }
  return result;
}

/**
 * Verifica se o componente é interativo
 */
function isInteractive(node) {
  return INTERACTIVE_PROPS.some((prop) => hasProp(node, prop));
}

/**
 * Verifica se tem spread de props de acessibilidade
 * Ex: {...a11yProps}, {...accessibilityProps}, {...buttonAccessibility(...)}
 */
function hasA11ySpread(node) {
  if (!node.openingElement?.attributes) return false;

  return node.openingElement.attributes.some((attr) => {
    if (t.isJSXSpreadAttribute(attr)) {
      // Verifica nome do identificador
      if (t.isIdentifier(attr.argument)) {
        const name = attr.argument.name || "";
        return /a11y|accessibility|accessible/i.test(name);
      }
      // Verifica chamada de função como buttonAccessibility(...)
      if (t.isCallExpression(attr.argument)) {
        const callee = attr.argument.callee;
        if (t.isIdentifier(callee)) {
          return /a11y|accessibility|accessible/i.test(callee.name);
        }
      }
    }
    return false;
  });
}

/**
 * Verifica se tem nome acessível válido
 */
function hasAccessibleName(node, hasTextDescendant) {
  // Primeiro verifica spread de props de a11y
  if (hasA11ySpread(node)) return true;

  return ACCESSIBILITY_LABEL_PROPS.some((prop) => hasProp(node, prop)) || hasTextDescendant;
}

/**
 * Verifica se está marcado como decorativo
 */
function isMarkedDecorative(node) {
  return DECORATIVE_MARKERS.some((marker) => {
    const value = getPropValue(node, marker.prop);
    return value === marker.value;
  });
}

/**
 * Verifica se tem role válido
 */
function hasValidRole(node) {
  return ACCESSIBILITY_ROLE_PROPS.some((prop) => hasProp(node, prop));
}

/**
 * Obtém todas as props de um nó
 */
function getAllProps(node) {
  if (!node.openingElement?.attributes) return [];

  return node.openingElement.attributes
    .filter((attr) => t.isJSXAttribute(attr))
    .map((attr) => attr.name?.name)
    .filter(Boolean);
}

/**
 * Extrai código fonte de um nó (evidence)
 */
function extractEvidence(code, node, maxLength = 200) {
  if (!node.start || !node.end) return "";

  let evidence = code.slice(node.start, Math.min(node.end, node.start + maxLength));

  // Remove quebras de linha excessivas
  evidence = evidence.replace(/\n\s*/g, " ").trim();

  if (node.end - node.start > maxLength) {
    evidence += "...";
  }

  return evidence;
}

/**
 * Verifica se um nó tem Text como descendente direto ou indireto
 */
function hasTextChild(node, code) {
  if (!node.children) return false;

  for (const child of node.children) {
    // Text direto
    if (t.isJSXText(child) && child.value.trim()) {
      return true;
    }

    // Elemento JSX
    if (t.isJSXElement(child)) {
      const childName = getComponentName(child);
      if (childName === "Text" || childName === "ThemedText") {
        return true;
      }
      // Recursivo
      if (hasTextChild(child, code)) {
        return true;
      }
    }

    // Expressão que pode ser texto
    if (t.isJSXExpressionContainer(child)) {
      if (t.isStringLiteral(child.expression) || t.isTemplateLiteral(child.expression)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Verifica se é uma cor hardcoded
 */
function isHardcodedColor(value) {
  if (typeof value !== "string") return false;

  // Exceções permitidas
  if (CONFIG.colorExceptions.includes(value.toLowerCase())) {
    return false;
  }

  // Hex colors
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
    return true;
  }

  // rgb/rgba
  if (/^rgba?\s*\(/.test(value)) {
    return true;
  }

  // hsl/hsla
  if (/^hsla?\s*\(/.test(value)) {
    return true;
  }

  // Named colors
  const namedColors = [
    "white",
    "black",
    "red",
    "blue",
    "green",
    "yellow",
    "gray",
    "grey",
    "orange",
    "purple",
    "pink",
  ];
  if (namedColors.includes(value.toLowerCase())) {
    return true;
  }

  return false;
}

/**
 * Analisa style prop para detectar tamanhos
 */
function analyzeStyleForSize(node) {
  const style = getPropValue(node, "style");
  if (typeof style !== "object") return null;

  const result = {
    width: style.width,
    height: style.height,
    minWidth: style.minWidth,
    minHeight: style.minHeight,
    padding: style.padding,
    paddingVertical: style.paddingVertical,
    paddingHorizontal: style.paddingHorizontal,
  };

  return result;
}

/**
 * Verifica se hitSlop está definido
 */
function hasHitSlop(node) {
  return hasProp(node, "hitSlop");
}

// ============================================================================
// REGRAS DE AUDITORIA
// ============================================================================

/**
 * @type {Object.<string, Function>}
 */
const RULES = {
  // ---------------------------------------------------------------------------
  // P0 — BLOCKER (WCAG A/AA + HIGH confidence)
  // ---------------------------------------------------------------------------

  /**
   * P0-NAME-001: Elemento interativo sem nome acessível
   */
  "P0-NAME-001": (node, context) => {
    const componentName = getComponentName(node);

    // Não é interativo? Skip
    if (!isInteractive(node)) return null;

    // Componente exempto?
    if (CONFIG.exemptComponents[componentName]) return null;

    // Já tem nome acessível?
    const hasTextDescendant = hasTextChild(node, context.code);
    if (hasAccessibleName(node, hasTextDescendant)) return null;

    // Marcado como decorativo?
    if (isMarkedDecorative(node)) return null;

    return {
      severity: "BLOCKER",
      ruleId: "P0-NAME-001",
      wcag: "4.1.2",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "HIGH",
      category: "NAME",
      component: componentName,
      props: getAllProps(node),
      message: `Elemento interativo <${componentName}> sem nome acessível (accessibilityLabel, aria-label, ou Text descendente)`,
      fix: `Adicionar accessibilityLabel="descrição da ação" ou incluir <Text> como filho`,
      autofixable: false,
    };
  },

  /**
   * P0-IMAGE-001: Imagem sem alternativa textual
   */
  "P0-IMAGE-001": (node, context) => {
    const componentName = getComponentName(node);

    // Não é imagem? Skip
    if (!IMAGE_COMPONENTS.includes(componentName)) return null;

    // Marcada como decorativa?
    if (isMarkedDecorative(node)) return null;

    // Tem label?
    if (hasProp(node, "accessibilityLabel") || hasProp(node, "aria-label")) return null;

    // Tem alt? (para web compat)
    if (hasProp(node, "alt")) return null;

    return {
      severity: "BLOCKER",
      ruleId: "P0-IMAGE-001",
      wcag: "1.1.1",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "HIGH",
      category: "IMAGE",
      component: componentName,
      props: getAllProps(node),
      message: `<${componentName}> sem texto alternativo e não marcada como decorativa`,
      fix: `Adicionar accessibilityLabel="descrição da imagem" ou marcar como decorativa com accessible={false}`,
      autofixable: false,
    };
  },

  /**
   * P0-INPUT-001: Input sem label
   */
  "P0-INPUT-001": (node, context) => {
    const componentName = getComponentName(node);

    // Não é input? Skip
    if (!INPUT_COMPONENTS.includes(componentName)) return null;

    // Tem label?
    if (ACCESSIBILITY_LABEL_PROPS.some((prop) => hasProp(node, prop))) return null;

    // Tem placeholder que pode servir de fallback? (não ideal, mas não é BLOCKER)
    // NOTA: placeholder não é substituto adequado, mas reduz severidade
    if (hasProp(node, "placeholder")) {
      return {
        severity: "MAJOR",
        ruleId: "P0-INPUT-001",
        wcag: "3.3.2",
        wcagLevel: "A",
        standard: "WCAG22",
        platform: "all",
        confidence: "MEDIUM",
        category: "FORM",
        component: componentName,
        props: getAllProps(node),
        message: `<${componentName}> usando apenas placeholder como label (não persistente)`,
        fix: `Adicionar accessibilityLabel="descrição do campo"`,
        autofixable: true,
      };
    }

    return {
      severity: "BLOCKER",
      ruleId: "P0-INPUT-001",
      wcag: "3.3.2",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "HIGH",
      category: "FORM",
      component: componentName,
      props: getAllProps(node),
      message: `<${componentName}> sem accessibilityLabel ou aria-label`,
      fix: `Adicionar accessibilityLabel="descrição do campo"`,
      autofixable: true,
    };
  },

  /**
   * P0-TARGET-WCAG-001: Tap target menor que 24x24 (WCAG 2.5.8 AA)
   */
  "P0-TARGET-WCAG-001": (node, context) => {
    const componentName = getComponentName(node);

    // Só para componentes interativos
    if (!isInteractive(node) && !BUTTON_LIKE_COMPONENTS.includes(componentName)) return null;

    const style = analyzeStyleForSize(node);
    if (!style) return null;

    // Verificar dimensões explícitas
    const width = style.width || style.minWidth;
    const height = style.height || style.minHeight;

    // Se não temos dimensões explícitas, não podemos afirmar com certeza
    if (width === undefined && height === undefined) return null;

    // Verificar se algum é menor que 24
    const isTooSmall =
      (typeof width === "number" && width < CONFIG.tapTargets.wcag) ||
      (typeof height === "number" && height < CONFIG.tapTargets.wcag);

    if (!isTooSmall) return null;

    return {
      severity: "BLOCKER",
      ruleId: "P0-TARGET-WCAG-001",
      wcag: "2.5.8",
      wcagLevel: "AA",
      standard: "WCAG22",
      platform: "all",
      confidence: "HIGH",
      category: "TARGET",
      component: componentName,
      props: getAllProps(node),
      message: `Tap target menor que 24×24px (WCAG 2.5.8 AA) - encontrado: ${width}×${height}`,
      fix: `Aumentar dimensões para mínimo 24×24px ou usar hitSlop`,
      autofixable: true,
    };
  },

  // ---------------------------------------------------------------------------
  // P1 — MAJOR (WCAG A + PROJECT_HIG)
  // ---------------------------------------------------------------------------

  /**
   * P1-TARGET-HIG-001: Tap target menor que 44pt (iOS HIG / Projeto)
   */
  "P1-TARGET-HIG-001": (node, context) => {
    const componentName = getComponentName(node);

    // Só para componentes interativos
    if (!isInteractive(node) && !BUTTON_LIKE_COMPONENTS.includes(componentName)) return null;

    // Se já tem hitSlop, provavelmente está ok
    if (hasHitSlop(node)) return null;

    const style = analyzeStyleForSize(node);
    if (!style) return null;

    const width = style.width || style.minWidth;
    const height = style.height || style.minHeight;

    // Se não temos dimensões explícitas, não podemos afirmar
    if (width === undefined && height === undefined) return null;

    // Já reportado por P0-TARGET-WCAG-001 se < 24
    if (
      (typeof width === "number" && width < CONFIG.tapTargets.wcag) ||
      (typeof height === "number" && height < CONFIG.tapTargets.wcag)
    ) {
      return null; // Deixar para P0
    }

    // Verificar se é entre 24-44
    const isSubOptimal =
      (typeof width === "number" &&
        width >= CONFIG.tapTargets.wcag &&
        width < CONFIG.tapTargets.projectHig) ||
      (typeof height === "number" &&
        height >= CONFIG.tapTargets.wcag &&
        height < CONFIG.tapTargets.projectHig);

    if (!isSubOptimal) return null;

    return {
      severity: "MAJOR",
      ruleId: "P1-TARGET-HIG-001",
      wcag: "N/A",
      wcagLevel: "BP",
      standard: "PROJECT_HIG",
      platform: "ios",
      confidence: "MEDIUM",
      category: "TARGET",
      component: componentName,
      props: getAllProps(node),
      message: `Tap target menor que 44pt (iOS HIG) - encontrado: ${width}×${height}`,
      fix: `Aumentar dimensões para 44×44pt ou adicionar hitSlop`,
      autofixable: true,
    };
  },

  /**
   * P1-ROLE-001: Componente interativo custom sem role
   */
  "P1-ROLE-001": (node, context) => {
    const componentName = getComponentName(node);

    // Componentes nativos já têm role implícito
    if (BUTTON_LIKE_COMPONENTS.includes(componentName)) return null;
    if (INPUT_COMPONENTS.includes(componentName)) return null;
    if (IMAGE_COMPONENTS.includes(componentName)) return null;

    // Não é interativo? Skip
    if (!isInteractive(node)) return null;

    // Já tem role?
    if (hasValidRole(node)) return null;

    // View/Animated.View com onPress precisa de role
    if (componentName !== "View" && !componentName.includes("Animated")) return null;

    return {
      severity: "MAJOR",
      ruleId: "P1-ROLE-001",
      wcag: "4.1.2",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "HIGH",
      category: "ROLE",
      component: componentName,
      props: getAllProps(node),
      message: `<${componentName}> interativo sem role definido`,
      fix: `Adicionar role="button" ou accessibilityRole="button"`,
      autofixable: true,
    };
  },

  /**
   * P1-STATE-001: disabled sem accessibilityState.disabled
   */
  "P1-STATE-001": (node, context) => {
    const componentName = getComponentName(node);

    // Componente exempto com accessibilityState interna?
    const exemptions = CONFIG.exemptComponents[componentName];
    if (exemptions && exemptions.includes("accessibilityState")) return null;

    // Tem disabled?
    const disabledValue = getPropValue(node, "disabled");
    if (disabledValue !== true && disabledValue !== "{disabled}" && disabledValue !== "{true}")
      return null;

    // Tem accessibilityState.disabled ou aria-disabled?
    if (hasProp(node, "aria-disabled")) return null;

    const accessibilityState = getPropValue(node, "accessibilityState");
    // Check if accessibilityState has disabled property (any value including expressions)
    if (typeof accessibilityState === "object" && "disabled" in accessibilityState) return null;

    return {
      severity: "MAJOR",
      ruleId: "P1-STATE-001",
      wcag: "4.1.2",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "HIGH",
      category: "STATE",
      component: componentName,
      props: getAllProps(node),
      message: `<${componentName}> com disabled sem accessibilityState.disabled`,
      fix: `Adicionar accessibilityState={{ disabled: true }} ou aria-disabled={true}`,
      autofixable: true,
    };
  },

  /**
   * P1-STATE-002: selected/checked sem accessibilityState correspondente
   */
  "P1-STATE-002": (node, context) => {
    const componentName = getComponentName(node);

    // Componente exempto com accessibilityState interna?
    const exemptions = CONFIG.exemptComponents[componentName];
    if (exemptions && exemptions.includes("accessibilityState")) return null;

    // Verificar selected
    const selectedValue = getPropValue(node, "selected");
    const checkedValue = getPropValue(node, "checked");
    const isSelectedValue = getPropValue(node, "isSelected");

    if (selectedValue === undefined && checkedValue === undefined && isSelectedValue === undefined)
      return null;

    // Tem accessibilityState correspondente?
    const accessibilityState = getPropValue(node, "accessibilityState");
    if (typeof accessibilityState === "object") {
      // Check if selected or checked property exists (any value including expressions)
      if ("selected" in accessibilityState || "checked" in accessibilityState) return null;
    }

    if (hasProp(node, "aria-selected") || hasProp(node, "aria-checked")) return null;

    return {
      severity: "MAJOR",
      ruleId: "P1-STATE-002",
      wcag: "4.1.2",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "MEDIUM",
      category: "STATE",
      component: componentName,
      props: getAllProps(node),
      message: `<${componentName}> com estado selecionado/checked sem accessibilityState correspondente`,
      fix: `Adicionar accessibilityState={{ selected: true }} ou {{ checked: true }}`,
      autofixable: true,
    };
  },

  /**
   * P1-MODAL-001: Modal sem accessibilityViewIsModal
   */
  "P1-MODAL-001": (node, context) => {
    const componentName = getComponentName(node);

    // É modal?
    if (!MODAL_COMPONENTS.includes(componentName)) return null;

    // Tem accessibilityViewIsModal?
    if (hasProp(node, "accessibilityViewIsModal")) return null;

    return {
      severity: "MAJOR",
      ruleId: "P1-MODAL-001",
      wcag: "2.4.3",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "ios",
      confidence: "HIGH",
      category: "MODAL",
      component: componentName,
      props: getAllProps(node),
      message: `<${componentName}> sem accessibilityViewIsModal (iOS)`,
      fix: `Adicionar accessibilityViewIsModal={true} para conter foco dentro do modal`,
      autofixable: true,
    };
  },

  /**
   * P1-CONTRAST-A: Cor hardcoded fora de Tokens
   */
  "P1-CONTRAST-A": (node, context) => {
    const componentName = getComponentName(node);

    // Verificar style prop
    const style = getPropValue(node, "style");
    if (typeof style !== "object") return null;

    const colorProps = ["color", "backgroundColor", "borderColor", "tintColor"];
    const hardcodedColors = [];

    for (const prop of colorProps) {
      if (style[prop] && isHardcodedColor(style[prop])) {
        hardcodedColors.push(`${prop}: ${style[prop]}`);
      }
    }

    if (hardcodedColors.length === 0) return null;

    return {
      severity: "MAJOR",
      ruleId: "P1-CONTRAST-A",
      wcag: "1.4.3",
      wcagLevel: "AA",
      standard: "PROJECT_HIG",
      platform: "all",
      confidence: "HIGH",
      category: "CONTRAST",
      component: componentName,
      props: getAllProps(node),
      message: `Cor hardcoded encontrada: ${hardcodedColors.join(", ")}`,
      fix: `Usar Tokens.* de src/theme/tokens.ts ou useThemeColors()`,
      autofixable: false,
    };
  },

  /**
   * P1-LABEL-IN-NAME-001: accessibilityLabel não contém texto visível
   */
  "P1-LABEL-IN-NAME-001": (node, context) => {
    const componentName = getComponentName(node);

    // Tem accessibilityLabel?
    const label = getPropValue(node, "accessibilityLabel");
    if (!label || typeof label !== "string") return null;

    // Tem Text filho?
    if (!hasTextChild(node, context.code)) return null;

    // Extrair texto visível é complexo, então reportamos com LOW confidence
    // para revisão manual
    return {
      severity: "MAJOR",
      ruleId: "P1-LABEL-IN-NAME-001",
      wcag: "2.5.3",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "LOW",
      category: "NAME",
      component: componentName,
      props: getAllProps(node),
      message: `accessibilityLabel pode não conter o texto visível do elemento (verificar manualmente)`,
      fix: `Garantir que accessibilityLabel contenha o texto visível do <Text> filho`,
      autofixable: false,
    };
  },

  // ---------------------------------------------------------------------------
  // P2 — MINOR (AAA / Best Practice)
  // ---------------------------------------------------------------------------

  /**
   * P2-MOTION-001: Animação sem verificar useReducedMotion
   */
  "P2-MOTION-001": (node, context) => {
    const componentName = getComponentName(node);

    // Verificar se é um Animated component ou usa animação
    const isAnimated =
      componentName.startsWith("Animated") ||
      componentName.includes("Animation") ||
      hasProp(node, "entering") ||
      hasProp(node, "exiting") ||
      hasProp(node, "layout");

    if (!isAnimated) return null;

    // Verificar se o arquivo usa useReducedMotion
    // Isso é uma heurística - verificamos se o hook está importado
    if (context.usesReducedMotion) return null;

    return {
      severity: "MINOR",
      ruleId: "P2-MOTION-001",
      wcag: "2.3.3",
      wcagLevel: "AAA",
      standard: "WCAG22",
      platform: "all",
      confidence: "MEDIUM",
      category: "MOTION",
      component: componentName,
      props: getAllProps(node),
      message: `Componente animado pode não respeitar preferência de reduced motion`,
      fix: `Usar useReducedMotion() de react-native-reanimated e condicionar animações`,
      autofixable: false,
    };
  },

  /**
   * P2-HINT-001: Ação complexa sem accessibilityHint
   */
  "P2-HINT-001": (node, context) => {
    const componentName = getComponentName(node);

    // Interativo?
    if (!isInteractive(node)) return null;

    // Já tem hint?
    if (hasProp(node, "accessibilityHint") || hasProp(node, "aria-describedby")) return null;

    // Tem múltiplas ações? (onPress + onLongPress)
    const hasMultipleActions = hasProp(node, "onPress") && hasProp(node, "onLongPress");

    if (!hasMultipleActions) return null;

    return {
      severity: "MINOR",
      ruleId: "P2-HINT-001",
      wcag: "1.3.1",
      wcagLevel: "A",
      standard: "WCAG22",
      platform: "all",
      confidence: "MEDIUM",
      category: "NAME",
      component: componentName,
      props: getAllProps(node),
      message: `Elemento com múltiplas ações (press + longPress) sem accessibilityHint`,
      fix: `Adicionar accessibilityHint="manter pressionado para opções adicionais"`,
      autofixable: false,
    };
  },

  /**
   * P2-STATUS-001: Toast/Loading sem accessibilityLiveRegion
   */
  "P2-STATUS-001": (node, context) => {
    const componentName = getComponentName(node);

    // Heurística: componentes com "Toast", "Loading", "Spinner", "Progress"
    const isStatusComponent = /toast|loading|spinner|progress|skeleton|indicator/i.test(
      componentName
    );

    if (!isStatusComponent) return null;

    // Tem live region?
    if (hasProp(node, "accessibilityLiveRegion") || hasProp(node, "aria-live")) return null;

    return {
      severity: "MINOR",
      ruleId: "P2-STATUS-001",
      wcag: "4.1.3",
      wcagLevel: "AA",
      standard: "WCAG22",
      platform: "android",
      confidence: "MEDIUM",
      category: "STATE",
      component: componentName,
      props: getAllProps(node),
      message: `Componente de status sem accessibilityLiveRegion`,
      fix: `Adicionar accessibilityLiveRegion="polite" ou aria-live="polite"`,
      autofixable: true,
    };
  },
};

// ============================================================================
// MOTOR DE AUDITORIA
// ============================================================================

class A11yAuditor {
  constructor() {
    /** @type {Finding[]} */
    this.findings = [];
    /** @type {Finding[]} */
    this.manualChecks = [];
    this.filesAnalyzed = 0;
    this.componentsAnalyzed = 0;

    // Coverage tracking
    this.coverage = {
      interactiveTotal: 0,
      interactiveWithName: 0,
      interactiveWithRole: 0,
      imagesTotal: 0,
      imagesHandled: 0,
      inputsTotal: 0,
      inputsWithLabel: 0,
    };
  }

  /**
   * Analisa um arquivo
   */
  analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf-8");
    const relativePath = path.relative(CONFIG.srcDir, filePath);

    let ast;
    try {
      ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript", "decorators-legacy"],
      });
    } catch (error) {
      console.error(`  ⚠️  Erro ao parsear ${relativePath}: ${error.message}`);
      return;
    }

    this.filesAnalyzed++;

    // Verificar se usa useReducedMotion
    const usesReducedMotion = code.includes("useReducedMotion");

    const context = {
      code,
      filePath: relativePath,
      usesReducedMotion,
    };

    traverse(ast, {
      JSXElement: (nodePath) => {
        const node = nodePath.node;
        this.componentsAnalyzed++;

        const componentName = getComponentName(node);

        // Track coverage
        this.trackCoverage(node, componentName);

        // Executar todas as regras
        for (const [ruleId, ruleFn] of Object.entries(RULES)) {
          try {
            const result = ruleFn(node, context);
            if (result) {
              const evidence = extractEvidence(code, node);
              const finding = {
                ...result,
                fingerprint: generateFingerprint(ruleId, relativePath, componentName, evidence),
                location: {
                  file: relativePath,
                  line: node.loc?.start?.line || 0,
                  column: node.loc?.start?.column || 0,
                },
                evidence,
              };

              if (result.confidence === "LOW") {
                this.manualChecks.push(finding);
              } else {
                this.findings.push(finding);
              }
            }
          } catch (error) {
            console.error(`  ⚠️  Erro na regra ${ruleId} para ${componentName}: ${error.message}`);
          }
        }
      },
    });
  }

  /**
   * Rastreia métricas de cobertura
   */
  trackCoverage(node, componentName) {
    // Interativos
    if (isInteractive(node) || BUTTON_LIKE_COMPONENTS.includes(componentName)) {
      this.coverage.interactiveTotal++;

      const hasTextDescendant = false; // Simplificado por performance
      if (ACCESSIBILITY_LABEL_PROPS.some((prop) => hasProp(node, prop)) || hasTextDescendant) {
        this.coverage.interactiveWithName++;
      }

      if (hasValidRole(node) || BUTTON_LIKE_COMPONENTS.includes(componentName)) {
        this.coverage.interactiveWithRole++;
      }
    }

    // Imagens
    if (IMAGE_COMPONENTS.includes(componentName)) {
      this.coverage.imagesTotal++;
      if (
        hasProp(node, "accessibilityLabel") ||
        hasProp(node, "aria-label") ||
        isMarkedDecorative(node)
      ) {
        this.coverage.imagesHandled++;
      }
    }

    // Inputs
    if (INPUT_COMPONENTS.includes(componentName)) {
      this.coverage.inputsTotal++;
      if (ACCESSIBILITY_LABEL_PROPS.some((prop) => hasProp(node, prop))) {
        this.coverage.inputsWithLabel++;
      }
    }
  }

  /**
   * Executa auditoria em todos os arquivos
   */
  async run() {
    console.log("\n🔍 Auditoria de Acessibilidade v1.1\n");
    console.log(`📁 Diretório: ${CONFIG.srcDir}\n`);

    const files = await glob(CONFIG.filePatterns, {
      cwd: CONFIG.srcDir,
      ignore: CONFIG.ignorePatterns,
      absolute: true,
    });

    console.log(`📄 Arquivos encontrados: ${files.length}\n`);

    for (const file of files) {
      this.analyzeFile(file);
    }

    return this.generateReport();
  }

  /**
   * Gera relatório estruturado
   */
  generateReport() {
    // Ordenar findings por severidade
    const severityOrder = { BLOCKER: 0, MAJOR: 1, MINOR: 2 };
    this.findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Calcular sumário
    const summary = {
      total: this.findings.length,
      bySeverity: {
        BLOCKER: this.findings.filter((f) => f.severity === "BLOCKER").length,
        MAJOR: this.findings.filter((f) => f.severity === "MAJOR").length,
        MINOR: this.findings.filter((f) => f.severity === "MINOR").length,
      },
      byCategory: {},
      byConfidence: {
        HIGH: this.findings.filter((f) => f.confidence === "HIGH").length,
        MEDIUM: this.findings.filter((f) => f.confidence === "MEDIUM").length,
        LOW: this.findings.filter((f) => f.confidence === "LOW").length,
      },
      coverage: {
        interactiveWithName: {
          count: this.coverage.interactiveWithName,
          total: this.coverage.interactiveTotal,
          percent:
            this.coverage.interactiveTotal > 0
              ? Math.round(
                  (this.coverage.interactiveWithName / this.coverage.interactiveTotal) * 100
                )
              : 100,
        },
        interactiveWithRole: {
          count: this.coverage.interactiveWithRole,
          total: this.coverage.interactiveTotal,
          percent:
            this.coverage.interactiveTotal > 0
              ? Math.round(
                  (this.coverage.interactiveWithRole / this.coverage.interactiveTotal) * 100
                )
              : 100,
        },
        imagesHandled: {
          count: this.coverage.imagesHandled,
          total: this.coverage.imagesTotal,
          percent:
            this.coverage.imagesTotal > 0
              ? Math.round((this.coverage.imagesHandled / this.coverage.imagesTotal) * 100)
              : 100,
        },
        inputsWithLabel: {
          count: this.coverage.inputsWithLabel,
          total: this.coverage.inputsTotal,
          percent:
            this.coverage.inputsTotal > 0
              ? Math.round((this.coverage.inputsWithLabel / this.coverage.inputsTotal) * 100)
              : 100,
        },
      },
    };

    // Contar por categoria
    const categories = [
      "NAME",
      "ROLE",
      "STATE",
      "TARGET",
      "CONTRAST",
      "MODAL",
      "IMAGE",
      "FORM",
      "MOTION",
    ];
    for (const cat of categories) {
      summary.byCategory[cat] = this.findings.filter((f) => f.category === cat).length;
    }

    /** @type {AuditReport} */
    const report = {
      version: "1.1",
      timestamp: new Date().toISOString(),
      summary,
      findings: this.findings,
      manualChecks: this.manualChecks,
      filesAnalyzed: this.filesAnalyzed,
      componentsAnalyzed: this.componentsAnalyzed,
    };

    return report;
  }
}

// ============================================================================
// GERAÇÃO DE RELATÓRIOS
// ============================================================================

/**
 * Gera relatório em Markdown
 */
function generateMarkdownReport(report) {
  const lines = [];

  lines.push("# Relatório de Auditoria de Acessibilidade v1.1");
  lines.push("");
  lines.push(`**Data:** ${new Date(report.timestamp).toLocaleString("pt-BR")}`);
  lines.push(`**Arquivos analisados:** ${report.filesAnalyzed}`);
  lines.push(`**Componentes analisados:** ${report.componentsAnalyzed}`);
  lines.push("");

  // Sumário executivo
  lines.push("## 📊 Sumário Executivo");
  lines.push("");
  lines.push(`| Severidade | Quantidade |`);
  lines.push(`|------------|------------|`);
  lines.push(`| 🔴 BLOCKER | ${report.summary.bySeverity.BLOCKER} |`);
  lines.push(`| 🟠 MAJOR | ${report.summary.bySeverity.MAJOR} |`);
  lines.push(`| 🟡 MINOR | ${report.summary.bySeverity.MINOR} |`);
  lines.push(`| **Total** | **${report.summary.total}** |`);
  lines.push("");

  // Cobertura
  lines.push("## 📈 Métricas de Cobertura");
  lines.push("");
  lines.push(`| Métrica | Atual | Total | % |`);
  lines.push(`|---------|-------|-------|---|`);
  lines.push(
    `| Interativos com nome acessível | ${report.summary.coverage.interactiveWithName.count} | ${report.summary.coverage.interactiveWithName.total} | ${report.summary.coverage.interactiveWithName.percent}% |`
  );
  lines.push(
    `| Interativos com role | ${report.summary.coverage.interactiveWithRole.count} | ${report.summary.coverage.interactiveWithRole.total} | ${report.summary.coverage.interactiveWithRole.percent}% |`
  );
  lines.push(
    `| Imagens tratadas | ${report.summary.coverage.imagesHandled.count} | ${report.summary.coverage.imagesHandled.total} | ${report.summary.coverage.imagesHandled.percent}% |`
  );
  lines.push(
    `| Inputs com label | ${report.summary.coverage.inputsWithLabel.count} | ${report.summary.coverage.inputsWithLabel.total} | ${report.summary.coverage.inputsWithLabel.percent}% |`
  );
  lines.push("");

  // Por categoria
  lines.push("## 📁 Por Categoria");
  lines.push("");
  lines.push(`| Categoria | Quantidade |`);
  lines.push(`|-----------|------------|`);
  for (const [cat, count] of Object.entries(report.summary.byCategory)) {
    if (count > 0) {
      lines.push(`| ${cat} | ${count} |`);
    }
  }
  lines.push("");

  // Findings por severidade
  const severityEmoji = { BLOCKER: "🔴", MAJOR: "🟠", MINOR: "🟡" };
  const severityLabels = {
    BLOCKER: "Bloqueadores (P0)",
    MAJOR: "Principais (P1)",
    MINOR: "Menores (P2)",
  };

  for (const severity of ["BLOCKER", "MAJOR", "MINOR"]) {
    const severityFindings = report.findings.filter((f) => f.severity === severity);
    if (severityFindings.length === 0) continue;

    lines.push(`## ${severityEmoji[severity]} ${severityLabels[severity]}`);
    lines.push("");

    // Agrupar por arquivo
    const byFile = {};
    for (const finding of severityFindings) {
      const file = finding.location.file;
      if (!byFile[file]) byFile[file] = [];
      byFile[file].push(finding);
    }

    for (const [file, findings] of Object.entries(byFile)) {
      lines.push(`### 📄 \`${file}\``);
      lines.push("");

      for (const finding of findings) {
        lines.push(
          `#### ${finding.ruleId} - ${finding.component} (linha ${finding.location.line})`
        );
        lines.push("");
        lines.push(`- **WCAG:** ${finding.wcag} (${finding.wcagLevel})`);
        lines.push(`- **Categoria:** ${finding.category}`);
        lines.push(`- **Confiança:** ${finding.confidence}`);
        lines.push(`- **Problema:** ${finding.message}`);
        lines.push(`- **Correção:** ${finding.fix}`);
        if (finding.autofixable) {
          lines.push(`- ✅ **Autofixável**`);
        }
        lines.push("");
        lines.push("```jsx");
        lines.push(finding.evidence);
        lines.push("```");
        lines.push("");
      }
    }
  }

  // Manual checks
  if (report.manualChecks.length > 0) {
    lines.push("## 🔍 Verificações Manuais Necessárias");
    lines.push("");
    lines.push("Os itens abaixo têm baixa confiança e precisam de revisão manual:");
    lines.push("");

    for (const check of report.manualChecks) {
      lines.push(`- **${check.location.file}:${check.location.line}** - ${check.message}`);
    }
    lines.push("");
  }

  // Fingerprints para referência
  lines.push("## 🔑 Fingerprints (para baseline)");
  lines.push("");
  lines.push("```");
  for (const finding of report.findings.slice(0, 20)) {
    lines.push(
      `${finding.fingerprint} | ${finding.ruleId} | ${finding.location.file}:${finding.location.line}`
    );
  }
  if (report.findings.length > 20) {
    lines.push(`... e mais ${report.findings.length - 20} findings`);
  }
  lines.push("```");
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const updateBaseline = args.includes("--update-baseline");
  const jsonOnly = args.includes("--json");

  const auditor = new A11yAuditor();
  const report = await auditor.run();

  // Criar diretório de output se não existir
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Salvar JSON
  const jsonPath = path.join(CONFIG.outputDir, "AUDIT_A11Y_DEEP_REPORT.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Relatório JSON salvo em: ${jsonPath}`);

  // Salvar Markdown
  if (!jsonOnly) {
    const mdPath = path.join(CONFIG.outputDir, "AUDIT_A11Y_DEEP_REPORT.md");
    fs.writeFileSync(mdPath, generateMarkdownReport(report));
    console.log(`📄 Relatório Markdown salvo em: ${mdPath}`);
  }

  // Atualizar baseline se solicitado
  if (updateBaseline) {
    const baseline = {
      version: "1.1",
      timestamp: report.timestamp,
      hash: crypto
        .createHash("sha256")
        .update(JSON.stringify(report.findings.map((f) => f.fingerprint)))
        .digest("hex"),
      findings: report.findings.map((f) => ({
        fingerprint: f.fingerprint,
        ruleId: f.ruleId,
        severity: f.severity,
        file: f.location.file,
        line: f.location.line,
      })),
      coverage: report.summary.coverage,
    };
    fs.writeFileSync(CONFIG.baselineFile, JSON.stringify(baseline, null, 2));
    console.log(`📄 Baseline atualizado em: ${CONFIG.baselineFile}`);
  }

  // Imprimir sumário
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMÁRIO");
  console.log("=".repeat(60));
  console.log(`🔴 BLOCKER: ${report.summary.bySeverity.BLOCKER}`);
  console.log(`🟠 MAJOR:   ${report.summary.bySeverity.MAJOR}`);
  console.log(`🟡 MINOR:   ${report.summary.bySeverity.MINOR}`);
  console.log(`📝 Total:   ${report.summary.total}`);
  console.log("");
  console.log("📈 COBERTURA:");
  console.log(`   Labels:  ${report.summary.coverage.interactiveWithName.percent}%`);
  console.log(`   Roles:   ${report.summary.coverage.interactiveWithRole.percent}%`);
  console.log(`   Imagens: ${report.summary.coverage.imagesHandled.percent}%`);
  console.log(`   Inputs:  ${report.summary.coverage.inputsWithLabel.percent}%`);
  console.log("=".repeat(60) + "\n");

  // Exit code baseado em BLOCKER
  if (report.summary.bySeverity.BLOCKER > 0) {
    console.log("❌ Auditoria falhou: existem issues BLOCKER\n");
    process.exit(1);
  }

  console.log("✅ Auditoria concluída com sucesso\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
