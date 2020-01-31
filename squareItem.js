
'use strict';
const https = require('https');


const items = async (event, context) => new Promise((resolve, reject) => {
    
    const params = {
        host: "connect.squareup.com",
        path: "/v2/catalog/batch-upsert",
        port: 443,
        method: "POST",
        headers: {
          "Square-Version" : "2020-01-22",
          "Content-type" : "application/json",
          "Authorization" : "Bearer EAAAEMac37X6v1KMlcembRoSUSo9j7ncYy43T5dHEmzQ6dNx_CKIl30DaNYi8YHi"
        }
    };
    
    const body = JSON.stringify({
      "idempotency_key": "527de89d-9832-468b-a09a-c724e14ded12",
      "batches": [
        {
          "objects": [
            {
              "id": "836091d0-11e5-4089-b63e-55a1b1c59f6a",
              "type": "ITEM_OPTION",
              "item_option_data": {
                "name": "Color",
                "values": [
                  {
                    "id": "#22White",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "22White"
                    }
                  },
                  {
                    "id": "#24White",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "24White"
                    }
                  },
                  {
                    "id": "#26Gray",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "26Gray"
                    }
                  },
                  {
                    "id": "#21White",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "21White"
                    }
                  }
                ]
              }
            },
            {
              "id": "ce42d10e-b677-4d32-a66c-dda8d7e823b3",
              "type": "ITEM_OPTION",
              "item_option_data": {
                "name": "Size",
                "values": [
                  {
                    "id": "#S",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "S"
                    }
                  },
                  {
                    "id": "#M",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "M"
                    }
                  },
                  {
                    "id": "#L",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "L"
                    }
                  },
                  {
                    "id": "#XL",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "XL"
                    }
                  },
                  {
                    "id": "#XXL",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "XXL"
                    }
                  }
                ]
              }
            },
            {
              "type": "ITEM",
              "id": "#Giordano-Men-T-Shirt-Men-Short-Sleeves-3-pack-Tshirt-Men-Solid-Cotton-Mens-Tee-Summer-T-Shirt-Men-Clothing-Sous-Vetement-Homme",
              "item_data": {
                "name": "Giordano Men T Shirt Men Short Sleeves 3-pack Tshirt Men Solid Cotton Mens Tee Summer T Shirt Men Clothing Sous Vetement Homme",
                "description": "Cheap men t-shirt, Buy Quality men tees directly from China vetement homme Suppliers: Giordano Men T Shirt Men Short Sleeves 3-pack Tshirt Men Solid Cotton Mens Tee Summer T Shirt Men Clothing Sous Vetement Homme\nEnjoy ✓Free Shipping Worldwide! ✓Limited Time Sale ✓Easy Return.",
                "item_options": [
                  {
                    "item_option_id": "836091d0-11e5-4089-b63e-55a1b1c59f6a"
                  },
                  {
                    "item_option_id": "ce42d10e-b677-4d32-a66c-dda8d7e823b3"
                  }
                ]
              }
            }
          ]
        }
      ]
    });
    
    const req = https.request(params, (res) => {
            res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            resolve(chunk);
             });
            
        });
        
        req.on('error', (e) => {
          reject(e.message);
        });
        
    // send the request
    req.write(body);
    req.end();
    
});

items();