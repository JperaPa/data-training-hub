// src/runtime/critic/critic-agent.js
async function evaluate({ task, output, ce }) {
  return {
    approved: true,
    reasons: [],
    ceReadiness: ce.readinessScore
  };
}

module.exports = { evaluate };
