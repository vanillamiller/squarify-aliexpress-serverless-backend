
'use strict';
const fetch = require('node-fetch')
let Item = require('./serverless-functions/items/item').Item;
const jwt = require('./serverless-functions/auth/jwtModule');
const decrypt = require('./serverless-functions/auth/encryption').decrypt;
const uuid = require('uuid');
const FormData = require('form-data');
const real = "squareup";
const sandbox = "squareupsandbox";


let params = {
  host: `connect.${real}.com`,
  path: "/v2/catalog/batch-upsert",
  port: 443,
  method: "POST",
  headers: {
    "Square-Version": "2020-01-22",
    "Content-type": "application/json",
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
  statusCode: 500,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-type': 'application/json'
  },
  body: JSON.stringify({ message: 'something went wrong with your authorization token!' })
};

const getImageType = (imageUrl) => imageUrl.split('.').pop();

const generateContentTypeHeader = (url) => {
  switch (getImageType(url)) {
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
  }
};

const post = async (event) => {

  const itemFromEventJson = JSON.parse(event['body'])['itemFromClient'];
  const itemObject = new Item(itemFromEventJson);
  const body = JSON.stringify(itemObject.toSquareItem());
  const encodedjwt = event['headers']['Authorization'];
  let decodedjwt;

  try {
    decodedjwt = jwt.verify(encodedjwt)
  } catch (e) {
    console.log(e)
  }

  const decryptedSquareOauth2Token = decrypt(decodedjwt.squareInfo.access_token);
  params.headers.Authorization = `Bearer ${decryptedSquareOauth2Token}`;

  const postItemToSquare = fetch(`https://connect.${real}.com/v2/catalog/batch-upsert`,
    {
      method: 'post',
      body: body,
      headers: params.headers
    })
    .then(res => res.json())

  const getAliImage = fetch(itemObject.image).then(res => res.buffer());

  Promise.all([postItemToSquare, getAliImage])
    .then(
      ([squareResponse, aliImage]) => {
        console.log('++++++++++++++++ Square Json +++++++++++++++++++++');
        console.log(`the name is ${itemObject.name}`)
        console.log(squareResponse);
        const itemId = squareResponse.objects.filter(obj => obj.type === 'ITEM')[0].id;
        // const itemId = squareResponse.id_mappings.filter(obj => obj.client_object_id === `#${itemObject.name}`)[0];

        console.log('++++++++++++++++ ItemId +++++++++++++++++++++');
        console.log(itemId);
        const imageFormJson = {
          "idempotency_key": uuid(),
          "object_id": itemId,
          "image": {
            "id": "#TEMP_ID",
            "type": "IMAGE",
            "image_data": {
              "caption": itemObject.name
            }
          }
        };

        let form = new FormData();

        form.append('request', JSON.stringify(imageFormJson),
          {
            contentType: 'application/json'
          });

        form.append('image', aliImage,
          {
            contentType: 'image/jpeg',
            filename: 'test.jpg'
          });

        fetch('https://connect.squareup.com/v2/catalog/images',
          {
            method: 'post',
            body: form,
            headers: {
              "Content-type": `multipart/form-data;boundary="${form.getBoundary()}"`,
              "Accept": "application/json",
              "Authorization": `Bearer ${decryptedSquareOauth2Token}`,
              "Square-Version": "2020-01-22",
            }
          })
          .then(
            res => res.json()
          )
          .then(json => console.log(json))
          .catch(
            err => console.log(err)
          )
      }
    ).catch(err => console.log(err));
};

const mockEvent = {
  headers: {
    Authorization: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcXVhcmVJbmZvIjp7ImFjY2Vzc190b2tlbiI6IlBGQXdJNVdFWDlaZStLNlNrMWd1eC9YeEVuUytVOGlFWGpIZkN5YzNCbFJ2UkIzL1k3b3krVktqK09vQVY2TnorbytnR0krZG1RTFVpelo1Qk9BcnFHVUg2K1NPdHJMUXF5NVJiMW1ZbGlrK1lGRTNoSnYwckJtV2diTGtWa2JuYzR6NTgzaXdzblRGczRCbW1XLy9KUGt4eEZZbVA5SkRnZUJtQXJtd3VGMnBCekFhRXdGYzFuVE81a1I4STRkbzRIY0s4NVJHQmFQcUhTcDVHRG5hOVE9PSIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJleHBpcmVzX2F0IjoiMjAyMC0wMy0xOVQxMTozNjoxNloiLCJtZXJjaGFudF9pZCI6IjhGMzQ5QkZCSjVGVzEiLCJyZWZyZXNoX3Rva2VuIjoibmJETGpraUxYM1JieVl5OHBLTERYS2s2QjFnbmdCWE9Ib1hodStTa2pQajhiNHU2NnFBUktucXRJUDhtZzBEODlYNmt6S3B1Z1dJMldYNlY0UUp0K0Mvb0Q5Z1ltZWFRWGR5MTRJRVJTRkZkM3NoeDk4UENxdTBCRnVvQTN5dmZoTml0MDIrVTNaU2Evb0dhanh4VXgya2RLdys5UGpUS1huYnljNnFZTVp2TGNYaWc1NEVnZStRZ2dUMmlOeGVoZjYwZkVDb0t6bStkYldNL3oyd3dXdz09In0sInNjb3BlcyI6WyJpdGVtcyJdLCJpYXQiOjE1ODIwMjU3NzZ9.hQh_NMb7lxQT3avnmGquycGUlVqdl-pzgxuuracRv50exgbrwMQhSXJe8n8lrI7QPPMUtX3kOKj4BIVCzMYu7Wp5QZa3Q4wz8x6FXXxHviP_b7CRtZ7HTXloKhrjZesq38lMKQGvnOZnZ6q9uwnhQ_9gSD5Thf4gIhfeAHC_SaQ"
  },
  body: JSON.stringify({
    itemFromClient: {
      "id": 4000386069867,
      "name": "this is a test",
      "desc": "Online Shopping at a cheapest price for Automotive, Phones & Accessories, Computers & Electronics, Fashion, Beauty & Health, Home &          Garden, Toys & Sports, Weddings & Events and more; just about anything else    Enjoy âFree Shipping Worldwide! âLimited Time SaleÂ âEasy Return.",
      "image": "https://ae01.alicdn.com/kf/U3accc565725946589bf671efa40218c4U/AUN-LED-HD-Projector-D60-1280x720P-Resolution-Support-3D-video-Beamer-Home-Cinema-Optional-Android-WIFI.jpg",
      "options": [
          {
              "name": "Ships From",
              "values": [
                  {
                      "name": "China"
                  },
                  {
                      "name": "United States"
                  },
                  {
                      "name": "Spain"
                  },
                  {
                      "name": "Australia"
                  },
                  {
                      "name": "Russian Federation"
                  },
                  {
                      "name": "France"
                  },
                  {
                      "name": "Italy"
                  }
              ]
          },
          {
              "name": "Color",
              "values": [
                  {
                      "name": "D60"
                  },
                  {
                      "name": "D60S"
                  }
              ]
          }
      ]
  }})
};


const postImg = async () => {

  let decodedjwt;
  try {
    decodedjwt = jwt.verify("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcXVhcmVJbmZvIjp7ImFjY2Vzc190b2tlbiI6IldxNWpxZmY5T0k5cEhETEQ3WXVlSEN3T0twUWw3UTVqRjJwY2MzQXZBRm0zYy9rNjdKRkMxU0UvTDY3NEZ5UzRYR3dZQnd3dFJEUjFQVXJ3eWVUS3VYd0NTaFZiVS9hM0cvU3dsQmdIT05qNHpnS29SY0pNbVRwUG1Cc0pRcTVzZmFlZXQwKzRrckNBV2JnRHFNdi9XVlY4QmlzK1dObndtWXpOUGRTV3FKM282NGJWL08wRUZxbm43dmYwOWVDUlZhNHkxU0VROU4rSnM0RWpzTHZTdVE9PSIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJleHBpcmVzX2F0IjoiMjAyMC0wMy0xOVQyMjowNjozNloiLCJtZXJjaGFudF9pZCI6IjhGMzQ5QkZCSjVGVzEiLCJyZWZyZXNoX3Rva2VuIjoiNnBzMWdvSzdxWHFKcFNjSUVVb29HRCtyUGhGVTVsZ3pFMkxPMmo0SXl6M3lobVcxK01xNDMzMXZlSVdkaXpGUFRuRVpmeGFrQ0RqL2x1dEV5Tm91djJZbElrN014ZHBqQzBta3dvMHVZeFlpN3BEczhhc2R4SWllVGo1N0NDRTZtWTZTSGxxSHY2RWpTMjZzL013VGtRRmlkcVNIL3dVTUJzRHZ6NE1WSjJZK0RyVEkyWkV4Ym1jRnZVQlRBZmQxVytJSHBvaU5acnQ1NXp4K041anVsQT09In0sInNjb3BlcyI6WyJpdGVtcyJdLCJpYXQiOjE1ODIwNjM1OTZ9.Vgdnl91zRfsgyYm_PcVk-YIQRRAhsIHgkN867rrXbTx_MB7C3ZuOX1vks-yk5k0aAdaC_0W6IPt4F30YQI2FYuyZR1Gx7laAchnWLll9ywhwtu1G_QmGvr6MX2KcrO1ERwBrUAkBOH73M3fRW9h3DrB2w4JpuU-PkNGOx2LUbKc")
  } catch (e) {
    console.log("++++++++++++++++++++++++++++++++++ COULDNT DECODE +++++++++++++++++++")
  }

  const decryptedSquareOauth2Token = decrypt(decodedjwt.squareInfo.access_token);
  console.log('++++++++++++++++++++ TOKEN +++++++++++++++++++++');
  console.log(decryptedSquareOauth2Token);
  const itemId = "2ZMIH3XBXQDKQCXD7JV7SR6W";
  const itemName = "testname"
  const caption = "test test test"
  const imageUrl = "https://ae01.alicdn.com/kf/HTB1Ko3lX.z1gK0jSZLeq6z9kVXaa/Original-Razer-DeathAdder-Essential-Wired-Gaming-Mouse-Mice-6400DPI-Optical-Sensor-5-Independently-Buttons-For-Laptop.jpg"
  const imageFormJson = {
    "idempotency_key": uuid(),
    "object_id": itemId,
    "image": {
      "id": "#TEMP_ID",
      "type": "IMAGE",
      "image_data": {
        "caption": caption
      }
    }
  };

  const aliImage = await fetch(imageUrl).then(res => res.buffer())


  let form = new FormData();

  form.append('request', JSON.stringify(imageFormJson),
    {
      contentType: 'application/json'
    });

  form.append('image', aliImage,
    {
      contentType: 'image/jpeg',
      filename: 'test.jpg'
    });

  console.log(form);

  fetch('https://connect.squareup.com/v2/catalog/images',
    {
      method: 'post',
      body: form,
      headers: {
        "Content-type": `multipart/form-data;boundary="${form.getBoundary()}"`,
        "Accept": "application/json",
        "Authorization": `Bearer ${decryptedSquareOauth2Token}`,
        "Square-Version": "2020-01-22",
      }
    })
    .then(
      res => res.json()
    )
    .then(json => console.log(json))
    .catch(
      err => console.log(err)
    )
}

post(mockEvent);




// const he = {"Content-Disposition": `form-data; name="${itemName}"; filename="${itemName}.${getImageType(imageUrl).toLowerCase()}"` }

  // form.submit({
  //   host: 'connect.squareupsandbox.com',
  //   path: '/v2/catalog/images',
  //   headers: {
  //     "Content-type": `multipart/form-data;boundary="${form.getBoundary()}"`,
  //     "Accept" : "application/json",
  //     "Authorization" : `Bearer ${decryptedSquareOauth2Token}`,
  //     "Square-Version":  "2020-01-22",
  //     "Cache-Control": "no-cache"
  //   }
  // }, function(err, res) {
  //   if(res != undefined){
  //   console.log('response status is : ' + res.statusCode);
  //   console.log('body is : ' + res)}
  //   else
  //   {console.log('error? : ' + err)}
  // });