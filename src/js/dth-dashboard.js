// dth-dashboard.js
// ------------------------------------------------------------
// Graph Buffers & State
// ------------------------------------------------------------
let cpuHistory = [];
let ramHistory = [];
let netHistory = [];
let diskHistory = [];

const MAX_POINTS = 50;
let lastNetBytes = null;

let autoRefresh = false;
let autoRefreshInterval = null;

// ------------------------------------------------------------
// Sparkline Renderer
// ------------------------------------------------------------
function drawSparkline(svgId, data, color = "#66fcf1") {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const width = svg.clientWidth;
  const height = svg.clientHeight;

  svg.innerHTML = "";
  if (data.length < 2) return;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const scaleX = width / (data.length - 1);
  const scaleY = max === min ? 1 : height / (max - min);

  let path = "";

  data.forEach((value, i) => {
    const x = i * scaleX;
    const y = height - (value - min) * scaleY;
    path += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
  });

  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  line.setAttribute("d", path);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", "2");
  line.setAttribute("fill", "none");

  svg.appendChild(line);
}

// ------------------------------------------------------------
// System Status Refresh
// ------------------------------------------------------------
async function refreshSystemStatus() {
  if (!window.dth || !window.dth.getSystemStatus) return;

  const status = await window.dth.getSystemStatus();

  // CPU
  cpuHistory.push(parseFloat(status.cpuLoad));
  if (cpuHistory.length > MAX_POINTS) cpuHistory.shift();

  // RAM
  ramHistory.push(parseFloat(status.memUsagePercent));
  if (ramHistory.length > MAX_POINTS) ramHistory.shift();

  // Disk
  if (status.diskUsagePercent !== undefined) {
    diskHistory.push(parseFloat(status.diskUsagePercent));
    if (diskHistory.length > MAX_POINTS) diskHistory.shift();
  }

  // Network
  if (typeof osNetworkBytes === "function") {
    const net = osNetworkBytes();
    if (lastNetBytes !== null) {
      const diff = net - lastNetBytes;
      netHistory.push(diff / 1024);
      if (netHistory.length > MAX_POINTS) netHistory.shift();
    }
    lastNetBytes = net;
  }

  // Draw graphs
  drawSparkline("dth-cpu-graph", cpuHistory, "#66fcf1");
  drawSparkline("dth-ram-graph", ramHistory, "#45a29e");
  drawSparkline("dth-net-graph", netHistory, "#ffcc00");
  drawSparkline("dth-disk-graph", diskHistory, "#ff4d4d");
}

// ------------------------------------------------------------
// Finance Panel Update
// ------------------------------------------------------------
async function updateFinancePanel() {
  const target = document.getElementById("dth-finance-output");
  if (!target || !window.dthFinance || !window.dthFinance.runFinance) return;

  try {
    const finance = await window.dthFinance.runFinance();

    target.innerHTML = `
      <div><strong>Income:</strong> $${finance.income}</div>
      <div><strong>Expenses:</strong> $${finance.expenses}</div>
      <div><strong>Net Cash Flow:</strong> $${finance.netCashFlow}</div>
      <div><strong>Readiness Score:</strong> ${finance.readinessScore}</div>
      
      <div style="margin-top:8px;"><strong>Risk Flags:</strong></div>
      <ul>${(finance.riskFlags || []).map(r => `<li>${r}</li>`).join("")}</ul>

      <div style="margin-top:8px;"><strong>Recommended Actions:</strong></div>
      <ul>${(finance.recommendedActions || []).map(a => `<li>${a}</li>`).join("")}</ul>
    `;
  } catch (err) {
    console.error("Finance panel error:", err);
    target.innerHTML = `<span class="dth-critical">Finance Agent Error</span>`;
  }
}

// ------------------------------------------------------------
// CE Overview Panel Update
// ------------------------------------------------------------
async function updateOverviewPanel() {
  if (!window.dthCE || !window.dthCE.runCE) return;

  const ce = await window.dthCE.runCE();

  const readinessEl = document.getElementById("dth-overview-readiness");
  const criticalEl = document.getElementById("dth-overview-critical");
  const lastRunEl = document.getElementById("dth-overview-last-run");
  const systemEl = document.getElementById("dth-overview-system");
  const modeEl = document.getElementById("dth-overview-mode");
  const panelEl = document.getElementById("dth-overview-panel");

  // Readiness
  if (readinessEl) {
    const cls =
      ce.readinessScore > 80
        ? "dth-good"
        : ce.readinessScore > 60
        ? "dth-warning"
        : "dth-critical";

    readinessEl.innerHTML = `Readiness: <span class="${cls}">${ce.readinessScore}</span>`;
  }

  // Critical Issues
  if (criticalEl) {
    if (ce.criticalIssues && ce.criticalIssues.length > 0) {
      criticalEl.innerHTML = `<span class="dth-critical">Critical: ${ce.criticalIssues.join(", ")}</span>`;
    } else {
      criticalEl.innerHTML = `<span class="dth-good">No critical issues</span>`;
    }
  }

  // Timestamp
  if (lastRunEl) {
    lastRunEl.textContent = `Last Sweep: ${new Date(ce.timestamp).toLocaleTimeString()}`;
  }

  // System Metrics
  if (systemEl && ce.system) {
    systemEl.textContent = `System: CPU ${parseFloat(ce.system.cpuLoad).toFixed(2)}, Memory ${ce.system.memUsagePercent}%`;
  }

  // Panel Border Logic
  if (panelEl) {
    if (ce.blocked) {
      panelEl.style.border = "2px solid #ff4d4d";
      panelEl.style.boxShadow = "0 0 12px #ff4d4d88";
    } else if (ce.issues && ce.issues.length > 0) {
      panelEl.style.border = "2px solid #ffcc00";
      panelEl.style.boxShadow = "0 0 12px #ffcc0088";
    } else {
      panelEl.style.border = "2px solid #66fcf1";
      panelEl.style.boxShadow = "0 0 12px #66fcf188";
    }
  }

  // Mode
  if (modeEl) {
    modeEl.innerHTML = `<span class="dth-good">Hybrid Mode Active</span>`;
  }
}

// ------------------------------------------------------------
// Initial Load
// ------------------------------------------------------------
refreshSystemStatus();
updateOverviewPanel();
updateFinancePanel();

// ------------------------------------------------------------
// Auto-Refresh Toggle
// ------------------------------------------------------------
const refreshBtn = document.getElementById("dth-refresh-toggle");
const refreshStatus = document.getElementById("dth-refresh-status");

if (refreshBtn && refreshStatus) {
  refreshBtn.addEventListener("click", () => {
    autoRefresh = !autoRefresh;

    if (autoRefresh) {
      refreshBtn.classList.add("active");
      refreshBtn.textContent = "Auto-Refresh: ON";
      refreshStatus.textContent = "Refreshing every 5 seconds";

      autoRefreshInterval = setInterval(async () => {
        await refreshSystemStatus();
        await updateOverviewPanel();
        await updateFinancePanel();
      }, 5000);
    } else {
      refreshBtn.classList.remove("active");
      refreshBtn.textContent = "Auto-Refresh: OFF";
      refreshStatus.textContent = "";

      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
      }
    }
  });

  // Sync initial UI state
  refreshBtn.textContent = autoRefresh ? "Auto-Refresh: ON" : "Auto-Refresh: OFF";
  refreshStatus.textContent = autoRefresh ? "Refreshing every 5 seconds" : "";
} // <-- Closed out the missing block wrapper safely