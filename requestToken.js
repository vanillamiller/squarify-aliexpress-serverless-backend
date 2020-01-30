var SquareConnect = require('square-connect');

var apiInstance = new SquareConnect.OAuthApi();
apiInstance.basePath = 'https://connect.squareupsandbox.com';

var body = new SquareConnect.ObtainTokenRequest(); // ObtainTokenRequest | An object containing the fields to POST for the request.  See the corresponding object definition for field details.
body.client_id = process.env.CLIENT_ID;
body.client_secret = process.env.CLIENT_SECRET;
body.code = event.queryStringParameters.code;
body.grant_type = "authorization_code";

module.exports.requestToken = (event, context, callback) => {
apiInstance.obtainToken(body).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
  callback(null, data);
}, function(error) {
  console.error(error);
});


}

