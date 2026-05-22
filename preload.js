const { contextBridge, ipcRenderer } = require('electron');

// SAFE IPC BRIDGE
contextBridge.exposeInMainWorld('dth', {
  getSystemStatus: () => ipcRenderer.invoke('dth:get-system-status')
});

// SAFE COMMAND EXECUTION (handled in main.js)
contextBridge.exposeInMainWorld("api", {
  runCommand: (cmd) => ipcRenderer.invoke("run-command", cmd)
});

// FINANCE AGENT BRIDGE
contextBridge.exposeInMainWorld('dthFinance', {
  runFinance: () => ipcRenderer.invoke('dth:run-finance')
});
