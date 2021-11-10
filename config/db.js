const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    options: {encrypt: true, trustServerCertificate: false},
}
const sql2 = `CREATE TABLE cust_tb (
    id int IDENTITY(1, 1) PRIMARY KEY,
    SF_Code varchar(255) NOT NULL,
    DIST_Code varchar(255) NOT NULL,
    CUST_Type varchar(255) NOT NULL,
    CUST_Name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phoneNumber varchar(255),
    country varchar(255) NOT NULL,
    address varchar(255),
    district varchar(255),
    longitude varchar(255),
    latitude varchar(255),
    registeredOn varchar(255),
    status varchar(255)
    )
    `;

const sql3 = `CREATE TABLE one_off_customer_tb (
    id int IDENTITY(1, 1) PRIMARY KEY,
    DIST_Code varchar(255) NOT NULL,
    CUST_Name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phoneNumber varchar(255),
    country varchar(255) NOT NULL,
    address varchar(255),
    status varchar(255),
    registeredOn varchar(255),
)`;
const connectDB = sql.connect(config, (err) =>{
    if(err) throw err;
    console.log('DB connected...')
    sql.query(sql2, (err, result) =>{
        if(err){
           return console.log('Customer table already exists...');
        }
        else{
            console.log('Customer table created successfully...');
            sql.query(sql3, (err, result)=>{
                if(err){
                    return console.log('One-off-customer table already exists...');
                }
                else{
                    console.log('One-Off-Customer table created successfully...');
                }
            })
        }
    })
});

module.exports = connectDB; 