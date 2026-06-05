import fs from "fs";
import path from "path";

export async function runCoach() {
  console.log("🎯 AI Coach started...");

  const date = new Date().toISOString().split("T")[0];

  const paths = {
    transcript: path.join("logs", "transcripts", `${date}.txt`),
    summary: path.join("logs", "summaries", `${date}.md`),
    reflection: path.join("logs", "reflections", `${date}.md`),
    sop: path.join("logs", "sop", `${date}.md`),
    progress: path.join("logs", "progress", `${date}.json`),
    review: path.join("logs", "review", `${date}.md`)
  };

  const outputDir = path.join("logs", "coach");
  const outputFile = path.join(outputDir, `${date}.md`);
  const outputJson = path.join(outputDir, `${date}.json`);

  fs.mkdirSync(outputDir, { recursive: true });

  // Load all files
  const data = {};
  for (const [key, filePath] of Object.entries(paths)) {
    if (fs.existsSync(filePath)) {
      data[key] = fs.readFileSync(filePath, "utf8");
    } else {
      data[key] = null;
    }
  }

  // Load evaluation JSON (source of truth)
  const evaluationPath = path.join("logs", "evaluation", `${date}.json`);
  const evaluation = fs.existsSync(evaluationPath)
    ? JSON.parse(fs.readFileSync(evaluationPath, "utf8"))
    : null;

  // Simple logic
  const transcriptLength = data.transcript ? data.transcript.length : 0;
  const workflowScore = evaluation ? evaluation.workflow_score : 0;

  const coachVerdict =
    workflowScore >= 8
      ? "Strong day"
      : workflowScore >= 5
      ? "Average day"
      : "Weak day";

  const coaching = `
# AI Coaching Report for ${date}

## Overall Verdict
${coachVerdict}

## Activity Level
Transcript length: ${transcriptLength} characters

## Workflow Score
${workflowScore}/10

## SOP Compliance
${evaluation && evaluation.sop_compliance ? "Yes" : "No"}

## Key Recommendations
- Add more detail to your reflections
- Improve structure in your summaries
- Document blockers earlier in the day
- Maintain consistency in your workflow

## Questions for Tomorrow
1. What is the single most important task you must complete
2. What will you avoid doing to stay focused
3. What will you measure to track progress
`;

  fs.writeFileSync(outputFile, coaching);

  // Machine-readable version
  const json = {
    date,
    verdict: coachVerdict,
    transcript_length: transcriptLength,
    workflow_score: workflowScore,
    sop_compliance: evaluation ? evaluation.sop_compliance : false,
    recommendations: [
      "Add more detail to reflections",
      "Improve summary structure",
      "Document blockers earlier",
      "Increase workflow consistency"
    ]
  };

  fs.writeFileSync(outputJson, JSON.stringify(json, null, 2));

  console.log(`✅ Coaching report saved to: ${outputFile}`);
  console.log(`📊 Machine-readable coaching JSON saved to: ${outputJson}`);
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runCoach();
}
