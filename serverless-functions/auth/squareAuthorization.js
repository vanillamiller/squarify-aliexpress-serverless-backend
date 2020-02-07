'use strict';

const https = require('https');
const jwt = require('jsonwebtoken');
class Token {

}

exports.authorizer = async (event, context) => new Promise((resolve, reject) => {
    
    const scopes = ['items'];
    const params = {
        host: "connect.squareup.com",
        path: "/oauth2/token",
        port: 443,
        method: "POST",
        headers: {
          "Square-Version" : "2019-12-17",
          "Content-type" : "application/json",
          "Accept" : "application/json"
        }
    };
    
    const body = JSON.stringify({
      "client_id": process.env.CLIENT_ID,
      "client_secret": process.env.CLIENT_SECRET,
      "code": event.queryStringParameters.code,
      "grant_type" : "authorization_code"
    })
    
    const req = https.request(params, (res) => {
            let body = '';
            res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            body += chunk;
             });
            
             res.on('end', () => {
              let responseFromSquare = JSON.parse(body);
              let user = {squareInfo : responseFromSquare, scopes : scopes};
              // TODO encrypt the oauth2 token
              // responseFromSquare.access_token = 
              resolve({
                statusCode : 200,
                headers : {
                  "Content-type" : "application/json",
                },
                body : JSON.stringify(user)
              });
            });
        });
        
        

        req.on('error', (e) => {
          reject({e});
        });
        
    // send the request
    req.write(body);
    req.end();
    
});

// const createJwt = json => jwt.sign(json, process.env.JWT_KEY, {algorithm : 'RS256'});

// const verifyJwt = token => jwt.verify