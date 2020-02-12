// const crypt = require('./serverless-functions/auth/encryption');
// const enc = crypt.encrypt;
// const dec = crypt.decrypt;
// const text = "EAAAENsJsS5blWbXBwJJqMB97a6teeX8y2JxuBjMO35HZuXUSlN5bIPnqFn1MhJp";
// const master = Buffer.from('KaPdSgVkYp3s6v8y/B?E(H+MbQeThWmZ', 'hex');

// const encd = enc(text, master);
// const decd = dec(encd, master);
// console.log(`before encryption: ${text}`);
// console.log(`after encryption: ${encd}`);
// console.log(`after descyption: ${decd}`);

const jwt = require('./serverless-functions/auth/jwtModule');
const payload = {foo : 'bar'};
const jwtsigned = jwt.sign(payload);
const jwtver = jwt.verify(jwtsigned);
console.log(jwtsigned);
console.log(jwtver);