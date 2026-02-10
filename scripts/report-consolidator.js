const fs = require("fs");
const path = require("path");

/**
 * Report Consolidator
 * Generates Markdown and HTML reports from the JSON output.
 *
 * Used by:
 * - npm run design:report
 */

const REPORT_JSON = "docs/design-audit-report.json";
const SUMMARY_MD = "docs/design-audit-summary.md";
const REPORT_HTML = "docs/design-audit-report.html";

function main() {
  const jsonPath = path.resolve(process.cwd(), REPORT_JSON);

  if (!fs.existsSync(jsonPath)) {
    console.error('No report JSON found. Run "npm run design:ci" (or "npm run design:audit") first.');
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  generateMarkdown(results);
  generateHtml(results);

  console.log(`Reports generated:\n- ${SUMMARY_MD}\n- ${REPORT_HTML}`);
}

function generateMarkdown(results) {
  const { summary, violations } = results;
  const scoreEmoji = summary.score > 90 ? "🟢" : summary.score > 75 ? "🟡" : "🔴";

  const content = `
# Design System Audit Summary

**Score**: ${summary.score}/100 ${scoreEmoji}
**Files Checked**: ${results.meta.filesChecked}
**Violations**: Critical: ${summary.critical} | High: ${summary.high} | Medium: ${summary.medium}

${violations.length > 0 ? "### Top Violations" : "✅ No violations found."}

${violations
  .slice(0, 10)
  .map((v) => `- [${v.severity.toUpperCase()}] **${v.file}:${v.line}** - ${v.message}`)
  .join("\n")}

${violations.length > 10 ? `\n...and ${violations.length - 10} more.` : ""}
`;

  fs.writeFileSync(path.resolve(process.cwd(), SUMMARY_MD), content.trim());
}

function generateHtml(results) {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Design System Audit</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }
    .critical { color: #dc2626; font-weight: bold; }
    .high { color: #d97706; }
    .medium { color: #2563eb; }
    .card { border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 8px; border-radius: 6px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Design Audit Report</h1>
    <h2>Score: ${results.summary.score}</h2>
  </div>
  <hr/>
  ${results.violations
    .map(
      (v) => `
    <div class="card">
      <div class="${v.severity}">[${v.severity.toUpperCase()}] ${v.ruleId}</div>
      <div>${v.file}:${v.line}</div>
      <p>${v.message}</p>
    </div>
  `
    )
    .join("")}
</body>
</html>
`;
  fs.writeFileSync(path.resolve(process.cwd(), REPORT_HTML), content.trim());
}

main();

