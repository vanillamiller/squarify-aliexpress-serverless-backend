const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync(__dirname + '/keys/public.key');
const privateKey = fs.readFileSync(__dirname + '/keys/private.key');
module.exports = {
    /** 
     * verifies jwt and decodes its payload
     * @param {String} token encoded and signed jwt
     * @returns {JSON} the decoded jwt payload
     * @throws if token is not signed with private key
    */
    verify : (token) => jwt.verify(token, publicKey),
    /**
     * signs and encodes json payload
     * @param {JSON} payload is the JSON session info to encode and sign
     * @returns {String} encoded and signed jwt
     * 
     */
    sign : (payload) => jwt.sign(payload, privateKey, {algorithm : 'RS256'})
}