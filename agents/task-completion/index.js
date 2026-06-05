import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// ---------------------------
// ENV + BASE AI CALL
// ---------------------------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set. AI completion analysis will fail.");
}

async function callAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      input: prompt
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI API error: ${response.status} - ${text}`);
  }

  const data = await response.json();

  if (!data.output_text) {
    throw new Error("Responses API returned no output_text field.");
  }

  return data.output_text.trim();
}

// ---------------------------
// HELPERS
// ---------------------------
function getISODateOffset(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

function loadJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

// ---------------------------
// AI COMPLETION ANALYSIS
// ---------------------------
async function callAIForCompletionAnalysis(payload) {
  const prompt =
`You are a task completion analysis engine.

Infer:
- completed_today
- carried_over
- abandoned
- new_today

Return ONLY valid JSON.

DATA:
${JSON.stringify(payload, null, 2)}
`;

  const output = await callAI(prompt);
  return JSON.parse(output);
}

// ---------------------------
// MAIN AGENT
// ---------------------------
export async function runTaskCompletion() {
  console.log("📌 Task Completion Agent started...");

  const today = getISODateOffset(0);
  const yesterday = getISODateOffset(-1);

  const tasksDir = path.join("logs", "tasks");
  const transcriptsDir = path.join("logs", "transcripts");
  const outputDir = path.join("logs", "task-completion");

  fs.mkdirSync(outputDir, { recursive: true });

  const todayTasksPath = path.join(tasksDir, `${today}.json`);
  const yesterdayTasksPath = path.join(tasksDir, `${yesterday}.json`);
  const todayTranscriptPath = path.join(transcriptsDir, `${today}.txt`);

  const todayTasks = loadJsonIfExists(todayTasksPath);
  const yesterdayTasks = loadJsonIfExists(yesterdayTasksPath);
  const todayTranscript = fs.existsSync(todayTranscriptPath)
    ? fs.readFileSync(todayTranscriptPath, "utf8")
    : "";

  const outputJsonPath = path.join(outputDir, `${today}.json`);
  const outputMdPath = path.join(outputDir, `${today}.md`);

  if (!todayTasks || !todayTasks.tasks) {
    const msg = `No tasks JSON found for today (${today}).`;
    console.log(`⚠️ ${msg}`);
    fs.writeFileSync(outputMdPath, `# Task Completion Report for ${today}\n\n${msg}\n`);
    fs.writeFileSync(outputJsonPath, JSON.stringify({ date: today, error: msg }, null, 2));
    return;
  }

  if (!OPENAI_API_KEY) {
    const msg = "OPENAI_API_KEY not set. Cannot run AI completion analysis.";
    console.log(`⚠️ ${msg}`);
    fs.writeFileSync(outputMdPath, `# Task Completion Report for ${today}\n\n${msg}\n`);
    fs.writeFileSync(outputJsonPath, JSON.stringify({ date: today, error: msg }, null, 2));
    return;
  }

  const payload = {
    date: today,
    yesterday_date: yesterday,
    yesterday_tasks: yesterdayTasks ? yesterdayTasks.tasks || [] : [],
    today_tasks: todayTasks.tasks || [],
    today_transcript: todayTranscript
  };

  let analysis;
  try {
    analysis = await callAIForCompletionAnalysis(payload);
  } catch (err) {
    console.error("❌ AI completion analysis failed:", err.message);
    fs.writeFileSync(outputMdPath, `# Task Completion Report for ${today}\n\nAI analysis failed: ${err.message}\n`);
    fs.writeFileSync(outputJsonPath, JSON.stringify({ date: today, error: err.message }, null, 2));
    return;
  }

  const {
    completed_today = [],
    carried_over = [],
    abandoned = [],
    new_today = []
  } = analysis;

  const md =
`# Task Completion Report for ${today}

## Completed Today
${completed_today.length === 0 ? "- None" : completed_today.map(t => `- ✅ [${t.category}] ${t.description}`).join("\n")}

## Carried Over
${carried_over.length === 0 ? "- None" : carried_over.map(t => `- ⏳ [${t.category}] ${t.description}`).join("\n")}

## Abandoned
${abandoned.length === 0 ? "- None" : abandoned.map(t => `- ❌ [${t.category}] ${t.description}`).join("\n")}

## New Today
${new_today.length === 0 ? "- None" : new_today.map(t => `- 🆕 [${t.category}] ${t.description}`).join("\n")}
`;

  fs.writeFileSync(outputMdPath, md);
  fs.writeFileSync(outputJsonPath, JSON.stringify({
    date: today,
    completed_today,
    carried_over,
    abandoned,
    new_today
  }, null, 2));

  console.log(`✅ Task completion report saved to: ${outputMdPath}`);
  console.log(`📊 Machine-readable completion JSON saved to: ${outputJsonPath}`);
}

// ---------------------------
// CLI ENTRYPOINT
// ---------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  runTaskCompletion();
}
