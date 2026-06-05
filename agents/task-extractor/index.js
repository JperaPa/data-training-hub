import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// ---------------------------
// ENV + BASE AI CALL
// ---------------------------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set. AI extraction will fail.");
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
// TASK EXTRACTION AI CALL
// ---------------------------
async function callAIForTasks(transcript) {
  const prompt =
`You are a task extraction engine for a personal productivity system.

Extract tasks from the transcript and return ONLY valid JSON:

{
  "tasks": [
    {
      "description": "string",
      "status": "new|in_progress|completed|abandoned|recurring",
      "category": "coding|debugging|planning|writing|learning|admin|other"
    }
  ]
}

DAILY TRANSCRIPT:
${transcript}
`;

  const output = await callAI(prompt);
  return JSON.parse(output).tasks;
}

// ---------------------------
// MAIN AGENT
// ---------------------------
export async function runTaskExtractor() {
  console.log("🧠 AI Task Extraction Agent started...");

  const date = new Date().toISOString().split("T")[0];
  const transcriptPath = path.join("logs", "transcripts", `${date}.txt`);
  const outputDir = path.join("logs", "tasks");
  const outputMd = path.join(outputDir, `${date}.md`);
  const outputJson = path.join(outputDir, `${date}.json`);

  fs.mkdirSync(outputDir, { recursive: true });

  if (!fs.existsSync(transcriptPath)) {
    console.log(`⚠️ No transcript found for ${date}`);
    fs.writeFileSync(outputMd, `# Tasks for ${date}\nNo transcript found.`);
    fs.writeFileSync(
      outputJson,
      JSON.stringify({ date, tasks: [], message: "No transcript found" }, null, 2)
    );
    console.log("📄 Empty task files saved.");
    return;
  }

  if (!OPENAI_API_KEY) {
    fs.writeFileSync(
      outputMd,
      `# Tasks for ${date}\nAI extraction unavailable (missing OPENAI_API_KEY).`
    );
    fs.writeFileSync(
      outputJson,
      JSON.stringify({ date, tasks: [], message: "AI key missing" }, null, 2)
    );
    console.log("⚠️ AI key missing. Wrote placeholder task files.");
    return;
  }

  const transcript = fs.readFileSync(transcriptPath, "utf8");

  let tasks;
  try {
    tasks = await callAIForTasks(transcript);
  } catch (err) {
    console.error("❌ AI task extraction failed:", err.message);
    fs.writeFileSync(
      outputMd,
      `# Tasks for ${date}\nAI extraction failed: ${err.message}`
    );
    fs.writeFileSync(
      outputJson,
      JSON.stringify({ date, tasks: [], error: err.message }, null, 2)
    );
    return;
  }

  // Markdown output
  const md =
`# Extracted Tasks for ${date}

${tasks.length === 0 ? "No tasks detected." : tasks.map(t => {
  const statusLabel =
    t.status === "completed" ? "✅" :
    t.status === "in_progress" ? "⏳" :
    t.status === "abandoned" ? "❌" :
    t.status === "recurring" ? "🔁" :
    "🆕";

  return `- ${statusLabel} [${t.category}] ${t.description}`;
}).join("\n")}
`;

  fs.writeFileSync(outputMd, md.trim() + "\n");

  // JSON output
  const json = {
    date,
    task_count: tasks.length,
    tasks
  };

  fs.writeFileSync(outputJson, JSON.stringify(json, null, 2));

  console.log(`✅ AI tasks extracted and saved to: ${outputMd}`);
  console.log(`📊 Machine-readable AI tasks saved to: ${outputJson}`);
}

// ---------------------------
// CLI ENTRYPOINT
// ---------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  runTaskExtractor();
}
