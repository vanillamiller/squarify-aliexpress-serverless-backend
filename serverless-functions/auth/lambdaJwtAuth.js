'use strict'
const jwt = require('./jwtModule.js');

exports.handler = async function (event) {
   const token = event.authorizationToken;
   const methodArn = 'arn:aws:execute-api:xxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxx/*';
     if(token!==undefined){
        try{
            const decoded = jwt.verify(token);
            if(decoded.scopes.includes('items')){
                let user = decoded.squareInfo.merchant_id;
                return generateAuthResponse(user, 'Allow', methodArn);
            }
     } catch(e){
         return generateAuthResponse('user', 'Deny', methodArn);
     }}
     return generateAuthResponse('user', 'Deny', methodArn);
}

function generateAuthResponse(principalId, effect, methodArn) {
   const policyDocument = generatePolicyDocument(effect, methodArn);

   return {
       principalId,
       policyDocument
   }
}

function generatePolicyDocument(effect, methodArn) {
   if (!effect || !methodArn) return null

   const policyDocument = {
       Version: '2012-10-17',
       Statement: [{
           Action: 'execute-api:Invoke',
           Effect: effect,
           Resource: methodArn
       }]
   };

   return policyDocument;
}

exports.test = async function(event) {
    // const foo = event['headers']['Authorization'];
    const res = {
        statusCode : 200,
        headers : {"Content-type" : "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,},
        body : JSON.stringify(event)
    };
    return res;
}