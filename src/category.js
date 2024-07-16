// ******************************************************************************
// ************************ DISPLAY CATEGORY INFORMATION ************************
// ******************************************************************************

// Call the display functions on page load
window.onload = function() {
    findIncome();
    findCategory();
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
    income.innerText = `$${data.recordset[0].income}`;
    
    // Set the userId in the "create category" row as a non-changeable value
    document.getElementById('userIdFk').value = userId;
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
    let i = 0; // Use an iterator

    // Go over each category the user has
    while (i < numberOfCategories) {
        // Iterate over and (call the functions for) each category 
        for (i; i < numberOfCategories; i++) {
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
            updateBtnTitle('.updateButtons');
            deleteBtnTitle('.deleteButtons');
        };
    };


    // Thought: I might want to add the update and delete buttons here, but give them a class that hides them.
    // Then in the UPDATE and DELETE portion of this file, all that needs to be done when the "edit" button is clicked is to remove that hiding class, and send the command to the database. 
    
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
        const updateBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        // Assigns an id to each paragraph
        rowId.id= 'cat-id' + i.toString();
        rowName.id= 'cat-name' + i.toString();
        rowAmount.id= 'cat-amount' + i.toString();
        rowMoneyIn.id= 'cat-moneyIn' + i.toString();
        rowMoneyOut.id= 'cat-moneyOut' + i.toString();
        rowForeignKey.id= 'cat-fk' + i.toString();
        // Assigns classes to the editing buttons
        updateBtn.classList.add('updateButtons');
        deleteBtn.classList.add('updateButtons');
        updateBtn.classList.add('hide');
        deleteBtn.classList.add('hide');
        // Adds them all to the row element
        rowDiv.appendChild(rowId);
        rowDiv.appendChild(rowName);
        rowDiv.appendChild(rowAmount);
        rowDiv.appendChild(rowMoneyIn);
        rowDiv.appendChild(rowMoneyOut);
        rowDiv.appendChild(rowForeignKey);
        rowDiv.appendChild(updateBtn);
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
    async function updateBtnTitle(id) {
        const buttons = document.querySelectorAll(id);
        buttons.forEach(btn => {
            btn.innerText = 'Update';
        });
    };
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
        // When clicked, open the editing modal
        showCreateCategory();
        // Show the row editing ability
        showRowEdits();
        toggle = true;
    } else {
        // When clicked again, 
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
    });
};


// Takes the entered values and sends them to the database to be created as a new Category 
async function submitCategory(edit) {
    // Get the ID from Main, which received it from Login
    const userId = await window.electronAPI.renderersRetrieveLogin();

    // Take the user's entered values and send them to be created in the database
    const categoryId = document.getElementById('catId').value;
    const name = document.getElementById('catName').value;
    const amount = document.getElementById('dollarAmount').value;
    const moneyIn = document.getElementById('moneyIn').value;
    const moneyOut = document.getElementById('moneyOut').value;
    window.electronAPI.setCategory(categoryId, name, amount, moneyIn, moneyOut, userId);

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
    const updateBtns = section.querySelectorAll('.updateButtons');
    const deleteBtns = section.querySelectorAll('.deleteButtons');
    // Remove the hide class from all the buttons
    updateBtns.forEach(btn => {
        btn.classList.remove('hide');
    });
    deleteBtns.forEach(btn => {
        btn.classList.remove('hide');
    });
};
// Hide again the update and delete buttons for each category
async function hideRowEdits() {
    // Get section HTML element to obtain the buttons
    const section = document.querySelector('.category-row');
    // Get all the update and delete buttons
    const updateBtns = section.querySelectorAll('.updateButtons');
    const deleteBtns = section.querySelectorAll('.deleteButtons');
    // Add back the hide class to all the buttons
    updateBtns.forEach(btn => {
        btn.classList.add('hide');
    });
    deleteBtns.forEach(btn => {
        btn.classList.add('hide');
    });
};


// *********************************************
// ************* UPDATE A CATEGORY *************
// *********************************************


// *********************************************
// ************* DELETE A CATEGORY *************
// *********************************************


// Thoughts: I'm probably going to need to loop through each button and add an eventlistener. 