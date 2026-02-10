#!/usr/bin/env node

/**
 * DESIGN SYSTEM EXCELLENCE PLATFORM - CORE ENGINE
 * Unifies audits for Design, A11y, Colors, Tokens, and UX.
 *
 * Used by:
 * - npm run design:ci
 * - npm run design:audit
 * - npm run design:full
 */

const fs = require("fs");
const path = require("path");
const { scanFiles } = require("./utils/file-scanner");
const { parseCode } = require("./utils/ast-parser");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

// --- Argument Parsing ---
const args = process.argv.slice(2);
const options = {
  mode: args.find((a) => a.startsWith("--mode="))?.split("=")[1] || "check", // check, audit, full, ci
  format: args.find((a) => a.startsWith("--format="))?.split("=")[1] || "terminal", // terminal, json, all
  target: args.find((a) => !a.startsWith("--")) || null,
  staged: args.includes("--staged"),
  diff: args.includes("--diff"),
  updateBaseline: args.includes("--update-baseline"),
  only: args.find((a) => a.startsWith("--only="))?.split("=")[1], // specific auditor
};

// --- Load Auditors ---
const auditorNames = ["design-system"]; // Extend later: colors, a11y, tokens-reference, ux-review
const auditors = {};

auditorNames.forEach((name) => {
  try {
    auditors[name] = require(`./auditors/${name}`);
  } catch {
    // Auditor not present; ignore.
  }
});

async function main() {
  console.log(
    `${colors.blue}${colors.bold}[Design System Excellence Platform]${colors.reset} Mode: ${options.mode}`
  );

  // 1. Scan Files
  const files = scanFiles(options);
  console.log(`Scanning ${files.length} files...`);

  const results = {
    meta: {
      generatedAt: new Date().toISOString(),
      mode: options.mode,
      filesChecked: files.length,
    },
    violations: [],
    summary: {
      critical: 0,
      high: 0,
      medium: 0,
      info: 0,
      score: 100,
    },
  };

  // 2. Run Analysis
  for (const file of files) {
    const code = fs.readFileSync(file, "utf-8");
    const ast = parseCode(code);
    if (!ast) continue;

    // Run active auditors
    Object.keys(auditors).forEach((key) => {
      if (options.only && options.only !== key) return;

      const auditor = auditors[key];
      try {
        const fileViolations = auditor.run(ast, file, code);
        if (fileViolations && fileViolations.length > 0) {
          fileViolations.forEach((v) => {
            results.violations.push({
              ...v,
              file: path.relative(process.cwd(), file),
              auditor: key,
            });
          });
        }
      } catch (e) {
        console.error(`Error running auditor ${key} on ${file}:`, e.message);
      }
    });
  }

  // 3. Aggregate Summary
  results.violations.forEach((v) => {
    results.summary[v.severity] = (results.summary[v.severity] || 0) + 1;
  });

  // Simple scoring (example)
  const penalty =
    results.summary.critical * 10 + results.summary.high * 3 + results.summary.medium * 1;
  results.summary.score = Math.max(0, 100 - penalty);

  // 4. Output
  if (options.format === "json" || options.mode === "ci") {
    const jsonPath = path.resolve(process.cwd(), "docs/design-audit-report.json");
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    if (options.format === "json") console.log(JSON.stringify(results, null, 2));
  }

  if (options.format === "terminal" || options.format === "all") {
    printTerminalReport(results);
  }

  // CI Exit Code
  if (options.mode === "ci" && results.summary.critical > 0) {
    console.error(`${colors.red}Build failed: Critical design violations found.${colors.reset}`);
    process.exit(1);
  }
}

function printTerminalReport(results) {
  if (results.violations.length === 0) {
    console.log(`${colors.green}✔ No violations found. Great job!${colors.reset}`);
    return;
  }

  // Group by file
  const byFile = {};
  results.violations.forEach((v) => {
    if (!byFile[v.file]) byFile[v.file] = [];
    byFile[v.file].push(v);
  });

  Object.keys(byFile).forEach((file) => {
    console.log(`\n${colors.bold}${file}${colors.reset}`);
    byFile[file].forEach((v) => {
      const color =
        v.severity === "critical"
          ? colors.red
          : v.severity === "high"
            ? colors.yellow
            : colors.blue;
      const line = typeof v.line === "number" ? v.line : "?";
      console.log(
        `  ${color}[${String(v.severity).toUpperCase()}]${colors.reset} ${v.message} ${colors.gray}(${v.ruleId}:${line})${colors.reset}`
      );
    });
  });

  console.log(
    `\n${colors.bold}Summary:${colors.reset} Score: ${results.summary.score}/100 | Critical: ${results.summary.critical} | High: ${results.summary.high} | Medium: ${results.summary.medium}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

