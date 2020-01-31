'use strict';

const https = require('https');


exports.authorizer = async (event, context) => new Promise((resolve, reject) => {
    
    const params = {
        host: "connect.squareupsandbox.com",
        path: "/oauth2/token",
        port: 443,
        method: "POST",
        headers: {
          "Square-Version" : "2020-01-22",
          "Content-type" : "application/json"
        }
    };
    
    const body = JSON.stringify({
      "client_id": process.env.CLIENT_ID,
      "client_secret": process.env.CLIENT_SECRET,
      "code": event.queryStringParameters.code,
      "grant_type": "authorization_code"
    })
    
    
    const req = https.request(params, (res) => {
            res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            resolve(chunk);
             });
            
        });
        
        req.on('error', (e) => {
          reject(e.message);
        });
        
    // send the request
    req.write(body);
    req.end();
    
});
