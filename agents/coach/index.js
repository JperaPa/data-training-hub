import fs from "fs";
import path from "path";

// ---------------------------------------------------------
// ROOT DIRECTORY (absolute path)
// ---------------------------------------------------------
const ROOT = path.resolve(process.cwd());

// ---------------------------------------------------------
// COMMAND INTELLIGENCE HELPERS
// ---------------------------------------------------------

function countCommandFrequency(usageLog) {
  const freq = {};
  for (const entry of usageLog) {
    const cmd = entry.command.trim();
    freq[cmd] = (freq[cmd] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([cmd, count]) => ({ cmd, count }));
}

function extractCommandsFromConversation(text) {
  if (!text) return [];

  const lines = text.split("\n");
  const commands = [];

  for (const line of lines) {
    if (
      line.startsWith("git ") ||
      line.startsWith("npm ") ||
      line.startsWith("cd ") ||
      line.startsWith("node ") ||
      line.startsWith("npx ") ||
      line.includes("tauri")
    ) {
      commands.push({
        command: line.trim(),
        timestamp: new Date().toISOString()
      });
    }
  }

  return commands;
}

// ---------------------------------------------------------
// MAIN COACH AGENT
// ---------------------------------------------------------

export async function runCoach() {
  console.log("🎯 AI Coach started...");

  const date = new Date().toISOString().split("T")[0];

  // All paths now absolute
  const paths = {
    transcript: path.join(ROOT, "logs", "transcripts", `${date}.txt`),
    summary: path.join(ROOT, "logs", "summaries", `${date}.md`),
    reflection: path.join(ROOT, "logs", "reflections", `${date}.md`),
    sop: path.join(ROOT, "logs", "sop", `${date}.md`),
    progress: path.join(ROOT, "logs", "progress", `${date}.json`),
    review: path.join(ROOT, "logs", "review", `${date}.md`)
  };

  const outputDir = path.join(ROOT, "logs", "coach");
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

  // Load evaluation JSON
  const evaluationPath = path.join(ROOT, "logs", "evaluation", `${date}.json`);
  const evaluation = fs.existsSync(evaluationPath)
    ? JSON.parse(fs.readFileSync(evaluationPath, "utf8"))
    : null;

  // Basic metrics
  const transcriptLength = data.transcript ? data.transcript.length : 0;
  const workflowScore = evaluation ? evaluation.workflow_score : 0;

  const coachVerdict =
    workflowScore >= 8
      ? "Strong day"
      : workflowScore >= 5
      ? "Average day"
      : "Weak day";

  // ---------------------------------------------------------
  // COMMAND INTELLIGENCE (absolute paths)
  // ---------------------------------------------------------

  const commandLogPath = path.join(ROOT, "logs", "commands", `${date}.json`);
  let commandUsage = [];

  if (fs.existsSync(commandLogPath)) {
    try {
      commandUsage = JSON.parse(fs.readFileSync(commandLogPath, "utf8"));
    } catch (err) {
      console.error("❌ Error parsing command log JSON:", err);
    }
  }

  const conversationCommands = [
    ...extractCommandsFromConversation(data.transcript),
    ...extractCommandsFromConversation(data.summary),
    ...extractCommandsFromConversation(data.reflection)
  ];

  const allCommands = [...commandUsage, ...conversationCommands];
  const commandFrequency = countCommandFrequency(allCommands);

  // ---------------------------------------------------------
  // BUILD COACHING REPORT
  // ---------------------------------------------------------

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

## Command Intelligence

### Most Used Commands Today
${commandFrequency.length === 0
  ? "- No commands detected today."
  : commandFrequency
      .map(c => `- ${c.cmd} — ${c.count} time${c.count > 1 ? "s" : ""}`)
      .join("\n")
}

### Commands Mentioned in Conversation
${conversationCommands.length === 0
  ? "- None"
  : conversationCommands.map(c => `- ${c.command}`).join("\n")
}

## Questions for Tomorrow
1. What is the single most important task you must complete
2. What will you avoid doing to stay focused
3. What will you measure to track progress
`;

  fs.writeFileSync(outputFile, coaching);

  const json = {
    date,
    verdict: coachVerdict,
    transcript_length: transcriptLength,
    workflow_score: workflowScore,
    sop_compliance: evaluation ? evaluation.sop_compliance : false,
    command_frequency: commandFrequency,
    conversation_commands: conversationCommands,
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
