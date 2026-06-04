import fs from "fs";
import path from "path";
import TranscriptCollector from "../transcript-collector/index.js";
import DailySessionSummarizer from "../daily-session-summarizer/index.js";
import ReflectionAgent from "../reflection/index.js";
import SOPEnforcementAgent from "../sop-enforcement/index.js";
import MCPPEnforcementAgent from "../mcpp-enforcement/index.js";
import { loadAgentContext } from "../../libs/ai/agentContext.js";

export default class Orchestrator {
  constructor() {
    this.transcriptCollector = new TranscriptCollector();
    this.summarizer = new DailySessionSummarizer();
    this.reflection = new ReflectionAgent();
    this.sopEnforcer = new SOPEnforcementAgent();
    this.mcppEnforcer = new MCPPEnforcementAgent();
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
    const summaryResult = await this.summarizer.run(context);
    const sessionSummaryPath = summaryResult?.sessionSummaryPath || null;

    // -----------------------------
    // 3. Reflection Agent
    // -----------------------------
    const reflectionResult = await this.reflection.run(context);
    const reflectionPath = reflectionResult?.reflectionPath || null;

    // -----------------------------
    // 4. SOP Enforcement Agent
    // -----------------------------
    const sopResult = await this.sopEnforcer.run(context);
    const sopCheckPath = sopResult?.sopCheckPath || null;

    // -----------------------------
    // 5. MCPP Enforcement Agent (NEW)
    // -----------------------------
    const mcppResult = await this.mcppEnforcer.run(context);
    const mcppCheckPath = mcppResult?.mcppCheckPath || null;

    // -----------------------------
    // 6. Progress Evaluator (inside orchestrator)
    // -----------------------------
    const progressPath = this.writeProgressFile(date, {
      transcriptPath,
      sessionSummaryPath,
      reflectionPath,
      sopCheckPath,
      mcppCheckPath
    });

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

// Run standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  const context = await loadAgentContext("orchestrator");
  const orchestrator = new Orchestrator();
  orchestrator.run(context);
}
