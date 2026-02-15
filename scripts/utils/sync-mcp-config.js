#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const fileRoot = path.join(root, ".mcp.json");
const fileClaude = path.join(root, ".claude", "mcp-config.json");

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

// Sync behavior:
// - If only one exists, create the other from it.
// - If both exist and differ, exit 1 and print diff summary.

const hasRoot = fs.existsSync(fileRoot);
const hasClaude = fs.existsSync(fileClaude);

if (!hasRoot && !hasClaude) {
  console.error("No MCP config found (neither .mcp.json nor .claude/mcp-config.json)");
  process.exit(2);
}

if (hasRoot && !hasClaude) {
  const obj = readJSON(fileRoot);
  const dir = path.dirname(fileClaude);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  writeJSON(fileClaude, obj);
  console.log("✅ Created .claude/mcp-config.json from .mcp.json");
  process.exit(0);
}

if (!hasRoot && hasClaude) {
  const obj = readJSON(fileClaude);
  writeJSON(fileRoot, obj);
  console.log("✅ Created .mcp.json from .claude/mcp-config.json");
  process.exit(0);
}

// both exist — compare canonicalized JSON
const a = JSON.stringify(readJSON(fileClaude));
const b = JSON.stringify(readJSON(fileRoot));

if (a === b) {
  console.log("✅ .mcp.json and .claude/mcp-config.json are identical");
  process.exit(0);
}

console.error("❌ .mcp.json and .claude/mcp-config.json differ. Please reconcile.");
// show minimal diff: list keys present in one and not the other
const A = readJSON(fileClaude);
const B = readJSON(fileRoot);
const keysA = Object.keys(A.mcpServers || {}).sort();
const keysB = Object.keys(B.mcpServers || {}).sort();

const onlyA = keysA.filter((k) => !keysB.includes(k));
const onlyB = keysB.filter((k) => !keysA.includes(k));

if (onlyA.length)
  console.error("  In .claude/mcp-config.json but not .mcp.json:", onlyA.join(", "));
if (onlyB.length)
  console.error("  In .mcp.json but not .claude/mcp-config.json:", onlyB.join(", "));

process.exit(3);
