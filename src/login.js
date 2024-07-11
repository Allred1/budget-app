// *****************************************************
// *************LOGIN FUNCTIONS*************
// *****************************************************
const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', submitLogin);

const loginValidation = document.getElementById('loginValidation');


async function submitLogin() {    
    const userId = document.getElementById('loginUserID').value;
    const password = document.getElementById('password').value;
    const result = await window.electronAPI.checkLogin(userId, password);
    // if result = 'valid' move on to dashboard page, and load the queries
    // else: an alert that says displays the error message
    if (result == 'valid') {
        loginValidation.innerText = '';
        captureLoginId(userId);
        // changes the 'login' button to be a link to dashboard page
        loginBtn.addEventListener('click', window.location.href='dashboard.html');
        // sends "loginUserID to the Main process", there to be used for the remaining queries
        // captureLoginId(userId);
    }
    else {
        loginValidation.innerText = result;
    };
};

function captureLoginId(userId) {
    window.electronAPI.sendIdToMain(userId);
};


// Popup for account creation
// Open / Close buttons and the popup (modal) itself
const createAccount = document.getElementById('createAccount');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('accountModal');
// Listeners to open and close the modal
createAccount.addEventListener('click', () => {
    modal.classList.add("open");
});
closeModal.addEventListener('click', () => {
    modal.classList.remove("open");
});


// Create Account
// button
const createProfileBtn = document.getElementById('createProfileBtn');
createProfileBtn.addEventListener('click', submitProfile);
createProfileBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    window.location.href='dashboard.html';
});


function submitProfile() {
    const userId = document.getElementById('profileId').value;
    const fName = document.getElementById('firstName').value;
    const lName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('profilePassword').value;
    window.electronAPI.setProfile(userId, fName, lName, username, password);
};