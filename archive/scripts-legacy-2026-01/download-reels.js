#!/usr/bin/env node
/**
 * Script para baixar Reels mais vistos do Instagram da Nathália
 * Usa yt-dlp (mais eficiente que outras ferramentas)
 *
 * Instalação: brew install yt-dlp (Mac) ou pip install yt-dlp
 * Uso: node scripts/download-reels.js
 */

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "onboarding", "videos");
const INSTAGRAM_USER = "nathaliavalente";

// Reels essenciais identificados no código
const ESSENTIAL_REELS = [
  {
    id: "DOhD-3nEt79",
    url: "https://www.instagram.com/reel/DOhD-3nEt79/",
    filename: "mundo-parto-relato.mp4",
    title: "Meu relato de parto 🩵",
    priority: 1,
  },
  {
    id: "DSGFrJECX0X",
    url: "https://www.instagram.com/reel/DSGFrJECX0X/",
    filename: "mundo-nath-africa.mp4",
    title: "Nathalia se emociona ao falar da alimentação",
    priority: 1,
  },
  {
    id: "DQzcsyvDmTV",
    url: "https://www.instagram.com/p/DQzcsyvDmTV/",
    filename: "home-hero-2meses.mp4",
    title: "2 meses do nosso mini homenzinho",
    priority: 1,
  },
  {
    id: "DN6p40GjgmB",
    url: "https://www.instagram.com/p/DN6p40GjgmB/",
    filename: "gestacao-ensaio.mp4",
    title: "Meu ensaio de gestante",
    priority: 2,
  },
];

// Verificar se yt-dlp está instalado
function checkYtDlp() {
  try {
    execSync("yt-dlp --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Instalar yt-dlp (Mac)
function installYtDlp() {
  console.log("📦 yt-dlp não encontrado. Tentando instalar...\n");

  try {
    console.log("Instalando via Homebrew...");
    execSync("brew install yt-dlp", { stdio: "inherit" });
    console.log("✅ yt-dlp instalado com sucesso!\n");
    return true;
  } catch (error) {
    console.log("❌ Falha ao instalar via Homebrew");
    console.log("\n💡 Instale manualmente:");
    console.log("   Mac: brew install yt-dlp");
    console.log("   Linux: pip install yt-dlp");
    console.log("   Windows: pip install yt-dlp");
    return false;
  }
}

// Baixar um Reel específico
function downloadReel(reel, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n📥 Baixando: ${reel.title}`);
    console.log(`   URL: ${reel.url}`);
    console.log(`   Arquivo: ${reel.filename}`);

    const args = [
      reel.url,
      "-f",
      "best[ext=mp4]/best", // Melhor qualidade MP4
      "-o",
      outputPath,
      "--no-playlist",
      "--no-warnings",
      "--quiet",
      "--progress",
    ];

    const process = spawn("yt-dlp", args);

    let errorOutput = "";

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) {
        if (fs.existsSync(outputPath)) {
          const stats = fs.statSync(outputPath);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          console.log(`✅ Baixado com sucesso! (${sizeMB} MB)`);
          resolve(outputPath);
        } else {
          reject(new Error("Arquivo não foi criado"));
        }
      } else {
        reject(new Error(`yt-dlp falhou com código ${code}: ${errorOutput}`));
      }
    });

    process.on("error", (error) => {
      reject(new Error(`Erro ao executar yt-dlp: ${error.message}`));
    });
  });
}

// Baixar Reels mais populares do perfil
async function downloadTopReels(limit = 10) {
  console.log(`\n🔍 Buscando ${limit} Reels mais populares de @${INSTAGRAM_USER}...\n`);

  const outputTemplate = path.join(OUTPUT_DIR, "%(title)s.%(ext)s");

  return new Promise((resolve, reject) => {
    const args = [
      `https://www.instagram.com/${INSTAGRAM_USER}/reels/`,
      "-f",
      "best[ext=mp4]/best",
      "-o",
      outputTemplate,
      "--playlist-end",
      limit.toString(),
      "--no-warnings",
      "--quiet",
      "--progress",
      "--sort",
      "view_count", // Ordenar por visualizações
    ];

    const process = spawn("yt-dlp", args);

    process.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${limit} Reels baixados com sucesso!`);
        resolve();
      } else {
        reject(new Error(`Falha ao baixar Reels (código ${code})`));
      }
    });

    process.on("error", (error) => {
      reject(new Error(`Erro: ${error.message}`));
    });
  });
}

// Função principal
async function main() {
  console.log("🎬 Download de Reels do Instagram - Nathália Valente\n");
  console.log("=".repeat(60));

  // Criar diretório se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Diretório criado: ${OUTPUT_DIR}\n`);
  }

  // Verificar yt-dlp
  if (!checkYtDlp()) {
    if (!installYtDlp()) {
      process.exit(1);
    }
  }

  const ytDlpVersion = execSync("yt-dlp --version", { encoding: "utf-8" }).trim();
  console.log(`✅ yt-dlp ${ytDlpVersion} encontrado\n`);

  // Opção 1: Baixar Reels essenciais específicos
  console.log("📋 Reels Essenciais (prioridade alta):\n");
  for (const reel of ESSENTIAL_REELS.filter((r) => r.priority === 1)) {
    const outputPath = path.join(OUTPUT_DIR, reel.filename);

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Já existe: ${reel.filename}`);
      continue;
    }

    try {
      await downloadReel(reel, outputPath);
    } catch (error) {
      console.log(`❌ Erro ao baixar ${reel.filename}: ${error.message}`);
      console.log("💡 Tente baixar manualmente ou verifique a URL");
    }
  }

  // Opção 2: Baixar Reels mais populares do perfil
  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Deseja baixar os Reels mais populares do perfil?");
  console.log("   (Isso pode levar alguns minutos e requer login no Instagram)");
  console.log("\n   Para fazer isso manualmente:");
  console.log(`   yt-dlp "https://www.instagram.com/${INSTAGRAM_USER}/reels/" --sort view_count`);

  // Resumo
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Resumo dos Downloads:\n");

  const downloaded = [];
  const missing = [];

  ESSENTIAL_REELS.forEach((reel) => {
    const filePath = path.join(OUTPUT_DIR, reel.filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      downloaded.push({ ...reel, size: sizeMB });
    } else {
      missing.push(reel);
    }
  });

  if (downloaded.length > 0) {
    console.log("✅ Baixados:");
    downloaded.forEach((reel) => {
      console.log(`   • ${reel.filename} (${reel.size} MB)`);
    });
  }

  if (missing.length > 0) {
    console.log("\n❌ Faltando:");
    missing.forEach((reel) => {
      console.log(`   • ${reel.filename}`);
      console.log(`     URL: ${reel.url}`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Próximos passos:");
  console.log("   1. Verifique os vídeos baixados em:", OUTPUT_DIR);
  console.log("   2. Atualize os caminhos em src/config/nath-content.ts se necessário");
  console.log("   3. Para vídeos de onboarding (welcome, paywall), grave com Nathália");
}

// Executar
if (require.main === module) {
  main().catch((error) => {
    console.error("\n❌ Erro fatal:", error.message);
    process.exit(1);
  });
}

module.exports = { downloadReel, downloadTopReels };
