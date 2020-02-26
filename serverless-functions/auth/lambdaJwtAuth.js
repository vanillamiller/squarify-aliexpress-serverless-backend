'use strict'
const jwt = require('./jwtModule.js');

/**
 * @param {JSON} event an AWS proxy event forwarded from lambdaJwtAuthorizer
 * @returns {JSON} policyDocument in line with aws policy document standards
 */
exports.handler = async function (event) {
    // get token from authorization header
   const token = event.authorizationToken;

   // must grant permission to all routes as AWS cache and return this arn
   // and not any other in resulting calls... can set TTL to 0, however this
   // is against best performance best practices according to AWS
   const methodArn = 'arn:aws:execute-api:xxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxx/*';

    // if there is a token attached
     if(token!==undefined){
        try{
            // attemt to decode token and verify payload
            const decoded = jwt.verify(token);
            // if includes correct scope
            if(decoded.scopes.includes('items')){
                // sets user as square merchant
                let user = decoded.squareInfo.merchant_id;
                // generate allowing response
                return generateAuthResponse(user, 'Allow', methodArn);
            }
     } catch(e){
         // otherwise deny access
         return generateAuthResponse('user', 'Deny', methodArn);
     }}
     // if there is no token attached also deny access
     return generateAuthResponse('user', 'Deny', methodArn);
}

/**
 * 
 * @param {String} principalId the user
 * @param {String} effect allow or deny access
 * @param {String} methodArn path to allowed api endpoints
 */
function generateAuthResponse(principalId, effect, methodArn) {
   const policyDocument = generatePolicyDocument(effect, methodArn);

   return {
       principalId,
       policyDocument
   }
}

/**
 * 
 * @param {String} effect allow or deny 
 * @param {String} methodArn envokable api endpoints 
 */
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
