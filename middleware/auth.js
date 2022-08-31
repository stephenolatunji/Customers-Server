const jwt = require('jsonwebtoken');
require('dotenv').config;

module.exports = (req, res, next) => {
  try {
    const key = process.env.JWT_SECRET
    let token = req.headers.authorization ||
    req.body.token || req.query.token || req.headers['x-access-token']
    token = token.split(' ')[0]
    if(token) {
      jwt.verify(token, key, (error, decoded) => {
        if(error) {
          return res.status(401).send({
            msg: 'Unauthorized user',
            error
          })
        }
        req.decoded = decoded;
        next()
      })
    }
    else{
      return res.status(401).send({
        msg: 'Access Denied, no token provided',
      })
    }
  } catch(error) {
    res.status(401).json({
     
      msg: "No Authorization Header"
    });
  }
};