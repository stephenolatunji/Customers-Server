const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();


router.route('/')
    .post(async(req, res)=>{
        const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
        const {
            SFCode,
            distCode,
            custType,
            name, 
            email,
            phone,
            country,
            address,
            district,
            longitude,
            latitude,
        } = req.body;

        try{
            await connectDB.query(`SELECT COUNT(SF_Code) AS count FROM cust_tb WHERE SF_Code = '${SFCode}'`, async(err, results) =>{
                if(!results.recordset[0].count){
                    await  connectDB.query(`INSERT INTO cust_tb (SF_Code, DIST_Code, 
                        CUST_Type, CUST_Name, email, phoneNumber, country, address, district,
                        longitude, latitude, registeredOn, status) VALUES(
                        '${SFCode}', '${distCode}', '${custType}', '${name}', '${email}',
                        '${phone}', '${country}', '${address}', '${district}', '${longitude}',
                        '${latitude}', '${date}', 'Active')`, async(err, result) =>{
                            if(result.rowsAffected > 0){
                                await connectDB.query(`SELECT * FROM cust_tb WHERE SF_Code = '${SFCode}'`, (err, results)=>{
                                    if(results.rowsAffected > 0){
                                        return res.status(200).json({success: true, msg: 'Customer registered successfully', result: results.recordset[0]})
                                    }
                                    else{
                                        res.status(400).json({success: false, msg: 'Could not fetch newly added customer'})
                                    }

                                })
                                
                            }
                            else{
                                res.status(400).json({succcess: false, msg: 'New Customer not added', err}); 
                            }
                        }
                    )
                   
                }
                else{
                    return res.status(401).json({success: false, msg: 'Customer already registered', err});
                }
            })
        }
        catch{
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    });

router.route('/one-off-customer')
    .post(async(req, res)=>{
        const {distCode, name, phone, country, email, address} = req.body;
        const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();

        try{
            await connectDB.query(`SELECT COUNT(email) AS count FROM one_off_customer_tb WHERE email = '${email}'`, async(err, results)=>{
                if(!results.recordset[0].count){
                    await connectDB.query(`INSERT INTO one_off_customer_tb (DIST_Code, 
                        CUST_Name, phoneNumber, email, country, address,
                        status, registeredOn) VALUES('${distCode}', '${name}', '${phone}',
                        '${email}', '${country}', '${address}', 'New', '${date}')`, async(err, results)=>{
                            if(results.rowsAffected > 0){
                                await connectDB.query(`SELECT * FROM one_off_customer_tb WHERE email = '${email}'`, (err, results) => {
                                    if(results.recordset.length > 0){
                                        res.status(200).json({success: true, msg: 'Successfully registered', result: results.recordset[0]})
                                    }
                                    else{
                                        res.status(400).json({success: false, msg: 'Could not find newly registered customer', err});
                                    }
                                })
                            }
                            else{
                                res.status(500).json({success: false, msg: 'Customer was not registered', err});
                            }
                        })
                }
                else{
                    

                     res.status(400).json({success: false, msg: 'You have already registered this customer', err});
     
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    })

module.exports = router;





     
 


       



