const express = require('express');
const { reset } = require('nodemon');
const connectDB = require('../config/db');
const router = express.Router();


router.route('/getall')
.get(async(req, res)=> {
    try{
        /* If query (page and limit, eg: -> apilink/getall?page=1&limit=5) paramters are passed,
        the result will be customers who are newly created or updated
        */
        if (req.query.page && req.query.limit) {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            let startIndex = (page - 1) * limit;
            let endIndex = page * limit;

            await connectDB.query(`EXEC getNumberModifiedCustomers`, async(err, results) => {
                // console.log(results);
                if (results.recordset[0].number_of_customers > 0) {
                    numOfCustomers = results.recordset[0].number_of_customers;
                    console.log(`>>> Number of customers is (${numOfCustomers}), starting index is (${startIndex}), and limt is (${endIndex}) <<<`);
                    startIndex = numOfCustomers <= startIndex ? (numOfCustomers - 1) : startIndex;
                    endIndex = numOfCustomers <= endIndex ? numOfCustomers : endIndex;
                    console.log(`>>> After calculations #### Number of customers is (${numOfCustomers}), starting index is (${startIndex}), and limt is (${endIndex}) #### <<<`);

                    await connectDB.query(`EXEC getModifiedCustomersByPagination @startIndex = '${startIndex}', @endIndex = '${endIndex}'`, (err, results) => {
                        // console.log(results);
                        if (results.recordset.length > 0) {
                            //res.status(200).json({success: true, msg: 'Customers found!', result: customers.slice(startIndex, endIndex)});
                            res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
                        }
                        else {
                            res.status(400).json({success: false, msg: 'Customers not found', err});
                        }
                    })
               }
                else{
                    res.status(400).json({success: false, msg: 'Customers not found', err});
                }
            })

        /* else return all customers existing in the DB */
        } else{
            await connectDB.query(`EXEC getAllCustomer`,(err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, msg: 'Customers found!', result: results.recordset});
               }
                else{
                    res.status(400).json({success: false, msg: 'Customers not found', err});
                }
            })
        }
    }
    catch(err){
        res.status(500).json({success: false, msg: 'Server Error', err});
    }
});


router.route('/distributor/:code')
    .get(async (req, res) =>{
        const distCode = req.params.code;

        try{
            
            await connectDB.query(`EXEC getCustomersByDistributorCode @distributorCode= '${distCode}'`, (err, results) =>{
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
            await connectDB.query(`EXEC getCustomersByBBCode @BB_Code = '${sfDigit}', @country = '${country}'`, (err, results) =>{
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


router.route('/rate-customer')
    .patch(async(req, res) =>{
        const stars = req.body.stars;
        const comment = req.body.comment;
        const outletCode = req.body.outletCode;
        const raterCode = req.body.raterCode;
        const orderId = req.body.orderId;
        const country = req.body.country;
        const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();

        try{
            if(stars > 0 && stars <= 5){
                await connectDB.query(`EXEC customersComments @outletCode = '${outletCode}', @ratings = ${parseInt(stars)}, 
                @ratersCode = '${raterCode}', @comment = '${comment}', @orderId = '${orderId}', @country = '${country}', @date = '${date}'`, async(err, result) => {
                    if(result.recordset.length > 0){
                        await connectDB.query(`EXEC getRatedCustomers @outletCode = ${outletCode}, @country = '${country}'`, async(err, results) =>{
                            if(results.recordset.length > 0){
                                const record = results.recordset[0];
                                const raters = parseInt(record.raters + 1);
                                const ratings = parseInt(record.ratings + stars);
                                const currentRating = (parseFloat(ratings/raters)).toFixed(1);
                                await connectDB.query(`EXEC updateCustomerRating @outletCode = '${outletCode}', @rating = ${ratings}, 
                                @raters = ${raters}, @stars = ${currentRating}, @country = '${country}'`, async(err, results) =>{
                                    if(results.rowsAffected > 0){
                                        return res.status(200).json({success: true, result: results.recordset[0]})
                                    }
                                    else{
                                        return res.status(400).json({success: false, msg: 'Rating failed'})
                                    }
                                })
                            }
                            else{
                                await connectDB.query(`EXEC rateCustomer @outletCode = '${outletCode}', @rating = ${stars}, @stars = ${stars}, @raters = 1, @country = '${country}'`, (err, results) =>{
                                    if(results.recordset.length > 0){
                                        return res.status(200).json({success: true, result: results.recordset[0]})
                                    }
                                    else{
                                        return reset.status(400).json({success: false, msg: 'Failed to rate'})
                                    }
                                })
                            }
                        })
                    }
                    else{
                        return res.status(400).json({success: false, msg: 'Customer\'s rating failed'})
                    }
                })
                
            }
            else{
                return res.status(400).json({success: false, msg: 'Value must be within the range of 0 and 5'})
            }
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server error!'})
        }
    })

    router.route('/getcustomer-rating')
    .post(async(req, res) =>{
        const country = req.body.country;
        const outletCode = req.body.outletCode;

        try{
            
            await connectDB.query(`EXEC getRatedCustomers @country = '${country}', @outletCode = '${outletCode}'`, (err, results) =>{
                if(results.recordset.length > 0){
                    res.status(200).json({success: true, result: results.recordset[0]});
               }
                else{
                    res.status(400).json({success: false, msg: `No rating found for this customer`, err});
                }
            });
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'Server Error'})
        }
    })


module.exports = router;