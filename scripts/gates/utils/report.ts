// scripts/gates/utils/report.ts
type GateStatus = "PASS" | "FAIL" | "SKIP";

type ExecStep = {
  name: string;
  command: string;
  status: "PASS" | "FAIL";
  exitCode: number;
  stdout: string;
  stderr: string;
  truncated: boolean;
};

type GateResult = {
  gate: "A" | "B" | "C" | "D" | "E" | "F";
  name: string;
  status: GateStatus;
  startedAt: string;
  finishedAt: string;
  exitCode?: number;
  steps: ExecStep[];
  consoleFindings?: Array<{ file: string; line: number; match: string }>;
  notes?: string[];
};

type DiagnosisReport = {
  generatedAt: string;
  environment: {
    os: string;
    node: string;
    bun?: string;
    git?: { branch?: string; commit?: string; dirty?: boolean };
  };
  gates: GateResult[];
  summary: { pass: number; fail: number; skip: number };
};

const statusEmoji = (s: GateStatus) => (s === "PASS" ? "🟢" : s === "FAIL" ? "🔴" : "🟡");

export function renderMarkdownReport(report: DiagnosisReport) {
  const { environment: env, gates, summary } = report;

  const lines: string[] = [];
  lines.push(`# Nossa Maternidade — Gate Diagnosis`);
  lines.push(`Generated at: **${report.generatedAt}**`);
  lines.push("");
  lines.push(`- OS: \`${env.os}\``);
  lines.push(`- Node: \`${env.node}\``);
  if (env.bun) lines.push(`- Bun: \`${env.bun}\``);
  if (env.git?.commit)
    lines.push(
      `- Git: \`${env.git.branch ?? "?"}@${env.git.commit.slice(0, 8)}\` (dirty: ${String(env.git.dirty)})`
    );
  lines.push("");
  lines.push(`## Summary`);
  lines.push(`- PASS: **${summary.pass}** | FAIL: **${summary.fail}** | SKIP: **${summary.skip}**`);
  lines.push("");

  lines.push(`## Gates`);
  lines.push(`| Gate | Name | Status | Exit |`);
  lines.push(`|------|------|--------|------|`);
  for (const g of gates) {
    lines.push(
      `| ${g.gate} | ${g.name} | ${statusEmoji(g.status)} ${g.status} | ${g.exitCode ?? "-"} |`
    );
  }
  lines.push("");

  const gateA = gates.find((g) => g.gate === "A");
  if (gateA) {
    lines.push(`## Gate A — Build Quality (${statusEmoji(gateA.status)} ${gateA.status})`);
    lines.push(`Started: ${gateA.startedAt}`);
    lines.push(`Finished: ${gateA.finishedAt}`);
    lines.push("");

    if (gateA.notes?.length) {
      lines.push(`### Notes`);
      for (const n of gateA.notes) lines.push(`- ${n}`);
      lines.push("");
    }

    lines.push(`### Steps`);
    for (const s of gateA.steps) {
      lines.push(`#### ${s.status === "PASS" ? "✅" : "❌"} ${s.name}`);
      lines.push(`- Command: \`${s.command}\``);
      lines.push(`- ExitCode: \`${s.exitCode}\`${s.truncated ? " (truncated)" : ""}`);
      if (s.stdout?.trim()) {
        lines.push("");
        lines.push("```");
        lines.push(s.stdout.trim());
        lines.push("```");
      }
      if (s.stderr?.trim()) {
        lines.push("");
        lines.push("```");
        lines.push(s.stderr.trim());
        lines.push("```");
      }
      lines.push("");
    }

    const findings = gateA.consoleFindings ?? [];
    lines.push(`### console.* findings (${findings.length})`);
    if (findings.length === 0) {
      lines.push(`✅ Nenhuma ocorrência encontrada.`);
    } else {
      for (const f of findings.slice(0, 200)) {
        lines.push(`- \`${f.file}:${f.line}\` — ${f.match}`);
      }
      if (findings.length > 200) lines.push(`- ... truncated (showing 200 of ${findings.length})`);
    }
    lines.push("");
  }

  lines.push(`## Próximas Ações (automático)`);
  if (summary.fail > 0) {
    lines.push(
      `- Corrigir **Gate A** primeiro (TypeScript/ESLint/build/console). Só depois avançar para Auth/RLS/etc.`
    );
  } else {
    lines.push(`- Gate A PASS. Próximo: iniciar Gate B (Auth em device real iOS).`);
  }
  lines.push("");

  return lines.join("\n");
}
