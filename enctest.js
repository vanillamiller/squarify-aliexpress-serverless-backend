const crypt = require('./serverless-functions/auth/encryption');
const enc = crypt.encrypt;
const dec = crypt.decrypt;
const text = "hello plz work!";
const master = Buffer.from('z%C*F-JaNdRgUjXn2r5u8x/A?D(G+KbP', 'hex');

const encd = enc(text, master);
const decd = dec(encd, master);
console.log(encd);
console.log(decd);