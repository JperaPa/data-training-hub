// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dth", {
  sendTask: (task) => ipcRenderer.invoke("dth:task", task),
  getDiagnostics: () => ipcRenderer.invoke("dth:diagnostics"),
  ping: () => ipcRenderer.invoke("dth:ping"),
});