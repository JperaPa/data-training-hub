import fs from "fs";
import path from "path";
import TranscriptCollector from "../transcript-collector/index.js";
import { run as runDailySessionSummarizer } from "../daily-session-summarizer/index.js";
import { run as runReflectionAgent } from "../reflection/index.js";
import { run as runSOPEnforcement } from "../sop-enforcement/index.js";
import { run as runMCPPEnforcement } from "../mcpp-enforcement/index.js";
import { loadAgentContext } from "../../libs/ai/agentContext.js";
import { runWorkflowCritic } from "../workflow-critic/index.js";
import { execSync } from "child_process";

export default class Orchestrator {
  constructor() {
    // Only TranscriptCollector is a class-based agent
    this.transcriptCollector = new TranscriptCollector();
  }

  async run(context) {
    const { date, logger } = context;

    logger.info(`Running FULL DTH Pipeline for ${date}`);

    // -----------------------------
    // 1. Transcript Collector
    // -----------------------------
    const transcriptResult = await this.transcriptCollector.run(context);
    const transcriptPath = transcriptResult?.transcriptPath || null;

    // -----------------------------
    // 2. Daily Session Summarizer
    // -----------------------------
    const summaryResult = await runDailySessionSummarizer(context);
    const sessionSummaryPath = summaryResult?.sessionSummaryPath || null;

    // -----------------------------
    // 3. Reflection Agent
    // -----------------------------
    const reflectionResult = await runReflectionAgent(context);
    const reflectionPath = reflectionResult?.reflectionPath || null;

    // -----------------------------
    // 4. SOP Enforcement Agent
    // -----------------------------
    const sopResult = await runSOPEnforcement(context);
    const sopCheckPath = sopResult?.sopCheckPath || null;

    // -----------------------------
    // 5. MCPP Enforcement Agent
    // -----------------------------
    const mcppResult = await runMCPPEnforcement(context);
    const mcppCheckPath = mcppResult?.mcppCheckPath || null;

    // -----------------------------
    // 6. Progress Evaluator (internal)
    // -----------------------------
    const progressPath = this.writeProgressFile(date, {
      transcriptPath,
      sessionSummaryPath,
      reflectionPath,
      sopCheckPath,
      mcppCheckPath
    });

    // -----------------------------
    // 7. Workflow Critic Agent (NEW)
    // -----------------------------
    await runWorkflowCritic(context);

    // -----------------------------
    // 8. Coach Agent (FINAL)
    // -----------------------------
    execSync(`node agents/coach/index.js`, { stdio: "inherit" });

    logger.success("Daily pipeline completed.");

    return {
      date,
      transcriptPath,
      sessionSummaryPath,
      reflectionPath,
      sopCheckPath,
      mcppCheckPath,
      progressPath
    };
  }

  // -----------------------------
  // Progress Evaluator
  // -----------------------------
  writeProgressFile(date, data) {
    const outDir = path.join("logs", "progress");
    const outPath = path.join(outDir, `${date}.json`);

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");

    return outPath;
  }
}

// Allow running orchestrator directly from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const context = await loadAgentContext("orchestrator");
    const orchestrator = new Orchestrator();
    await orchestrator.run(context);
  })();
}
