'use strict';

const https = require('https');
const jwt = require('./jwtModule');
const encrypt = require('./encryption').encrypt;

const encryptionKey = Buffer.from(process.env.MASTER_KEY, 'hex');
const scopes = ['items'];
const params = {
  host: "connect.squareup.com",
  path: "/oauth2/token",
  port: 443,
  method: "POST",
  headers: {
    "Square-Version": "2019-12-17",
    "Content-type": "application/json",
    "Accept": "application/json"
  }
};

exports.authorizer = async (event, context) => await new Promise((resolve, reject) => {

  const body = JSON.stringify({
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "code": event.queryStringParameters.code,
    "grant_type": "authorization_code"
  })

  const req = https.request(params, (res) => {
    let body = '';
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      body += chunk;
    });

    res.on('end', () => {
      let responseFromSquare = JSON.parse(body);
      responseFromSquare.access_token = encrypt(responseFromSquare.access_token, encryptionKey);
      responseFromSquare.refresh_token = encrypt(responseFromSquare.refresh_token, encryptionKey);
      let user = { squareInfo: responseFromSquare, scopes: scopes };
      // TODO encrypt the oauth2 token
      // responseFromSquare.access_token = 
      resolve({
        statusCode: 200,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user)
      });
    });
  });
  req.on('error', (e) => {
    resolve({statusCode : 500,
          headers : {"Content-type" : "application/json"},
          body : JSON.stringify({message : 'could not request access from square'})});
  });
  // send the request
  req.write(body);
  req.end();
});

// const createJwt = json => jwt.sign(json, process.env.JWT_KEY, {algorithm : 'RS256'});

// const verifyJwt = token => jwt.verify