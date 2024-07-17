const config        = require('./dbConfig');
const sql           = require('mssql');



// ************************************************************
// CREATE FUNCTIONS
// ************************************************************
const createProfile = async(profile) => {
    try {
        let pool = await sql.connect(config);
        let newProfile = await pool.request().query(`INSERT INTO profile (user_id, first_name, last_name, username, password) VALUES (${profile[0]}, '${profile[1]}', '${profile[2]}', '${profile[3]}', '${profile[4]}')`);
        console.log('Profile created.');
        return newProfile;
    }
    catch(error) {
        console.log(error);
    };
};

const createCategory = async(category) => {
    try {
        let pool = await sql.connect(config);
        let newCategory = await pool.request().query(`INSERT INTO category VALUES (${category[0]}, '${category[1]}', '${category[2]}', '${category[3]}', '${category[4]}', '${category[5]}')`);
        console.log('Category created.');
        return newCategory;
    }
    catch(error) {
        console.log(error);
    };
};


// ************************************************************
// 'GET' FUNCTIONS
// ************************************************************
const getProfile = async(userId) => {
    try {
        let pool = await sql.connect(config);
        let profile = await pool.request().query(`SELECT * FROM profile WHERE user_id = '${userId}'`);
        return profile;
    }
    catch(error) {
        console.log(error);
    };
};

const getIncome = async(userId) => {
    try {
        let pool = await sql.connect(config);
        let income = await pool.request().query(`SELECT income FROM profile WHERE user_id = '${userId}'`);
        return income;
    }
    catch(error) {
        console.log(error);
    };
};

const getCategory = async(userId) => {
    try {
        let pool = await sql.connect(config);
        let category = await pool.request().query(`SELECT * FROM category WHERE profile_id_fk = '${userId}'`);
        return category;
    }
    catch(error) {
        console.log(error);
    };
};


// ************************************************************
// 'EDIT' FUNCTIONS
// ************************************************************
const updateProfile = async(profile) => {
    try {
        let pool = await sql.connect(config);
        let newProfile = await pool.request().query(`UPDATE profile SET user_id = ${profile[0]}, first_name = '${profile[1]}', last_name = '${profile[2]}', username = '${profile[3]}', password = '${profile[4]}', income = '${profile[5]}' WHERE user_id = '${profile[0]}'`);
        console.log('Profile updated.');
        return newProfile;
    }
    catch(error) {
        console.log(error);
    };
};



// ************************************************************
// 'DELETE' FUNCTIONS
// ************************************************************
// delete category from the database
const deleteCategory = async(categoryId) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`DELETE FROM category WHERE category_id = ${categoryId}`);
        console.log(`${categoryId} Category deleted.`);
    }
    catch(error) {
        console.log(error);
    };
};




// ************************************************************
// LOGIN FUNCTIONS
// ************************************************************
const findLogin = async(login) => {
    try {
        let pool = await sql.connect(config);
        let newLogin = await pool.request().query(`SELECT user_id, password FROM profile WHERE EXISTS (SELECT user_id, password WHERE user_id = '${login[0]}' AND password = '${login[1]}');`)
        // If the query returns a valid result, return "valid", otherwise return an "incorrect" message
        if (newLogin.recordset[0] == null) {
            return 'Incorrect User ID or Password';
        }
        else {
            return 'valid'
        };
    }
    catch(error) {
        console.log(error);
        return 'Incorrect userId or password';
    };
};



module.exports = {
    createProfile,
    createCategory,

    getProfile,
    getIncome,
    getCategory,

    updateProfile,

    deleteCategory,

    findLogin,
};