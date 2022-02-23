const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();


router.route('/getall')
    .get(async(req, res)=>{
        try{
            await connectDB.query(`EXEC getAllCustomer`,(err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
               }
                else{
                    res.status(400).json({success: false, msg: 'Customers not found', err});
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
            
            await connectDB.query(`EXEC getCustomerByDistributorCode @distributorCode= '${distCode}'`, (err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
               }
                else{
                    res.status(400).json({success: false, msg: 'Customers not found', err});
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
            
            await connectDB.query(`EXEC getCustomersById @id = '${id}'`, (err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, msg: 'Customer found!', result: results.recordset[0]});
               }
                else{
                    res.status(400).json({success: false, msg: 'Customer not found', err});
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
            
            await connectDB.query(`EXEC getcustomersBySalesforceId @salesforceId = '${id}'`, (err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, msg: 'Customer found!', result: results.recordset});
               }
                else{
                    res.status(400).json({success: false, msg: 'Customer not found', err});
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
            
            await connectDB.query(`EXEC getCustomerByStatus @status = '${status}'`, (err, results) =>{
                if(results.rowsAffected > 0){
                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
               }
                else{
                    res.status(400).json({success: false, msg: `No ${status} Customer found`, err});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'Server Error'})
        }
    });

router.route('/get-by-lastdigit/:country')
    .post(async(req, res) =>{
        const sfDigit = req.body.sfDigit;
        const country = req.params.country;

        try{
            await connectDB.query(`SELECT * FROM cust_tb2 WHERE digits = '${sfDigit}' AND country = '${country}'`, (err, results) =>{
                if(results.recordset.length > 0){
                   return res.status(200).json({success: true, msg: 'Customers found!', results: results.recordset})
                }
                else{
                    return res.status(404).json({success: false, msg: 'Customer with code not found'})
                }
            })

        }catch(err){
            res.status(500).json({success: false, err})
        }
    })


router.route('/getbycountry/:country')
    .get(async(req, res) =>{
        const country = req.params.country;

        try{
            
            await connectDB.query(`EXEC getCustomersByCountry @country = '${country}'`, (err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
               }
                else{
                    res.status(400).json({success: false, msg: `No Customer found in this country `, err});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'Server Error'})
        }
    })

    router.route('/getcustomerbytype/:country/:type')
    .get(async(req, res) =>{
        const country = req.params.country;
        const type = req.params.type;

        try{
            
            await connectDB.query(`EXEC getCustomerByType @country = '${country}', @type = '${type}'`, (err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
               }
                else{
                    res.status(400).json({success: false, msg: `No Customer found in this country `, err});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'Server Error'})
        }
    })

module.exports = router;