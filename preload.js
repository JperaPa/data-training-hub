const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemMetrics: () => ipcRenderer.invoke('get-system-metrics')
});
