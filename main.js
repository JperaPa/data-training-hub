// main.js

const { Menu } = require("electron");

const template = [
  {
    label: "Developer",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// ------------------------------------------------------------
// IMPORTS (CommonJS)
// ------------------------------------------------------------
ipcMain.on("task", async (event, task) => {
  // task = { agent: "secure_search", payload: {...} }

  const result = await handleUserTask(task);

  event.sender.send("task-result", result);
});

// Runtime agents
const { handleUserTask, delegateToAgent, runOverwatchPlanning } = require("./src/runtime/orchestrator");
const { getOverwatchLog } = require("./src/runtime/overwatch-log");

// ------------------------------------------------------------
// CREATE WINDOW
// ------------------------------------------------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load Vite dev server correctly
  win.loadURL("http://localhost:5173");
}

// ------------------------------------------------------------
// APP READY
// ------------------------------------------------------------
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ------------------------------------------------------------
// QUIT WHEN ALL WINDOWS CLOSED
// ------------------------------------------------------------
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ------------------------------------------------------------
// IPC HANDLERS
// ------------------------------------------------------------

// Main DTH task handler (Orchestrator → Agents → Critic → ALF → Learning Loop)
ipcMain.handle("run-dth-task", async (event, { task }) => {
  return handleUserTask(task);
});

// Direct Overwatch call
ipcMain.handle("run-overwatch", async (event, { task }) => {
  return runOverwatchPlanning(task);
});

// Direct agent delegation
ipcMain.handle("delegate-agent", async (event, { agentName, task }) => {
  return delegateToAgent(agentName, task);
});

// Load learning data
ipcMain.handle("load-learning-data", async () => {
  const data = fs.readFileSync("src/data/ce_learning.json", "utf8");
  return JSON.parse(data);
});

// Overwatch log stream
ipcMain.handle("get-overwatch-log", async () => {
  return getOverwatchLog();
});

// System-mode Overwatch (dashboard button)
ipcMain.on("task", async (event, task) => {
  // task = { agent: "overwatch", payload: "__system__" }

  if (task.agent === "overwatch") {
    const result = await handleUserTask(task.payload);
    event.sender.send("overwatch-response", result);
    return;
  }

  // fallback for other agents if needed
  const result = await handleUserTask(task.payload);
  event.sender.send("task-results", result);
});

