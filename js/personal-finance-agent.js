import Orchestrator from "./renderer-orchestrator.js";

const FinanceAgent = {
  run(data) {
    return Orchestrator.runTask({
      agent: "finance",
      action: "analyze",
      payload: data
    });
  },

  handleResult(result) {
    console.log("[FinanceAgent] Result received:", result);

    const outputEl = document.getElementById("finance-output");
    if (outputEl) {
      outputEl.textContent = JSON.stringify(result, null, 2);
    }
  }
};

Orchestrator.registerAgent("finance", FinanceAgent);

export default FinanceAgent;