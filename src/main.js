const { app, BrowserWindow, ipcMain }   = require('electron/main');
const path                              = require('node:path');
const dbOperation                       = require('../dbFiles/dbOperation')



// Reusable function to instantiate windows
const createWindow = () => {
    // File paths
    const dashboardHtmlPath = path.resolve(__dirname, '../resources/dashboard.html');
    const preloadScriptPath = path.join(__dirname, '../src/preload.js');

    // Main window constructor
    const mainWindow = new BrowserWindow({
        width: 1400, 
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true, // turning this to false makes the page not work
            preload: preloadScriptPath
        },
        show: false,
    });

    mainWindow.loadFile(dashboardHtmlPath);
    // mainWindow.maximize();
    mainWindow.show();
};



// **************************************************************************************
// **************************************************************************************
// ***********   HANLDERS   ***************
// **************************************************************************************
// **************************************************************************************



// *************************************
// *******CREATE HANDLERS*******
// *************************************
ipcMain.handle('set-profile', async function setGoal(_event, value={userId, fName, lName, username, password}) {
    dbOperation.createProfile(value);
});
ipcMain.handle('set-category', async function setGoal(_event, value={catId, name, amount, moneyIn, moneyOut, userIdFk}) {
    dbOperation.createCategory(value);
});


// *************************************
// *******GET HANDLERS*******
// *************************************

// calls getProfile from dbOperation
// ipcMain.handle('get-profile', async function setGoal(_event, userId) {
//     const result = await dbOperation.getProfile(userId);
//     console.log(result.recordset[0]);
// });
ipcMain.handle('get-profile', 
    async function setGoal(_event, userId) {
        const result = await dbOperation.getProfile(userId);
        console.log(result.recordset[0]);
        return result;
    }
);


// calls getIncome from dbOperation
ipcMain.handle('get-income', 
    async function setGoal(_event, userId) {
        const result = await dbOperation.getIncome(userId);
        console.log(result.recordset[0].income);
        return result;
    }
);

// calls getCategory from dbOperation
ipcMain.handle('get-category', async function setGoal(_event, userId) {
    const result = await dbOperation.getCategory(userId);
    // console.log("ID: " + result.recordset[0].category_id);
    // console.log("Name: " + result.recordset[0].category_name);
    // console.log("Amount: " + result.recordset[0].dollar_amount);
    // console.log("In?: " + result.recordset[0].money_id);
    // console.log("Out?: " + result.recordset[0].money_out);
    // console.log("Profile ID: " + result.recordset[0].profile_id_fk);
    console.log(result.recordset);
});



// *************************************
// *******UPDATE (EDIT) HANDLERS*******
// *************************************



// *************************************
// *******LOGIN HANDLERS*******
// *************************************
ipcMain.handle('check-login', async function setGoal(_event, value={userId, password}) {
    const result = await dbOperation.findLogin(value);
    if (result == 'valid') {
        // need to send "valid" to renderer so renderer can trigger the link to the dashboard
    }
    console.log(result);
});






// ******************************************************************************************************
// ******************************************************************************************************

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