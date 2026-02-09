const traverse = require("@babel/traverse").default;

/**
 * Auditor: Colors
 * Detects hardcoded colors and suggests tokens.
 */
module.exports = {
  id: "colors",
  run: (ast, filePath, code) => {
    const violations = [];

    // Heuristic: skip files that are likely valid color definitions
    if (filePath.includes("tokens.ts") || filePath.includes("theme/")) return violations;

    traverse(ast, {
      // 1. Check JSX Attributes (className for 'text-white', etc)
      JSXAttribute(path) {
        if (path.node.name.name === "className" && path.node.value.type === "StringLiteral") {
          const classes = path.node.value.value.split(" ");
          classes.forEach((cls) => {
            if (cls.match(/^(text|bg|border)-(white|black|gray-\d+|slate-\d+|red-\d+|blue-\d+)/)) {
              // Only flag if strict mode - for now allow Tailwind colors but warn about hardcoded arbitraries
              if (cls.startsWith("text-[#") || cls.startsWith("bg-[#")) {
                violations.push({
                  ruleId: "no-arbitrary-tailwind-values",
                  severity: "high",
                  message: `Avoid arbitrary values like ${cls}. Use theme tokens.`,
                  line: path.node.loc?.start.line,
                });
              }
            }
          });
        }
      },

      // 2. Check Style Objects
      ObjectProperty(path) {
        const key = path.node.key.name;
        const value = path.node.value;

        if (value.type === "StringLiteral") {
          // Detect Hex
          if (value.value.match(/^#[0-9A-Fa-f]{3,8}$/)) {
            violations.push({
              ruleId: "no-hardcoded-hex",
              severity: "high",
              message: `Hardcoded color "${value.value}". Use Tokens.* or useThemeColors().`,
              line: path.node.loc?.start.line,
            });
          }
          // Detect RGB/HSL
          if (value.value.match(/^(rgb|hsl)a?\(/)) {
            violations.push({
              ruleId: "no-hardcoded-func-color",
              severity: "high",
              message: `Hardcoded color function "${value.value}". Use tokens.`,
              line: path.node.loc?.start.line,
            });
          }
        }
      },
    });

    return violations;
  },
};
