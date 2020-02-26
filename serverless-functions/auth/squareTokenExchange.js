'use strict';

const https = require('https');
const jwt = require('./jwtModule');
const encrypt = require('./encryption').encrypt;

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
      // parse square response
      let responseFromSquare = JSON.parse(body);

      // encrypt Oaut2 keys before sending to client
      responseFromSquare.access_token = encrypt(responseFromSquare.access_token);
      responseFromSquare.refresh_token = encrypt(responseFromSquare.refresh_token);

      // package as jwt payload and sign
      let user = { squareInfo: responseFromSquare, scopes: scopes };
      let token = jwt.sign(user);

      // redirect to the authorization fronend redirect
      resolve({
        statusCode: 302,
        headers: {
          "Content-type": "application/json",
          "location": `https://square-459ed.web.app/#/authorize?token=${token}`
        },
        // body: JSON.stringify({'user' : user, 'token' : token})
      });
    });
  });
  req.on('error', (e) => {
    resolve({
      statusCode: 500,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ message: 'could not request access from square' })
    });
  });
  // send the request
  req.write(body);
  req.end();
});

exports.revoker = async (event, context) => await new Promise((resolve, reject) => {

  const encodedjwt = event['headers']['Authorization'];
  let decodedjwt;

  try {
    decodedjwt = jwt.verify(encodedjwt)
  } catch (e) {
    callback(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({message : 'invalid token!'})
    })
  }

  const decryptedSquareOauth2Token = decrypt(decodedjwt.squareInfo.access_token);
  params.headers.Authorization = `Bearer ${decryptedSquareOauth2Token}`;

  const body = JSON.stringify({
    "client_id": process.env.CLIENT_ID,
    "access_token": event.body.access_token
  })

  const req = https.request(params, (res) => {
    let body = '';
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      body += chunk;
    });

    res.on('end', () => {
      // parse square response
      let responseFromSquare = JSON.parse(body);
      responseFromSquare.success
        ? resolve({
          statusCode: 200,
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({message : 'success'})
        })
        : resolve({
          statusCode: 500,
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({message : 'failure'})
        })
    });
  });
  req.on('error', (e) => {
    resolve({
      statusCode: 500,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ message: 'failure' })
    });
  });
 
  req.write(body);
  req.end();
});