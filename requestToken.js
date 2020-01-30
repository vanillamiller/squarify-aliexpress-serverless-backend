// // var SquareConnect = require('square-connect');

// // var apiInstance = new SquareConnect.OAuthApi();
// // apiInstance.basePath = 'https://connect.squareupsandbox.com';

// // var body = new SquareConnect.ObtainTokenRequest(); // ObtainTokenRequest | An object containing the fields to POST for the request.  See the corresponding object definition for field details.
// // body.client_id = process.env.CLIENT_ID;
// // body.client_secret = process.env.CLIENT_SECRET;
// // body.code = event.queryStringParameters.code;
// // body.grant_type = "authorization_code";

// // module.exports.requestToken = (event, context, callback) => {
// // apiInstance.obtainToken(body).then(function(data) {
// //   console.log('API called successfully. Returned data: ' + data);
// //   callback(null, data);
// // }, function(error) {
// //   console.error(error);
// //   callback(null, error);
// // });


// // }

// var https = require('https');


// exports.handler = async (event, context) => new Promise((resolve, reject) => {
    
//     const params = {
//         host: "connect.squareupsandbox.com",
//         path: "/oauth2/token",
//         port: 443,
//         method: "POST",
//         headers: {
//           "Square-Version" : "2020-01-22",
//         }
//     };
    
//     const body = JSON.stringify({
//       "client_id": process.env.CLIENT_ID,
//       "client_secret": process.env.CLIENT_SECRET,
//       "code": event.queryStringParameters.code,
//       "grant_type": "authorization_code"
//     })
    
    
//     const req = https.request(params, (res) => {
//             res.on('data', function (chunk) {
//             console.log('BODY: ' + chunk);
//             resolve(chunk);
//              });
            
//         });
        
//         req.on('error', (e) => {
//           reject(e.message);
//         });
        
//     // send the request
//     req.write(body);
//     req.end();
    
// });
