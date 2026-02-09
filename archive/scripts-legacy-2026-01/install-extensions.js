#!/usr/bin/env node
/**
 * Instala todas as extensões recomendadas do .vscode/extensions.json
 * Uso: node scripts/install-extensions.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Detectar qual comando CLI está disponível (Cursor ou VS Code)
function detectCliCommand() {
  try {
    execSync("cursor --version", { stdio: "pipe" });
    return "cursor";
  } catch (error) {
    try {
      execSync("code --version", { stdio: "pipe" });
      return "code";
    } catch (err) {
      return null;
    }
  }
}

const cliCommand = detectCliCommand();

if (!cliCommand) {
  console.error("❌ Cursor ou VS Code CLI não encontrado!");
  console.error("   Instale o Cursor ou VS Code e certifique-se de que o comando está no PATH.");
  process.exit(1);
}

console.log(`📦 Instalando extensões recomendadas (usando: ${cliCommand})...\n`);

const extensionsFile = path.join(__dirname, "..", ".vscode", "extensions.json");

if (!fs.existsSync(extensionsFile)) {
  console.error("❌ Arquivo .vscode/extensions.json não encontrado!");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(extensionsFile, "utf-8"));
const extensions = config.recommendations || [];

if (extensions.length === 0) {
  console.log("⚠️  Nenhuma extensão recomendada encontrada.");
  process.exit(0);
}

console.log(`   Total: ${extensions.length} extensões\n`);

let installed = 0;
let failed = 0;

extensions.forEach((ext, index) => {
  try {
    console.log(`   [${index + 1}/${extensions.length}] ${ext}...`);
    execSync(`${cliCommand} --install-extension ${ext}`, { stdio: "pipe" });
    installed++;
  } catch (error) {
    console.error(`   ❌ Erro ao instalar ${ext}`);
    failed++;
  }
});

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`✅ Instaladas: ${installed}`);
if (failed > 0) {
  console.log(`❌ Falhas: ${failed}`);
}
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("🔄 Reinicie o Cursor para aplicar as mudanças.");
