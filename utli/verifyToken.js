const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token)
        });
    });
};


module.exports = {verifyToken: verifyToken}