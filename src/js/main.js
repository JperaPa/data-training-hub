const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "AML Intelligence Workstation",
    backgroundColor: "#090a10",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load your existing workstation layout
  mainWindow.loadFile('index.html');
  
  // Optional: Automatically open DevTools for debugging during development
  // mainWindow.webContents.openDevTools();
}

// SECURE BACKEND IPC CHANNEL: Listens for the RAM Purge request from your frontend UI
ipcMain.on('trigger-hardware-purge', (event) => {
  console.log("Executing secure OS-level RAM flush...");
  
  // Executes genuine macOS cache release via administrative terminal bridge
  exec('osascript -e "do shell script \\"purge\\" with administrator privileges"', (err, stdout, stderr) => {
    if (err) {
      console.error("OS Purge Aborted:", err);
      event.reply('purge-status', { success: false, error: err.message });
      return;
    }
    console.log("OS Cache Purged Successfully.");
    event.reply('purge-status', { success: true });
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});