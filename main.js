// main.js — FINAL VERSION (Option A Architecture)

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// ------------------------------------------------------------
// Load Backend Runtime Agents
// ------------------------------------------------------------
const CEAgent = require("./src/runtime/ce-agent.js");
const Diagnostics = require("./src/runtime/system-diagnostics.js");
const RuntimeOrchestrator = require("./src/runtime/orchestrator.js");

// ------------------------------------------------------------
// Create Electron Window
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
  setInterval(async () => {
    const system = await Diagnostics.run();
    console.log("[SYSTEM] Diagnostics heartbeat @", system.timestamp);
    console.log("[SYSTEM] Diagnostics:", system);
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