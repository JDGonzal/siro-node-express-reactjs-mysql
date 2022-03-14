const express = require('express');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, laboratory, clinic } = require('../middleware/roles.js');
const mysqlConnection = require('../utils/database.js');
const apiMessage = require('../utils/messages.js');

// Setup the express server routeRoles
const routeTestType= express.Router();

routeTestType.get('/api/testtype', [auth, clinic], async (request,response)=>{
  var query= `SELECT testTypeId, testTypeName, testTypeIsMultiple FROM ${process.env.MYSQL_D_B_}.testTypes
            WHERE testTypeId >0
            ORDER BY testTypeId`;
  mysqlConnection.query(query, (err,rows, fields) =>{
    if (err){
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeTestType;
