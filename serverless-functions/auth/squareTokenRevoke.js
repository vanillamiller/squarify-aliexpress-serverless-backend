'use strict';

const https = require('https');
const jwt = require('./jwtModule');
const decrypt = require('./encryption').decrypt;

const params = {
    host: "connect.squareup.com",
    path: "/oauth2/revoke",
    port: 443,
    method: "POST",
    headers: {
        "Square-Version": "2019-12-17",
        "Content-type": "application/json",
        "Accept": "application/json",
        "Authorization": `Client ${process.env.CLIENT_SECRET}`
    }
};

exports.handler = async (event, context) => await new Promise((resolve, reject) => {

    const encodedjwt = event['headers']['Authorization'];
    console.log('++++++++++++++++++++++++ encoded jwt' + encodedjwt);
    let decodedjwt;

    try {
        decodedjwt = jwt.verify(encodedjwt)
    } catch (e) {
        resolve({
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ message: 'invalid token!' })
        })
    }

    const decryptedSquareOauth2Token = decrypt(decodedjwt.squareInfo.access_token);

    const body = JSON.stringify({
        "access_token": decryptedSquareOauth2Token,
        "client_id": process.env.CLIENT_ID
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
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ message: 'success' })
                })
                : resolve({
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ message: 'failure' })
                })
        });
    });
    req.on('error', (e) => {
        resolve({
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ message: 'failure' })
        });
    });

    req.write(body);
    req.end();
});