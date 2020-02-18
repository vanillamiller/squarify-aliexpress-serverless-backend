
'use strict';
const https = require('https');
let Item = require('./item.js').Item;
const jwt = require('../auth/jwtModule');
const decrypt = require('../auth/encryption').decrypt;
const FormData = require('form-data');
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

const generateSuccessResponse = (successfulItem) => ({
  statusCode: 200,
  headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-type': 'application/json'
  },
  body: JSON.stringify(successfulItem),
})

const errorResponse = {
  statusCode : 500,
  headers : {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-type' : 'application/json'
  },
  body : JSON.stringify({message : 'something went wrong with your authorization token!'})
};

const getImageType = (imageUrl) => imageUrl.split('.').pop();

const generateContentTypeHeader = (imageType) => {
  switch(imageType) {
  case 'jpg' || 'jpeg' || 'JPEG':
    return 'image/JPEG';
  case 'png' || 'PNG':
    return 'image/PNG';
  case 'gif' || 'GIF':
    return 'image/GIF';
  case 'pjpeg' || 'PJPEG':
    return 'image/PJPEG'
  default:
    throw Error('unknown image extension');
}};



exports.post = async (event, context, callback) => {

    const itemFromEventJson = JSON.parse(event['body'])['itemFromClient'];
    const itemObject = new Item(itemFromEventJson);
    const body = JSON.stringify(itemObject.toSquareItem());
    const encodedjwt = event['headers']['Authorization'];
    let decodedjwt;

    try{
      decodedjwt = jwt.verify(encodedjwt)
    } catch(e){
      callback(null, errorResponse);
    }

    const decryptedSquareOauth2Token = decrypt(decodedjwt.squareInfo.access_token);
    params.headers.Authorization = `Bearer ${decryptedSquareOauth2Token}`;
    
    const postItemToSquare = fetch(`https://connect.${real}.com/v2/catalog/batch-upsert`,
    { method : 'post',
      body : body,
      headers : params.headers
    })
    .then(
      res => res.json()
    );

    const getAliImage = fetch(itemObject.image).then(res => res.buffer());
    

    Promise.all([postItemToSquare, getAliImage])
    .then(
      ([squareRes, aliImage]) => {
        const itemIdMap = squareRes.filter(obj => obj.client_object_id === `#${itemObject.name}`)[0];
        const imageFormJson = {
          "idempotency_key": uuid(),
          "object_id": itemIdMap,
          "image":{
              "id":"#TEMP_ID",
              "type":"IMAGE",
              "image_data":{
                  "caption": itemObject.name
              }
          }
        };
        const formData = new FormData();
        formData.append('request', imageFormJson);
        formData.append('file', aliImage);

        const headers = {
          "Content-type" : generateContentTypeHeader(getImageType(itemObject.image)),
          "Content-Disposition" : `form-data; name="${itemObject.name}"; filename="${itemObject.name.strip(' ')}.${getImageType(itemObject.image).toLowerCase()}"`
        }

        fetch('https://connect.squareupsandbox.com/v2/catalog/images',
        {
          method : 'post',
          body : formData,
          headers : headers
        })
        .then(
          callback(null, generateSuccessResponse(itemObject))
        )
        .catch(
          callback(null, errorResponse)
        )
      }
    );
};
