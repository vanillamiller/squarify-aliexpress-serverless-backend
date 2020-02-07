
'use strict';
const https = require('https');
let Item = require('./item.js').Item;

exports.post = async (event, context, callback) => new Promise((resolve, reject) => {
    
    // callback(null, {
    //   statusCode : 200,
    //   headers : {
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-type' : 'application/json'
    //           },
    //   body : JSON.stringify(JSON.parse(event['body'])['itemFromClient'])
    // })

    const params = {
        host: "connect.squareupsandbox.com",
        path: "/v2/catalog/batch-upsert",
        port: 443,
        method: "POST",
        headers: {
          "Square-Version" : "2020-01-22",
          "Content-type" : "application/json",
          "Authorization" : "Bearer EAAAEPdYYlfwYBkeoo2re4kGfW508rVzBIkfZ-wwkt-G1C224YNCCxta_Wd6Yknk"
        }
    };
    
    
    const itemFromEventJson = JSON.parse(event['body'])['itemFromClient'];
    console.log("here is the body: event['itemFromCLient]");
    const body = JSON.stringify(Item.fromJson(itemFromEventJson).toSquareItem());
    
    const req = https.request(params, (res) => {
      let resbody = '';
      res.on('data', function (chunk) {
              resbody += chunk;
            console.log(resbody);
            });
             
      res.on('end', (chunk) => resolve({
              statusCode : 200,
              headers : {
                'Access-Control-Allow-Origin': '*',
                'Content-type' : 'application/json'
              },
              body : resbody
            }));
            
      req.on('error', (e) => {
          reject({
              statusCode : 200,
              headers : {
                'Access-Control-Allow-Origin': '*',
                'Content-type' : 'application/json'
              },
              body : resbody
            });
        });
            
    });
        
    // send the request
    req.write(body);
    req.end();
    
});
