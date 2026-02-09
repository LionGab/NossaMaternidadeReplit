#!/usr/bin/env node
/**
 * Exporta configurações do Claude Code para sincronização entre PCs
 * Uso: node scripts/export-claude-settings.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const isWindows = os.platform() === "win32";
const claudeConfigDir = path.join(os.homedir(), ".config", "claude-code");

const exportDir = path.join(__dirname, "..", ".claude-export");

console.log("📤 Exportando configurações do Claude Code...\n");
console.log(`   Origem: ${claudeConfigDir}`);
console.log(`   Destino: ${exportDir}\n`);

if (!fs.existsSync(claudeConfigDir)) {
  console.log("⚠️  Configurações do Claude Code não encontradas.");
  console.log("   Certifique-se de que o Claude Code está instalado e configurado.");
  process.exit(0);
}

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Arquivos para exportar (NUNCA exportar .env)
const filesToExport = ["config.json", "mcp-settings.json"];

let exported = 0;

filesToExport.forEach((file) => {
  const src = path.join(claudeConfigDir, file);
  const dest = path.join(exportDir, file);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`   ✅ ${file}`);
    exported++;
  } else {
    console.log(`   ⚠️  ${file} (não encontrado)`);
  }
});

// Criar .gitignore na pasta de export para não commitar .env por acidente
const gitignorePath = path.join(exportDir, ".gitignore");
const gitignoreContent = `# NUNCA commitar credenciais
.env
*.key
*.pem
*.p12
`;

fs.writeFileSync(gitignorePath, gitignoreContent);

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`✅ ${exported} arquivo(s) exportado(s)`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("📁 Arquivos salvos em: .claude-export/");
console.log("💡 Próximo passo:");
console.log("   git add .claude-export/");
console.log('   git commit -m "chore: Export Claude Code settings"');
console.log("   git push");
