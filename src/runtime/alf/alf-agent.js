// src/runtime/alf/alf-agent.js

function learn({ system, issues, readinessScore }) {
  const learning = {};

  if (issues.includes("High memory pressure")) {
    learning.memory = "User frequently hits memory limits";
  }

  if (issues.includes("ActivityWatch unreachable")) {
    learning.activitywatch = "Telemetry source often offline";
  }

  return learning;
}

module.exports = {
  learn
};