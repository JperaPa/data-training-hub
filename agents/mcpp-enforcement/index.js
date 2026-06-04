import fs from "fs";
import path from "path";
import { BaseAgent } from "../../libs/ai/baseAgent.js";
import { loadAgentContext } from "../../libs/ai/agentContext.js";

const schema = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "agents/mcpp-enforcement/schema.json"),
    "utf-8"
  )
);

export default class MCPPEnforcementAgent extends BaseAgent {
  constructor() {
    super("mcpp-enforcement", schema);
  }

  async run(context) {
    const { date, paths, logger } = context;

    logger.info(`Running MCPP Enforcement Agent for ${date}`);

    const transcript = this.safeLoad(paths.transcript);
    const sessionSummary = this.safeLoad(paths.sessionSummary);
    const reflection = this.safeLoad(paths.reflection);

    const planningDetected = this.detectPlanningActivity(
      transcript,
      sessionSummary,
      reflection
    );

    const steps = {
      problemFraming: this.evaluateProblemFraming(transcript, sessionSummary),
      coaDevelopment: this.evaluateCOADevelopment(transcript, sessionSummary),
      coaWargaming: this.evaluateCOAWargaming(transcript, sessionSummary),
      coaComparisonDecision: this.evaluateCOAComparisonDecision(
        transcript,
        sessionSummary
      ),
      ordersDevelopment: this.evaluateOrdersDevelopment(
        transcript,
        sessionSummary
      ),
      transition: this.evaluateTransition(transcript, sessionSummary)
    };

    const findings = this.generateFindings(steps);
    const recommendations = this.generateRecommendations(steps);
    const overallStatus = this.computeOverallStatus(steps, planningDetected);

    const output = {
      date,
      overallStatus,
      steps,
      findings,
      recommendations,
      alignment: {
        missionAlignment: this.assessMissionAlignment(sessionSummary, reflection),
        readinessAssessment: this.assessReadiness(steps)
      },
      sourceFiles: {
        transcript: paths.transcript,
        sessionSummary: paths.sessionSummary,
        reflection: paths.reflection
      }
    };

    const outPath = path.join("logs", "mcpp-checks", `${date}.md`);
    this.writeMarkdownReport(outPath, output);

    logger.success(`MCPP compliance report written to: ${outPath}`);

    return {
      mcppCheckPath: outPath,
      ...output
    };
  }

  safeLoad(filePath) {
    try {
      if (!filePath || !fs.existsSync(filePath)) return null;
      return fs.readFileSync(filePath, "utf-8");
    } catch {
      return null;
    }
  }

  detectPlanningActivity(transcript, summary, reflection) {
    const text = `${transcript || ""} ${summary || ""} ${reflection || ""}`.toLowerCase();
    const keywords = [
      "coa",
      "course of action",
      "wargame",
      "mission",
      "orders",
      "problem framing",
      "planning",
      "transition"
    ];
    return keywords.some(k => text.includes(k));
  }

  evaluateProblemFraming() {
    return { status: "Partial", notes: "Problem framing evaluation not yet implemented." };
  }

  evaluateCOADevelopment() {
    return { status: "Missing", notes: "No COA development artifacts detected." };
  }

  evaluateCOAWargaming() {
    return { status: "Missing", notes: "No wargaming evidence found." };
  }

  evaluateCOAComparisonDecision() {
    return { status: "Partial", notes: "Decision criteria not fully documented." };
  }

  evaluateOrdersDevelopment() {
    return { status: "Missing", notes: "Orders development not detected." };
  }

  evaluateTransition() {
    return { status: "Compliant", notes: "Transition considerations appear present." };
  }

  generateFindings(steps) {
    const findings = [];
    for (const [step, data] of Object.entries(steps)) {
      if (data.status !== "Compliant") {
        findings.push(`${step}: ${data.status} — ${data.notes}`);
      }
    }
    return findings;
  }

  generateRecommendations(steps) {
    const recs = [];
    if (steps.coaWargaming.status === "Missing") {
      recs.push("Conduct COA wargaming against at least 3 enemy COAs.");
    }
    if (steps.ordersDevelopment.status === "Missing") {
      recs.push("Develop a 5-paragraph order for the selected COA.");
    }
    return recs;
  }

  computeOverallStatus(steps, planningDetected) {
    if (!planningDetected) return "Unable to Evaluate";

    const statuses = Object.values(steps).map(s => s.status);

    if (statuses.every(s => s === "Compliant")) return "Compliant";
    if (statuses.some(s => s === "Non-Compliant" || s === "Missing"))
      return "Non-Compliant";
    return "Partial";
  }

  assessMissionAlignment() {
    return "Mission alignment assessment not yet implemented.";
  }

  assessReadiness() {
    return "Readiness assessment not yet implemented.";
  }

  writeMarkdownReport(outPath, output) {
    const { date, overallStatus, steps, findings, recommendations, alignment } = output;

    const md = `
# MCPP Compliance Report — ${date}

## Overall Status
${overallStatus}

## Step-by-Step Evaluation
${Object.entries(steps)
  .map(([step, data]) => `- **${step}**: ${data.status}\n  - ${data.notes}`)
  .join("\n")}

## Findings
${findings.map(f => `- ${f}`).join("\n")}

## Recommendations
${recommendations.map(r => `- ${r}`).join("\n")}

## Alignment
- Mission Alignment: ${alignment.missionAlignment}
- Readiness Assessment: ${alignment.readinessAssessment}
`;

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, md.trim(), "utf-8");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const context = await loadAgentContext("mcpp-enforcement");
  const agent = new MCPPEnforcementAgent();
  agent.run(context);
}
