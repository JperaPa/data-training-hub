// src/runtime/critic/critic-agent.js

function evaluate({ system, issues, readinessScore }) {
  const contradictions = [];

  if (readinessScore > 80 && issues.length > 0) {
    contradictions.push("High readiness score but issues detected");
  }

  if (system.cpuLoad[0] < 1.0 && system.memUsagePercent < 50 && readinessScore < 50) {
    contradictions.push("Low resource usage but low readiness score");
  }

  return {
    contradictions,
    score: readinessScore,
    issues
  };
}

module.exports = {
  evaluate
};