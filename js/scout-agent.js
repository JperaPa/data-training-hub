import Orchestrator from "./renderer-orchestrator.js";

const ScoutAgent = {
  run(target) {
    return Orchestrator.runTask({
      agent: "scout",
      action: "recon",
      payload: { target }
    });
  },

  handleResult(result) {
    console.log("[ScoutAgent] Result received:", result);

    const el = document.getElementById("scout-output");
    if (el) el.textContent = JSON.stringify(result, null, 2);
  }
};

Orchestrator.registerAgent("scout", ScoutAgent);

export default ScoutAgent;
