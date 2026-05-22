// main.js — FINAL FIXED VERSION

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// ------------------------------------------------------------
// Load System Diagnostics Agent
// ------------------------------------------------------------
const systemDiagnostics = require("./js/system-diagnostics.js");

// ------------------------------------------------------------
// Load CE Agent (correct API)
// ------------------------------------------------------------
const CEAgent = require("./js/ce-agent.js");

// ------------------------------------------------------------
// Create Electron Window
// ------------------------------------------------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile("index.html");
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
  // STARTUP CE SWEEP (fixed)
  // ------------------------------------------------------------
  setTimeout(async () => {
    console.log("[STARTUP] Running initial CE sweep...");

    const system = await systemDiagnostics.run();
    const ce = CEAgent.runCEAgent({ system });

    console.log("[STARTUP] CE Score:", ce.readinessScore);
  }, 5000);

  // ------------------------------------------------------------
  // SYSTEM DIAGNOSTICS HEARTBEAT (every 5 seconds)
  // ------------------------------------------------------------
  setInterval(async () => {
    const system = await systemDiagnostics.run();
    console.log("[SYSTEM] Diagnostics heartbeat @", system.timestamp);
    console.log("[SYSTEM] Diagnostics:", system);
  }, 5000);

  // ------------------------------------------------------------
  // CE HEARTBEAT (every 30 seconds)
  // ------------------------------------------------------------
  setInterval(async () => {
    const system = await systemDiagnostics.run();
    const ce = CEAgent.runCEAgent({ system });

    console.log("[CE] Heartbeat — Score:", ce.readinessScore);
  }, 30000);

  // ------------------------------------------------------------
  // DAILY SNAPSHOT (every 24 hours)
  // ------------------------------------------------------------
  setInterval(async () => {
    const system = await systemDiagnostics.run();
    const ce = CEAgent.runCEAgent({ system });

    console.log("[DAILY] CE Snapshot:", ce);
  }, 24 * 60 * 60 * 1000);
});

// ------------------------------------------------------------
// Quit when all windows closed
// ------------------------------------------------------------
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
