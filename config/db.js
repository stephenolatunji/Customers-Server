const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    options: {encrypt: true, trustServerCertificate: false},
}


const connectDB = sql.connect(config, (err) =>{
    if(err) throw err;
    console.log('DB connected...')
});

module.exports = connectDB; 