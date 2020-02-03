// let crypto = require('crypto');

// class Crypto {

//     constructor() {
//         this.key = process.env.AES_KEY;
//         this.ivLength = 16;
//         this.cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//         this.decipher = crypto.createDecipher('aes-192-ccm', "process.env.ENC_KEY");
//     }

//     encrypt(thing) {
//         // let iv = crypto.randomBytes(ivLength);
//         // let cipher = 
//         // let encrypted = cipher.update(text);

//         // encrypted = Buffer.concat([encrypted, cipher.final()]);

//         // return iv.toString('hex') + ':' + encrypted.toString('hex');
//     };
//     decrypt(encryptedThing) {
//         let textParts = text.split(':');
//         let iv = Buffer.from(textParts.shift(), 'hex');
//         let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//         let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//         let decrypted = decipher.update(encryptedText);

//         decrypted = Buffer.concat([decrypted, decipher.final()]);

//         return decrypted.toString();
//     }
// }

// let c = new Crypto();
// let enc = c.encrypt('hello miller!');
// let dec = c.decrypt(enc);


// console.log(enc);
// console.log(dec);