import Orchestrator from "../renderer-orchestrator.js";

const AgentName = {
  run(payload) {
    return Orchestrator.runTask({
      agent: "agent-name",
      action: "default",
      payload
    });
  },

  handleResult(result) {
    console.log(`[AgentName] Result received:`, result);
    // TODO: update UI here
  }
};

Orchestrator.registerAgent("agent-name", AgentName);

export default AgentName;