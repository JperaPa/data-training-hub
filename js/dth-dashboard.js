// js/dth-dashboard.js
import OSINTAgent from "./osint-agent.js";
import SanctionsAgent from "./sanctions-agent.js";
import FinanceAgent from "./personal-finance-agent.js";
import ScoutAgent from "./scout-agent.js";
import TypologyAgent from "./typology-agent.js";
import TrainingAgent from "./training-agent.js";

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