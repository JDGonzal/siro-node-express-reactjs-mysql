const express = require("express");

// Import middlewares
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");

// Setup the express server routeRoles
const routeCity = express.Router();

routeCity.get("/api/city/:id", (request, response) => {
  var query = `SELECT cityId,cityName,IF(MOD(cityId,1000)=1,0,1) as citySort, StateStateId  
            FROM ${process.env.MYSQL_D_B_}.Cities
            WHERE StateStateId = ?
            ORDER BY CitySort, CityName`;
  var values = [parseInt(request.params.id)];
  mysqlConnection.getConnection(function (err, connection) {
    if (err) {
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
      return;
    }
    mysqlConnection.query(query, values, (err, rows, fields) => {
      connection.release();
      if (err) {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      }
      response.send(rows);
    });
    connection.on("error", function (err) {
      return;
    });
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeCity;
