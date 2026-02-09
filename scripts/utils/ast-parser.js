const parser = require("@babel/parser");

function parseCode(code) {
  try {
    return parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx", "classProperties", "decorators-legacy", "exportDefaultFrom"],
    });
  } catch (e) {
    return null; // Fail gracefully
  }
}

module.exports = { parseCode };
