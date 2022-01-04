const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const csv = require('csvtojson');
const multer = require('multer')
const fs = require('fs');
const randomize = require('randomatic');

global.__basedir = __dirname;

const parser = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
});

const filter = (req, file, cb)=>{
    if(file.mimetype.includes('csv')){
        cb(null, true);
        return
    }
    else{
        cb("Please upload only csv file.", false);
    }
};

const upload = multer({storage: parser, fileFilter: filter});


router.route('/upload')
    .post(upload.single('file'), async(req, res) =>{
        // res.setHeader('Content-Type', 'multipart/form-data');
        try{
            if(req.file == undefined){
                return res.status(400).json({success: false, msg: 'Please upload a CSV file'});
            }
          else {  let filePath = __basedir + '/uploads/' + req.file.filename;
            var nonExistingUser = 0;
           
            const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
            const dataArray = await csv().fromFile(filePath);
            for(let i = 0; i < dataArray.length; i++){
               const singleData = dataArray[i];
               const compName = singleData.customer_name.toString();
               const sysproCode = singleData.SYS_Code.toString();
               const salesforceCode = singleData.SF_Code.toString();
               const district = singleData.district.toString();
               const state = singleData.state.toString();
               const region = singleData.region.toString();
               const type = singleData.customer_type.toString(); 
               const email = singleData.email.toString();
               const Owner_Phone = singleData.Owner_Phone.toString();
               const lat = singleData.lat.toString();
               const long = singleData.long.toString();
               const address = singleData.address.toString();  
               const country = singleData.country.toString(); 
               
               const random = randomize('0', 4);
               const split_name = compName.slice(0, 3).toUpperCase();
               const split_type = type.charAt(0).toUpperCase();

               const code = `${split_type}${split_type}${split_name}${random}`;
                
                await connectDB.query(`SELECT COUNT(SF_Code) AS count FROM cust_tb WHERE SF_Code = '${salesforceCode}'`, async(err, result)=>{
                    nonExistingUser += result.recordset[0].count ? 0 : 1
                    
                    if(!result.recordset[0].count){
                        await connectDB.query(
                            `INSERT INTO cust_tb (DIST_Code, BB_Code, SF_code,
                            CUST_type, CUST_Name, country, email, status, district,
                            region, address, phoneNumber, latitude, longitude, registeredOn, state)
                            VALUES('${sysproCode}', '${code}', '${salesforceCode}', '${type}', '${compName}', '${country}',
                            '${email}','Active', '${district}', '${region}', '${address}', 
                            '${Owner_Phone}', '${lat}', '${long}', '${date}', '${state}')`, (err, result) =>{
                                if(err){
                                   return res.status(400).json({success: false, msg: 'Can not register customers', err});
                                }
                                else{
                                   if(i == dataArray.length -1){
                                    fs.unlink(filePath,()=>{
                                        res.status(200).json({success: true, msg: `${nonExistingUser} ${ nonExistingUser > 1 ? 'customers' : 'customer'}  registration successful. ${dataArray.length - nonExistingUser} were already registered`});
                                    },err =>{
                                        res.status(500).json({success: false, msg: `Uploaded but file no delete ooo!!! ${err}`});
                                    }
                                    )
                                 
                                   }
                                }
                            }
            
                            )
                    }else{
                        if(i == dataArray.length -1){
                            fs.unlink(filePath,()=>{
                                res.status(200).json({success: true, msg: `${nonExistingUser} ${ nonExistingUser > 1 ? 'customers' : 'customer'}  registration successful. ${dataArray.length - nonExistingUser} were already registered`});
                            },err =>{
                                res.status(500).json({success: false, msg: `Uploaded but file no delete ooo!!! ${err}`});
                            }
                            )
                         
                           }
                    }
                    
                })
           
           }}
            
        }
        catch(err){
            res.status(500).json({success: false, err, msg: 'Server error'})
        }
    })

module.exports = router;  
