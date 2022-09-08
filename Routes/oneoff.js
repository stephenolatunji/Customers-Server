const express = require('express');
const connectDB = require('../Config/db');
const router = express.Router();
const auth = require('../middleware/auth');

router.route('/register')
    .post(
        // auth, 
        async(req, res) =>{
        const {customerName, phoneNumber, country} = req.body;
        const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();

        try{
            await connectDB.query(`SELECT COUNT(phoneNumber) AS count FROM one_off_customer_tb 
            WHERE phoneNumber = '${phoneNumber}'`, async(err, result) =>{
                if(!result.recordset[0].count){
                    await connectDB.query(`INSERT INTO one_off_customer_tb 
                    (CUST_Name, phoneNumber, country, registeredOn) 
                    VALUES('${customerName}', '${phoneNumber}', '${country}', '${date}')`, async(err, result) =>{
                        if(result.rowsAffected > 0){
                            await connectDB.query(`SELECT * FROM one_off_customer_tb WHERE phoneNumber = '${phoneNumber}'`, async(err, result) => {
                                return res.status(200).json({success: true, msg: 'Customer registered successfully', result: result.recordset[0]})
                            })
                        }
                        else{
                            return res.status(200).json({success: false, msg: 'Customer not found', result: results.recordset[0]})
                        }
                    })
                }
                else{
                    res.status(404).json({success: false, msg: 'Customer already exists',  err})
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server error', err})
        }
    })

router.route('/getall')
.get(
    // auth, 
    async(req, res)=>{
    try{
        await connectDB.query(`SELECT * FROM one_off_customer_tb`,(err, results) =>{
            if(results.rowsAffected > 0){
                res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
            }
            else{
                res.status(404).json({success: false, msg: 'Customers not found', err});
            }
        })
    }
    catch(err){
        res.status(500).json({success: false, msg: 'Server Error', err});
    }
});

router.route('/getbycountry/:country')
    .get(
        // auth, 
        async(req, res)=>{
        const country = req.params.country;
        try{
            await connectDB.query(`SELECT * FROM one_off_customer_tb WHERE country = '${country}'`,(err, results) =>{
                if(results.rowsAffected > 0){
                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
               }
                else{
                    res.status(404).json({success: false, msg: 'Customers not found', err});
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    });

    router.route('/:id')
    .get(
        // auth, 
        async(req, res)=>{
        const id = req.params.id;
        try{
            await connectDB.query(`SELECT * FROM one_off_customer_tb WHERE id = '${id}'`,(err, results) =>{
                if(results.rowsAffected > 0){
                    res.status(200).json({success: true, msg: 'Customer found!', result: results.recordset[0]});
               }
                else{
                    res.status(404).json({success: false, msg: 'Customers not found', err});
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    });

module.exports = router;