const { app, BrowserWindow, ipcMain }   = require('electron/main');
const path                              = require('node:path');
const dbOperation                       = require('../dbFiles/dbOperation')



// Reusable function to instantiate windows
const createWindow = () => {
    // File paths
    const dashboardHtmlPath = path.resolve(__dirname, '../resources/dashboard.html');
    const loginHtmlPath = path.resolve(__dirname, '../resources/login.html');
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

    // Receive the UserID from the Login, then send it to the Profile & Category renderers
    ipcMain.handle('send-Main-userId', async(_event, userId) => {
        // Send the userId (retrieved from the Login) to the Profile and Category processes
        ipcMain.handle('sendIdToProfile', async() => {
            return userId;
        });
    });

    // mainWindow.loadFile(dashboardHtmlPath);
    mainWindow.loadFile(loginHtmlPath);
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
ipcMain.handle('check-login', 
    async function setGoal(_event, value={userId, password}) {
        const result = await dbOperation.findLogin(value);
        console.log(result);
        return result;
    }
);

// See results from Profile ID I'm trying to pass from Main to Profile
ipcMain.on('see-id-test', (_event, value) => {
    console.log(value);
});
// ipcMain.handle('see-id-test', 
//     async function setGoal(_event, value) {
//         console.log(value);
//     }
// );


// Somehow retain and send the UserId for all the other queries
// ipcMain.handle('send-userId', 
//     function setGoal(_event, userId) {
//         userId;

//     }
// );
// ipcMain.on('send-Main-userId', (event, arg) => {
//     mainWindow.webContents.send('send-Profile-userId', arg);
// });
// ipcMain.handle('send-Main-userId', 
//     async function setGoal(_event, value) {
//         console.log(value); // printed successfully
//         electronAPI.sendIdToProfile(value);
//     }
// );
// ipcMain.once('send-Main-userId', async (event, data) => {
//     console.log(data);
//     mainWindow.webContents.send('send-Profile-userId', arg);
// });
// ipcMain.handle('send-Main-userId', (event, arg) => {
//     console.log(arg);
//     mainWindow.webContents.send('send-Profile-userId', arg);
// });
// function sendDataToUI (data) {
//     window.webContents.send('sendDataToUI', data);
// };






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