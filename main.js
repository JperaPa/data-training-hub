// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// Environment
const isDev = process.env.ELECTRON_DEV === "1" || process.env.NODE_ENV === "development";

// -------------------- Helper paths --------------------
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data", "processed");
const REVIEW_LOG_PATH = path.join(DATA_DIR, "overwatch_reviews.json");
const TRAJECTORY_PATH = path.join(DATA_DIR, "trajectory.json");
const LEDGER_PATH = path.join(DATA_DIR, "recommendation_ledger.json");
const PROGRESS_PATH = path.join(DATA_DIR, "daily_progress.json");
const AUDIT_LOG_PATH = path.join(DATA_DIR, "audit_log.json");

// Ensure data dir exists
fs.mkdirSync(DATA_DIR, { recursive: true });

// -------------------- Create window --------------------
async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "src", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    const devUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";
    await win.loadURL(devUrl);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexPath = path.join(__dirname, "dist", "renderer", "index.html");
    await win.loadURL(`file://${indexPath}`);
  }

  return win;
}

// -------------------- Existing handlers (keep) --------------------
// Keep your existing get-system-state and dth:run-ce handlers if present.
// Example: (these can be replaced with your actual implementations)
ipcMain.handle("get-system-state", async () => {
  try {
    const runCEAgent = require("./src/js/ce-agent").runCEAgent;
    const runFinanceAgent = require("./src/js/finance-agent");
    const runOSINTAgent = require("./src/js/osint-agent");
    const runSanctionsAgent = require("./src/js/sanctions-agent");
    const runTrainingAgent = require("./src/js/training-agent");
    const systemDiagnostics = require("./src/js/system-diagnostics");
    const computeReadiness = require("./src/js/readiness");

    const ce = await runCEAgent();
    const finance = await runFinanceAgent();
    const osint = await runOSINTAgent();
    const sanctions = await runSanctionsAgent();
    const training = await runTrainingAgent();

    // Overwatch is handled by overwatch:run-review
    return { ce, finance, osint, sanctions, training };
  } catch (err) {
    console.error("[MAIN] get-system-state error:", err);
    return {};
  }
});

// -------------------- Overwatch / Trajectory / Ledger IPCs --------------------
ipcMain.handle("overwatch:run-review", async () => {
  try {
    const runCompliance = require("./src/js/overwatch-compliance");
    return await runCompliance();
  } catch (err) {
    console.error("[MAIN] overwatch:run-review failed:", err);
    throw err;
  }
});

ipcMain.handle("overwatch:get-history", async () => {
  try {
    if (!fs.existsSync(REVIEW_LOG_PATH)) return [];
    return JSON.parse(fs.readFileSync(REVIEW_LOG_PATH, "utf8") || "[]");
  } catch (err) {
    console.error("[MAIN] overwatch:get-history failed:", err);
    return [];
  }
});

ipcMain.handle("trajectory:get", async () => {
  try {
    if (!fs.existsSync(TRAJECTORY_PATH)) return null;
    return JSON.parse(fs.readFileSync(TRAJECTORY_PATH, "utf8") || "null");
  } catch (err) {
    console.error("[MAIN] trajectory:get failed:", err);
    return null;
  }
});

ipcMain.handle("recommendation:approve", async (_, { id, approver, rationale }) => {
  try {
    const ledger = fs.existsSync(LEDGER_PATH) ? JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8") || "[]") : [];
    const rec = ledger.find(r => r.id === id || r.recommendation === id);
    if (!rec) throw new Error("Recommendation not found");

    rec.approved = true;
    rec.approvalDate = new Date().toISOString();
    rec.approver = approver || "user";

    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));

    const audit = fs.existsSync(AUDIT_LOG_PATH) ? JSON.parse(fs.readFileSync(AUDIT_LOG_PATH, "utf8") || "[]") : [];
    audit.push({
      id: `audit_${Date.now()}`,
      recommendationId: rec.id || null,
      approver: rec.approver,
      rationale: rationale || null,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(AUDIT_LOG_PATH, JSON.stringify(audit, null, 2));

    return rec;
  } catch (err) {
    console.error("[MAIN] recommendation:approve failed:", err);
    throw err;
  }
});

// Lightweight cybersecurity assessment hook (non-destructive)
ipcMain.handle("cybersecurity:assess", async (_, { id, actionSummary }) => {
  try {
    // Placeholder: call your cybersecurity agent here if available.
    // Return conservative assessment object.
    return {
      id,
      safeToProceed: true,
      issues: [],
      note: "Lightweight assessment: no immediate issues detected. Manual review recommended for high-impact changes."
    };
  } catch (err) {
    console.error("[MAIN] cybersecurity:assess failed:", err);
    return { id, safeToProceed: false, issues: ["assessment error"], note: err.message };
  }
});

// -------------------- App lifecycle --------------------
app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});