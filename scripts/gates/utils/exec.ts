// scripts/gates/utils/exec.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { spawn } from "node:child_process";

export type ExecStepResult = {
  name: string;
  command: string;
  status: "PASS" | "FAIL";
  exitCode: number;
  stdout: string;
  stderr: string;
  truncated: boolean;
};

type ExecStepArgs = {
  name: string;
  command: string;
  args: string[];
  timeoutMs: number;
  cwd?: string;
  env?: Record<string, string | undefined>;
  maxOutputLines?: number;
};

function truncateByLines(text: string, maxLines: number) {
  const lines = text.split("\n");
  if (lines.length <= maxLines) return { text, truncated: false };
  const keep = lines.slice(-maxLines);
  return {
    text: `[TRUNCATED: showing last ${maxLines} lines out of ${lines.length}]\n` + keep.join("\n"),
    truncated: true,
  };
}

export async function execStep(args: ExecStepArgs): Promise<ExecStepResult> {
  const { name, command, args: cmdArgs, timeoutMs, cwd, env, maxOutputLines = 2000 } = args;

  return await new Promise<ExecStepResult>((resolve) => {
    const child = spawn(command, cmdArgs, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    });

    let stdout = "";
    let stderr = "";
    const startedAt = Date.now();

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    (child as any).on("close", (code: number | null) => {
      clearTimeout(timer);
      const exitCode = typeof code === "number" ? code : 1;

      const tOut = truncateByLines(stdout, maxOutputLines);
      const tErr = truncateByLines(stderr, Math.min(500, maxOutputLines));

      resolve({
        name,
        command: `${command} ${cmdArgs.join(" ")}`.trim(),
        status: exitCode === 0 ? "PASS" : "FAIL",
        exitCode,
        stdout: tOut.text,
        stderr: tErr.text,
        truncated: tOut.truncated || tErr.truncated || Date.now() - startedAt >= timeoutMs,
      });
    });
  });
}

export async function getGitInfo(): Promise<
  { branch?: string; commit?: string; dirty?: boolean } | undefined
> {
  const run = (cmd: string, cmdArgs: string[]) =>
    execStep({ name: cmd, command: cmd, args: cmdArgs, timeoutMs: 8_000, maxOutputLines: 200 });

  try {
    const branch = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const commit = await run("git", ["rev-parse", "HEAD"]);
    const status = await run("git", ["status", "--porcelain"]);

    return {
      branch: branch.exitCode === 0 ? branch.stdout.trim() : undefined,
      commit: commit.exitCode === 0 ? commit.stdout.trim() : undefined,
      dirty: status.exitCode === 0 ? status.stdout.trim().length > 0 : undefined,
    };
  } catch {
    return undefined;
  }
}

export function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}`;
}
