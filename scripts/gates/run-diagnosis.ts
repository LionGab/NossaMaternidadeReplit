// scripts/gates/run-diagnosis.ts
/* eslint-disable no-console */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execStep, getGitInfo, nowStamp } from "./utils/exec";
import { scanConsoleUsages, type ConsoleFinding } from "./utils/scanConsole";
import { renderMarkdownReport } from "./utils/report";

type GateStatus = "PASS" | "FAIL" | "SKIP";

type GateResult = {
  gate: "A" | "B" | "C" | "D" | "E" | "F";
  name: string;
  status: GateStatus;
  startedAt: string;
  finishedAt: string;
  exitCode?: number;
  steps: Array<{
    name: string;
    command: string;
    status: "PASS" | "FAIL";
    exitCode: number;
    stdout: string;
    stderr: string;
    truncated: boolean;
  }>;
  consoleFindings?: ConsoleFinding[];
  notes?: string[];
};

type DiagnosisReport = {
  generatedAt: string;
  environment: {
    os: string;
    node: string;
    bun?: string;
    git?: {
      branch?: string;
      commit?: string;
      dirty?: boolean;
    };
  };
  gates: GateResult[];
  summary: {
    pass: number;
    fail: number;
    skip: number;
  };
};

async function main() {
  console.log("\n🔍 Nossa Maternidade — Gate Diagnosis v0.9\n");
  console.log("━".repeat(50));

  const generatedAt = new Date().toISOString();
  const stamp = nowStamp();

  const reportsDir = join(process.cwd(), "reports", "gates");
  const historyDir = join(reportsDir, "history");

  await mkdir(historyDir, { recursive: true });

  const git = await getGitInfo();

  const nodeVersion = process.version;
  const os = `${process.platform} ${process.arch}`;

  const bunVersion = await (async () => {
    try {
      const r = await execStep({
        name: "bun --version",
        command: "bun",
        args: ["--version"],
        timeoutMs: 15_000,
      });
      return r.stdout.trim() || undefined;
    } catch {
      return undefined;
    }
  })();

  console.log(`📋 Environment:`);
  console.log(`   OS: ${os}`);
  console.log(`   Node: ${nodeVersion}`);
  if (bunVersion) console.log(`   Bun: ${bunVersion}`);
  if (git?.branch)
    console.log(`   Git: ${git.branch}@${git.commit?.slice(0, 8) ?? "?"} (dirty: ${git.dirty})`);
  console.log("");

  const gates: GateResult[] = [];

  // --------------------
  // Gate A — Build Quality
  // --------------------
  console.log("🔴 Gate A — Build Quality");
  console.log("━".repeat(50));

  const gateAStart = new Date().toISOString();
  const steps: GateResult["steps"] = [];

  // Step 1: quality-gate
  console.log("   ▶ Running npm run quality-gate...");
  const step1 = await execStep({
    name: "quality-gate",
    command: "npm",
    args: ["run", "quality-gate"],
    timeoutMs: 20 * 60_000,
    maxOutputLines: 2000,
  });
  steps.push(step1);
  console.log(`   ${step1.status === "PASS" ? "✅" : "❌"} quality-gate (exit: ${step1.exitCode})`);

  // Step 2: console scan
  console.log("   ▶ Scanning console.* usages...");
  const consoleFindings = await scanConsoleUsages({
    rootDir: process.cwd(),
    includeDirs: ["src", "scripts"],
    ignore: [
      "src/utils/logger.ts",
      "src/utils/logger.tsx",
      "**/node_modules/**",
      "**/dist/**",
      "**/.expo/**",
      "**/ios/**",
      "**/android/**",
      "**/reports/**",
      // Allow console in gate scripts (eslint-disable)
      "scripts/gates/**",
    ],
  });

  const consoleStep = {
    name: "console.log scan",
    command: "internal:scanConsoleUsages",
    status: consoleFindings.length === 0 ? ("PASS" as const) : ("FAIL" as const),
    exitCode: consoleFindings.length === 0 ? 0 : 1,
    stdout:
      consoleFindings.length === 0
        ? "OK: zero occurrences"
        : `Found ${consoleFindings.length} console usages`,
    stderr: "",
    truncated: false,
  };
  steps.push(consoleStep);
  console.log(
    `   ${consoleStep.status === "PASS" ? "✅" : "❌"} console.log scan (${consoleFindings.length} findings)`
  );

  const gateAExitCode = steps.some((s) => s.exitCode !== 0) ? 1 : 0;
  const gateAStatus = gateAExitCode === 0 ? "PASS" : "FAIL";

  gates.push({
    gate: "A",
    name: "Build Quality",
    status: gateAStatus,
    startedAt: gateAStart,
    finishedAt: new Date().toISOString(),
    exitCode: gateAExitCode,
    steps,
    consoleFindings,
    notes: [
      "Gate A PASS requer: typecheck+lint+build-check OK + zero console.log",
      "Se scripts/quality-gate.sh já faz parte disso, o runner apenas orquestra e registra.",
    ],
  });

  console.log("");
  console.log(`   🏁 Gate A: ${gateAStatus === "PASS" ? "🟢 PASS" : "🔴 FAIL"}`);
  console.log("━".repeat(50));

  const summary = {
    pass: gates.filter((g) => g.status === "PASS").length,
    fail: gates.filter((g) => g.status === "FAIL").length,
    skip: gates.filter((g) => g.status === "SKIP").length,
  };

  const report: DiagnosisReport = {
    generatedAt,
    environment: {
      os,
      node: nodeVersion,
      bun: bunVersion,
      git,
    },
    gates,
    summary,
  };

  const latestJsonPath = join(reportsDir, "latest.json");
  const latestMdPath = join(reportsDir, "latest.md");
  const histJsonPath = join(historyDir, `${stamp}.json`);
  const histMdPath = join(historyDir, `${stamp}.md`);

  const md = renderMarkdownReport(report);

  await writeFile(latestJsonPath, JSON.stringify(report, null, 2), "utf-8");
  await writeFile(latestMdPath, md, "utf-8");
  await writeFile(histJsonPath, JSON.stringify(report, null, 2), "utf-8");
  await writeFile(histMdPath, md, "utf-8");

  console.log("");
  console.log(`📄 Reports generated:`);
  console.log(`   ${latestMdPath}`);
  console.log(`   ${latestJsonPath}`);
  console.log("");

  if (summary.fail > 0) {
    console.log("❌ Gate(s) FAILED. Fix issues before proceeding.");
    process.exit(1);
  } else {
    console.log("✅ All gates PASSED. Ready for next phase.");
  }
}

main().catch((err) => {
  console.error("Gate diagnosis failed:", err);
  process.exit(1);
});
