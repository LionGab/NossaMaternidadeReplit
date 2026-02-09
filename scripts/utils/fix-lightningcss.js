const fs = require("fs");
const path = require("path");

// Fix for Windows: Copy lightningcss native binary to expected location
if (process.platform === "win32" && process.arch === "x64") {
  const sourceFile = path.join(
    __dirname,
    "..",
    "node_modules",
    "lightningcss-win32-x64-msvc",
    "lightningcss.win32-x64-msvc.node"
  );

  const destFile = path.join(
    __dirname,
    "..",
    "node_modules",
    "lightningcss",
    "lightningcss.win32-x64-msvc.node"
  );

  if (fs.existsSync(sourceFile) && !fs.existsSync(destFile)) {
    try {
      fs.copyFileSync(sourceFile, destFile);
      console.log("✅ LightningCSS fix aplicado: arquivo .node copiado para local esperado");
    } catch (error) {
      console.warn("⚠️  Aviso: Não foi possível copiar arquivo LightningCSS:", error.message);
    }
  }
}

// Fix for EAS iOS builds: guard against nil products in React Native SPM helper
const spmFile = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native",
  "scripts",
  "cocoapods",
  "spm.rb"
);

if (fs.existsSync(spmFile)) {
  try {
    const spmContent = fs.readFileSync(spmFile, "utf8");
    const targetLine = "products.each do |product_name|";
    const patchedLine = "Array(products).each do |product_name|";

    if (spmContent.includes(targetLine) && !spmContent.includes(patchedLine)) {
      const updated = spmContent.replace(targetLine, patchedLine);
      fs.writeFileSync(spmFile, updated, "utf8");
      console.log("✅ React Native SPM patch aplicado (products nil guard)");
    }
  } catch (error) {
    console.warn("⚠️  Aviso: não foi possível aplicar patch do SPM:", error.message);
  }
}
