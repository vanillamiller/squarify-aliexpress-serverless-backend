'use strict'
const jwt = require('jsonwebtoken');

exports.handler = (event, context, callback) => {
   const token = event.headers.Authorization;

   try{
      const decoded = jwt.verify(token, process.env.JWT_KEY);
   }catch(e){
      
   }
   

}