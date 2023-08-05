const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");

// Setup the express server routeRoles
const routeBreed = express.Router();

routeBreed.get("/api/breed/:id", [auth, clinic], (request, response) => {
  var query = `SELECT breedId,breedName,IF(MOD(breedId,1000)=1,0,1) as breedSort, SpeciesSpeciesId  
            FROM ${process.env.MYSQL_D_B_}.Breeds
            WHERE SpeciesSpeciesId = ?
            ORDER BY breedSort,breedName`;
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

module.exports = routeBreed;
