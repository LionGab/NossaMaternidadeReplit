#!/usr/bin/env node
/**
 * Importa configurações do Claude Code de outro PC
 * Uso: node scripts/import-claude-settings.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const isWindows = os.platform() === "win32";
const claudeConfigDir = path.join(os.homedir(), ".config", "claude-code");

const exportDir = path.join(__dirname, "..", ".claude-export");

console.log("📥 Importando configurações do Claude Code...\n");
console.log(`   Origem: ${exportDir}`);
console.log(`   Destino: ${claudeConfigDir}\n`);

if (!fs.existsSync(exportDir)) {
  console.log("⚠️  Nenhuma exportação encontrada.");
  console.log('   Execute "npm run sync:export-claude" no outro PC e faça git push.');
  console.log('   Depois execute "git pull" aqui e tente novamente.');
  process.exit(0);
}

if (!fs.existsSync(claudeConfigDir)) {
  console.log("   Criando diretório de configuração...");
  fs.mkdirSync(claudeConfigDir, { recursive: true });
}

const filesToImport = ["config.json", "mcp-settings.json"];

let imported = 0;

filesToImport.forEach((file) => {
  const src = path.join(exportDir, file);
  const dest = path.join(claudeConfigDir, file);

  if (fs.existsSync(src)) {
    // Fazer backup do arquivo existente
    if (fs.existsSync(dest)) {
      const backupPath = `${dest}.backup`;
      fs.copyFileSync(dest, backupPath);
      console.log(`   🔄 Backup criado: ${path.basename(backupPath)}`);
    }

    fs.copyFileSync(src, dest);
    console.log(`   ✅ ${file}`);
    imported++;
  } else {
    console.log(`   ⚠️  ${file} (não encontrado na exportação)`);
  }
});

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`✅ ${imported} arquivo(s) importado(s)`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("🔄 Reinicie o Cursor para aplicar as mudanças.");
console.log("💡 Se o Claude Code não funcionar, verifique se as API keys estão configuradas.");
