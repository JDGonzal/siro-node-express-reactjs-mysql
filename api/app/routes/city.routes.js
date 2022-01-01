const express = require('express');
require('dotenv').config(); // import config = require('config');
const routeCity = express.Router();

// Import middlewares
const mysqlConnection = require('../utils/database.js');
const apiMessage = require('../utils/messages.js');

routeCity.get('/api/city/:id', (request, response) => {
  var query = `SELECT cityId,cityName,IF(MOD(cityId,1000)=1,0,1) as citySort, StateStateId  
            FROM ${process.env.MYSQL_D_B_}.Cities
            WHERE StateStateId = ?
            ORDER BY CitySort, CityName`;
  var values = [
    parseInt(request.params.id)
  ];
  mysqlConnection.query(query, values, (err, rows, fields) => {
    if (err) {
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

module.exports = routeCity;
