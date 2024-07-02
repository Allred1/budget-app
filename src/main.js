const { app, BrowserWindow, ipcMain }   = require('electron/main');
const path                              = require('node:path');
const dbOperation                       = require('../dbFiles/dbOperation')



// Reusable function to instantiate windows
function createWindow () {
    // File paths
    const indexHtmlPath = path.resolve(__dirname, '../resources/index.html');
    const preloadScriptPath = path.join(__dirname, '../src/preload.js');


    // Main window constructor
    const mainWindow = new BrowserWindow({
        width: 800, 
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: preloadScriptPath
        }
    });


    // GET FUNCTIONS
    ipcMain.handle('get-income', async function setGoal(_event, userId) {
        const result = await dbOperation.getIncome(userId);
        console.log(result.recordset);
        document.getElementById('income').innerHTML = result;
    });
    // ipcMain.handle('get-income', async(req, userId, res) => {
    //     console.log('Called');
    //     const result = await dbOperation.getIncome(userId);
    //     console.log(result);
    // });


    mainWindow.loadFile(indexHtmlPath);

};




// When the app is ready, call the createWindow function
app.whenReady().then(() => {
    createWindow();
    // Listen for the activate events after your app is initialized
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Close the app when all the windows are closed (not for macOS users - darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});