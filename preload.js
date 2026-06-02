const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data)
});

contextBridge.exposeInMainWorld("overwatchAPI", {
  getLog: () => ipcRenderer.invoke("get-overwatch-log")
});

contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        if (channel === "task") ipcRenderer.send("task", data);
    },
    receive: (channel, func) => {
        if (channel === "overwatch-response") {
            ipcRenderer.on("overwatch-response", (event, ...args) => func(...args));
        }
    }
});