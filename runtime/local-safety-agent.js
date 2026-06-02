// src/runtime/local-safety-agent.js
const { buildAgentMissionContext } = require('./overwatch-agent');

async function runLocalSafetyAgent(userTaskSummary, callLLM) {
  const missionContext = buildAgentMissionContext("local_safety_agent", userTaskSummary);

  const response = await callLLM(
    { role: "system", content: missionContext.systemPrompt },
    { role: "user", content: userTaskSummary }
  );

  return response;
}

module.exports = {
  runLocalSafetyAgent
};