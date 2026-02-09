#!/usr/bin/env node

/**
 * Script para atualizar paleta de cores do tailwind.config.js
 * Migração CONSERVADORA: Site institucional (Rosa Nude + Menta)
 */

const fs = require("fs");
const path = require("path");

// Definições das novas paletas (escalas completas 50-900)
const NEW_PALETTES = {
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
};

function generatePaletteString(name, palette, indent = "      ") {
  let str = `${indent}${name}: {\n`;

  // Ordem: 50, 100, 200, ..., 900, DEFAULT
  const order = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "DEFAULT",
    "muted",
  ];

  order.forEach((key) => {
    if (palette[key]) {
      str += `${indent}  ${key}: "${palette[key]}",\n`;
    }
  });

  str += `${indent}},\n`;
  return str;
}

function updateTailwindConfig() {
  const configPath = path.join(__dirname, "..", "tailwind.config.js");

  console.log("📖 Lendo tailwind.config.js...");
  let content = fs.readFileSync(configPath, "utf8");

  // 1. Adicionar novas paletas ANTES de primary
  console.log("✨ Adicionando novas paletas (rosa, menta, nude, texto)...");
  const primaryIndex = content.indexOf("      primary: {");

  if (primaryIndex === -1) {
    throw new Error('Não encontrou "primary: {" no arquivo');
  }

  const newPalettes =
    generatePaletteString("rosa", NEW_PALETTES.rosa) +
    generatePaletteString("menta", NEW_PALETTES.menta) +
    generatePaletteString("nude", NEW_PALETTES.nude) +
    generatePaletteString("texto", NEW_PALETTES.texto);

  content = content.slice(0, primaryIndex) + newPalettes + content.slice(primaryIndex);

  // 2. Substituir valores de primary com menta
  console.log("🔄 Substituindo primary com menta...");
  const primaryPalette = generatePaletteString("primary", NEW_PALETTES.menta);
  content = content.replace(/primary: \{[^}]*50:[^}]*\}/s, primaryPalette.trim());

  // 3. Substituir valores de accent com rosa (usando 600 como DEFAULT para contraste)
  console.log("🔄 Substituindo accent com rosa[600] (contraste WCAG)...");
  const accentPalette = generatePaletteString("accent", {
    ...NEW_PALETTES.rosa,
    DEFAULT: NEW_PALETTES.rosa[600], // #A07676 para contraste adequado
  });
  content = content.replace(/accent: \{[^}]*50:[^}]*\}/s, accentPalette.trim());

  // 4. Salvar arquivo
  console.log("💾 Salvando tailwind.config.js...");
  fs.writeFileSync(configPath, content, "utf8");

  console.log("✅ tailwind.config.js atualizado com sucesso!");
  console.log("\n📋 Resumo das mudanças:");
  console.log("  ✅ Adicionadas 4 paletas: rosa, menta, nude, texto");
  console.log("  ✅ primary → menta (#A8C5B5)");
  console.log("  ✅ accent → rosa[600] (#A07676) para contraste");
}

try {
  updateTailwindConfig();
} catch (error) {
  console.error("❌ Erro ao atualizar tailwind.config.js:");
  console.error(error.message);
  process.exit(1);
}
