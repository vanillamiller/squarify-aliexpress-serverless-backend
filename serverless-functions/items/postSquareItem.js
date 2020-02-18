
'use strict';
const https = require('https');
let Item = require('./item.js').Item;
const jwt = require('../auth/jwtModule');
const decrypt = require('../auth/encryption').decrypt;

const real = "squareup";
const sandbox = "squareupsandbox";

let params = {
  host: `connect.${real}.com`,
  path: "/v2/catalog/batch-upsert",
  port: 443,
  method: "POST",
  headers: {
    "Square-Version" : "2020-01-22",
    "Content-type" : "application/json",
  }
};

exports.post = async (event, context, callback) => new Promise((resolve, reject) => {

    const itemFromEventJson = JSON.parse(event['body'])['itemFromClient'];
    const itemObject = new Item(itemFromEventJson);
    const body = JSON.stringify(itemObject.toSquareItem());
    const encodedjwt = event['headers']['Authorization'];
    let decodedjwt;

    try{
      decodedjwt = jwt.verify(encodedjwt)
    } catch(e){
      resolve({
        statusCode : 500,
        headers : {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-type' : 'application/json'
        },
        body : JSON.stringify({message : 'something went wrong with your authorization token!'})
      })
    }

    const decryptedSquareOauth2Token = decrypt(decodedjwt.squareInfo.access_token);
    params.headers.Authorization = `Bearer ${decryptedSquareOauth2Token}`;
    
    // const req = https.request(params, (res) => {
    //   let resbody = '';
    //   res.on('data', function (chunk) {
    //           resbody += chunk;
    //         });
             
    //   res.on('end', (chunk) => 
    //   resolve({statusCode : res.statusCode,
    //           headers : {
    //             'Access-Control-Allow-Origin': '*',
    //             'Access-Control-Allow-Credentials': true,
    //             'Content-type' : 'application/json'
    //           },
    //           body : resbody
    //       }));
            
    // }).on('error', (e) => {
    //   resolve({
    //     statusCode : req.statusCode,
    //     headers : {
    //       'Access-Control-Allow-Origin': '*',
    //       'Access-Control-Allow-Credentials': true,
    //       'Content-type' : 'application/json'
    //     },
    //     body : ''
    //   });
    // });
        
    // send the request
    req.write(body);
    req.end();
    // resolve({
    //   statusCode : 200,
    //   headers : {
    //                 'Access-Control-Allow-Origin': '*',
    //                 'Access-Control-Allow-Credentials': true,
    //                 'Content-type' : 'application/json'
    //               },
    //   body : JSON.stringify({
    //     event : event})
    // });
    
});
