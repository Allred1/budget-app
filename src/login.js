// **************************************
// ************* LOGGING IN *************
// **************************************

// Login button and event listener
const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', submitLogin);

// Field displaying an 'incorrect login' message
const loginValidation = document.getElementById('incorrectLoginMessage');


async function submitLogin() {    
    const userId = document.getElementById('loginUserID').value;
    const password = document.getElementById('password').value;
    
    // Query the database via Preload -> Main -> dbOperation (and back) to verify if the entered Login is correct
    const result = await window.electronAPI.verifyLogin(userId, password);
    
    // if result = 'valid' move on to dashboard page, and load the queries. Otherwise display an error message on the GUI
    if (result == 'valid') {
        loginValidation.innerText = ''; // if 'valid', remove the error message
        // Send the Login ID to Main process, so Main can give it to the other processes
        captureLoginId(userId);
        // changes the 'login' button to be a link to dashboard page
        loginBtn.addEventListener('click', window.location.href='dashboard.html');
    }
    else {
        loginValidation.innerText = result;
    };
};

function captureLoginId(userId) {
    window.electronAPI.sendIdToMain(userId);
};



// **************************************************
// ************* CREATING A NEW ACCOUNT *************
// **************************************************

// Popup (modal) for creating an account
// Open / Close buttons & the modal itself
const createAccount = document.getElementById('createAccount');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('accountModal');

// Listeners to open and close the modal
// Open
createAccount.addEventListener('click', () => {
    modal.classList.add("open");
});
// Close
closeModal.addEventListener('click', () => {
    modal.classList.remove("open");
});


// Create Account button
const createProfileBtn = document.getElementById('createProfileBtn');

// When clicked, calls the function that submits the user input as a new profile
// and navigates the user to the Dashboard page
createProfileBtn.addEventListener('click', submitProfile);
createProfileBtn.addEventListener('click', (event) => {
    event.stopPropagation();    // prevents event bubbling
    window.location.href='dashboard.html';
});

// Takes the entered values and sends them to the database to be created as a new Profile
function submitProfile() {
    const userId = document.getElementById('profileId').value;
    const fName = document.getElementById('firstName').value;
    const lName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('profilePassword').value;
    window.electronAPI.setProfile(userId, fName, lName, username, password);
};