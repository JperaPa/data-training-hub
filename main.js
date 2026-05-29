const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// -------------------- Window Creation --------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // YOUR actual preload
    },
  });

  // DEV MODE ONLY — load Vite dev server
  win.loadURL("http://localhost:5173");
}

// -------------------- Minimal IPC Test --------------------
ipcMain.handle("ping", async () => {
  return "pong from main";
});

// -------------------- App Lifecycle --------------------
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});