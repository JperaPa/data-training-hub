// src/runtime/overwatch-health.js

function fullSystemHealth() {
  // Minimal health: mark known agents as OK.
  return {
    decision_engine: { status: "OK" },
    infra: { status: "OK" },
    local_safety: { status: "OK" },
    overwatch: { status: "OK" }
  };
}

module.exports = {
  fullSystemHealth
};