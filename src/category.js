// ********************************************************
// ************* DISPLAY CATEGORY INFROMATION *************
// ********************************************************

// Call the display functions on page load
window.onload = function() {
    findIncome();
};

// Income field
const income = document.getElementById('cat-income');

async function findIncome() {
    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();
    // Ask the database for the income information via Preload -> Main -> dbOperation, and return it
    const data = await window.electronAPI.retrieveIncome(userId);
    income.innerText = `$${data.recordset[0].income}`;
};



// *************************************************
// ************* CREATE A NEW CATEGORY *************
// *************************************************

// When clicked, calls the function that submits the user input as a new Category
const createCategoryBtn = document.getElementById('createCategoryBtn');
createCategoryBtn.addEventListener('click', submitCategory);

// Takes the entered values and sends them to the database to be created as a new Category 
function submitCategory() {
    const categoryId = document.getElementById('catId').value;
    const name = document.getElementById('catName').value;
    const amount = document.getElementById('dollarAmount').value;
    const moneyIn = document.getElementById('moneyIn').value;
    const moneyOut = document.getElementById('moneyOut').value;
    const userIdFk = document.getElementById('userIdFk').value;
    window.electronAPI.setCategory(categoryId, name, amount, moneyIn, moneyOut, userIdFk);
};


// *********************************************
// ************* UPDATE A CATEGORY *************
// *********************************************



// *********************************************
// ************* DELETE A CATEGORY *************
// *********************************************