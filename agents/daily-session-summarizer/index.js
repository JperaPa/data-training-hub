import fs from "fs";
import path from "path";

export async function runDailySummarizer() {
  console.log("📝 Daily Summarizer started...");

  const date = new Date().toISOString().split("T")[0];
  const transcriptPath = path.join("logs", "transcripts", `${date}.txt`);
  const summaryDir = path.join("logs", "summaries");
  const summaryPath = path.join(summaryDir, `${date}.md`);

  // Ensure output directory exists
  fs.mkdirSync(summaryDir, { recursive: true });

  // Check if transcript exists
  if (!fs.existsSync(transcriptPath)) {
    console.log(`⚠️ No transcript found for ${date}`);
    fs.writeFileSync(summaryPath, `# Summary for ${date}\nNo transcript found.`);
    console.log(`📄 Empty summary saved to: ${summaryPath}`);
    return;
  }

  // Read transcript
  const transcript = fs.readFileSync(transcriptPath, "utf8");

  // Dummy summary content
  const summary = `# Summary for ${date}\n\nThis is a placeholder summary.\n\nTranscript length: ${transcript.length} characters.\n`;

  fs.writeFileSync(summaryPath, summary);

  console.log(`✅ Summary saved to: ${summaryPath}`);
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runDailySummarizer();
}
