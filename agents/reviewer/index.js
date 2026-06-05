import fs from "fs";
import path from "path";

export async function runReviewer() {
  console.log("🧠 Reviewer AI started...");

  const date = new Date().toISOString().split("T")[0];
  const evalPath = path.join("logs", "evaluation", `${date}.json`);
  const outputDir = path.join("logs", "review");
  const outputFile = path.join(outputDir, `${date}.md`);

  fs.mkdirSync(outputDir, { recursive: true });

  if (!fs.existsSync(evalPath)) {
    console.log(`⚠️ No evaluation file found for ${date}`);
    fs.writeFileSync(outputFile, `# Review for ${date}\nNo evaluation found.`);
    console.log(`📄 Empty review saved to: ${outputFile}`);
    return;
  }

  const evaluation = JSON.parse(fs.readFileSync(evalPath, "utf8"));

  // Simple logic
  const score = evaluation.workflow_score;
  const sop = evaluation.sop_compliance;
  const summary = evaluation.summary_quality;
  const reflection = evaluation.reflection_depth;

  let verdict = "neutral";

  if (score >= 8 && sop) verdict = "strong";
  else if (score >= 5) verdict = "average";
  else verdict = "weak";

  const review = `
# Daily Review for ${date}

## Overall Verdict
**${verdict.toUpperCase()}** day based on workflow score and SOP compliance.

## Key Metrics
- Workflow Score: ${score}/10
- SOP Compliance: ${sop ? "Yes" : "No"}
- Summary Quality: ${summary}
- Reflection Depth: ${reflection}

## Recommendations
${evaluation.recommendations.map(r => `- ${r}`).join("\n")}

## Simple Questions for the User
1. What was your biggest win today
2. What was your biggest blocker
3. What will you improve tomorrow
`;

  fs.writeFileSync(outputFile, review);

  console.log(`✅ Review saved to: ${outputFile}`);
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runReviewer();
}
