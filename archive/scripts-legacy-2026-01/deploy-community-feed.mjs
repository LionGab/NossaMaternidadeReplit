#!/usr/bin/env node
/* eslint-disable no-console */
import { spawnSync } from "node:child_process";

function exitWith(msg, code = 1) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(code);
}

const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
if (!token) {
  exitWith(
    [
      "SUPABASE_ACCESS_TOKEN não definido.",
      "Gere um Personal Access Token no Supabase Dashboard (Account → Access Tokens).",
      "O token correto começa com: sbp_...",
      "",
      "Exemplos:",
      "  macOS/Linux (bash/zsh): export SUPABASE_ACCESS_TOKEN=sbp_********",
      "  Windows (PowerShell):   $env:SUPABASE_ACCESS_TOKEN='sbp_********'",
      "",
      "Depois rode novamente:",
      "  npm run supabase:deploy:community-feed",
    ].join("\n")
  );
}

if (!token.startsWith("sbp_")) {
  exitWith(
    [
      "SUPABASE_ACCESS_TOKEN inválido: o Supabase CLI espera um Personal Access Token no formato sbp_...",
      "Você provavelmente colou uma API key do projeto (anon/service, geralmente começa com eyJ...).",
      "Crie um PAT (sbp_...) no Supabase Dashboard (Account → Access Tokens) e tente novamente.",
    ].join("\n")
  );
}

const args = ["supabase", "functions", "deploy", "community-feed"];

const projectRef = process.env.SUPABASE_PROJECT_REF?.trim();
if (projectRef) {
  args.push("--project-ref", projectRef);
} else {
  console.log("ℹ️  SUPABASE_PROJECT_REF não definido. Se o CLI pedir project ref, defina essa env var para evitar prompts.");
}

console.log("🚀 Deploying Edge Function: community-feed");
console.log("   (usando SUPABASE_ACCESS_TOKEN via env; sem login interativo)\n");

const result = spawnSync("npx", args, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    SUPABASE_ACCESS_TOKEN: token,
  },
});

if (result.error) {
  exitWith(`Falha ao executar o Supabase CLI: ${result.error.message}`);
}

process.exit(result.status ?? 1);
