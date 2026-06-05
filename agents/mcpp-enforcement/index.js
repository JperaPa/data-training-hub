import fs from "fs";
import path from "path";

export async function runSOPEnforcement() {
  console.log("📋 SOP Enforcement Agent started...");

  const date = new Date().toISOString().split("T")[0];
  const reflectionPath = path.join("logs", "reflections", `${date}.md`);
  const sopDir = path.join("logs", "sop");
  const sopPath = path.join(sopDir, `${date}.md`);

  // Ensure output directory exists
  fs.mkdirSync(sopDir, { recursive: true });

  // Check if reflection exists
  if (!fs.existsSync(reflectionPath)) {
    console.log(`⚠️ No reflection found for ${date}`);
    fs.writeFileSync(sopPath, `# SOP Report for ${date}\nNo reflection found.`);
    console.log(`📄 Empty SOP report saved to: ${sopPath}`);
    return;
  }

  // Read reflection
  const reflection = fs.readFileSync(reflectionPath, "utf8");

  // Dummy SOP report
  const sopReport = `# SOP Report for ${date}\n\nThis is a placeholder SOP compliance report.\n\nReflection length: ${reflection.length} characters.\n`;

  fs.writeFileSync(sopPath, sopReport);

  console.log(`✅ SOP report saved to: ${sopPath}`);
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runSOPEnforcement();
}
