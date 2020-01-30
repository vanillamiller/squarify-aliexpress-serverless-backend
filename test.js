// var https = require('https');

// const handler = async => new Promise((resolve, reject) => {
    
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
//       client_id: "sandbox-sq0idb-9-aHuRqCAFAbgjNyoQy9RA",
//       client_secret: "EAAAEEw-vZSlXxMwsy3QpWwRFqyj6Rhda3wgMDj62JLe3zSMlS2bfhfQTrZ4e15Q",
//       code: "sandbox-sq0cgb-aftZO3Bx3VNz4RC1rsTNuA",
//       grant_type : "authorization_code"
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

// handler();

let t = { hello : 'bye'};
t.g = null;

console.log(t);