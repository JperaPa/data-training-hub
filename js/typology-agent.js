import Orchestrator from "./renderer-orchestrator.js";

const TypologyAgent = {
  run(transaction) {
    return Orchestrator.runTask({
      agent: "typology",
      action: "classify",
      payload: { transaction }
    });
  },

  handleResult(result) {
    console.log("[TypologyAgent] Result received:", result);

    const el = document.getElementById("typology-output");
    if (el) el.textContent = JSON.stringify(result, null, 2);
  }
};

Orchestrator.registerAgent("typology", TypologyAgent);

export default TypologyAgent;