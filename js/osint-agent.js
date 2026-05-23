import Orchestrator from "./renderer-orchestrator.js";

const OSINTAgent = {
  run(query) {
    return Orchestrator.runTask({
      agent: "osint",
      action: "lookup",
      payload: { query }
    });
  },

  handleResult(result) {
    console.log("[OSINTAgent] Result received:", result);

    const outputEl = document.getElementById("osint-output");
    if (outputEl) {
      outputEl.textContent = JSON.stringify(result, null, 2);
    }
  }
};

Orchestrator.registerAgent("osint", OSINTAgent);

export default OSINTAgent;