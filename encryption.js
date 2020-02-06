const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'z%C*F-JaNdRgUjXn2r5u8x/A?D(G+KbP';
console.log(key.toString());
const iv = 'dd313462cc5f01af6e7ba5196cd96f3e'
iv = iv.hexEncode();
console.log(iv);

/**
 * 
 * @param {String} text string to be encrypted
 * @return {}
 * encrypts ouath2 keys that are sent within the jwt
 */
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

/**
 * 
 * @param {*} text 
 */
function decrypt(text) {
  const iv = Buffer.from(text.iv, 'hex');
  const encryptedText = Buffer.from(text.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const hw = encrypt('Some serious stuff');
console.log(hw);
console.log(decrypt(hw));