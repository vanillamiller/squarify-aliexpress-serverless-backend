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
        }

        itemData.item_options = this.variants.map(v => {return {"item_option_id" : `#${v.name}`}});

        if(this.variants.length > 0){
            let addOptions = this.variants.map(v => {
                let option = {id : `#${v.name}`, type : "ITEM_OPTION", name : v.name}
                let values = v.variants.map( w => {
                    let info = {
                        id : `#${w.name.replace(/\s/g, '-')}`,
                        type : "ITEM_OPTION_VAL",
                        item_option_value_data : {
                            name : w.name
                        }
                    }
                    if(v.image != null){
                        info.image = w.image;
                    }
                    return info;
                });
                option.values = values;
                return option;
            })
            // itemData.item_options = addOptions;
            objects = [...addOptions];
        }
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