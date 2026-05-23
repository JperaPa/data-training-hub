// renderer-orchestrator.js

const RendererOrchestrator = {
  agents: {},

  registerAgent(name, agentModule) {
    this.agents[name] = agentModule;
    console.log(`[RendererOrchestrator] Registered agent: ${name}`);
  },

  async runTask(task) {
    console.log("[RendererOrchestrator] Sending task to backend:", task);

    const result = await window.dth.sendTask(task);

    console.log("[RendererOrchestrator] Received result:", result);

    // Route result to the correct renderer agent (if it exists)
    if (result.agent && this.agents[result.agent]) {
      this.agents[result.agent].handleResult(result);
    }

    return result;
  }
};

export default RendererOrchestrator;
