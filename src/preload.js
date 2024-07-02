// Import modules
const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})


contextBridge.exposeInMainWorld('electronAPI', {
    retrieveIncome: (userId) => ipcRenderer.invoke('get-income', userId),
});