// src/runtime/agent_registry.js

const path = require("path");
const fs = require("fs");

// Load SOP helper
function loadSOP(filename) {
  const sopPath = path.join(__dirname, "../../sop", filename);
  return fs.readFileSync(sopPath, "utf8");
}

// ---------------------------------------------
// AGENT REGISTRY (MATCHES YOUR REAL FILES)
// ---------------------------------------------
const agents = {
  decision_engine: {
    sop: loadSOP("decision_engine_agent_sop.md"),
    backend: require("../../js/decision-engine-agent.js")
  },

  infra: {
    sop: loadSOP("infra_agent_sop.md"),
    backend: require("../../js/scout-agent.js")
  },

  local_safety: {
    sop: loadSOP("local_safety_agent_sop.md"),
    backend: require("../../js/local-safety-panel.js")
  },

  finance: {
    sop: loadSOP("finance_agent_sop.md"),
    backend: require("../../js/personal-finance-agent.js")
  },

  // You DO NOT have sanctions_agent_sop.md
  // So we disable this agent until you create one
  sanctions: {
    sop: loadSOP("_template.md"),
    backend: require("../../js/sanctions-agent.js")
  },

  osint: {
    sop: loadSOP("orchestrator_agent_sop.md"),
    backend: require("../../js/osint-agent.js")
  },

  training: {
    sop: loadSOP("_template.md"),
    backend: require("../../js/training-agent.js")
  },
  
  secure_search: {
  sop: loadSOP("_template.md"),
  backend: require("../../js/secure-search-agent.js")
},


  // ---------------------------------------------
  // OVERWATCH (Unified Executive Agent)
  // ---------------------------------------------
  overwatch: {
    sop: loadSOP("overwatch_agent_sop.md"),
    backend: require("../../js/overwatch-agent.js")
  }
};

module.exports = {
  agents
};