const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.HOST_QA,
    user: 'sqlAdmin',
    password: process.env.PASSWORD_QA,
    database: process.env.DB,
    options: {encrypt: true, trustServerCertificate: false},
}


const connectDB = sql.connect(config, (err) =>{
    if(err) throw err;
    console.log('DB connected...')
});

module.exports = connectDB; 