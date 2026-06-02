// src/runtime/orchestrator.js

const { buildOverwatchSystemPrompt, buildAgentMissionContext } = require("../../js/overwatch-agent.js");
const { evaluateAgentOutput } = require("./critic-agent");
const { fullSystemHealth } = require("./overwatch-health");
const { agents } = require("./agent_registry");
const { logOverwatch } = require("./overwatch-log");
const { runALFReview } = require("./alf-agent");
const { recordLearningEvent } = require("./rule-learning-agent");
const { callLLM } = require("./callLLM");

// -------------------------
// Overwatch Planning
// -------------------------
function runOverwatchPlanning(userInput) {
  const overwatchConfig = buildOverwatchSystemPrompt();

  return callLLM(
    { role: "system", content: overwatchConfig.systemPrompt },
    { role: "user", content: userInput }
  );
}

// -------------------------
// Agent Status Helper
// -------------------------
function getAgentStatus(agentName) {
  const health = fullSystemHealth();
  return health[agentName] || null;
}

async function delegateToAgent(agentName, userTaskSummary) {
  const status = getAgentStatus(agentName);

  if (!status) {
    return {
      error: true,
      message: `Unknown agent: ${agentName}`,
      status: "UNKNOWN_AGENT"
    };
  }

  if (status.status === "BROKEN") {
    return {
      error: true,
      message: `Agent ${agentName} is BROKEN. Missing SOP or backend module.`,
      status
    };
  }

  // SPECIAL CASE: Overwatch system diagnostics mode
  if (agentName === "overwatch" && userTaskSummary === "__system__") {
    const { runOverwatchAgent } = require("../../js/overwatch-agent.js");
    return await runOverwatchAgent({});
  }

  // ---------------------------------------------
  // YOUR NEW BACKEND AGENT EXECUTION LOGIC
  // ---------------------------------------------
  const backendModule = agents[agentName].backend;

  if (backendModule && typeof backendModule.run === "function") {
    return await backendModule.run(userTaskSummary);
  }

  // ---------------------------------------------
  // FALLBACK: LLM-DRIVEN AGENT (SOP + mission context)
  // ---------------------------------------------
  const missionContext = buildAgentMissionContext(
    agents[agentName].sop,
    userTaskSummary
  );

  const rawOutput = await callLLM(
    { role: "system", content: missionContext.systemPrompt },
    { role: "user", content: userTaskSummary }
  );

  const evaluation = evaluateAgentOutput({
    agentName,
    sopText: missionContext.systemPrompt,
    agentOutput: rawOutput
  });

  const alfReview = await runALFReview({
    agentName,
    agentOutput: rawOutput,
    criticEvaluation: evaluation,
    callLLM
  });

  logOverwatch(`ALF decision for agent "${agentName}": ${alfReview.decision}`);

  if (alfReview.decision !== "APPROVE") {
    recordLearningEvent({
      agentName,
      agentOutput: rawOutput,
      criticEvaluation: evaluation,
      alfReview
    });
  }

  return {
    rawOutput,
    evaluation,
    alfReview
  };
}
