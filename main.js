// ------------------------------------------------------------
// ELECTRON BOOTSTRAP
// ------------------------------------------------------------
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// ------------------------------------------------------------
// LOAD AGENTS
// ------------------------------------------------------------
const { runCEAgent, learnFromExceptions } = require("./src/js/ce-agent");
const runFinanceAgent = require("./src/js/finance-agent");
const runOSINTAgent = require("./src/js/osint-agent");
const runSanctionsAgent = require("./src/js/sanctions-agent");
const runTypologyAgent = require("./src/js/typology-agent");
const runTrainingAgent = require("./src/js/training-agent");
const computeReadiness = require("./src/js/readiness");
const systemDiagnostics = require("./src/js/system-diagnostics");

// ------------------------------------------------------------
// CREATE WINDOW
// ------------------------------------------------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile(path.join(__dirname, "src/html/index.html"));
}

// ------------------------------------------------------------
// IPC HANDLERS
// ------------------------------------------------------------
ipcMain.handle("run-command", async (_, cmd) => {
  const { exec } = require("child_process");
  return new Promise(resolve => {
    exec(cmd, (err, stdout) => resolve(stdout));
  });
});

ipcMain.handle("dth:run-ce", async () => {
  const system = await systemDiagnostics();
  const readiness = computeReadiness(system);
  const critical = readiness.criticalIssues.length > 0;

  let osint = null;
  if (!critical) {
    osint = await runOSINTAgent();
  }

  const sanctions = await runSanctionsAgent();
  const typology = await runTypologyAgent();
  const training = await runTrainingAgent();
  const finance = await runFinanceAgent();

  return runCEAgent({
    system,
    readiness,
    critical,
    osint,
    sanctions,
    typology,
    training,
    finance
  });
});

// ------------------------------------------------------------
// DAILY SNAPSHOT WRITER
// ------------------------------------------------------------
function writeDailySnapshot(data) {
  const fs = require("fs");
  const today = new Date().toISOString().split("T")[0];
  const filePath = path.join(__dirname, "src/data/daily_snapshots", `${today}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ------------------------------------------------------------
// UNIFIED APP.WHENREADY() BLOCK
// ------------------------------------------------------------
app.whenReady().then(() => {
  createWindow();

  // STARTUP SWEEP
  setTimeout(async () => {
    console.log("[STARTUP] Running initial CE sweep...");
    const system = await systemDiagnostics();
    const ce = runCEAgent({ system });
    console.log("[STARTUP] CE Score:", ce.readinessScore);
  }, 5000);

  // ------------------------------------------------------------
  // HEARTBEAT MODE 1 — CE Agent every 5 minutes
  // ------------------------------------------------------------
  setInterval(async () => {
    const system = await systemDiagnostics();
    const ce = runCEAgent({ system });

    console.log("[HEARTBEAT] CE Agent:", ce.readinessScore, ce.criticalIssues);

    const patterns = learnFromExceptions();
    console.log("[LEARNING]", patterns);

  }, 1000 * 60 * 5);

  // ------------------------------------------------------------
  // HEARTBEAT MODE 2 — Finance Agent every hour
  // ------------------------------------------------------------
  setInterval(async () => {
    const finance = await runFinanceAgent();
    console.log("[HEARTBEAT] Finance Agent:", finance.netCashFlow);
  }, 1000 * 60 * 60);

  // ------------------------------------------------------------
  // HEARTBEAT MODE 3 — Daily Snapshot (once per day)
  // ------------------------------------------------------------
  setInterval(async () => {
    const system = await systemDiagnostics();
    const finance = await runFinanceAgent();

    writeDailySnapshot({
      timestamp: new Date().toISOString(),
      system,
      finance
    });

    console.log("[HEARTBEAT] Daily snapshot saved.");
  }, 1000 * 60 * 60 * 24);

  // ------------------------------------------------------------
  // HEARTBEAT MODE 4 — Full Intelligence Sweep (every 12 hours)
  // ------------------------------------------------------------
  setInterval(async () => {
    const system = await systemDiagnostics();
    const readiness = computeReadiness(system);

    let osint = null;
    if (!readiness.criticalIssues.length) {
      osint = await runOSINTAgent();
    }

    const sanctions = await runSanctionsAgent();
    const typology = await runTypologyAgent();
    const training = await runTrainingAgent();
    const finance = await runFinanceAgent();

    const ce = runCEAgent({
      system,
      readiness,
      osint,
      sanctions,
      typology,
      training,
      finance
    });

    console.log("[HEARTBEAT] Full Intelligence Sweep Complete:", ce.readinessScore);
  }, 1000 * 60 * 60 * 12);

}); // END app.whenReady()
// ------------------------------------------------------------
// main.js — CLEAN FIXED VERSION
// ------------------------------------------------------------

const { app, BrowserWindow } = require("electron");
const path = require("path");

// ------------------------------------------------------------
// Load Backend Runtime Agents
// ------------------------------------------------------------
const CEAgent = require("./src/runtime/ce-agent.js");
const Diagnostics = require("./src/runtime/system-diagnostics.js");
const RuntimeOrchestrator = require("./src/runtime/orchestrator.js");

// ------------------------------------------------------------
// Create Electron Window (ONLY ONE VERSION)
// ------------------------------------------------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile("./src/html/index.html");
}

// ------------------------------------------------------------
// APP READY
// ------------------------------------------------------------
app.whenReady().then(() => {
  createWindow();

  // macOS behavior
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // ------------------------------------------------------------
  // STARTUP CE SWEEP
  // ------------------------------------------------------------
  setTimeout(async () => {
    console.log("[STARTUP] Running initial CE sweep...");

    const system = await Diagnostics.run();
    const ce = CEAgent.runCEAgent({ system });

    console.log("[STARTUP] CE Score:", ce.readinessScore);
  }, 5000);

  // ------------------------------------------------------------
  // SYSTEM DIAGNOSTICS HEARTBEAT (every 5 seconds)
  // ------------------------------------------------------------
  function broadcastDiagnostics(system) {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach(win => {
      win.webContents.send("diagnostics-update", system);
    });
  }

  setInterval(async () => {
    const system = await Diagnostics.run();
    console.log("[SYSTEM] Diagnostics heartbeat @", system.timestamp);
    console.log("[SYSTEM] Diagnostics:", system);

    broadcastDiagnostics(system);
  }, 5000);

  // ------------------------------------------------------------
  // CE HEARTBEAT (every 30 seconds)
  // ------------------------------------------------------------
  setInterval(async () => {
    const system = await Diagnostics.run();
    const ce = CEAgent.runCEAgent({ system });

    console.log("[CE] Heartbeat — Score:", ce.readinessScore);
  }, 30000);
});

// ------------------------------------------------------------
// Quit when all windows closed
// ------------------------------------------------------------
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});