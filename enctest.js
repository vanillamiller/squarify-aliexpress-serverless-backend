const crypt = require('./serverless-functions/auth/encryption');
const enc = crypt.encrypt;
const dec = crypt.decrypt;
const text = "hello plz work!";
const master = Buffer.from('KaPdSgVkYp3s6v8y/B?E(H+MbQeThWmZ', 'hex');

const encd = enc(text, master);
const decd = dec(encd, master);
console.log(encd);
console.log(decd);