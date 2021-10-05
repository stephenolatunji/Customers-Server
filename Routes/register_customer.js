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

            await connectDB.query(`SELECT * FROM cust_tb WHERE SF_Code = '${SFCode}'`, (err, results) =>{
                const result = results.recordset;
                if(result.length > 0){
                    return res.status(401).json({success: false, msg: 'Customer already registered'});
                }
                else{
                    connectDB.query(`INSERT INTO cust_tb(SF_Code, DIST_Code, 
                        CUST_Type, email, phoneNumber, country, address, district,
                        longitude, latitude, registeredOn, status) VALUES(
                        '${SFCode}', '${distCode}', '${custType}', '${email}',
                        '${phone}', '${country}', '${address}', '${district}', '${longitude}',
                        '${latitude}', '${date}', 'Active'
                        )`, (err, results) =>{
                            if(err){
                                return res.status(400).json({success: false, msg: 'Customer registration failed', err});
                            }
                            else{
                               
                                res.status(200).json({succcess: true, msg: 'Customer registered successfully'}); 
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





     
 


       



