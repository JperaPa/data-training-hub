import fs from "fs";
import path from "path";

export async function runTranscriptCollector() {
  console.log("🧠 Transcript Collector started...");

  const date = new Date().toISOString().split("T")[0];
  const rawDir = path.join("data", "raw");
  const outputDir = path.join("logs", "transcripts");
  const outputFile = path.join(outputDir, `${date}.txt`);

  fs.mkdirSync(outputDir, { recursive: true });

  // Read all files in data/raw
  if (!fs.existsSync(rawDir)) {
    console.log("⚠️ No raw data directory found. Creating one.");
    fs.mkdirSync(rawDir, { recursive: true });
  }

  const files = fs.readdirSync(rawDir).filter(f => f.endsWith(".txt") || f.endsWith(".md") || f.endsWith(".log"));

  if (files.length === 0) {
    console.log("⚠️ No raw transcript files found.");
    fs.writeFileSync(outputFile, `No raw transcript files found for ${date}.`);
    console.log(`📄 Empty transcript saved to: ${outputFile}`);
    return;
  }

  let combined = `# Transcript for ${date}\n\n`;

  for (const file of files) {
    const filePath = path.join(rawDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    combined += `\n--- FILE: ${file} ---\n`;
    combined += content + "\n";
  }

  fs.writeFileSync(outputFile, combined);

  console.log(`✅ Transcript saved to: ${outputFile}`);
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runTranscriptCollector();
}
