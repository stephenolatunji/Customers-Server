const express = require('express');
const connectDB = require('../Config/db');
const router = express.Router();
const auth = require('../middleware/auth');

router.route('/create-dream')
    .post(
        // auth, 
        async(req, res) =>{
        const BB_Code = req.body.BB_Code;
        const dreamName = req.body.dreamName;
        const dreamPoint = req.body.dreamPoint;
        const dreamDuration = req.body.dreamDuration;
        const country = req.body.country;
        const preferredDream = req.body.preferredDream;
        // const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
        const date = new Date(new Date().getTime() ).toISOString();
        const customerType = req.body.customerType;

        try{
            await connectDB.query(`EXEC createDream @country = '${country}', @BB_Code = '${BB_Code}',
            @dreamName = '${dreamName}', @dreamPoint = ${dreamPoint}, @dreamDuration = ${dreamDuration},
            @date = '${date}', @preferredDream = '${preferredDream}', @customer_type = '${customerType}'`, (err, result) =>{
                    if(result.recordset.length > 0){
                        return res.status(200).json({success: true, results: result.recordset[0]})
                    }
                    else{
                       return res.status(400).json({success: false, msg: 'Error creating dream'})
                    }
                })
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'Server Error'})
        }
    })

    router.route('/getdream')
    .post(
        // auth, 
        async(req, res) =>{
        const BB_Code = req.body.BB_Code;
        const country = req.body.country;

        try{
            await connectDB.query(`EXEC getMyDream @BB_Code = '${BB_Code}', @country = '${country}'`, (err, results) =>{console.log(results);
                if(results.recordset.length > 0){;
                   return res.status(200).json({success: true, msg: 'Customers found!', results: results.recordset})
                }
                else{
                    return res.status(404).json({success: false, msg: 'Customer with code not found'})
                }
            })

        }catch(err){
            res.status(500).json({success: false, err, msg: 'Server Error'})
        }
    })

    router.route('/update-points')
        .patch(
            // auth, 
            async(req, res) =>{
            const BB_Code = req.body.BB_Code;
            const points = req.body.points;
            const country = req.body.country;
            const delivered = req.body.delivered;

            try{
                await connectDB.query(`EXEC getMyDream @BB_Code = '${BB_Code}', @country = '${country}'`, async(err, results) =>{
                    if(results.recordset.length > 0){
                        let accumPoint = results.recordset[0].accumulated_points;
                        accumPoint = parseInt(points) + parseInt(accumPoint)
                        await connectDB.query(`EXEC updateDreamPoints @BB_Code = '${BB_Code}', @points = ${accumPoint}, @delivered = '${delivered}'`, (err, result) =>{
                            if (result.recordset.length > 0) {
                                return res.status(200).json({success: true, msg: 'Points Updated Successfully', results: result.recordset})
                                
                            }
                            else{
                                return res.status(404).json({success: false, msg: 'Can not update'})
                            }
                        })
                    }
                })
                
            }
            catch(err){

            }
        })

        router.route('/leader-board')
        .post(
            // auth, 
            async(req, res) =>{
            const customerType = req.body.customerType;
    
            try{
                await connectDB.query(`EXEC getDreamByCustomerType @customer_type= '${customerType}'`, (err, results) =>{
                    if(results.recordset.length > 0){
                        const data_ = results.recordset;
                        let eligibleWinner;
                        let data;
                        if(customerType == 'Bulkbreaker'){
                           eligibleWinner = data_.filter(e => e.accumulated_points >= 400 && e.placed_orders_count >= 10 && e.delivered_orders_count >= 20)
                           data = eligibleWinner.sort((a, b) => {
                            return b.delivered_orders_count - a.delivered_orders_count
                            })
                        }else if(customerType == 'Poc'){
                            eligibleWinner = data_.filter(e => e.accumulated_points >= 100 && e.placed_orders_count >= 20);
                            data = eligibleWinner.sort((a, b) => {
                                return b.placed_orders_count - a.placed_orders_count
                                })
                        }
                       
                        
                       return res.status(200).json({success: true, msg: 'Customers found!', data })
                    }
                    else{
                        return res.status(404).json({success: false, msg: 'Customer with code not found'})
                    }
                })
    
            }catch(err){
                res.status(500).json({success: false, err, msg: 'Server Error'})
            }
        })
    module.exports = router;