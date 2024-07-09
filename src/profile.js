// *****************************************************
// *************CREATE FUNCTIONS*************
// *****************************************************
const createProfileBtn = document.getElementById('createProfileBtn');
// createProfileBtn.addEventListener('click', submitProfile);

function submitProfile() {
    const userId = document.getElementById('profileId').value;
    const fName = document.getElementById('firstName').value;
    const lName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    window.electronAPI.setProfile(userId, fName, lName, username, password);
};


// *****************************************************
// *************GET FUNCTIONS*************
// *****************************************************
const getProfileBtn = document.getElementById('getProfileBtn');
getProfileBtn.addEventListener('click', findProfile);

// Display values
const setId = document.getElementById('setId');
const setFName = document.getElementById('setFName');
const setLName = document.getElementById('setLName');
const setUsername = document.getElementById('setUsername');
const setPassword = document.getElementById('setPassword');

// Retrieve the profile by ID
async function findProfile() {
    const userId = document.getElementById('getProfileId').value;
    const data = await window.electronAPI.retrieveProfile(userId);
    setId.innerText = data.recordset[0].user_id;
    setFName.innerText = data.recordset[0].first_name;
    setLName.innerText = data.recordset[0].last_name;
    setUsername.innerText = data.recordset[0].username;
    setPassword.innerText = data.recordset[0].password;
};


// *****************************************************
// *************EDIT FUNCTIONS*************
// *****************************************************