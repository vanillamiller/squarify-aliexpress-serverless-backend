// const crypt = require('./serverless-functions/auth/encryption');
// const enc = crypt.encrypt;
// const dec = crypt.decrypt;
// const text = "test test test";
// // const master = Buffer.from('KaPdSgVkYp3s6v8y/B?E(H+MbQeThWmZ', 'hex');

// const encd = enc(text);
// const decd = dec(encd);
// console.log(`before encryption: ${text}`);
// console.log(`after encryption: ${encd}`);
// console.log(`after descyption: ${decd}`);

const jwt = require('./serverless-functions/auth/jwtModule');
const payload = {foo : 'bar'};
const jwtsigned = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcXVhcmVJbmZvIjp7ImFjY2Vzc190b2tlbiI6InUwbU9WN0R2UUg5QlJkYktQdHY1UkN4blVtakwyOC9CUVEvWTdtK3pSMUV4bjNoM005R1p1T204UEZ4TXlXU1hSNXVDb092SUJub1Q3VnJCeTJMelQyZmZBMWpzTXpOK1BlYVk5MU1menEyVTBlUkhwNjJ4ZTFIUUpFUyt5cTVDYVdISTcwMklxdHBUYy9FMENPcDZkZ0Y3Tmp2aDFoa29VbjVsTmV4anhxT1MyTmZkcE1vZkFDVnJhZDR6N2tzTXBUanovZGQ3aHpoMjdkMnV4MHhxd2c9PSIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJleHBpcmVzX2F0IjoiMjAyMC0wMy0xM1QwNToyOTo1N1oiLCJtZXJjaGFudF9pZCI6IjhGMzQ5QkZCSjVGVzEiLCJyZWZyZXNoX3Rva2VuIjoiOE94dlVhOVB5Z1pweUcya2gxS2d6N0xtYVB5THAvVEswbWZSb2lhOWpsUzk4YitsSFVYbkZnOTl4emFXb0g3VTRMcU1jQWVxSlE5T2ZQWlhoZThVK2g5TzdLZTlvb0k3aWZnbGo1TUw1NWhiYlFISjQzVWhOOEtCOEVSRko1SUF4bnV4ZnBjSENIT3Q0cmxnWWQrTzhvdTJCT1J5RW5HZVpiQ0dsa1dsZlZFcFpicXJEVWpGZkg1VEhkSlpzVXViOTJUSGhZWjFoMm53cnoyd3RmbkR5UT09In0sInNjb3BlcyI6WyJpdGVtcyJdLCJpYXQiOjE1ODE0ODUzOTd9.M8uHaA4vqZjH-6P_NDlaPk5kJTLj-htVhIbzVqoKl1ynb0KoH9j-ar80pYO6ji5AFBxaOoQvfnw-kc88MvBEg9AP-VksLJrg_26-_DLjkTUieHZwIRsDm1l8FmxQ5bl8UsAeUIo2rPfvySJQ1wrBB-2n4E75oEyYZrAqkYJJB6A';
const jwtver = jwt.verify(jwtsigned);
console.log(jwtsigned);
console.log(jwtver);