import { runTranscriptCollector } from "../transcript-collector/index.js";
import { runDailySummarizer } from "../daily-session-summarizer/index.js";
import { runReflectionAgent } from "../reflection/index.js";
import { runSOPEnforcement } from "../mcpp-enforcement/index.js";
import { runProgressEvaluator } from "../progress-evaluator/index.js";

export async function runFullPipeline() {
  console.log("🚀 FULL PIPELINE STARTED\n");

  await runTranscriptCollector();
  console.log("");

  await runDailySummarizer();
  console.log("");

  await runReflectionAgent();
  console.log("");

  await runSOPEnforcement();
  console.log("");

  await runProgressEvaluator();
  console.log("");

  console.log("🎉 FULL PIPELINE COMPLETE");
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullPipeline();
}
