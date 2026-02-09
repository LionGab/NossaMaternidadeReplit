#!/usr/bin/env node
/**
 * Verifica se todas as configurações estão sincronizadas corretamente
 * Uso: node scripts/verify-sync.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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

console.log("🔍 Verificando sincronização de configurações...\n");

let errors = 0;
let warnings = 0;

// ============================================
// 1. Arquivos do Projeto (via Git)
// ============================================
console.log("📁 Configurações do Projeto (via Git):");

const projectFiles = [
  ".vscode/settings.json",
  ".vscode/extensions.json",
  ".claude/settings.local.json",
  ".cursorrules",
  "claude.md",
  "tailwind.config.js",
];

projectFiles.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  const exists = fs.existsSync(filePath);

  if (exists) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} (AUSENTE)`);
    errors++;
  }
});

// ============================================
// 2. Extensões Instaladas
// ============================================
console.log("\n🔌 Extensões Recomendadas:");

const extensionsFile = path.join(__dirname, "..", ".vscode", "extensions.json");

if (fs.existsSync(extensionsFile)) {
  // Remove comentários do JSON antes de parsear (JSON com comentários não é válido)
  const fileContent = fs.readFileSync(extensionsFile, "utf-8");
  const jsonWithoutComments = fileContent.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  const config = JSON.parse(jsonWithoutComments);
  const required = config.recommendations || [];

  const cliCommand = detectCliCommand();
  let installed = [];

  if (cliCommand) {
    try {
      installed = execSync(`${cliCommand} --list-extensions`, { encoding: "utf-8" })
        .split("\n")
        .filter(Boolean);
    } catch (error) {
      console.log(`   ⚠️  Não foi possível listar extensões (comando "${cliCommand}" falhou)`);
      warnings++;
    }
  } else {
    console.log("   ⚠️  Cursor ou VS Code CLI não encontrado (não é possível verificar extensões)");
    warnings++;
  }

  required.forEach((ext) => {
    const isInstalled = installed.some((i) => i.toLowerCase() === ext.toLowerCase());

    if (isInstalled) {
      console.log(`   ✅ ${ext}`);
    } else {
      console.log(`   ⚠️  ${ext} (NÃO INSTALADA)`);
      warnings++;
    }
  });
} else {
  console.log("   ❌ .vscode/extensions.json não encontrado");
  errors++;
}

// ============================================
// 3. Settings Sync (VS Code/Cursor)
// ============================================
console.log("\n☁️  Settings Sync (Cursor):");

try {
  // Verificar se o settings sync está configurado
  const userDataDir =
    process.platform === "win32"
      ? path.join(process.env.APPDATA || "", "Cursor", "User")
      : path.join(process.env.HOME || "", "Library", "Application Support", "Cursor", "User");

  const settingsPath = path.join(userDataDir, "settings.json");

  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

    if (settings["settingsSync.keybindingsPerPlatform"] !== undefined) {
      console.log("   ✅ Settings Sync configurado");
    } else {
      console.log("   ⚠️  Settings Sync não detectado (verifique manualmente)");
      warnings++;
    }
  } else {
    console.log("   ⚠️  Arquivo de settings do Cursor não encontrado");
    warnings++;
  }
} catch (error) {
  console.log("   ⚠️  Não foi possível verificar Settings Sync");
  warnings++;
}

// ============================================
// 4. Claude Code Config
// ============================================
console.log("\n🤖 Claude Code:");

const claudeConfigDir = path.join(
  process.env.HOME || process.env.USERPROFILE || "",
  ".config",
  "claude-code"
);
const claudeConfigFile = path.join(claudeConfigDir, "config.json");

if (fs.existsSync(claudeConfigFile)) {
  console.log("   ✅ config.json");
} else {
  console.log("   ⚠️  config.json (não encontrado)");
  warnings++;
}

const mcpSettingsFile = path.join(claudeConfigDir, "mcp-settings.json");

if (fs.existsSync(mcpSettingsFile)) {
  console.log("   ✅ mcp-settings.json");
} else {
  console.log("   ⚠️  mcp-settings.json (não encontrado)");
  warnings++;
}

// ============================================
// 5. MCP Servers
// ============================================
console.log("\n🌐 MCP Servers:");

// MCP Config - aceitar ambos os paths
const mcpConfigPaths = [
  ".mcp.json", // Prioridade 1: root (padrão atual)
  ".claude/mcp-config.json", // Prioridade 2: legacy/alternativo
];

let mcpConfigPath = null;
for (const p of mcpConfigPaths) {
  const fullPath = path.join(__dirname, "..", p);
  if (fs.existsSync(fullPath)) {
    mcpConfigPath = fullPath;
    console.log(`   ✅ MCP config encontrado: ${p}`);
    break;
  }
}

if (mcpConfigPath) {
  const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, "utf-8"));
  const servers = Object.keys(mcpConfig.mcpServers || {});

  if (servers.length > 0) {
    console.log(`   ✅ ${servers.length} servidor(es) configurado(s):`);
    servers.slice(0, 5).forEach((server) => {
      console.log(`      • ${server}`);
    });

    if (servers.length > 5) {
      console.log(`      ... e mais ${servers.length - 5}`);
    }
  } else {
    console.log("   ⚠️  Nenhum servidor MCP configurado");
    warnings++;
  }
} else {
  console.log("   ❌ MCP config não encontrado (.mcp.json ou .claude/mcp-config.json)");
  errors++;
}

// ============================================
// 6. Git Status
// ============================================
console.log("\n📦 Git Status:");

try {
  const gitStatus = execSync("git status --porcelain", { encoding: "utf-8" });

  if (gitStatus.trim() === "") {
    console.log("   ✅ Working directory limpo");
  } else {
    const changedFiles = gitStatus.split("\n").filter(Boolean).length;
    console.log(`   ⚠️  ${changedFiles} arquivo(s) modificado(s) (considere commit/push)`);
  }
} catch (error) {
  console.log("   ⚠️  Não é um repositório Git");
  warnings++;
}

// ============================================
// Resumo Final
// ============================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

if (errors === 0 && warnings === 0) {
  console.log("✅ Tudo sincronizado corretamente!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} erro(s) crítico(s) encontrado(s)`);
  }

  if (warnings > 0) {
    console.log(`⚠️  ${warnings} aviso(s) encontrado(s)`);
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (warnings > 0 && errors === 0) {
    console.log("💡 Recomendações:");
    console.log("   npm run sync:install-extensions  # Instalar extensões faltantes");
    console.log("   npm run sync:import-claude       # Importar configs do Claude");
    console.log("   npm run sync:fix-mcp-paths       # Ajustar paths do MCP\n");
  } else if (errors > 0) {
    console.log("🚨 Ações necessárias:");
    console.log("   git pull                         # Sincronizar arquivos do projeto");
    console.log("   npm install                      # Atualizar dependências");
    console.log("   npm run sync:all                 # Sincronizar tudo\n");
    process.exit(1);
  }
}
