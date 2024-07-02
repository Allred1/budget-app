// const dbOperation = require('../dbFiles/dbOperation');


const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;




// Retrieve the income by ID
function findIncome() {
    const userId = document.getElementById('getIncomeId').value;
    window.electronAPI.retrieveIncome(userId);
};
const getIncomeBtn = document.getElementById('getIncomeBtn');
getIncomeBtn.addEventListener('click', findIncome);


// async function incomeRenderer() {
//     const userId = document.getElementById('getIncomeId').value;
//     const result = await dbOperation.getIncome(userId);
//     console.log(result.recordset);
// };

// getIncomeBtn.addEventListener('click', incomeRenderer);


