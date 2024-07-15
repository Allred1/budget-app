const { app, BrowserWindow, ipcMain }   = require('electron/main');
const path                              = require('node:path');
const dbOperation                       = require('../dbFiles/dbOperation')



// Reusable function to instantiate windows
const createWindow = () => {
    // File paths
    const loginHtmlPath = path.resolve(__dirname, '../resources/login.html');
    const preloadScriptPath = path.join(__dirname, '../src/preload.js');

    // Main window constructor
    const mainWindow = new BrowserWindow({
        width: 1400, 
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true, 
            preload: preloadScriptPath
        },
        show: false,
    });

    // Receive the UserID from the Login, then send it to the other renderer processes
    ipcMain.handle('send-Main-userId', async(_event, userId) => {
        // Send ID to the other Renderers (dashboard, profile, & category)
        ipcMain.handle('sendIdToRenderers', async() => { return userId; });
            // Error when logging out and logging in with a new login: "Erro: Attempted to register a second handler for 'sendIdToRenderers'"
            // Idea: when I log out, I not only need to navigate out of the previous page and to the login page, but I also need to wipe the original userId to a blank string. 
    });
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
// Calls the CreateProfile and CreateCategory functions interacting with the database
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
        console.log(result.recordset);
        return result;
    }
);

// calls getIncome from dbOperation
ipcMain.handle('get-income', 
    async function setGoal(_event, userId) {
        const result = await dbOperation.getIncome(userId);
        console.log(`Income: ${result.recordset[0].income}`);
        return result;
    }
);

// calls getCategory from dbOperation
ipcMain.handle('get-category', 
    async function setGoal(_event, userId) {
        const result = await dbOperation.getCategory(userId);
        console.log(result.recordset);
        return result;
    }
);



// **************************************
// ******* UPDATE (EDIT) HANDLERS *******
// **************************************
// calls updateProfile function interacting with the database
ipcMain.handle('set-new-profile', 
    async function setGoal(_event, value={userId, fName, lName, username, password}) {
        dbOperation.updateProfile(value);
    }
);



// *************************************
// ******* LOGIN HANDLERS *******
// *************************************
// Checks if the ID & Password the user submitted exists in the database, then returns the result to Login
ipcMain.handle('check-login', 
    async function setGoal(_event, value={userId, password}) {
        const result = await dbOperation.findLogin(value);
        return result;
    }
);

// DEBUGGING HANLDER: SEE WHAT THE RENDERERS ARE RECEIVING (in trying to send the LoginID to them)
// See results from Profile ID I'm trying to pass from Main to Profile
ipcMain.on('see-id-test', (_event, value) => {
    console.log(value);
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