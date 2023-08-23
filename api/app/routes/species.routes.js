const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");

// Setup the express server routeRoles
const routeSpecies = express.Router();

routeSpecies.get("/api/species", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routeSpecies.get(";
  const apiUrl = "/api/species|";
  setLog("TRACE", __filename, funcName, apiUrl);
  // var query = `SELECT speciesId, speciesName, speciesOrder FROM ${process.env.MYSQL_D_B_}.Species ORDER BY speciesOrder, speciesName`;
  db.species.findAll({
    attributes: ['speciesId', 'speciesName', 'speciesOrder'],
    order: ['speciesOrder', 'speciesName'],
  })
    .then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
      response.send(rows);
    })
    .catch((err) => {
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
      setLog("ERROR", __filename, funcName, `${apiUrl}.error:${JSON.stringify(err)}`);
    })
    .finally(() => {
      setLog("INFO", __filename, funcName, `(${apiUrl}).end`);
    });
  
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeSpecies;
