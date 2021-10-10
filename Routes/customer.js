const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();


router.route('/getall')
    .get(async(req, res)=>{
        try{
            await connectDB.query(`SELECT * FROM cust_tb`,(err, results) =>{
                if(err){res.status(400).json({success: false, err});
                }
                else{

                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset})
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    });


router.route('/distributor/:code')
    .get(async (req, res) =>{
        const distCode = req.params.code;

        try{
            
            await connectDB.query(`SELECT * FROM cust_tb WHERE DIST_Code = '${distCode}'`, (err, results) =>{
                if(err){
                    res.status(400).json({success: false, msg: "Customers not found ", err});
                }
                else{
                    res.status(200).json({success: true, result: results.recordset});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'SERVER Error'})
        }
    });

router.route('/:id')
    .get(async(req, res) =>{
        const id = req.params.id;

        try{
            
            await connectDB.query(`SELECT * FROM cust_tb WHERE id = '${id}'`, (err, results) =>{
                if(err){
                    res.status(400).json({success: false, msg: "Customer not found ", err});
                }
                else{
                    res.status(200).json({success: true, result: results.recordset[0]});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'SERVER Error'})
        }
    });


router.route('/salesforce/:id')
    .get(async(req, res) =>{
        const id = req.params.id;

        try{
            
            await connectDB.query(`SELECT * FROM cust_tb WHERE SF_Code = '${id}'`, (err, results) =>{
                if(err){
                    res.status(400).json({success: false, msg: "Customer not found ", err});
                }
                else{
                    res.status(200).json({success: true, result: results.recordset[0]});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'SERVER Error'})
        }
    });

router.route('/status/:status')
    .get(async(req, res) =>{
        const status = req.params.status;

        try{
            
            await connectDB.query(`SELECT * FROM cust_tb WHERE status = '${status}'`, (err, results) =>{
                if(err){
                    res.status(400).json({success: false, msg: `No '${status}' customer found` , err});
                }
                else{
                    res.status(200).json({success: true, result: results.recordset});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'Server Error'})
        }
    });


module.exports = router;