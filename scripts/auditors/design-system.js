const traverse = require("@babel/traverse").default;
const path = require("path");
const fs = require("fs");

/**
 * Auditor: Design System
 * Checks for: StyleSheet usage, React Native Animated (vs Reanimated), Hardcoded styles
 */
module.exports = {
  id: "design-system",
  run: (ast, filePath, code) => {
    const violations = [];
    const filename = path.basename(filePath);

    // Skip non-UI files roughly
    if (!filename.match(/\.(tsx|jsx)$/)) return violations;

    traverse(ast, {
      // 1. Detect StyleSheet Usage
      ImportDeclaration(path) {
        if (path.node.source.value === "react-native") {
          path.node.specifiers.forEach((specifier) => {
            if (specifier.imported && specifier.imported.name === "StyleSheet") {
              violations.push({
                ruleId: "no-stylesheet",
                severity: "medium",
                message:
                  'Avoid StyleSheet.create. Use NativeWind classes (className="...") instead.',
                line: path.node.loc?.start.line,
              });
            }
            // 2. Detect Animated from react-native
            if (specifier.imported && specifier.imported.name === "Animated") {
              violations.push({
                ruleId: "no-rn-animated",
                severity: "critical",
                message: "Do not use Animated from react-native. Use react-native-reanimated.",
                line: path.node.loc?.start.line,
              });
            }
          });
        }
      },

      // 3. Detect Hardcoded Values in Objects (naive check for now)
      ObjectProperty(path) {
        const key = path.node.key.name;
        const value = path.node.value;

        // borderRadius: 22 -> should be token or even number check
        if (key === "borderRadius" && typeof value.value === "number") {
          if (value.value > 0 && ![4, 8, 12, 16, 20, 24, 32].includes(value.value)) {
            violations.push({
              ruleId: "hardcoded-border-radius",
              severity: "high",
              message: `Hardcoded borderRadius: ${value.value}. Use a radius token or standard spacing.`,
              line: path.node.loc?.start.line,
            });
          }
        }
      },
    });

    return violations;
  },
};
