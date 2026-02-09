// scripts/gates/utils/scanConsole.ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export type ConsoleFinding = {
  file: string;
  line: number;
  match: string;
};

type ScanArgs = {
  rootDir: string;
  includeDirs: string[];
  ignore: string[];
};

const DEFAULT_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

function shouldIgnore(filePath: string, ignore: string[]) {
  const normalized = filePath.replaceAll("\\", "/");
  return ignore.some((p) => {
    const needle = p.replaceAll("\\", "/").replaceAll("**", "");
    return needle && normalized.includes(needle);
  });
}

function statSafe(p: string) {
  try {
    return statSync(p);
  } catch {
    return null;
  }
}

function walk(dir: string, ignore: string[], out: string[] = []) {
  const entries = readdirSync(dir);
  for (const e of entries) {
    const full = join(dir, e);
    if (shouldIgnore(full, ignore)) continue;
    const st = statSafe(full);
    if (!st) continue;
    if (st.isDirectory()) walk(full, ignore, out);
    else out.push(full);
  }
  return out;
}

export async function scanConsoleUsages(args: ScanArgs): Promise<ConsoleFinding[]> {
  const { rootDir, includeDirs, ignore } = args;
  const findings: ConsoleFinding[] = [];
  const consoleRegex = /\bconsole\.(log|debug|info|warn|error)\s*\(/g;

  for (const dir of includeDirs) {
    const abs = join(rootDir, dir);
    if (!statSafe(abs)?.isDirectory()) continue;

    const files = walk(abs, ignore);
    for (const f of files) {
      if (shouldIgnore(f, ignore)) continue;
      if (!DEFAULT_EXTS.some((ext) => f.endsWith(ext))) continue;

      const content = readFileSync(f, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i];
        if (consoleRegex.test(lineText)) {
          findings.push({
            file: f.replace(rootDir + "/", "").replace(rootDir + "\\", ""),
            line: i + 1,
            match: lineText.trim().slice(0, 200),
          });
        }
        consoleRegex.lastIndex = 0;
      }
    }
  }

  return findings;
}
