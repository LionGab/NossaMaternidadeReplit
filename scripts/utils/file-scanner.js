const glob = require("glob");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Scan files based on options
 * @param {Object} options
 * @param {string} options.target - Specific file or folder
 * @param {boolean} options.staged - Scan git staged files
 * @param {boolean} options.diff - Scan changed files vs main
 * @returns {string[]} List of absolute file paths
 */
function scanFiles(options) {
  const rootDir = process.cwd();
  let files = [];

  // 1. Explicit target
  if (options.target) {
    const targetPath = path.resolve(rootDir, options.target);
    if (fs.statSync(targetPath).isDirectory()) {
      files = glob.sync(`${options.target}/**/*.{ts,tsx,js,jsx}`, { cwd: rootDir, absolute: true });
    } else {
      files = [targetPath];
    }
  }
  // 2. Staged files
  else if (options.staged) {
    try {
      const output = execSync("git diff --cached --name-only --diff-filter=ACMR", {
        encoding: "utf-8",
      });
      files = output
        .split("\n")
        .filter(Boolean)
        .map((f) => path.resolve(rootDir, f.trim()));
    } catch (e) {
      console.warn("Warning: Could not check git staged files. Fallback to all.");
    }
  }
  // 3. Diff vs Main (or previous commit)
  else if (options.diff) {
    try {
      // Try vs origin/main, fallback to HEAD~1
      let cmd = "git diff --name-only origin/main...HEAD --diff-filter=ACMR";
      try {
        execSync("git rev-parse origin/main", { stdio: "ignore" });
      } catch {
        cmd = "git diff --name-only HEAD~1..HEAD --diff-filter=ACMR";
      }

      const output = execSync(cmd, { encoding: "utf-8" });
      files = output
        .split("\n")
        .filter(Boolean)
        .map((f) => path.resolve(rootDir, f.trim()));
    } catch (e) {
      console.warn("Warning: Could not check git diff. Fallback to all.");
    }
  }
  // 4. Default: Scan src/
  else {
    files = glob.sync("src/**/*.{ts,tsx,js,jsx}", {
      cwd: rootDir,
      absolute: true,
      ignore: ["**/__tests__/**", "**/*.test.*", "**/__mocks__/**"],
    });
  }

  // Filter valid extensions and existance
  return files.filter((f) => {
    return fs.existsSync(f) && /\.(ts|tsx|js|jsx)$/.test(f) && !f.includes("node_modules");
  });
}

module.exports = { scanFiles };
