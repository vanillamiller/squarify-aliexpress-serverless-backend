
'use strict';
const https = require('https');


const items = async (event, context) => new Promise((resolve, reject) => {
    
    const params = {
        host: "connect.squareupsandbox.com",
        path: "/v2/catalog/batch-upsert",
        port: 443,
        method: "POST",
        headers: {
          "Square-Version" : "2020-01-22",
          "Content-type" : "application/json",
          "Authorization" : "Bearer EAAAEEw-vZSlXxMwsy3QpWwRFqyj6Rhda3wgMDj62JLe3zSMlS2bfhfQTrZ4e15Q"
        }
    };
    
    const body = JSON.stringify({
        "idempotency_key": "13059341-4d20-4cbe-be14-3ae13e562b8f",
        "batches": [
          {
            "objects": [
              {
                "id": "#Color",
                "type": "ITEM_OPTION",
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
              },
              {
                "id": "#Size",
                "type": "ITEM_OPTION",
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
              },
              {
                "type": "ITEM",
                "id": "#Giordano-Men-T-Shirt-Men-Short-Sleeves-3-pack-Tshirt-Men-Solid-Cotton-Mens-Tee-Summer-T-Shirt-Men-Clothing-Sous-Vetement-Homme",
                "item_data": {
                  "name": "Giordano Men T Shirt Men Short Sleeves 3-pack Tshirt Men Solid Cotton Mens Tee Summer T Shirt Men Clothing Sous Vetement Homme",
                  "description": "Cheap men t-shirt, Buy Quality men tees directly from China vetement homme Suppliers: Giordano Men T Shirt Men Short Sleeves 3-pack Tshirt Men Solid Cotton Mens Tee Summer T Shirt Men Clothing Sous Vetement Homme\nEnjoy ✓Free Shipping Worldwide! ✓Limited Time Sale ✓Easy Return.",
                  "item_options": [
                    {
                      "item_option_id": "#Color"
                    },
                    {
                      "item_option_id": "#Size"
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