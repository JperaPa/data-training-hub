import fs from "fs";
import path from "path";

export async function runEvaluator() {
  console.log("🧪 Evaluator AI started...");

  const date = new Date().toISOString().split("T")[0];

  const paths = {
    transcript: path.join("logs", "transcripts", `${date}.txt`),
    summary: path.join("logs", "summaries", `${date}.md`),
    reflection: path.join("logs", "reflections", `${date}.md`),
    sop: path.join("logs", "sop", `${date}.md`),
    progress: path.join("logs", "progress", `${date}.json`)
  };

  const outputDir = path.join("logs", "evaluation");
  const outputFile = path.join(outputDir, `${date}.json`);

  fs.mkdirSync(outputDir, { recursive: true });

  // Load files
  const data = {};
  for (const [key, filePath] of Object.entries(paths)) {
    if (fs.existsSync(filePath)) {
      data[key] = fs.readFileSync(filePath, "utf8");
    } else {
      data[key] = null;
    }
  }

  // Simple scoring logic
  const score = {
    transcript_exists: !!data.transcript,
    summary_exists: !!data.summary,
    reflection_exists: !!data.reflection,
    sop_exists: !!data.sop,
    progress_exists: !!data.progress
  };

  const workflowScore =
    Object.values(score).filter(Boolean).length * 2; // max 10

  const evaluation = {
    date,
    workflow_score: workflowScore,
    sop_compliance: data.sop ? true : false,
    summary_quality: data.summary ? "placeholder" : "missing",
    reflection_depth: data.reflection ? "placeholder" : "missing",
    progress_signal: data.progress ? "placeholder" : "missing",
    recommendations: [
      "Add more detail to reflections",
      "Document blockers earlier in the day",
      "Increase structure in daily summaries"
    ]
  };

  fs.writeFileSync(outputFile, JSON.stringify(evaluation, null, 2));

  console.log(`✅ Evaluation saved to: ${outputFile}`);
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runEvaluator();
}
