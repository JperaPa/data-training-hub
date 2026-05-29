const { contextBridge, ipcRenderer } = require("electron");

<<<<<<< HEAD
contextBridge.exposeInMainWorld("api", {
  ping: () => ipcRenderer.invoke("ping")
});
=======
// existing CPU sampling here if you already added it...

contextBridge.exposeInMainWorld("diagnostics", {
  onUpdate: (callback) => {
    ipcRenderer.on("diagnostics-update", (_event, data) => {
      if (typeof callback === "function") {
        callback(data);
      }
    });
  }
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
>>>>>>> a7b3bbce0aa6b5b2dd7437d4756c4815dbf72e5c
