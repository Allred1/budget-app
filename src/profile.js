
// ****************************************
// ************* PROFILE PAGE *************
// ****************************************

// Call the function on page load
window.onload = function() {
    findProfile();
};




// ************************************************************
// ************* RETRIEVE THE PROFILE INFORMATION *************
// ************************************************************
// Retrieve the profile by ID
async function findProfile() {
    // Display values
    const setId = document.getElementById('setId');
    const setFName = document.getElementById('setFName');
    const setLName = document.getElementById('setLName');
    const setUsername = document.getElementById('setUsername');
    const setPassword = document.getElementById('setPassword');
    const setIncome = document.getElementById('setIncome');

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
    setIncome.innerText = `$${data.recordset[0].income}`;
};



// **********************************************************
// ************* UPDATE THE PROFILE INFORMATION *************
// **********************************************************

// Update button switches the Profile Display out for the Profile Form for editing
const updateProfileBtn = document.getElementById('updateProfileBtn');
updateProfileBtn.addEventListener('click', openForm);

// Opens the form
async function openForm() {
    // get access to the html profile display and profile form elements
    const section = document.querySelector('.profile-box');
    const display = section.querySelector('.profile-display');
    const edit = section.querySelector('.profile-edit');

    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();

    // Retrieve the current data from the database
    const data = await window.electronAPI.retrieveProfile(userId);

    // Hide the static display and reveal the edit form
    display.classList.add('hide');
    edit.classList.remove('hide');

    // Get the IDs for the form inputs and
    // then set the text values to the current data from the database
    document.getElementById('editId').value = userId;
    document.getElementById('editFName').value = data.recordset[0].first_name;
    document.getElementById('editLName').value = data.recordset[0].last_name;
    document.getElementById('editUsername').value = data.recordset[0].username;
    document.getElementById('editPassword').value = data.recordset[0].password;
    document.getElementById('editIncome').value = data.recordset[0].income;

    // On clicking the "save" button, 
    // Update the database with these values via Prelead -> Main -> dbOperation
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    saveProfileBtn.addEventListener('click', (event) => {
        event.preventDefault();
        submitNewProfile(display, edit);
    });
};

// Opens a confirm alert before either returning the user to the Profile Display or submitting the new profile values to the database
async function submitNewProfile(display, edit) {
    // Ask the user for confirmation before making the changes
    let message = "Are you sure you want to make these changes?";
    if (confirm(message) == true) {
        // Take the input values, whether the user changed them or they remain the same
        const userId = document.getElementById('editId').value;
        const fName = document.getElementById('editFName').value;
        const lName = document.getElementById('editLName').value;
        const username = document.getElementById('editUsername').value;
        const password = document.getElementById('editPassword').value;
        const income = document.getElementById('editIncome').value;

        // Send the new data to be updated in the database
        window.electronAPI.setNewProfile(userId, fName, lName, username, password, income);

        // Hide the profile form and reveal the static profile display
        edit.classList.add('hide');
        display.classList.remove('hide');
    } else {
        // Hide the profile form and reveal the static profile display
        edit.classList.add('hide');
        display.classList.remove('hide');
    };
};