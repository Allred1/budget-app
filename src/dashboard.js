
// **********************************************************
// ************* DISPLAY THE INCOME INFORMATION *************
// **********************************************************

// Call the function on page load
window.onload = function() {
    findIncome();
    findCategory();
    logout();
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
    income.innerText = `$${(data.recordset[0].income).toFixed(2)}`;
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


    name('catName1', 0);
    name('catName2', 1);
    name('catName3', 2);
    name('catName4', 3);
    name('catName5', 4);

    amount('amount1', 0, 'monthly');
    amount('amount2', 1, 'monthly');
    amount('amount3', 2, 'monthly');
    amount('amount4', 3, 'monthly');
    amount('amount5', 4, 'monthly');

    moneyIn('moneyIn1', 0);     moneyOut('moneyOut1', 0);
    moneyIn('moneyIn2', 1);     moneyOut('moneyOut2', 1);
    moneyIn('moneyIn3', 2);     moneyOut('moneyOut3', 2);
    moneyIn('moneyIn4', 3);     moneyOut('moneyOut4', 3);
    moneyIn('moneyIn5', 4);     moneyOut('moneyOut5', 4);

    // VIEWS BUTTONS
    const monthlyBtn = document.getElementById('monthlyBtn');
    const biweeklyBtn = document.getElementById('biweeklyBtn');
    const weeklyBtn = document.getElementById('weeklyBtn');

    // VIEWS LISTENERS
    // Monthly view
    monthlyBtn.addEventListener('click', (event) => {
        amount('amount1', 0, 'monthly');
        amount('amount2', 1, 'monthly');
        amount('amount3', 2, 'monthly');
        amount('amount4', 3, 'monthly');
        amount('amount5', 4, 'monthly');
    });
    // Biweekly view
    biweeklyBtn.addEventListener('click', (event) => {
        amount('amount1', 0, 'biweekly');
        amount('amount2', 1, 'biweekly');
        amount('amount3', 2, 'biweekly');
        amount('amount4', 3, 'biweekly');
        amount('amount5', 4, 'biweekly');
    });
    // Weekly view
    weeklyBtn.addEventListener('click', (event) => {
        amount('amount1', 0, 'weekly');
        amount('amount2', 1, 'weekly');
        amount('amount3', 2, 'weekly');
        amount('amount4', 3, 'weekly');
        amount('amount5', 4, 'weekly');
    });


    // Populate each category with its proper name, amount, and money_in / money_out status
    async function name(id, number) {
        document.getElementById(id).innerText = `${data.recordset[number].category_name}`;
    };
    async function amount(id, number, view) {
        const value = data.recordset[number].dollar_amount;
        const amountLabel = document.getElementById('amountLabel');
        var newValue = 0;
        var newLabel = "";
        // Display the value calculated off of the specific view the user wants
        if (view == 'monthly') {
            newValue = (value * 1).toFixed(2);
            newLabel = 'Monthly';
        } else if (view == 'biweekly') {
            newValue = (value / 2).toFixed(2);
            newLabel = 'Biweekly';
        } else if (view == 'weekly') {
            newValue = (value / 4).toFixed(2);
            newLabel = 'Weekly';
        };
        document.getElementById(id).innerText = `$${newValue}`;
        amountLabel.innerText = `${newLabel}:`;
    };
    async function moneyIn(id, number) {
        document.getElementById(id).innerText = `Savings: ${data.recordset[number].money_in}`;
    };
    async function moneyOut(id, number) {
        document.getElementById(id).innerText = `Expense: ${data.recordset[number].money_out}`;
    }

    // according to whether the category is an In or Out, I can change the css styling to make it a different color. 
};


// Logs out of account when user clicks logout button 
async function logout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        window.electronAPI.tellMainLogout();
    });
};