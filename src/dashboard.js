// *****************************************************
// *************CREATE FUNCTIONS*************
// *****************************************************



// *****************************************************
// *************GET FUNCTIONS*************
// *****************************************************
// Buttons
const getIncomeBtn = document.getElementById('getIncomeBtn');
const getCategoryBtn = document.getElementById('getCategoryBtn');

const income = document.getElementById('income');

//  Listeners
getIncomeBtn.addEventListener('click', findIncome);
getCategoryBtn.addEventListener('click', findCategory);

// Retrieve the income by ID
async function findIncome() {
    const userId = document.getElementById('getIncomeId').value;
    const data = await window.electronAPI.retrieveIncome(userId);
    income.innerText = `$${data.recordset[0].income}`;
};
// Retrieve the category by the user's ID
function findCategory() {
    const userId = document.getElementById('getCategoryId').value;
    window.electronAPI.retrieveCategory(userId);
};


// *****************************************************
// *************EDIT FUNCTIONS*************
// *****************************************************
