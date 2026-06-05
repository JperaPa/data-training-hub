import fs from "fs";
import path from "path";
import { runOpenAI } from "../lib/openai.js";   // FIXED: matches your actual export

const ROOT = process.cwd();

export async function runWorkflowCritic() {
  console.log("🧠 Workflow Critic Agent started...");

  const date = new Date().toISOString().split("T")[0];

  // -----------------------------------------
  // Load all relevant logs
  // -----------------------------------------
  const paths = {
    transcript: path.join(ROOT, "logs", "transcripts", `${date}.txt`),
    summary: path.join(ROOT, "logs", "summaries", `${date}.md`),
    reflection: path.join(ROOT, "logs", "reflections", `${date}.md`),
    progress: path.join(ROOT, "logs", "progress", `${date}.json`),
    commands: path.join(ROOT, "logs", "commands", `${date}.json`)
  };

  const data = {};
  for (const [key, filePath] of Object.entries(paths)) {
    if (fs.existsSync(filePath)) {
      data[key] = fs.readFileSync(filePath, "utf8");
    } else {
      data[key] = null;
    }
  }

  let progressJson = null;
  let commandsJson = [];
  try {
    if (data.progress) progressJson = JSON.parse(data.progress);
    if (data.commands) commandsJson = JSON.parse(data.commands);
  } catch (err) {
    console.error("❌ Error parsing JSON logs:", err);
  }

  // -----------------------------------------
  // Build prompt
  // -----------------------------------------
  const prompt = `
You are the **Workflow Critic Agent**, a brutally honest, highly analytical reviewer.

Your job is to critique the user's:
- workflow (from transcript + commands)
- summary
- reflection
- progress log

You must identify:
- contradictions
- inefficiencies
- missing information
- cognitive distortions
- workflow drift
- patterns
- blind spots

Your tone: direct, analytical, constructive, no sugarcoating.

Return your output in the following JSON structure:

{
  "workflow_critique": "...",
  "summary_critique": "...",
  "reflection_critique": "...",
  "patterns": "...",
  "contradictions": "...",
  "recommendations": ["...", "..."]
}

-------------------------
TRANSCRIPT:
${data.transcript || "No transcript available."}

-------------------------
SUMMARY:
${data.summary || "No summary available."}

-------------------------
REFLECTION:
${data.reflection || "No reflection available."}

-------------------------
PROGRESS LOG:
${JSON.stringify(progressJson, null, 2)}

-------------------------
COMMAND LOG:
${JSON.stringify(commandsJson, null, 2)}
`;

  // -----------------------------------------
  // Call OpenAI using your actual wrapper
  // -----------------------------------------
  const raw = await runOpenAI(prompt);

  let response;
  try {
    response = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Workflow Critic returned invalid JSON:", raw);
    throw err;
  }

  // -----------------------------------------
  // Write output files
  // -----------------------------------------
  const outDir = path.join(ROOT, "logs", "workflow-critic");
  fs.mkdirSync(outDir, { recursive: true });

  const mdFile = path.join(outDir, `${date}.md`);
  const jsonFile = path.join(outDir, `${date}.json`);

  const md = `
# Workflow Critic Report — ${date}

## Workflow Critique
${response.workflow_critique}

## Summary Critique
${response.summary_critique}

## Reflection Critique
${response.reflection_critique}

## Pattern Detection
${response.patterns}

## Contradictions
${response.contradictions}

## Recommendations
${response.recommendations.map(r => `- ${r}`).join("\n")}
`;

  fs.writeFileSync(mdFile, md);
  fs.writeFileSync(jsonFile, JSON.stringify(response, null, 2));

  console.log(`✅ Workflow Critic report saved to: ${mdFile}`);
  console.log(`📊 JSON saved to: ${jsonFile}`);
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runWorkflowCritic();
}
