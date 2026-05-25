const { contextBridge } = require("electron");
const os = require("os");

let lastCpuLoad = 0;

function sampleCpuLoad() {
    // Simple normalized load: 0.0 – ~1.0
    const loadAvg = os.loadavg()[0];           // 1‑minute load
    const cores = os.cpus().length || 4;
    lastCpuLoad = Math.min(1, loadAvg / cores);
}

setInterval(sampleCpuLoad, 1000);
sampleCpuLoad();

contextBridge.exposeInMainWorld("systemLoad", {
    getCpuLoad: () => lastCpuLoad
});
const { contextBridge, ipcRenderer } = require("electron");
const os = require("os");

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
