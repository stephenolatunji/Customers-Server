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
                
                if(results.recordset[0].count){
                    return res.status(401).json({success: false, msg: 'Customer already registered'});
                }
                else{
                   
                    await  connectDB.query(`INSERT INTO cust_tb(SF_Code, DIST_Code, 
                        CUST_Type, email, phoneNumber, country, address, district,
                        longitude, latitude, registeredOn, status) VALUES(
                        '${SFCode}', '${distCode}', '${custType}', '${email}',
                        '${phone}', '${country}', '${address}', '${district}', '${longitude}',
                        '${latitude}', '${date}', 'Active'
                        )`, async(err, result) =>{
                            if(result.rowsAffected > 0){
                                await connectDB.query(`SELECT * FROM cust_tb WHERE SF_Code = '${SFCode}'`, (err, result)=>{
                                    if(result.rowsAffected > 0){
                                        return res.status(200).json({success: true, msg: 'Customer registered successfully', results: result.recordset[0]})
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
            })
        }
        catch{
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    })

module.exports = router;





     
 


       



