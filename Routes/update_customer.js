const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();

router.route('/status/:id')
    .patch(async(req, res)=>{
        const status = req.body.status;
        const id = req.params.id
        try{
            if(status == 'Active' || status == 'Inactive' || status == 'Blocked'){
                await connectDB.query(`EXEC selectCountId @id = '${id}'`, (err, result) =>{
                    if(result.recordset.length < 1){
                        return res.status(400).json({success: false, msg: 'Can not find customer', err});
                    }
                    else{
                        connectDB.query(`EXEC updateCustomerStatus @status = '${status}', @id = '${id}'`, (err, results) =>{
                            if(results.affectedRows > 0){
                                return res.status(200).json({success: true, msg: "Customer's status updated"});
                            }
                            else{
                                
                                return res.status(400).json({success: false, msg: "Customer status not updated", err});
                            }
                        })
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

module.exports = router;