import Orchestrator from "./renderer-orchestrator.js";

const SanctionsAgent = {
  run(name) {
    return Orchestrator.runTask({
      agent: "sanctions",
      action: "check",
      payload: { name }
    });
  },

  handleResult(result) {
    console.log("[SanctionsAgent] Result received:", result);

    const outputEl = document.getElementById("sanctions-output");
    if (outputEl) {
      outputEl.textContent = JSON.stringify(result, null, 2);
    }
  }
};

Orchestrator.registerAgent("sanctions", SanctionsAgent);

export default SanctionsAgent;
