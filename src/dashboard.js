
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
    // Get the login ID
    const userId = await window.electronAPI.renderersRetrieveLogin();
    // Send a request to the database to get the category data
    const data = await window.electronAPI.retrieveCategory(userId);

    name('catName1', 0);    amount('amount1', 0);
    name('catName2', 1);    amount('amount2', 1);
    name('catName3', 2);    amount('amount3', 2);
    name('catName4', 3);    amount('amount4', 3);
    name('catName5', 4);    amount('amount5', 4);;

    moneyIn('moneyIn1', 0);     moneyOut('moneyOut1', 0);
    moneyIn('moneyIn2', 1);     moneyOut('moneyOut2', 1);
    moneyIn('moneyIn3', 2);     moneyOut('moneyOut3', 2);
    moneyIn('moneyIn4', 3);     moneyOut('moneyOut4', 3);
    moneyIn('moneyIn5', 4);     moneyOut('moneyOut5', 4);

    // Populate each category with its proper name, amount, and money_in / money_out status
    async function name(id, number) {
        document.getElementById(id).innerText = `${data.recordset[number].category_name}`;
    };
    async function amount(id, number) {
        document.getElementById(id).innerText = `$${data.recordset[number].dollar_amount}`;
    };
    async function moneyIn(id, number) {
        document.getElementById(id).innerText = `Savings: ${data.recordset[number].money_in}`;
    };
    async function moneyOut(id, number) {
        document.getElementById(id).innerText = `Expense: ${data.recordset[number].money_out}`;
    }

    // according to whether the category is an In or Out, I can change the css styling to make it a different color. 
};

