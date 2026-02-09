#!/usr/bin/env node

/**
 * Verificador de Baseline de Acessibilidade para CI
 *
 * Compara o relatório atual com o baseline e falha se:
 * - Houver novos BLOCKERs (HIGH confidence)
 * - Cobertura cair abaixo dos thresholds
 * - Número de novos MAJORs exceder limite
 *
 * @author Claude Code
 * @version 1.1.0
 */

const fs = require("fs");
const path = require("path");

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const CONFIG = {
  reportPath: path.resolve(__dirname, "../docs/AUDIT_A11Y_DEEP_REPORT.json"),
  baselinePath: path.resolve(__dirname, "../docs/a11y-baseline.json"),

  // Thresholds mínimos (piso fixo)
  thresholds: {
    labelCoverage: 80, // Mínimo 80% de interativos com label
    roleCoverage: 70, // Mínimo 70% de interativos com role
    imagesHandled: 90, // Mínimo 90% de imagens tratadas
    inputsWithLabel: 95, // Mínimo 95% de inputs com label
    maxNewMajors: 5, // Máximo 5 novos P1 por PR
  },

  // Modo estrito: falha em qualquer novo finding
  strictMode: false,
};

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Carrega JSON com tratamento de erro
 */
function loadJson(filePath, required = true) {
  if (!fs.existsSync(filePath)) {
    if (required) {
      console.error(`❌ Arquivo não encontrado: ${filePath}`);
      process.exit(1);
    }
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error(`❌ Erro ao parsear ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Formata porcentagem com cores
 */
function formatPercent(value, threshold) {
  const passed = value >= threshold;
  const emoji = passed ? "✅" : "❌";
  return `${emoji} ${value}% (mínimo: ${threshold}%)`;
}

// ============================================================================
// VERIFICAÇÕES
// ============================================================================

/**
 * Verifica novos BLOCKERs
 */
function checkNewBlockers(report, baseline) {
  const currentBlockers = report.findings.filter(
    (f) => f.severity === "BLOCKER" && f.confidence === "HIGH"
  );

  if (!baseline) {
    // Sem baseline, todos os BLOCKERs são novos
    return {
      passed: currentBlockers.length === 0,
      newBlockers: currentBlockers,
      message:
        currentBlockers.length === 0
          ? "✅ Nenhum BLOCKER encontrado"
          : `❌ ${currentBlockers.length} BLOCKERs encontrados (sem baseline para comparação)`,
    };
  }

  const baselineFingerprints = new Set(baseline.findings.map((f) => f.fingerprint));
  const newBlockers = currentBlockers.filter((f) => !baselineFingerprints.has(f.fingerprint));

  return {
    passed: newBlockers.length === 0,
    newBlockers,
    message:
      newBlockers.length === 0
        ? "✅ Nenhum novo BLOCKER introduzido"
        : `❌ ${newBlockers.length} novos BLOCKERs introduzidos`,
  };
}

/**
 * Verifica novos MAJORs
 */
function checkNewMajors(report, baseline) {
  const currentMajors = report.findings.filter(
    (f) => f.severity === "MAJOR" && f.confidence !== "LOW"
  );

  if (!baseline) {
    return {
      passed: currentMajors.length <= CONFIG.thresholds.maxNewMajors,
      count: currentMajors.length,
      message: `${currentMajors.length} MAJORs encontrados (sem baseline)`,
    };
  }

  const baselineFingerprints = new Set(baseline.findings.map((f) => f.fingerprint));
  const newMajors = currentMajors.filter((f) => !baselineFingerprints.has(f.fingerprint));

  return {
    passed: newMajors.length <= CONFIG.thresholds.maxNewMajors,
    count: newMajors.length,
    newMajors,
    message:
      newMajors.length <= CONFIG.thresholds.maxNewMajors
        ? `✅ ${newMajors.length} novos MAJORs (limite: ${CONFIG.thresholds.maxNewMajors})`
        : `❌ ${newMajors.length} novos MAJORs excede limite de ${CONFIG.thresholds.maxNewMajors}`,
  };
}

/**
 * Verifica cobertura
 */
function checkCoverage(report) {
  const coverage = report.summary.coverage;

  const checks = [
    {
      name: "Labels em interativos",
      value: coverage.interactiveWithName.percent,
      threshold: CONFIG.thresholds.labelCoverage,
    },
    {
      name: "Roles em interativos",
      value: coverage.interactiveWithRole.percent,
      threshold: CONFIG.thresholds.roleCoverage,
    },
    {
      name: "Imagens tratadas",
      value: coverage.imagesHandled.percent,
      threshold: CONFIG.thresholds.imagesHandled,
    },
    {
      name: "Inputs com label",
      value: coverage.inputsWithLabel.percent,
      threshold: CONFIG.thresholds.inputsWithLabel,
    },
  ];

  const results = checks.map((check) => ({
    ...check,
    passed: check.value >= check.threshold,
    formatted: formatPercent(check.value, check.threshold),
  }));

  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

/**
 * Verifica regressões de cobertura
 */
function checkCoverageRegression(report, baseline) {
  if (!baseline || !baseline.coverage) {
    return { passed: true, message: "✅ Sem baseline para comparação de regressão" };
  }

  const current = report.summary.coverage;
  const previous = baseline.coverage;

  const regressions = [];

  // Permitir até 5% de queda antes de falhar
  const tolerance = 5;

  if (current.interactiveWithName.percent < previous.interactiveWithName.percent - tolerance) {
    regressions.push(
      `Labels: ${previous.interactiveWithName.percent}% → ${current.interactiveWithName.percent}%`
    );
  }
  if (current.interactiveWithRole.percent < previous.interactiveWithRole.percent - tolerance) {
    regressions.push(
      `Roles: ${previous.interactiveWithRole.percent}% → ${current.interactiveWithRole.percent}%`
    );
  }
  if (current.imagesHandled.percent < previous.imagesHandled.percent - tolerance) {
    regressions.push(
      `Imagens: ${previous.imagesHandled.percent}% → ${current.imagesHandled.percent}%`
    );
  }
  if (current.inputsWithLabel.percent < previous.inputsWithLabel.percent - tolerance) {
    regressions.push(
      `Inputs: ${previous.inputsWithLabel.percent}% → ${current.inputsWithLabel.percent}%`
    );
  }

  return {
    passed: regressions.length === 0,
    regressions,
    message:
      regressions.length === 0
        ? "✅ Sem regressões significativas de cobertura"
        : `❌ Regressões detectadas: ${regressions.join(", ")}`,
  };
}

/**
 * Lista findings corrigidos
 */
function getFixedFindings(report, baseline) {
  if (!baseline) return [];

  const currentFingerprints = new Set(report.findings.map((f) => f.fingerprint));
  return baseline.findings.filter((f) => !currentFingerprints.has(f.fingerprint));
}

// ============================================================================
// RELATÓRIO DE CI
// ============================================================================

/**
 * Gera relatório de CI formatado para GitHub Actions
 */
function generateCIReport(results, report, baseline) {
  const lines = [];

  lines.push("## 🔍 Relatório de Acessibilidade CI");
  lines.push("");

  // Status geral
  const allPassed =
    results.blockers.passed &&
    results.majors.passed &&
    results.coverage.passed &&
    results.regression.passed;

  lines.push(`### ${allPassed ? "✅ PASSED" : "❌ FAILED"}`);
  lines.push("");

  // BLOCKERs
  lines.push("#### BLOCKERs");
  lines.push(results.blockers.message);
  if (!results.blockers.passed && results.blockers.newBlockers.length > 0) {
    lines.push("");
    lines.push("| Arquivo | Linha | Regra | Componente |");
    lines.push("|---------|-------|-------|------------|");
    for (const b of results.blockers.newBlockers.slice(0, 10)) {
      lines.push(`| ${b.location.file} | ${b.location.line} | ${b.ruleId} | ${b.component} |`);
    }
    if (results.blockers.newBlockers.length > 10) {
      lines.push(`| ... | ... | ... | +${results.blockers.newBlockers.length - 10} mais |`);
    }
  }
  lines.push("");

  // MAJORs
  lines.push("#### MAJORs");
  lines.push(results.majors.message);
  lines.push("");

  // Cobertura
  lines.push("#### Cobertura");
  lines.push("");
  lines.push("| Métrica | Status |");
  lines.push("|---------|--------|");
  for (const r of results.coverage.results) {
    lines.push(`| ${r.name} | ${r.formatted} |`);
  }
  lines.push("");

  // Regressão
  lines.push("#### Regressão");
  lines.push(results.regression.message);
  lines.push("");

  // Corrigidos
  if (results.fixed.length > 0) {
    lines.push("#### 🎉 Corrigidos neste PR");
    lines.push("");
    for (const f of results.fixed.slice(0, 5)) {
      lines.push(`- ~~${f.ruleId}~~ em ${f.file}:${f.line}`);
    }
    if (results.fixed.length > 5) {
      lines.push(`- ... e mais ${results.fixed.length - 5}`);
    }
    lines.push("");
  }

  // Sumário
  lines.push("#### Sumário");
  lines.push("");
  lines.push(`- 🔴 BLOCKERs: ${report.summary.bySeverity.BLOCKER}`);
  lines.push(`- 🟠 MAJORs: ${report.summary.bySeverity.MAJOR}`);
  lines.push(`- 🟡 MINORs: ${report.summary.bySeverity.MINOR}`);
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const ciMode = args.includes("--ci");
  const verboseMode = args.includes("--verbose") || args.includes("-v");

  console.log("\n🔍 Verificador de Baseline de Acessibilidade v1.1\n");

  // Carregar relatório atual
  const report = loadJson(CONFIG.reportPath, true);

  // Carregar baseline (opcional)
  const baseline = loadJson(CONFIG.baselinePath, false);

  if (baseline) {
    console.log(`📋 Baseline carregado: ${baseline.timestamp}`);
    console.log(`   ${baseline.findings.length} findings no baseline\n`);
  } else {
    console.log("⚠️  Sem baseline - primeira execução ou baseline não encontrado\n");
  }

  // Executar verificações
  const results = {
    blockers: checkNewBlockers(report, baseline),
    majors: checkNewMajors(report, baseline),
    coverage: checkCoverage(report),
    regression: checkCoverageRegression(report, baseline),
    fixed: getFixedFindings(report, baseline),
  };

  // Imprimir resultados
  console.log("=".repeat(60));
  console.log("📊 RESULTADOS");
  console.log("=".repeat(60));
  console.log("");

  console.log("🔴 BLOCKERs:");
  console.log(`   ${results.blockers.message}`);
  console.log("");

  console.log("🟠 MAJORs:");
  console.log(`   ${results.majors.message}`);
  console.log("");

  console.log("📈 COBERTURA:");
  for (const r of results.coverage.results) {
    console.log(`   ${r.name}: ${r.formatted}`);
  }
  console.log("");

  console.log("📉 REGRESSÃO:");
  console.log(`   ${results.regression.message}`);
  console.log("");

  if (results.fixed.length > 0) {
    console.log("🎉 CORRIGIDOS:");
    console.log(`   ${results.fixed.length} findings foram corrigidos desde o baseline`);
    if (verboseMode) {
      for (const f of results.fixed) {
        console.log(`   - ${f.ruleId} em ${f.file}:${f.line}`);
      }
    }
    console.log("");
  }

  console.log("=".repeat(60));

  // Gerar relatório CI se solicitado
  if (ciMode) {
    const ciReport = generateCIReport(results, report, baseline);
    const ciReportPath = path.resolve(__dirname, "../docs/A11Y_CI_REPORT.md");
    fs.writeFileSync(ciReportPath, ciReport);
    console.log(`\n📄 Relatório CI salvo em: ${ciReportPath}`);

    // Saída para GitHub Actions summary
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, ciReport);
    }
  }

  // Determinar exit code
  const passed =
    results.blockers.passed &&
    results.majors.passed &&
    results.coverage.passed &&
    results.regression.passed;

  if (passed) {
    console.log("\n✅ Todas as verificações passaram!\n");
    process.exit(0);
  } else {
    console.log("\n❌ Algumas verificações falharam\n");

    if (!results.blockers.passed) {
      console.log("   → Resolva os BLOCKERs antes de fazer merge");
    }
    if (!results.majors.passed) {
      console.log("   → Muitos novos MAJORs - revise as mudanças");
    }
    if (!results.coverage.passed) {
      console.log("   → Cobertura abaixo do threshold mínimo");
    }
    if (!results.regression.passed) {
      console.log("   → Regressão significativa de cobertura");
    }
    console.log("");

    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
