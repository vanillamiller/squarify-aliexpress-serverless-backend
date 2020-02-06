
'use strict';
const https = require('https');
let Item = require('./item.js').Item;
const json = require('./fromnet.json');

const post = async (event, context) => new Promise((resolve, reject) => {
    
    const params = {
        host: "connect.squareupsandbox.com",
        path: "/v2/catalog/batch-upsert",
        port: 443,
        method: "POST",
        headers: {
          "Square-Version" : "2020-01-22",
          "Content-type" : "application/json",
          "Authorization" : "Bearer EAAAENsJsS5blWbXBwJJqMB97a6teeX8y2JxuBjMO35HZuXUSlN5bIPnqFn1MhJp"
        }
    };
    
    const body = JSON.stringify(Item.fromJson(json).toSquareItem());
    console.log(body);
    
    const req = https.request(params, (res) => {
      let resbody = '';
            res.on('data', function (chunk) {
              resbody += chunk;
            console.log(resbody);
            resolve(resbody);
             });
            
        });
        
        req.on('error', (e) => {
          reject(e.message);
        });
        
    // send the request
    req.write(body);
    req.end();
    
});

post();