'use strict'

const https = require('https');
const uuid = require('uuid');

class AliItem {
    
    constructor(aliData){
        this.name = aliData.titleModule.subject, 
        this.price = aliData.priceModule.formatedActivityPrice,
        this.description = aliData.pageModule.description,
        this.variants = aliData.skuModule.productSKUPropertyList.map((p) => {
            let property = {};
            property.name = p.skuPropertyName;
            property.variants = p.skuPropertyValues.map((v) => {
                let variant = {};
                variant.name = v.propertyValueDisplayName;
                variant.image = v.skuPropertyImagePath;
                return variant;
            })    
            return property;
        }),
        this.images = aliData.imageModule.imagePathList
    }

    // converts the loaded aliItem into a batch upsert body 
    toSquareItem = () => {
        let req = {"idempotency_key" : uuid()};
        let objects = [];
        let object = {"type": "ITEM",
            "id" : `#${this.name.replace(/\s/g, '-')}`,
        };
        let itemData = {
            "name" : this.name,
            "description" : this.description,
            "image" : this.image,
        };

        
        if(this.variants.length > 0){
            let addOptions = this.variants.map(v => {
                // uuid's are used because square options are universal in the backend
                // where in this case they need to be directly associated with the product 
                // for demonstration purposes. The standard #name resulted in many clashes.
                // Many of the tests were done on clothing which have same name SIZE but 
                // varied in range of sizes.
                let option = {id : `#${uuid()}`, type : "ITEM_OPTION"}
                // create list of values that the option holds eg SIZE (ITEM_OPTION) holds S,M,L,XL (ITEM_OPTION_VAL)
                let values = v.variants.map( w => {
                    // create the item option value to be added to values array within the options.
                    let info = {
                        id : `#${uuid()}`,
                        type : "ITEM_OPTION_VAL",
                        item_option_value_data : {
                            name : w.name
                        }
                    }
                    return info;
                });
                // insert name and option values into item_options_data
                option.item_option_data={name : v.name, values : values};
                return option;
            })
            // spread the different options into batch upsert objects
            objects = [...addOptions];
            // append the options id to the actual item
            itemData.item_options = addOptions.map(opt => {return {"item_option_id" : opt.id}});
        }

        // insert the item into the batch objects with the accompanying options and return 
        // the appropriate request body
        object.item_data = itemData;
        objects.push(object);
        req.batches = [{objects: objects}];
        return req;
    }
}

exports.AliItem = AliItem;

const scrape = (data) => {
    try{
        // remove the dangling comma and all redundant stuff after and return
        let cleaned = data.match(/data:[\s\S]*?};/g)[0].replace(/[\n\r]/g, '');
        return JSON.parse(cleaned.slice(6, cleaned.lastIndexOf('},')+1));
    } catch (e){
        // if Aliexpress schema changes will not crash but return JSON parsing error
        return e;
    }
}

const getItemId = (url) => url.match(/item\/[0-9]*\.html/g)[0].replace(/\D/g,'');

exports.get = async (event, context) => new Promise((resolve, reject) => {
    
    let itemId = false;
    
    try{
        itemId = getItemId(event.url);
    } catch(e){
        itemId = false;
    }
    
    if(itemId){
    const params = {
	host: "www.aliexpress.com",
	path: `/item/${itemId}.html`,
	port: 443,
	method: "GET",
	};	
    
    
    const req = https.request(params, function(res) {
        let data = '';
        console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            console.log("DONE");
            let ali = new AliItem(scrape(data.toString()));
            console.log(ali.toSquareItem().object);
            resolve(ali.toSquareItem());
        });
    });
    req.end();
    } else {
        resolve('something bad happened')
    }
    
});