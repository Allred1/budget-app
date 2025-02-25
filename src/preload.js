// Import modules
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
    // Create channels
    setProfile: (userId, fName, lName, username, password) => ipcRenderer.invoke('set-profile', [userId, fName, lName, username, password]),
    setCategory: (name, amount, moneyIn, moneyOut, userIdFk) => ipcRenderer.invoke('set-category', [name, amount, moneyIn, moneyOut, userIdFk]),
    
    // Retrieve channels
    retrieveProfile: (userId) => ipcRenderer.invoke('get-profile', userId),
    retrieveIncome: (userId) => ipcRenderer.invoke('get-income', userId),
    retrieveCategory: (userId) => ipcRenderer.invoke('get-category', userId),

    // Update channels
    setNewProfile: (userId, fName, lName, username, password, income) => ipcRenderer.invoke('set-new-profile', [userId, fName, lName, username, password, income]),
    
    // Delete channels
    removeCategory: (categoryId) => ipcRenderer.invoke('remove-category', categoryId),
    
    // Login channel
    verifyLogin: (userId, password) => ipcRenderer.invoke('check-login', [userId, password]),
    sendIdToMain: (userId) => ipcRenderer.invoke('send-Main-userId', userId), 
    tellMainLogout: () => ipcRenderer.invoke('logout'),
    // Pass the Login from the Main process to the Dashboard, Profile, & Category Renderer processes
    renderersRetrieveLogin: () => ipcRenderer.invoke('sendIdToRenderers'),
    
    // DEBUGGING: SEE CONTENTS BEING SENT FROM MAIN TO RENDERER, IN MAIN THROUGH CONSOLE.LOG
    seeIdTest: (id) => ipcRenderer.send('see-id-test', id),
    }
);