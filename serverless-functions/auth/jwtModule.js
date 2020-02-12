const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync(__dirname + '/keys/public.key');
const privateKey = fs.readFileSync(__dirname + '/keys/private.key');
module.exports = {
    verify : (token) => jwt.verify(token, publicKey),
    sign : (payload) => jwt.sign(payload, privateKey, {algorithm : 'RS256'})
}