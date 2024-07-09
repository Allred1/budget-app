// *****************************************************
// *************CREATE FUNCTIONS*************
// *****************************************************
const createCategoryBtn = document.getElementById('createCategoryBtn');
createCategoryBtn.addEventListener('click', submitCategory);

function submitCategory() {
    const categoryId = document.getElementById('catId').value;
    const name = document.getElementById('catName').value;
    const amount = document.getElementById('dollarAmount').value;
    const moneyIn = document.getElementById('moneyIn').value;
    const moneyOut = document.getElementById('moneyOut').value;
    const userIdFk = document.getElementById('userIdFk').value;
    window.electronAPI.setCategory(categoryId, name, amount, moneyIn, moneyOut, userIdFk);
};


// *****************************************************
// *************GET FUNCTIONS*************
// *****************************************************



// *****************************************************
// *************EDIT FUNCTIONS*************
// *****************************************************