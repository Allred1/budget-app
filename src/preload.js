// Import modules
const { contextBridge, ipcRenderer } = require('electron');


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
    sendIdToMain: (userId) => ipcRenderer.invoke('send-Main-userId', userId), 
    // Pass the Login from the Main process to the Profile & Category processes
    retrieveLogin: () => ipcRenderer.invoke('sendIdToProfile'),
    // View contents in Main
    seeIdTest: (id) => ipcRenderer.send('see-id-test', id),
    }
);