const jwt = require('jsonwebtoken')

const createToken = (id)=>{
    return new Promise((resolve,reject)=>{
        jwt.sign({id},process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1 days'},(error,data)=>{
            if(error) {
              reject(error)
            }
            resolve(data);
        })
    })
};

module.exports = {createToken: createToken};

