/**
 * verify-modules.js
 * Scans /src/js and compares filenames to what main.js expects.
 */

const fs = require("fs");
const path = require("path");

const jsFolder = path.join(__dirname, "src/js");

// What main.js expects
const expected = [
  "ce-agent.js",
  "finance-agent.js",
  "osint-agent.js",
  "sanctions-agent.js",
  "typology-agent.js",
  "training-agent.js",
  "readiness.js",
  "system-diagnostics.js"
];

console.log("\n🔍 Scanning /src/js ...\n");

if (!fs.existsSync(jsFolder)) {
  console.error("❌ ERROR: Folder not found:", jsFolder);
  process.exit(1);
}

const actual = fs.readdirSync(jsFolder).filter(f => f.endsWith(".js"));

console.log("📁 Actual files:");
actual.forEach(f => console.log("   •", f));

console.log("\n📌 Expected files:");
expected.forEach(f => console.log("   •", f));

console.log("\n----------------------------------------");
console.log("🔎 MISMATCH REPORT");
console.log("----------------------------------------\n");

// Check for missing expected files
expected.forEach(file => {
  if (!actual.includes(file)) {
    console.log(`❌ Missing: ${file}`);
  }
});

// Check for extra or misnamed files
actual.forEach(file => {
  if (!expected.includes(file)) {
    console.log(`⚠️ Unexpected or misnamed file: ${file}`);
  }
});

console.log("\n✅ Scan complete.\n");