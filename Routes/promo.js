const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();

router.route('/create-dream')
    .post(async(req, res) =>{
        const BB_Code = req.body.BB_Code;
        const dreamName = req.body.dreamName;
        const dreamPoint = req.body.dreamPoint;
        const dreamDuration = req.body.dreamDuration;
        const country = req.body.country;
        // const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
        const date = new Date(new Date().getTime() ).toISOString();

        try{
            await connectDB.query(`EXEC createDream @country = '${country}', @BB_Code = '${BB_Code}',
            @dreamName = '${dreamName}', @dreamPoint = ${dreamPoint}, @dreamDuration = ${dreamDuration},
            @date = '${date}'`, (err, result) =>{
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
    .post(async(req, res) =>{
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
        .patch(async(req, res) =>{
            const BB_Code = req.body.BB_Code;
            const points = req.body.points;
            const country = req.body.country;

            try{
                await connectDB.query(`EXEC getMyDream @BB_Code = '${BB_Code}', @country = '${country}'`, async(err, results) =>{
                    if(results.recordset.length > 0){
                        let accumPoint = results.recordset[0].accumulated_points;
                        accumPoint = parseInt(points + accumPoint)
                        await connectDB.query(`EXEC updateDreamPoints @BB_Code = '${BB_Code}', @points = ${accumPoint}`, (err, result) =>{
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
    module.exports = router;