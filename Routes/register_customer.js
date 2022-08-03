const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const randomize  = require('randomatic');


router.route('/')
    .post(async(req, res)=>{
        const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
        const {
            SFCode,
            distCode,
            custType,
            name, 
            email,
            phone,
            country,
            address,
            district,
            state,
            region,
            longitude,
            latitude,
        } = req.body;
        const random = randomize('0', 4);
            const split_name = name.slice(0, 3).toUpperCase();
            const split_type = custType.charAt(0).toUpperCase();

            const code = `${split_type}${split_type}${split_name}${random}`;
        try{
            // await connectDB.query(`EXEC selectCountSFCode @salesforceCode = '${SFCode}'`, async(err, results) =>{
            //     if(!results.recordset[0]['']){
                  const result = await connectDB.request()
                  .input("distributorCode", distCode)
                  .input("salesforceCode", SFCode)
                  .input("customerType", custType)
                  .input("customerName", name)
                  .input("customerCode", code)
                  .input("email", email)
                  .input("phoneNumber", phone)
                  .input("country", country)
                  .input("district", district)
                  .input("state", state)
                  .input("region", region)
                  .input("address", address)
                  .input("lat", latitude)
                  .input("long", longitude)
                  .input("registeredOn", date)
                  .execute("registerCustomer");
                    console.log(result);
                  if(result.recordset && result.recordset.length > 0){
                    return res.status(401).json({success: true, msg: 'Customer registered successfully', results: result.recordset[0]});
                  }
                  else{

                  }
                   
            //     }
            //     else{
            //         return res.status(401).json({success: false, msg: 'Customer already registered', err});
            //     }
            // })
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    });

// router.route('/one-off-customer')
//     .post(async(req, res)=>{
//         const {distCode, name, phone, country, email, address} = req.body;
//         const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();

//         try{
//             await connectDB.query(`SELECT COUNT(email) AS count FROM one_off_customer_tb WHERE email = '${email}'`, async(err, results)=>{
//                 if(!results.recordset[0].count){
//                     await connectDB.query(`INSERT INTO one_off_customer_tb (DIST_Code, 
//                         CUST_Name, phoneNumber, email, country, address,
//                         status, registeredOn) VALUES('${distCode}', '${name}', '${phone}',
//                         '${email}', '${country}', '${address}', 'New', '${date}')`, async(err, results)=>{
//                             if(results.rowsAffected > 0){
//                                 await connectDB.query(`SELECT * FROM one_off_customer_tb WHERE email = '${email}'`, (err, results) => {
//                                     if(results.recordset.length > 0){
//                                         res.status(200).json({success: true, msg: 'Successfully registered', result: results.recordset[0]})
//                                     }
//                                     else{
//                                         res.status(400).json({success: false, msg: 'Could not find newly registered customer', err});
//                                     }
//                                 })
//                             }
//                             else{
//                                 res.status(500).json({success: false, msg: 'Customer was not registered', err});
//                             }
//                         })
//                 }
//                 else{
                    

//                      res.status(400).json({success: false, msg: 'You have already registered this customer', err});
     
//                 }
//             })
//         }
//         catch(err){
//             res.status(500).json({success: false, msg: 'Server Error', err});
//         }
//     })

module.exports = router;





     
 


       



