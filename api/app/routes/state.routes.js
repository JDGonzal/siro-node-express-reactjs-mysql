const express = require('express');
require('dotenv').config(); // import config = require('config');
const routeState = express.Router();

// Import middlewares
const mysqlConnection = require('../utils/database.js');
const apiMessage = require('../utils/messages.js')

routeState.get('/api/state', (request,response)=>{
  var query= `SELECT stateId, stateName FROM ${process.env.MYSQL_D_B_}.States
            ORDER BY stateName`;
  mysqlConnection.query(query, (err,rows, fields) =>{
    if (err){
      response.status(501).json({
        message: apiMessage['501'][1],
        error: err
      });
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeState;
