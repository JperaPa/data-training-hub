import fs from "fs";
import path from "path";
import { runOpenAI } from "../lib/openai.js";

export async function runExampleOpenAIAgent() {
  console.log("🤖 Example OpenAI Agent started...");

  const prompt = `
You are a summarization engine.
Summarize the following text in 3 bullet points:

TEXT:
The Data Training Hub is a personal intelligence system designed to help
Francisco track tasks, summarize transcripts, and evaluate daily progress.
`;

  let output;
  try {
    output = await runOpenAI(prompt);
  } catch (err) {
    console.error("❌ OpenAI request failed:", err.message);
    return;
  }

  // Save output to logs
  const date = new Date().toISOString().split("T")[0];
  const outputDir = path.join("logs", "example-openai");
  const outputPath = path.join(outputDir, `${date}.txt`);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, output);

  console.log(`✅ OpenAI agent output saved to: ${outputPath}`);
  console.log("📄 Output:");
  console.log(output);
}

// CLI entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
  runExampleOpenAIAgent();
}