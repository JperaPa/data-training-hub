// js/dth-dashboard.js
import OSINTAgent from "./osint-agent.js";
import SanctionsAgent from "./sanctions-agent.js";
import FinanceAgent from "./personal-finance-agent.js";
import ScoutAgent from "./scout-agent.js";
import TypologyAgent from "./typology-agent.js";
import TrainingAgent from "./training-agent.js";
import { getSystemLoad } from "./utils.js";

function updateBackgroundPulse() {
    const load = getSystemLoad(); // 0–1

    // Map load → intensity + speed
    const intensity = 0.1 + load * 0.9;   // 0.1–1.0
    const speed = 6 - load * 4;           // 6s → 2s

    document.documentElement.style.setProperty("--dth-pulse-intensity", intensity.toString());
    document.documentElement.style.setProperty("--dth-pulse-speed", `${speed}s`);
}

// Smooth updates
setInterval(updateBackgroundPulse, 500);
updateBackgroundPulse();


function $(id) {
  return document.getElementById(id);
}

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
import { getSystemLoad } from "./utils.js";

function updateBackgroundPulse() {
    const load = getSystemLoad(); // 0.0 → 1.0
    const intensity = Math.min(1, load * 2);

    document.body.style.background = `
        radial-gradient(
            circle,
            rgba(255,0,0,${0.1 + intensity * 0.4}) 0%,
            rgba(0,0,0,1) 80%
        )
    `;

    document.body.style.transition = "background 0.5s ease";
}

setInterval(updateBackgroundPulse, 500);
import { getSystemLoad } from "./utils.js";

function updateBackgroundPulse() {
  const load = getSystemLoad(); // 0–1
  const intensity = 0.1 + load * 0.9;
  const speed = 6 - load * 4;

  document.documentElement.style.setProperty("--dth-pulse-intensity", intensity.toString());
  document.documentElement.style.setProperty("--dth-pulse-speed", `${speed}s`);
}

setInterval(updateBackgroundPulse, 500);
updateBackgroundPulse();

// -----------------------------
// System panel live updates
// -----------------------------
function classifyMem(memPercent) {
  if (memPercent < 70) return "ok";
  if (memPercent < 90) return "warn";
  return "crit";
}

function classifyCpu(load) {
  if (load < 0.7) return "ok";
  if (load < 1.5) return "warn";
  return "crit";
}

function classifyDisk(disk) {
  if (disk === "100%") return "crit";
  if (disk === "busy") return "warn";
  return "ok";
}

if (window.diagnostics && typeof window.diagnostics.onUpdate === "function") {
  window.diagnostics.onUpdate((system) => {
    const cpuEl = document.getElementById("cpu-load-value");
    const memEl = document.getElementById("mem-usage-value");
    const diskEl = document.getElementById("disk-status-value");

    if (!cpuEl || !memEl || !diskEl) return;

    const mem = system.memUsagePercent ?? 0;
    const cpuArr = system.cpuLoad ?? [];
    const cpu = cpuArr[0] ?? 0; // 1‑minute load
    const disk = system.disk ?? "unknown";

    // CPU
    cpuEl.textContent = `${cpu.toFixed(2)} load`;
    cpuEl.className = `value ${classifyCpu(cpu)}`;

    // Memory
    memEl.textContent = `${mem.toFixed(1)}%`;
    memEl.className = `value ${classifyMem(mem)}`;

    // Disk
    diskEl.textContent = disk;
    diskEl.className = `value ${classifyDisk(disk)}`;
  });
}
