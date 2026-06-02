// src/runtime/critic-agent.js

function evaluateAgentOutput({ agentName, sopText, agentOutput }) {
  // Minimal critic: just wraps the output with a generic "OK".
  return {
    agentName,
    score: 0.8,
    verdict: "OK",
    notes: "Minimal critic stub. No deep evaluation performed."
  };
}

module.exports = {
  evaluateAgentOutput
};
