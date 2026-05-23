// src/runtime/orchestrator.js
const CEAgent = require("./ce-agent");
const CriticAgent = require("./critic/critic-agent");
const ALFAgent = require("./alf/alf-agent");
const Diagnostics = require("./system-diagnostics");
const { buildAgentResponse } = require("./schemas");

async function run(task) {
  const { agent, action, payload } = task;

  // 1) Get system snapshot
  const system = await Diagnostics.run();

  // 2) CE evaluation
  const ce = CEAgent.runCEAgent({ system, task });

  // 3) Call acting agent (you can route by agent name here)
  const output = await routeToActingAgent({ agent, action, payload });

  // 4) Critic evaluation
  const critic = await CriticAgent.evaluate({ task, output, ce });

  // 5) ALF decision
  const alf = await ALFAgent.decide({ task, output, ce, critic });

  // 6) Build unified response
  return buildAgentResponse({
    agent,
    action,
    input: payload,
    ce,
    critic,
    alf,
    output,
    status: "ok"
  });
}

async function routeToActingAgent({ agent, action, payload }) {
  // For now, simple switch; later you can modularize
  switch (agent) {
    case "osint":
      return { message: "OSINT placeholder", payload };
    case "sanctions":
      return { message: "Sanctions placeholder", payload };
    case "finance":
      return { message: "Finance placeholder", payload };
    case "scout":
      return { message: "Scout placeholder", payload };
    case "typology":
      return { message: "Typology placeholder", payload };
    case "training":
      return { message: "Training placeholder", payload };
    default:
      return { message: "Unknown agent", payload };
  }
}

module.exports = { run };