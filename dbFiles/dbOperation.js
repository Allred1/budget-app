const config        = require('./dbConfig');
const sql           = require('mssql');



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


module.exports = {
    getIncome
}