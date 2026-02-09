#!/usr/bin/env node
/**
 * Ajusta paths do MCP config para o OS atual (macOS vs Windows)
 * Uso: node scripts/fix-mcp-paths.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const mcpConfigPath = path.join(__dirname, "..", ".claude", "mcp-config.json");

console.log("🔧 Ajustando paths do MCP config para o OS atual...\n");

if (!fs.existsSync(mcpConfigPath)) {
  console.log("⚠️  mcp-config.json não encontrado.");
  console.log(`   Esperado em: ${mcpConfigPath}`);
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(mcpConfigPath, "utf-8"));
const projectPath = path.join(__dirname, "..");
const isWindows = os.platform() === "win32";

let changesCount = 0;

// Ajustar filesystem MCP server (path absoluto do projeto)
if (config.mcpServers && config.mcpServers.filesystem) {
  const oldArgs = JSON.stringify(config.mcpServers.filesystem.args);

  config.mcpServers.filesystem.args = ["@modelcontextprotocol/server-filesystem", projectPath];

  const newArgs = JSON.stringify(config.mcpServers.filesystem.args);

  if (oldArgs !== newArgs) {
    console.log(`   ✅ filesystem MCP: ${projectPath}`);
    changesCount++;
  } else {
    console.log(`   ℹ️  filesystem MCP: já configurado corretamente`);
  }
}

// Ajustar inspector command (se existir)
if (
  config.mcpServers &&
  config.mcpServers.filesystem &&
  config.mcpServers.filesystem.inspectorCommand
) {
  config.mcpServers.filesystem.inspectorCommand = `npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem ${projectPath}`;
  console.log(`   ✅ inspector command atualizado`);
  changesCount++;
}

// Salvar apenas se houve mudanças
if (changesCount > 0) {
  fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2));

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ ${changesCount} ajuste(s) realizado(s)`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("🔄 Recarregue os MCP servers no Cursor:");
  console.log('   Cmd/Ctrl + Shift + P → "Claude Code: Reload MCP Servers"');
} else {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ℹ️  Nenhum ajuste necessário");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}
