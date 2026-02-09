/**
 * Script para extrair imagens dos screenshots do Instagram
 * Processa os screenshots capturados e extrai as imagens principais
 */

const fs = require("fs");
const path = require("path");

const SCREENSHOTS_DIR = path.join(__dirname, "..", ".playwright-mcp");
const OUTPUT_DIR = path.join(__dirname, "..", "assets", "onboarding", "images");

console.log("📸 Processando screenshots do Instagram...\n");

// Verificar screenshots disponíveis
const screenshots = [
  "nathalia-instagram-profile.png",
  "post-paris-thales-full.png",
  "post-thales-aviao-full.png",
];

screenshots.forEach((screenshot) => {
  const screenshotPath = path.join(SCREENSHOTS_DIR, screenshot);
  if (fs.existsSync(screenshotPath)) {
    const stats = fs.statSync(screenshotPath);
    console.log(`✅ ${screenshot} (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(`❌ ${screenshot} - Não encontrado`);
  }
});

console.log("\n💡 Os screenshots foram salvos em:", SCREENSHOTS_DIR);
console.log("💡 Você pode usar esses screenshots como referência visual");
console.log("\n📋 Próximos passos:");
console.log("1. Abra os screenshots para ver as imagens");
console.log("2. Use uma ferramenta de edição para recortar as imagens principais");
console.log("3. Salve as imagens recortadas em:", OUTPUT_DIR);
console.log("\n🔧 Alternativa: Use uma ferramenta online como:");
console.log("   - https://www.iloveimg.com/crop-image");
console.log("   - https://www.photopea.com/");
console.log("   - Recorte manualmente usando Preview (Mac) ou Paint (Windows)");
