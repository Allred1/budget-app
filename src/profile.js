
// ***********************************************************
// ************* DISPLAY THE PROFILE INFORMATION *************
// ***********************************************************

// Call the function on page load
window.onload = function() {
    findProfile();
};


// Retrieve the profile by ID
async function findProfile() {
    // Display values
    const setId = document.getElementById('setId');
    const setFName = document.getElementById('setFName');
    const setLName = document.getElementById('setLName');
    const setUsername = document.getElementById('setUsername');
    const setPassword = document.getElementById('setPassword');

    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();
    
    // DEBUGGING: SEE WHAT'S BEING RECEIVED
    // window.electronAPI.seeIdTest(`New Id: ${userId}`);

    // Ask the database for the account information via Preload -> Main -> dbOperation, and return it
    const data = await window.electronAPI.retrieveProfile(userId);
    // Populate the fields with the data from the database
    setId.innerText = userId;
    setFName.innerText = data.recordset[0].first_name;
    setLName.innerText = data.recordset[0].last_name;
    setUsername.innerText = data.recordset[0].username;
    setPassword.innerText = data.recordset[0].password;
};



// **********************************************************
// ************* UPDATE THE PROFILE INFORMATION *************
// **********************************************************