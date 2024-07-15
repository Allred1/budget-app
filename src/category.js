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
    // const numberOfCategories = data.recordset.length;
    
    // while (numberOfCategories > 0) {
    //     // Iterate over and (call the functions for) each category 
    //     for (let i = 0; i < data.recordset; i++) {
    //         catId('cat-id' + i.toString(), i);
    //         name('cat-name' + i.toString(), i);
    //         amount('cat-amount' + i.toString(), i);
    //         moneyIn('cat-moneyIn' + i.toString(), i);
    //         moneyOut('cat-moneyOut' + i.toString(), i);
    //         foreignKey('cat-fk' + i.toString(), i);
    //         // const rowElements = document.querySelector('#category-row');
    //         // addRowElement(rowElements, i);
    //     };
    // };
    
    // // Creates a new HTML row element
    // function addRowElement(rowElements, i) {
    //     const rowId = document.createElement('p');
    //     const rowName = document.createElement('p');
    //     const rowAmount = document.createElement('p');
    //     const rowMoneyIn = document.createElement('p');
    //     const rowMoneyOut = document.createElement('p');
    //     const rowForeignKey = document.createElement('p');
    //     rowId.id = 'cat-id' + i.toString();
    //     rowName.id= 'cat-name' + i.toString();
    //     rowAmount.id= 'cat-amount' + i.toString();
    //     rowMoneyIn.id= 'cat-moneyIn' + i.toString();
    //     rowMoneyOut.id= 'cat-moneyOut' + i.toString();
    //     rowForeignKey.id= 'cat-fk' + i.toString();
    //     rowElements.appendChild(rowId);
    //     rowElements.appendChild(rowName);
    //     rowElements.appendChild(rowAmount);
    //     rowElements.appendChild(rowMoneyIn);
    //     rowElements.appendChild(rowMoneyOut);
    //     rowElements.appendChild(rowForeignKey);
    // };


    catId('cat-id0', 0);
    // catId('cat-id2', 1);
    // catId('cat-id3', 2);
    // catId('cat-id4', 3);
    // catId('cat-id5', 4);

    name('cat-name0', 0);    amount('cat-amount0', 0);
    // name('cat-name1', 1);    amount('cat-amount1', 1);
    // name('cat-name2', 2);    amount('cat-amount2', 2);
    // name('cat-name3', 3);    amount('cat-amount3', 3);
    // name('cat-name4', 4);    amount('cat-amount4', 4);;

    moneyIn('cat-moneyIn0', 0);     moneyOut('cat-moneyOut0', 0);
    // moneyIn('cat-moneyIn1', 1);     moneyOut('cat-moneyOut1', 1);
    // moneyIn('cat-moneyIn2', 2);     moneyOut('cat-moneyOut2', 2);
    // moneyIn('cat-moneyIn3', 3);     moneyOut('cat-moneyOut3', 3);
    // moneyIn('cat-moneyIn4', 4);     moneyOut('cat-moneyOut4', 4);

    foreignKey('cat-fk0', 0);
    // foreignKey('cat-fk1', 1);
    // foreignKey('cat-fk2', 2);
    // foreignKey('cat-fk3', 3);
    // foreignKey('cat-fk4', 4);

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
        document.getElementById(id).innerText = "''";
    };


    // Notes to self: I may need a (or some) other function(s) for a dynamic interface. When the user creates a new category, I need to count how many categories they have, and use that number to iterate over that many recordsets (recordset[3], etc.), and call each of those data-populating functions for each number. (Will also require the altering of the id string (concatenating + 1, etc.)). 
    // I was going to add the need to manually add another HTML row element for each new category created, but I think the looping-over will take care of that once the page is refreshed. 
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
editBtn.addEventListener('click', function() {
    if (toggle == false) {
        // When clicked, open the editing modal
        showCreateCategory();
        toggle = true;
    } else {
        // When clicked again, 
        // Get HTML elements and swith the modal to be hidden
        const section = document.querySelector('.category-content');
        const edit = section.querySelector('.create-row');
        edit.classList.add('hide');
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


// *********************************************
// ************* UPDATE A CATEGORY *************
// *********************************************



// *********************************************
// ************* DELETE A CATEGORY *************
// *********************************************