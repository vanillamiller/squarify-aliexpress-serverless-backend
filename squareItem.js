
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
          "Authorization" : "Bearer EAAAENsJsS5blWbXBwJJqMB97a6teeX8y2JxuBjMO35HZuXUSlN5bIPnqFn1MhJp"
        }
    };
    
    const body = JSON.stringify({
      "idempotency_key": "5d804d57-aa7c-45cf-bf94-a6fa96a6afde",
      "batches": [
        {
          "objects": [
            {
              "id": "#Color",
              "type": "ITEM_OPTION",
              "item_option_data": {
                "name": "Color",
                "values": [
                  {
                    "id": "#DM-601",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-601"
                    }
                  },
                  {
                    "id": "#DM-602",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-602"
                    }
                  },
                  {
                    "id": "#DM-629",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-629"
                    }
                  },
                  {
                    "id": "#DM-606",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-606"
                    }
                  },
                  {
                    "id": "#DM-613",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-613"
                    }
                  },
                  {
                    "id": "#DM-615",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-615"
                    }
                  },
                  {
                    "id": "#DM-633",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-633"
                    }
                  },
                  {
                    "id": "#DM-616",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-616"
                    }
                  },
                  {
                    "id": "#DM-617",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-617"
                    }
                  },
                  {
                    "id": "#DM-630",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-630"
                    }
                  },
                  {
                    "id": "#DM-635",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-635"
                    }
                  },
                  {
                    "id": "#DM-618",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-618"
                    }
                  },
                  {
                    "id": "#DM-621",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-621"
                    }
                  },
                  {
                    "id": "#DM-622",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-622"
                    }
                  },
                  {
                    "id": "#DM-623",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-623"
                    }
                  },
                  {
                    "id": "#DM-624",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-624"
                    }
                  },
                  {
                    "id": "#BS-667",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "BS-667"
                    }
                  },
                  {
                    "id": "#DM-636",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-636"
                    }
                  },
                  {
                    "id": "#BS-603",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "BS-603"
                    }
                  },
                  {
                    "id": "#BS-608",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "BS-608"
                    }
                  },
                  {
                    "id": "#DM-625",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-625"
                    }
                  },
                  {
                    "id": "#DM-626",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "DM-626"
                    }
                  },
                  {
                    "id": "#BS-611",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "BS-611"
                    }
                  },
                  {
                    "id": "#BS-609",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "BS-609"
                    }
                  },
                  {
                    "id": "#BS-625",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "BS-625"
                    }
                  },
                  {
                    "id": "#BS-631",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "BS-631"
                    }
                  }
                ]
              }
            },
            {
              "id": "#Size",
              "type": "ITEM_OPTION",
              "item_option_data": {
                "name": "Size",
                "values": [
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
                  },
                  {
                    "id": "#XXXL",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "XXXL"
                    }
                  },
                  {
                    "id": "#4XL",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "4XL"
                    }
                  },
                  {
                    "id": "#5XL",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "5XL"
                    }
                  },
                  {
                    "id": "#6XL",
                    "type": "ITEM_OPTION_VAL",
                    "item_option_value_data": {
                      "name": "6XL"
                    }
                  }
                ]
              }
            },
            {
              "type": "ITEM",
              "id": "#NIGRITY-Autumn-Winter-Mens-Long-Sleeve-Plaid-Warm-Thick-Fleece-Lined-Shirt-Fashion-Soft-Casual-Flannel-Shirt-Plus-Big-Size-L-6XL",
              "item_data": {
                "name": "NIGRITY Autumn Winter Mens Long Sleeve Plaid Warm Thick Fleece Lined Shirt Fashion Soft Casual Flannel Shirt Plus Big Size L-6XL",
                "description": "Cheap Casual Shirts, Buy Directly from China Suppliers:NIGRITY Autumn Winter Mens Long Sleeve Plaid Warm Thick Fleece Lined Shirt Fashion Soft Casual Flannel Shirt Plus Big Size L-6XL\nEnjoy ✓Free Shipping Worldwide! ✓Limited Time Sale ✓Easy Return.",
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
      let body = '';
            res.on('data', function (chunk) {
              body += chunk;
            console.log(body);
            resolve(body);
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