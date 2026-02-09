#!/usr/bin/env node
/**
 * Toggle DEV BYPASS ON/OFF
 *
 * Usage:
 *   npm run dev:bypass on    # Enable bypass (skip login)
 *   npm run dev:bypass off   # Disable bypass (normal flow)
 */

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../src/config/dev-bypass.ts");
const arg = process.argv[2]?.toLowerCase();

if (!["on", "off"].includes(arg)) {
  console.log("❌ Usage: npm run dev:bypass [on|off]");
  process.exit(1);
}

try {
  let content = fs.readFileSync(configPath, "utf8");

  if (arg === "on") {
    content = content.replace(/ENABLE_DEV_BYPASS:\s*(true|false)/, "ENABLE_DEV_BYPASS: true");
    console.log("✅ DEV BYPASS ENABLED");
    console.log("📱 Restart Expo server: npm start");
    console.log("🔄 App will skip login and go to MainTabs");
  } else {
    content = content.replace(/ENABLE_DEV_BYPASS:\s*(true|false)/, "ENABLE_DEV_BYPASS: false");
    console.log("✅ DEV BYPASS DISABLED");
    console.log("📱 App will use normal authentication flow");
  }

  fs.writeFileSync(configPath, content, "utf8");
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
