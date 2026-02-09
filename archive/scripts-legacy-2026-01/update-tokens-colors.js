#!/usr/bin/env node

/**
 * Script para atualizar paleta de cores do src/theme/tokens.ts
 * Migração CONSERVADORA: Site institucional (Rosa Nude + Menta)
 */

const fs = require("fs");
const path = require("path");

// Definições das novas paletas (escalas completas 50-900)
const NEW_PALETTES = {
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
  },
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
  },
};

function updateTokens() {
  const tokensPath = path.join(__dirname, "..", "src", "theme", "tokens.ts");

  console.log("📖 Lendo src/theme/tokens.ts...");
  let content = fs.readFileSync(tokensPath, "utf8");

  // 1. Atualizar header comment
  console.log("📝 Atualizando header com nova paleta...");
  content = content.replace(
    /Paleta oficial: Calm FemTech \(Azul \+ Rosa\)/,
    "Paleta oficial: Natural Earth (Rosa Nude + Menta)"
  );

  // 2. Substituir brand.primary (azul → menta)
  console.log("🔄 Substituindo brand.primary com menta...");

  // Encontrar o bloco primary completo e substituir
  const primaryRegex =
    /primary: \{[\s\S]*?50: ["']#F5FBFD["'],[\s\S]*?900: ["']#143D4D["'],[\s\S]*?\},/;

  const newPrimaryBlock = `primary: {
    50: "#F4F9F6", // Background principal - off-white menta
    100: "#E5F0EB", // Highlights, cards - menta muito claro
    200: "#C9E0D5", // Border subtle - menta pastel suave
    300: "#A8C5B5", // Hover states - menta pastel médio ✨
    400: "#8FB3A0", // Active elements - menta pastel principal
    500: "#7A9E8E", // Principal - menta pastel vibrante
    600: "#648273", // CTA secundário
    700: "#516A5E", // Links, ícones
    800: "#42554C", // Textos sobre claro
    900: "#36463F", // Headings
  },`;

  content = content.replace(primaryRegex, newPrimaryBlock);

  // 3. Substituir brand.accent (rosa claro → rosa nude com 600 como destaque)
  console.log("🔄 Substituindo brand.accent com rosa nude...");

  const accentRegex =
    /accent: \{[\s\S]*?50: ["']#FEF7F9["'],[\s\S]*?900: ["']#8A3D52["'],[\s\S]*?\},/;

  const newAccentBlock = `accent: {
    50: "#FDF8F8", // Background accent suave - quase branco rosado
    100: "#F5E6E8", // Highlight rosa - rosa muito claro
    200: "#EBCDD0", // Border rosa - rosa pastel suave
    300: "#D4A5A5", // Hover - rosa pastel médio
    400: "#C48E8E", // Active - rosa pastel
    500: "#B88B8B", // Rosa médio
    600: "#A07676", // CTA PRINCIPAL - rosa nude premium (contraste WCAG) ✨
    700: "#876363", // CTA pressed
    800: "#6E5050", // Text accent
    900: "#5A4242", // Heading accent (raro)
  },`;

  content = content.replace(accentRegex, newAccentBlock);

  // 4. Salvar arquivo
  console.log("💾 Salvando src/theme/tokens.ts...");
  fs.writeFileSync(tokensPath, content, "utf8");

  console.log("✅ src/theme/tokens.ts atualizado com sucesso!");
  console.log("\n📋 Resumo das mudanças:");
  console.log("  ✅ Header: Calm FemTech → Natural Earth");
  console.log("  ✅ brand.primary → menta (#A8C5B5)");
  console.log("  ✅ brand.accent → rosa nude (#A07676 para CTAs)");
  console.log("\n🔒 PRESERVADO (migração conservadora):");
  console.log("  ✅ brand.secondary (lilac)");
  console.log("  ✅ brand.teal");
  console.log("  ✅ feeling.* (cores vibrantes)");
  console.log("  ✅ gradients.*");
  console.log("  ✅ nathAccent.* (coral)");
}

try {
  updateTokens();
} catch (error) {
  console.error("❌ Erro ao atualizar src/theme/tokens.ts:");
  console.error(error.message);
  process.exit(1);
}
