/**
 * ESLint Flat Config - Nossa Maternidade
 *
 * Design System Enforcement Rules:
 * - No hardcoded hex colors (use Tokens.*)
 * - No console.log (use logger.*)
 * - Accessibility requirements
 *
 * @see https://docs.expo.dev/guides/linting/
 */

const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactPlugin = require("eslint-plugin-react");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

/**
 * Custom rule to detect hardcoded colors in React Native styles
 * Detects patterns like: color: "#xxx", backgroundColor: 'white'
 */
const noHardcodedColors = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow hardcoded color values in styles",
      category: "Design System",
      recommended: true,
    },
    messages: {
      noHardcodedColor:
        "Hardcoded color '{{value}}' detected. Use Tokens.* or colors.* from useTheme() instead.",
    },
    schema: [],
  },
  create(context) {
    // Color property names that should use tokens
    const colorProperties = new Set([
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderBottomColor",
      "borderLeftColor",
      "borderRightColor",
      "shadowColor",
      "tintColor",
      "overlayColor",
    ]);

    // Allowed literal colors (transparent is ok)
    const allowedColors = new Set(["transparent", "inherit", "currentColor"]);

    // Hex color regex
    const hexColorRegex = /^#[0-9A-Fa-f]{3,8}$/;

    // Named colors that should be replaced
    const namedColors = new Set([
      "white",
      "black",
      "red",
      "green",
      "blue",
      "yellow",
      "orange",
      "purple",
      "pink",
      "gray",
      "grey",
    ]);

    return {
      Property(node) {
        // Only check style properties
        if (node.key && node.key.type === "Identifier" && colorProperties.has(node.key.name)) {
          const value = node.value;

          // Check for string literals
          if (value && value.type === "Literal" && typeof value.value === "string") {
            const colorValue = value.value.toLowerCase();

            // Skip allowed colors
            if (allowedColors.has(colorValue)) {
              return;
            }

            // Check for hex colors
            if (hexColorRegex.test(value.value)) {
              context.report({
                node: value,
                messageId: "noHardcodedColor",
                data: { value: value.value },
              });
              return;
            }

            // Check for named colors
            if (namedColors.has(colorValue)) {
              context.report({
                node: value,
                messageId: "noHardcodedColor",
                data: { value: value.value },
              });
            }
          }

          // Check for template literals with hex colors
          if (value && value.type === "TemplateLiteral") {
            value.quasis.forEach((quasi) => {
              if (hexColorRegex.test(quasi.value.raw.trim())) {
                context.report({
                  node: quasi,
                  messageId: "noHardcodedColor",
                  data: { value: quasi.value.raw },
                });
              }
            });
          }
        }
      },
    };
  },
};

/**
 * Custom rule to ensure color values come from design system tokens
 * Detects bypass patterns like: const COLORS = { success: "#xxx" }; backgroundColor: COLORS.success
 */
const requireTokenImports = {
  meta: {
    type: "problem",
    docs: {
      description: "Color values in styles must come from design system token imports",
      category: "Design System",
      recommended: true,
    },
    messages: {
      requireTokenImport:
        "Color value must come from '@/theme/tokens' or 'useThemeColors()'. Found local constant: '{{source}}'",
      noLocalColorConst:
        "Local color constants are not allowed. Import colors from '@/theme/tokens' instead.",
    },
    schema: [],
  },
  create(context) {
    // Valid import sources for design tokens
    const validImportSources = new Set([
      "@/theme/tokens",
      "./tokens",
      "../theme/tokens",
      "../../theme/tokens",
    ]);

    // Track which identifiers are valid token imports
    const tokenImports = new Set();

    // Track local const declarations that look like color palettes
    const localColorConsts = new Set();

    // Color property names to check
    const colorProperties = new Set([
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderBottomColor",
      "borderLeftColor",
      "borderRightColor",
      "shadowColor",
      "tintColor",
      "overlayColor",
    ]);

    // Hex color regex
    const hexColorRegex = /^#[0-9A-Fa-f]{3,8}$/;

    return {
      // Track imports from valid token sources
      ImportDeclaration(node) {
        if (validImportSources.has(node.source.value)) {
          node.specifiers.forEach((spec) => {
            if (spec.local && spec.local.name) {
              tokenImports.add(spec.local.name);
            }
          });
        }
      },

      // Detect local color constant declarations (like const COLORS = { ... })
      VariableDeclarator(node) {
        if (
          node.id &&
          node.id.type === "Identifier" &&
          node.init &&
          node.init.type === "ObjectExpression"
        ) {
          // Check if object contains hex color values
          const hasHexColors = node.init.properties.some((prop) => {
            if (
              prop.value &&
              prop.value.type === "Literal" &&
              typeof prop.value.value === "string"
            ) {
              return hexColorRegex.test(prop.value.value);
            }
            return false;
          });

          if (hasHexColors) {
            localColorConsts.add(node.id.name);
            context.report({
              node: node.id,
              messageId: "noLocalColorConst",
            });
          }
        }
      },

      // Check color properties for valid sources
      Property(node) {
        if (node.key && node.key.type === "Identifier" && colorProperties.has(node.key.name)) {
          const value = node.value;

          // Check MemberExpression (e.g., COLORS.success, semantic.light.success)
          if (value && value.type === "MemberExpression") {
            // Get the root object name
            let rootObject = value.object;
            while (rootObject.type === "MemberExpression") {
              rootObject = rootObject.object;
            }

            const objectName = rootObject.name;

            // If it's a local color constant, report error
            if (localColorConsts.has(objectName)) {
              context.report({
                node: value,
                messageId: "requireTokenImport",
                data: { source: objectName },
              });
            }
            // If it's not from token imports and not a known safe source, report
            else if (objectName && !tokenImports.has(objectName) && objectName !== "colors") {
              // Allow 'colors' from useThemeColors() hook (runtime)
              // Check if it might be a local bypass
              if (localColorConsts.has(objectName)) {
                context.report({
                  node: value,
                  messageId: "requireTokenImport",
                  data: { source: objectName },
                });
              }
            }
          }
        }
      },
    };
  },
};

/**
 * Custom plugin for Design System rules
 */
const designSystemPlugin = {
  meta: {
    name: "design-system",
    version: "1.0.0",
  },
  rules: {
    "no-hardcoded-colors": noHardcodedColors,
    "require-token-imports": requireTokenImports,
  },
};

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  // Base TypeScript config
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "design-system": designSystemPlugin,
    },
    rules: {
      // ===========================
      // DESIGN SYSTEM ENFORCEMENT
      // ===========================

      // Error on hardcoded colors (must use Tokens.*)
      "design-system/no-hardcoded-colors": "error",

      // Enforce token imports for all color sources
      "design-system/require-token-imports": "error",

      // Block console.log (must use logger.*)
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],

      // ===========================
      // TYPESCRIPT RULES
      // ===========================

      // Disallow any type (zero tolerance for type safety)
      "@typescript-eslint/no-explicit-any": "error",

      // Prefer interfaces over types for object shapes
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],

      // ===========================
      // REACT RULES
      // ===========================

      // Enforce hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // JSX accessibility (basic)
      "react/jsx-no-target-blank": "error",

      // ===========================
      // ACCESSIBILITY (a11y)
      // ===========================

      // These are enforced by quality-gate and audit scripts
      // Basic checks here

      // ===========================
      // GENERAL CODE QUALITY
      // ===========================

      // No unused variables (except prefixed with _)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Prefer const over let when possible
      "prefer-const": "warn",

      // No var
      "no-var": "error",

      // Require strict equality
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },

  // Disable design system rules for design tokens source file
  {
    files: ["**/theme/tokens.ts", "**/theme/design-system.ts"],
    rules: {
      "design-system/no-hardcoded-colors": "off",
      "design-system/require-token-imports": "off",
    },
  },

  // Disable interface preference for files with ParamListBase constraints
  // React Navigation requires 'type' for proper type inference
  {
    files: ["**/types/navigation.ts", "**/types/database.types.ts", "**/screens/auth/*.tsx"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.ts",
      "babel.config.js",
      "metro.config.js",
      "tailwind.config.js",
      "scripts/**",
      "supabase/functions/**",
    ],
  },
];
