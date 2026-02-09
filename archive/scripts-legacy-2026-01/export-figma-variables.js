#!/usr/bin/env node
/**
 * Export Design Tokens to Figma Variables Format
 *
 * Converte os tokens do design system (src/theme/tokens.ts) para o formato
 * Figma Variables JSON, permitindo importação direta no Figma.
 *
 * Usage:
 *   node scripts/export-figma-variables.js
 *
 * Output:
 *   figma-variables.json - Arquivo pronto para importar no Figma
 */

const fs = require("fs");
const path = require("path");

// Cores do design system (manualmente extraídas do tokens.ts)
// Em produção, você poderia usar um parser TS para ler automaticamente
const designTokens = {
  // Brand Colors
  "brand/primary/50": "#F0F9FF",
  "brand/primary/100": "#E0F2FE",
  "brand/primary/200": "#BAE6FD",
  "brand/primary/300": "#7DD3FC",
  "brand/primary/400": "#38BDF8",
  "brand/primary/500": "#0EA5E9",
  "brand/primary/600": "#0284C7",
  "brand/primary/700": "#0369A1",
  "brand/primary/800": "#075985",
  "brand/primary/900": "#0C4A6E",

  "brand/accent/50": "#FFF1F3",
  "brand/accent/100": "#FFE4E9",
  "brand/accent/200": "#FECDD6",
  "brand/accent/300": "#FDA4B8",
  "brand/accent/400": "#FB7196",
  "brand/accent/500": "#F43F68",
  "brand/accent/600": "#E11D50",
  "brand/accent/700": "#BE123C",
  "brand/accent/800": "#9F1239",
  "brand/accent/900": "#881337",

  "brand/secondary/50": "#FAF5FF",
  "brand/secondary/100": "#F3E8FF",
  "brand/secondary/200": "#E9D5FF",
  "brand/secondary/300": "#D8B4FE",
  "brand/secondary/400": "#C084FC",
  "brand/secondary/500": "#A855F7",
  "brand/secondary/600": "#9333EA",
  "brand/secondary/700": "#7C3AED",
  "brand/secondary/800": "#6B21A8",
  "brand/secondary/900": "#581C87",

  // Semantic Colors
  "semantic/success": "#10B981",
  "semantic/success-light": "#D1FAE5",
  "semantic/warning": "#F59E0B",
  "semantic/warning-light": "#FEF3C7",
  "semantic/error": "#EF4444",
  "semantic/error-light": "#FEE2E2",
  "semantic/info": "#3B82F6",
  "semantic/info-light": "#DBEAFE",

  // Feeling Colors
  "feeling/bem": "#FFE4B5",
  "feeling/cansada": "#BAE6FD",
  "feeling/indisposta": "#DDD6FE",
  "feeling/amada": "#FFD0E0",
  "feeling/ansiosa": "#FED7AA",

  // Maternal Journey
  "maternal/tentando": "#FFF7ED",
  "maternal/gravidez": "#FDF4FF",
  "maternal/pos-natal": "#FEF2F2",
  "maternal/amamentacao": "#F0FDF4",
  "maternal/maternidade": "#FFF1F2",

  // Surface Colors (Light Mode)
  "surface/base": "#F8FCFF",
  "surface/card": "#FFFFFF",
  "surface/elevated": "#FFFFFF",
  "surface/tertiary": "#F0F9FF",

  // Text Colors (Light Mode)
  "text/primary": "#1F2937",
  "text/secondary": "#6B7280",
  "text/tertiary": "#9CA3AF",
  "text/muted": "#D1D5DB",
  "text/inverse": "#F9FAFB",
};

// Spacing tokens
const spacingTokens = {
  "spacing/xs": 4,
  "spacing/sm": 8,
  "spacing/md": 12,
  "spacing/lg": 16,
  "spacing/xl": 20,
  "spacing/2xl": 24,
  "spacing/3xl": 32,
  "spacing/4xl": 40,
  "spacing/5xl": 48,
  "spacing/6xl": 64,
  "spacing/7xl": 80,
  "spacing/8xl": 96,
};

// Border Radius tokens
const radiusTokens = {
  "radius/none": 0,
  "radius/xs": 4,
  "radius/sm": 8,
  "radius/md": 12,
  "radius/lg": 16,
  "radius/xl": 20,
  "radius/2xl": 24,
  "radius/3xl": 28,
  "radius/full": 9999,
};

// Typography tokens
const typographyTokens = {
  "font/sans": "Manrope",
  "font/serif": "DM Serif Display",
  "font/display": "DM Serif Display",
};

// Formato Figma Variables JSON
const figmaVariables = {
  $figmaStylesVersion: "1.0.0",
  $figmaCollectionName: "Nossa Maternidade - Design Tokens 2025",
  $figmaDescription: "Pink Clean + Blue Clean - Design System completo para app de saúde maternal",

  // Coleções de variáveis
  collections: [
    {
      name: "Colors",
      modes: ["Light", "Dark"],
      variables: Object.entries(designTokens).map(([name, value]) => ({
        name: name.replace(/\//g, "/"),
        type: "COLOR",
        valuesByMode: {
          Light: value,
          Dark: value, // TODO: adicionar valores dark mode
        },
      })),
    },
    {
      name: "Spacing",
      modes: ["Default"],
      variables: Object.entries(spacingTokens).map(([name, value]) => ({
        name: name.replace(/\//g, "/"),
        type: "FLOAT",
        valuesByMode: {
          Default: value,
        },
      })),
    },
    {
      name: "Radius",
      modes: ["Default"],
      variables: Object.entries(radiusTokens).map(([name, value]) => ({
        name: name.replace(/\//g, "/"),
        type: "FLOAT",
        valuesByMode: {
          Default: value,
        },
      })),
    },
    {
      name: "Typography",
      modes: ["Default"],
      variables: Object.entries(typographyTokens).map(([name, value]) => ({
        name: name.replace(/\//g, "/"),
        type: "STRING",
        valuesByMode: {
          Default: value,
        },
      })),
    },
  ],
};

// Salvar arquivo
const outputPath = path.join(__dirname, "..", "figma-variables.json");
fs.writeFileSync(outputPath, JSON.stringify(figmaVariables, null, 2), "utf-8");

console.log("✅ Figma Variables exportadas com sucesso!");
console.log(`📁 Arquivo: ${outputPath}`);
console.log("\n📖 Como importar no Figma:");
console.log("1. Abra seu arquivo Figma");
console.log("2. Vá em: Menu → Plugins → Import Variables");
console.log("3. Selecione o arquivo: figma-variables.json");
console.log("4. Confirme a importação\n");
console.log("🎨 Total de variáveis exportadas:");
console.log(`   - Cores: ${Object.keys(designTokens).length}`);
console.log(`   - Spacing: ${Object.keys(spacingTokens).length}`);
console.log(`   - Radius: ${Object.keys(radiusTokens).length}`);
console.log(`   - Typography: ${Object.keys(typographyTokens).length}`);
console.log(
  `   - TOTAL: ${Object.keys(designTokens).length + Object.keys(spacingTokens).length + Object.keys(radiusTokens).length + Object.keys(typographyTokens).length}\n`
);
