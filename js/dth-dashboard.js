// js/dth-dashboard.js
import OSINTAgent from "./osint-agent.js";
import SanctionsAgent from "./sanctions-agent.js";
import FinanceAgent from "./personal-finance-agent.js";
import ScoutAgent from "./scout-agent.js";
import TypologyAgent from "./typology-agent.js";
import TrainingAgent from "./training-agent.js";
import { getSystemLoad } from "./utils.js";
import { renderLocalSafetyPanel } from "./local-safety-panel.js";
import { callOverwatch } from "./renderer-orchestrator.js";

function $(id) {
  return document.getElementById(id);
}

/* ------------------------------------------------------------
   BACKGROUND PULSE
------------------------------------------------------------ */
function updateBackgroundPulse() {
  const load = getSystemLoad(); // 0–1
  const intensity = 0.1 + load * 0.9;
  const speed = 6 - load * 4;

  document.documentElement.style.setProperty("--dth-pulse-intensity", intensity.toString());
  document.documentElement.style.setProperty("--dth-pulse-speed", `${speed}s`);
}

setInterval(updateBackgroundPulse, 500);
updateBackgroundPulse();

/* ------------------------------------------------------------
   LOCAL SAFETY BUTTON
------------------------------------------------------------ */
if ($("btn-local-safety")) {
  $("btn-local-safety").addEventListener("click", async () => {
    const task = "Provide a local safety intelligence assessment for my area.";
    const response = await window.electronAPI.invoke("run-dth-task", { task });

    if (response.rawOutput && response.rawOutput.local_safety_score !== undefined) {
      renderLocalSafetyPanel(response.rawOutput);
    }
  });
}

/* ------------------------------------------------------------
   EXISTING AGENT BUTTONS
------------------------------------------------------------ */

// OSINT
if ($("run-osint-btn")) {
  $("run-osint-btn").addEventListener("click", async () => {
    const query = $("osint-input").value;
    const result = await OSINTAgent.run(query);
    $("osint-output").textContent = JSON.stringify(result, null, 2);
  });
}

// Sanctions
if ($("run-sanctions-btn")) {
  $("run-sanctions-btn").addEventListener("click", async () => {
    const name = $("sanctions-input").value;
    const result = await SanctionsAgent.run(name);
    $("sanctions-output").textContent = JSON.stringify(result, null, 2);
  });
}

// Finance
if ($("run-finance-btn")) {
  $("run-finance-btn").addEventListener("click", async () => {
    const data = { income: $("finance-income")?.value, notes: $("finance-notes")?.value };
    const result = await FinanceAgent.run(data);
    $("finance-output").textContent = JSON.stringify(result, null, 2);
  });
}

// Scout
if ($("run-scout-btn")) {
  $("run-scout-btn").addEventListener("click", async () => {
    const target = $("scout-input").value;
    const result = await ScoutAgent.run(target);
    $("scout-output").textContent = JSON.stringify(result, null, 2);
  });
}

// Typology
if ($("run-typology-btn")) {
  $("run-typology-btn").addEventListener("click", async () => {
    const tx = $("typology-input").value;
    const result = await TypologyAgent.run(tx);
    $("typology-output").textContent = JSON.stringify(result, null, 2);
  });
}

// Training
if ($("run-training-btn")) {
  $("run-training-btn").addEventListener("click", async () => {
    const example = $("training-input").value;
    const result = await TrainingAgent.run(example);
    $("training-output").textContent = JSON.stringify(result, null, 2);
  });
}

window.api.receive("overwatch-response", (data) => {
    document.getElementById("overwatch-output").innerText =
        JSON.stringify(data, null, 2);
});

function renderSystemHealth(data) {
    document.getElementById("system-health").innerText =
        JSON.stringify(data, null, 2);
}

function renderAgentStatus(data) {
    document.getElementById("agent-status").innerText =
        JSON.stringify(data, null, 2);
}

function renderCyber(data) {
    document.getElementById("cyber-checks").innerText =
        JSON.stringify(data, null, 2);
}

function renderGoals(data) {
    document.getElementById("goals").innerText =
        JSON.stringify(data, null, 2);
}

function renderAlerts(data) {
    document.getElementById("alerts").innerText =
        JSON.stringify(data, null, 2);
}

function renderRecommended(data) {
    document.getElementById("recommended").innerText =
        JSON.stringify(data, null, 2);
}
