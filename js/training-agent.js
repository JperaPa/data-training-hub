import Orchestrator from "./renderer-orchestrator.js";

const TrainingAgent = {
  run(example) {
    return Orchestrator.runTask({
      agent: "training",
      action: "learn",
      payload: { example }
    });
  },

  handleResult(result) {
    console.log("[TrainingAgent] Result received:", result);

    const el = document.getElementById("training-output");
    if (el) el.textContent = JSON.stringify(result, null, 2);
  }
};

Orchestrator.registerAgent("training", TrainingAgent);

export default TrainingAgent;