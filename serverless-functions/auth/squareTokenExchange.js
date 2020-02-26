'use strict';
const https = require('https');
const jwt = require('./jwtModule');
const encrypt = require('./encryptionModule').encrypt;

// scopes that will be added to doc allows items read and write
const scopes = ['items'];
// parameters needed from Square token endpoint
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

/**
 * @param {JSON} event AWS Lambda proxy event
 * @returns {JSON} AWS Lambda proxy response
 */
exports.handler = async (event, context) => await new Promise((resolve, reject) => {

  // Construct and serialize request body
  const body = JSON.stringify({
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "code": event.queryStringParameters.code,
    "grant_type": "authorization_code"
  })

  /**
   * @param {JSON} params url, extension and headers for https request
   * @returns {JSON} Lambda proxy response 
   */
  const req = https.request(params, (res) => {
    // initialize empty string
    let body = '';
    // append response data packet to body on data event
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      body += chunk;
    });

    // on request close 
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

