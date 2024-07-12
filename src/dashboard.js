
// **********************************************************
// ************* DISPLAY THE INCOME INFORMATION *************
// **********************************************************

// Call the function on page load
window.onload = function() {
    findIncome();
    findCategory();
};


// Income field 
const income = document.getElementById('income');

// Retrieve the income by ID
async function findIncome() {
    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();
    
    // DEBUGGING: SEE WHAT'S BEING RECEIVED
    // window.electronAPI.seeIdTest(`New Id: ${userId}`);
    
    // Ask the database for the income information via Prelead -> Main -> dbOperation, and return it
    const data = await window.electronAPI.retrieveIncome(userId);
    // Populate the field with the data from the database
    income.innerText = `$${data.recordset[0].income}`;
};



// ************************************************************
// ************* DISPLAY THE CATEGORY INFORMATION *************
// ************************************************************

// Retrieve the category by the user's ID
async function findCategory() {
    const userId = await window.electronAPI.renderersRetrieveLogin();
    window.electronAPI.retrieveCategory(userId);
};