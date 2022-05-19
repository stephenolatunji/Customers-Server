const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();

router.route('/status/:id')
    .patch(async(req, res)=>{
        const status = req.body.status;
        const id = req.params.id
        try{
            if(status == 'Active' || status == 'Inactive' || status == 'Blocked'){
                connectDB.query(`EXEC updateCustomerStatus @status = '${status}', @id = '${id}'`, (err, results) =>{
                    if(results.recordset.length > 0){
                        return res.status(200).json({success: true, msg: "Customer's status updated", result: results.recordset[0]});
                    }
                    else{
                        
                        return res.status(400).json({success: false, msg: "Customer status not updated", err});
                    }
                })
            }
            else{
                res.status(401).json({success: false, msg: `${status} option does not exist`})
            }
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server Error', err})
        }
    });

router.route('/profile/:id')
    .patch(async( req, res) => {
        const id = req.params.id;
        const data = req.body;

        try{
            await connectDB.query(`EXEC selectCountId @id = '${id}'`, (err, results)=>{
                if(results.recordset.length > 0){
                    connectDB.query(`UPDATE cust_tb SET ? WHERE id = '${id}'`, data, (err, results) =>{console.log(results);
                        if(results.rowsAffected.length > 0){
                            return res.status(200).json({success: true, msg: 'Customer details successfully updated'});
                        }
                        else{
                            res.status(400).json({success: false, msg: 'Can not update'});
                        }
                    });
                }
                else{
                    res.status(400).json({success: false, msg: 'Customer not found'})
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: `Server Error ${err}`})
        }
    })

router.route('/update-phone')
    .patch(async(req, res) =>{
        const code = req.body.code;
        const phoneNumber = req.body.phoneNumber;

        try{
            if(phoneNumber.length > 10){
                connectDB.query(`EXEC updateCustomerPhone @phone = '${phoneNumber}', @code = '${code}'`, (err, results) =>{
                    if(results.recordset.length > 0){
                        return res.status(200).json({success: true, msg: "Customer's phone updated", result: results.recordset[0]});
                    }
                    else{
                        
                        return res.status(400).json({success: false, msg: "Customer's phone not updated", err});
                    }
                })
            }
            else{
                res.status(400).json({success: false, msg: 'Please provide a valid number'})
            }
        }
        catch(err){
            res.status(500).json({success: false, msg: `Server Error ${err}`})
        }
    })

    router.route('/update-dist/change-dist')
    .patch(async( req, res) => {
        const sfCode = req.body.sfCode;
        const distCode = req.body.distCode;

        try{
            connectDB.query(`EXEC updateCustomerDistributor @SF_Code = '${sfCode}', @Dist_Code = '${distCode}'`, (err, results) =>{
                if(results.recordset.length > 0){
                    return res.status(200).json({success: true, msg: "Customer's Distributor updated", result: results.recordset[0]});
                }
                else{
                    
                    return res.status(400).json({success: false, msg: "Customer's Distibutor not updated", err});
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: `Server Error ${err}`})
        }
    })

module.exports = router;