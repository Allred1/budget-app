// Import modules
const { contextBridge, ipcRenderer } = require('electron/renderer');


contextBridge.exposeInMainWorld('electronAPI', {
    // Create channels
    setProfile: (userId, fName, lName, username, password) => ipcRenderer.invoke('set-profile', [userId, fName, lName, username, password]),
    setCategory: (catId, name, amount, moneyIn, moneyOut, userIdFk) => ipcRenderer.invoke('set-category', [catId, name, amount, moneyIn, moneyOut, userIdFk]),
    // Retrieve channels
    retrieveProfile: (userId) => ipcRenderer.invoke('get-profile', userId),
    retrieveIncome: (userId) => ipcRenderer.invoke('get-income', userId),
    retrieveCategory: (userId) => ipcRenderer.invoke('get-category', userId),
    // Login channel
    checkLogin: (userId, password) => ipcRenderer.invoke('check-login', [userId, password]),
});