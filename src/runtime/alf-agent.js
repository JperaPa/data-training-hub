// src/runtime/alf-agent.js

/**
 * ALF (Analyst-Like Feedback) Agent
 *
 * Mission:
 * - Simulate a human reviewer sitting between the agent output and the user.
 * - Decide whether to APPROVE, REJECT, or REQUEST_CHANGES.
 * - Provide clear, actionable feedback.
 *
 * Inputs:
 * - agentName: which agent produced the output
 * - agentOutput: raw output from the acting agent
 * - criticEvaluation: result from the Critic Agent
 */

const { buildOverwatchSystemPrompt } = require('../../js/overwatch-agent');

async function runALFReview({ agentName, agentOutput, criticEvaluation, callLLM }) {
  const overwatchConfig = buildOverwatchSystemPrompt();

  const systemPrompt = `
${overwatchConfig.systemPrompt}

You are now operating as ALF (Analyst-Like Feedback) for the Data Training Hub (DTH).

MISSION:
- Review the output of another agent and the Critic's evaluation.
- Decide if the output is acceptable to present to the user.
- If not acceptable, explain what is wrong and what needs to change.

RULES:
- You DO NOT redo the entire task.
- You DO NOT fabricate missing data.
- You DO:
  - Point out gaps, contradictions, or unclear reasoning.
  - Suggest specific improvements.
  - Decide on one of three actions:
    - "APPROVE"
    - "REQUEST_CHANGES"
    - "REJECT"

OUTPUT FORMAT:
You MUST respond in valid JSON with the following fields:
{
  "decision": "APPROVE" | "REQUEST_CHANGES" | "REJECT",
  "rationale": string,
  "required_changes": string[],
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}
`.trim();

  const userContent = `
You are reviewing output from agent: ${agentName}.

--- AGENT OUTPUT (JSON) ---
${JSON.stringify(agentOutput, null, 2)}

--- CRITIC EVALUATION (JSON) ---
${JSON.stringify(criticEvaluation, null, 2)}

Your job:
- Decide if this is acceptable to present to the user.
- If not, list specific changes or issues.
`.trim();

  const response = await callLLM(
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent }
  );

  // We assume response is already parsed JSON or a JSON string.
  let parsed;
  try {
    parsed = typeof response === "string" ? JSON.parse(response) : response;
  } catch (e) {
    parsed = {
      decision: "REJECT",
      rationale: "ALF could not parse its own response as JSON.",
      required_changes: ["Fix ALF output format."],
      severity: "HIGH"
    };
  }

  return parsed;
}

module.exports = {
  runALFReview
};
