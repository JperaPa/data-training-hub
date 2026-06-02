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

export function callOverwatch() {
    window.api.send("task", {
        agent: "overwatch",
        payload: {}
    });
}

export function callOverwatchSystem() {
    window.api.send("task", {
        agent: "overwatch",
        payload: "__system__"
    });
}

// Tab switching
document.getElementById("tab-secure-search")?.addEventListener("click", () => {
  // hide other panels as needed
  document.getElementById("secure-search-panel").style.display = "block";
});

// Run search
document.getElementById("search-run")?.addEventListener("click", () => {
  const query = document.getElementById("search-query").value;
  const select = document.getElementById("search-engine");
  const engines = Array.from(select.selectedOptions).map(o => o.value);

  window.api.send("task", {
    agent: "secure_search",
    payload: { query, engines }
  });
});

// Receive result
window.api.receive("task-result", (result) => {
  if (result.agent === "secure_search") {
    document.getElementById("search-results").textContent =
      JSON.stringify(result, null, 2);
  }
});

// ------------------------------------------------------------
// EXPOSE FUNCTIONS GLOBALLY FOR INLINE HTML BUTTONS
// ------------------------------------------------------------
window.callOverwatch = callOverwatch;
window.callOverwatchSystem = callOverwatchSystem;
