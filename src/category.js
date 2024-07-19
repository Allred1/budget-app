// ******************************************************************************
// ************************ DISPLAY CATEGORY INFORMATION ************************
// ******************************************************************************

// Call the display functions on page load
window.onload = function() {
    findIncome();
    findCategory();
    addFunctionalityToDeleteBtns();
    findTax();
    logout();
};


// **********************************************
// ************* DISPLAY THE INCOME *************
// **********************************************
async function findIncome() {
    // Income field
    const income = document.getElementById('cat-income');

    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();
    // Ask the database for the income information via Preload -> Main -> dbOperation, and return it
    const data = await window.electronAPI.retrieveIncome(userId);
    income.innerText = `$${(data.recordset[0].income).toFixed(2)}`;
    
    // Set the userId in the "create category" row as a non-changeable value
    document.getElementById('userIdFk').value = userId;
};



// *************************************************
// ************** DISPLAY TAX CATEGORY *************
// *************************************************
async function findTax() {
    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();
    // Need user Id to find user's income from database
    const data = await window.electronAPI.retrieveIncome(userId);
    // Tax takes annual income, determines bracket, then calculates the tax on the monthly income.
    const monthlyIncome = data.recordset[0].income
    const annualIncome = monthlyIncome * 12;

    // Get column values for Tax
    const taxId = document.getElementById('taxId');
    const taxName = document.getElementById('taxName');
    const taxAmount = document.getElementById('taxAmount');
    const taxMoneyIn = document.getElementById('taxMoneyIn');
    const taxMoneyOut = document.getElementById('taxMoneyOut');
    const taxUserIdFk = document.getElementById('taxUserIdFk');

    // Utah State tax: 
    const stateTax = 0.0465; // percentage
    // Using the federal tax brackets, determine which one the user lies in
    const bracket = determineTaxBracket(annualIncome);
    // Calculate the total tax that must be paid
    const totalTax = calculateFederalAndStateTax(monthlyIncome, bracket, stateTax);

    // Populate the fields with data
    taxId.innerText = 3000;
    taxName.innerText = 'Tax';
    taxAmount.innerText = `$${totalTax}`;
    taxMoneyIn.innerText = 'No';
    taxMoneyOut.innerText = 'Yes';
    taxUserIdFk.innerText = userId;

    // Calculate the total federal and state tax
    function calculateFederalAndStateTax(income, bracket, stateTax) {
        const federal = income * bracket;
        const state = income * stateTax;
        const total = federal + state;
        return total;
    };
    // Determine the user's tax bracket
    function determineTaxBracket(income) {
        // United States Federal Tax Brackets
        const ten = 0.10;
        const twelve = 0.12;
        const twentyTwo = 0.22;
        const twentyFour = 0.24;
        const thirtyTwo = 0.32;
        const thirtyFive = 0.35;
        const thirtySeven = 0.37;
        // Determine the user's tax bracket
        if (income < 11600) { return ten }
        else if (11600 < income < 47150) { return twelve }
        else if (47150 < income < 100525) { return twentyTwo }
        else if (100525 < income < 191950) { return twentyFour }
        else if (191950 < income < 243725) { return thirtyTwo }
        else if (243725 < income < 609350) { return thirtyFive }
        else if (income > 609350) {return thirtySeven }
    };
};



// *************************************************
// ************* DISPLAY EACH CATEGORY *************
// *************************************************
// Retrieve the category by ID
async function findCategory() {
    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();
    // Ask the database for the category information via Preload -> Main -> dbOperation, and return it
    const data = await window.electronAPI.retrieveCategory(userId);

    // Get the number of categories this user has
    const numberOfCategories = data.recordset.length;
    // let i = 0; // Use an iterator

    // Iterate over and (call the functions for) each category the user has
    for (let i = 0; i < numberOfCategories; i++) {
        // Get the rows section of the HTML
        const rowSection = document.querySelector('#row-section');
        // Create a new <div> (with an ID) to add to the row section
        const rowDiv = document.createElement('div');
        rowDiv.id = 'cat-row' + i.toString();    // add ID
        rowDiv.className = 'row';                // add Class (for css)
        rowSection.appendChild(rowDiv);
        // Add each paragraph element to the <div> row element
        addColumnsToRow(rowDiv, i);
        // Call the functions to display in each column
        catId('cat-id' + i.toString(), i);
        name('cat-name' + i.toString(), i);
        amount('cat-amount' + i.toString(), i);
        moneyIn('cat-moneyIn' + i.toString(), i);
        moneyOut('cat-moneyOut' + i.toString(), i);
        foreignKey('cat-fk' + i.toString(), i);
        // updateBtnTitle('.updateButtons');
        deleteBtnTitle('.deleteButtons');
    };

    
    // Creates a new HTML row element
    function addColumnsToRow(rowDiv, i) {
        // Creates a paragraph element for each attribute in the row
        const rowId = document.createElement('p');
        const rowName = document.createElement('p');
        const rowAmount = document.createElement('p');
        const rowMoneyIn = document.createElement('p');
        const rowMoneyOut = document.createElement('p');
        const rowForeignKey = document.createElement('p');
        // Creates button elements
        // const updateBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        // Assigns an id to each paragraph
        rowId.id= 'cat-id' + i.toString();
        rowName.id= 'cat-name' + i.toString();
        rowAmount.id= 'cat-amount' + i.toString();
        rowMoneyIn.id= 'cat-moneyIn' + i.toString();
        rowMoneyOut.id= 'cat-moneyOut' + i.toString();
        rowForeignKey.id= 'cat-fk' + i.toString();
        deleteBtn.id= 'cat-deleteBtn' + i.toString();
        // Assigns classes to the editing buttons
        // updateBtn.classList.add('updateButtons');
        deleteBtn.classList.add('deleteButtons');
        // updateBtn.classList.add('hide');
        deleteBtn.classList.add('hide');
        // Adds them all to the row element
        rowDiv.appendChild(rowId);
        rowDiv.appendChild(rowName);
        rowDiv.appendChild(rowAmount);
        rowDiv.appendChild(rowMoneyIn);
        rowDiv.appendChild(rowMoneyOut);
        rowDiv.appendChild(rowForeignKey);
        // rowDiv.appendChild(updateBtn);
        rowDiv.appendChild(deleteBtn);
    };


    // Populate each category with its proper name, amount, and money_in / money_out status
    async function catId(id, number) {
        document.getElementById(id).innerText = data.recordset[number].category_id;
    };
    async function name(id, number) {
        document.getElementById(id).innerText = data.recordset[number].category_name;
    };
    async function amount(id, number) {
        document.getElementById(id).innerText = `$${data.recordset[number].dollar_amount}`;
    };
    async function moneyIn(id, number) {
        document.getElementById(id).innerText = data.recordset[number].money_in;
    };
    async function moneyOut(id, number) {
        document.getElementById(id).innerText = data.recordset[number].money_out;
    };
    async function foreignKey(id, number) {
        document.getElementById(id).innerText = data.recordset[number].profile_id_fk;
    };
    // async function updateBtnTitle(id) {
    //     const buttons = document.querySelectorAll(id);
    //     buttons.forEach(btn => {
    //         btn.innerText = 'Update';
    //     });
    // };
    async function deleteBtnTitle(id) {
        const buttons = document.querySelectorAll(id);
        buttons.forEach(btn => {
            btn.innerText = 'Delete';
        });
    };
};





// *************************************************************************
// ************************ EDIT THE CATEGORY MODAL ************************
// *************************************************************************


// *********************************************
// ************* CREATE A CATEGORY *************
// *********************************************
// toggle for edit button
let toggle = false;

const editBtn = document.getElementById('editBtn');
editBtn.addEventListener('click', (event) => {
    if (toggle == false) {
        // Change button to say "close"
        editBtn.innerText = 'Close';
        // When clicked, open the editing modal
        showCreateCategory();
        // Show the row editing ability
        showRowEdits();
        // Give the rows a functioning 'delete' button
        // addFunctionalityToDeleteBtns();
        toggle = true;
    } else {
        // When clicked again, 
        // Change button to say 'edit' again
        editBtn.innerText = 'Edit';
        // Get HTML elements and swith the modal to be hidden
        const section = document.querySelector('.category-content');
        const edit = section.querySelector('.create-row');
        edit.classList.add('hide');
        // Hide the row editing ability
        hideRowEdits();
        toggle = false;
    };
});


// Open the modal of the Create-Category row
async function showCreateCategory() {
    // Get HTML elements to switch them from being hidden to being revealed & vice versa
    const section = document.querySelector('.category-content');
    const edit = section.querySelector('.create-row');

    // Reveal the create category option
    edit.classList.remove('hide');

    // When clicked, calls the function that submits the user input as a new Category
    const createCategoryBtn = document.getElementById('createCategoryBtn');
    createCategoryBtn.addEventListener('click', (event) => {
        event.preventDefault();
        submitCategory(edit);
        // Hide the row editing ability
        hideRowEdits();
        location.reload();
    });
};



// Takes the entered values and sends them to the database to be created as a new Category 
async function submitCategory(edit) {
    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();

    // Take the user's entered values and send them to be created in the database
    const name = document.getElementById('catName').value;
    const amount = document.getElementById('dollarAmount').value;
    const moneyIn = document.getElementById('moneyIn').value;
    const moneyOut = document.getElementById('moneyOut').value;
    window.electronAPI.setCategory(name, amount, moneyIn, moneyOut, userId);

    // Hide the create category modal again
    edit.classList.add('hide');
};




// *****************************************************************
// ************* REVEAL / HIDE THE ROW EDITING BUTTONS *************
// *****************************************************************


// Show the update and delete buttons for each category
async function showRowEdits() {
    // Get section HTML element to obtain the buttons
    const section = document.querySelector('.category-row');
    // Get all the update and delete buttons
    // const updateBtns = section.querySelectorAll('.updateButtons');
    const deleteBtns = section.querySelectorAll('.deleteButtons');
    // Remove the hide class from all the buttons
    // updateBtns.forEach(btn => {
    //     btn.classList.remove('hide');
    // });
    deleteBtns.forEach(btn => {
        btn.classList.remove('hide');
    });
};
// Hide again the update and delete buttons for each category
async function hideRowEdits() {
    // Get section HTML element to obtain the buttons
    const section = document.querySelector('.category-row');
    // Get all the update and delete buttons
    // const updateBtns = section.querySelectorAll('.updateButtons');
    const deleteBtns = section.querySelectorAll('.deleteButtons');
    // Add back the hide class to all the buttons
    // updateBtns.forEach(btn => {
    //     btn.classList.add('hide');
    // });
    deleteBtns.forEach(btn => {
        btn.classList.add('hide');
    });
    // Change button to say 'edit' again
    editBtn.innerText = 'Edit';
};


// *********************************************
// ************* UPDATE A CATEGORY *************
// *********************************************

// Get the update buttons 
// Get the userId

// Thoughts: I need to do something similar to what I did with the profile page: having a modal open when the update button is clicked. 

// What do I need: 
/*
A hidden modal for the row (probably just one). Then click the "update" button, and the modal appears, populated with the current data, and the view of it is hidden. I'll need the recordset numbers and keep track of which one. 
 */





// *********************************************
// ************* DELETE A CATEGORY *************
// *********************************************

async function addFunctionalityToDeleteBtns() {    
    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();
    // Retrieve the category data via Preload -> Main -> dbOperation
    const data = await window.electronAPI.retrieveCategory(userId);
    // Get the number of categories
    const numberOfCategories = data.recordset.length;
    
    // Iterate over each category, adding an event listener to each delete button ID
    for (let i = 0; i < numberOfCategories; i++) {
        const deleteBtn = document.getElementById('cat-deleteBtn' + i.toString());
        deleteBtn.addEventListener('click', (_event) => {
            // Popup a confirmation message
            let message = 'Are you sure you want to delete this category?';
            if (confirm(message) == true) {
                // Send the request to delete the category from the database
                window.electronAPI.removeCategory(data.recordset[i].category_id);
                // Remove all the HTML elements associated with that category
                deleteHtmlElements(i);
            };
        });
    };
};

// Function that will remove the HTML elements associated with a category (called when a delete button event is activated)
async function deleteHtmlElements(i) {
    // Access the specific <div> we're targeting
    const rowDiv = document.querySelector('#cat-row' + i.toString());
    // Access the <p> elements of that <div>
    const rowId = document.querySelector('#cat-id' + i.toString());
    const rowName = document.querySelector('#cat-name' + i.toString());
    const rowAmount = document.querySelector('#cat-amount' + i.toString());
    const rowMoneyIn = document.querySelector('#cat-moneyIn' + i.toString());
    const rowMoneyOut = document.querySelector('#cat-moneyOut' + i.toString());
    const rowForeignKey = document.querySelector('#cat-fk' + i.toString());
    const rowDeleteBtn = document.querySelector('#cat-deleteBtn' + i.toString());
    // Remove the <div> and <p> elements associated with this category
    rowDiv.remove();
    rowId.remove();
    rowName.remove();
    rowAmount.remove();
    rowMoneyIn.remove();
    rowMoneyOut.remove();
    rowForeignKey.remove();
    rowDeleteBtn.remove();
};



// Logs out of account when user clicks logout button 
async function logout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        window.electronAPI.tellMainLogout();
    });
};