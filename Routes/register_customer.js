const express = require('express');
const connectDB = require('../Config/db');
const router = express.Router();
const randomize  = require('randomatic');
const axios = require('axios');
const auth = require('../middleware/auth');


router.route('/')
    .post(
        // auth, 
        async(req, res)=>{
        const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
        const {
            SFCode,
            dist_code,
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
            await connectDB.query(`SELECT COUNT(phoneNumber) AS count FROM cust_tb WHERE phoneNumber = '${phone}'`, async(err, results) =>{
                if(!results.recordset[0].count){
                  const result = await connectDB.request()
                  .input("distributorCode", dist_code)
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
                  if(result.recordset && result.recordset.length > 0){
                    const token = `POAPPLDMS2:Sec##urity123`;
                    const encodedToken = Buffer.from(token).toString('base64');
                    const datum = {
                        SF_Code: SFCode,
                        DIST_Code: dist_code,
                        CUST_Type: custType,
                        CUST_Name: name,
                        email: email,
                        phoneNumber: phone,
                        country: country,
                        address: address,
                        district: district,
                        region: region,
                        longitude: longitude,
                        latitude: latitude,
                        registeredOn: date,
                        status: 'new',
                        state: state
                    }
                    const data = new Array(datum);
                    const dat = {
                        Customer: data
                    }
                //    const x = await axios.post('https://sappoqa.ab-inbev.com/RESTAdapter/Customer/CustomerCreate', dat, 
                //     {  headers: {'Authorization': `Basic ${encodedToken}`, 
                //     'content-type': 'application/json'}})
                //     console.log(x);
                //     //   return res.status(200).json({success: true, msg: 'Customer registered successfully', results: result.recordset[0]});
                //     if(x){
                //         return x;
                //     }
                return res.status(200).json({success: true, msg: 'Customer registered successfully', results: result.recordset[0]});
                  }
                  else{
                    return res.status(400).json({success: false, msg: 'DMS Error', err})
                  }
                   
                }
                else{
                    return res.status(401).json({success: false, msg: 'Customer with same phone number already registered', err});
                }
            })
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server Error', err});
        }
    });


module.exports = router;





     
 


       



