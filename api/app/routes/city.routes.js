const express = require("express");
const { QueryTypes } = require("sequelize");
// Import middlewares
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routeCity = express.Router();

routeCity.get("/api/city/:id", (request, response) => {
  var jsonValues = { StateStateId: parseInt(String(request.params.id)) };
  const funcName = arguments.callee.name + "routeCity.get(";
  const apiUrl = "/api/city/:";
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  var query = `SELECT cityId,cityName,IF(MOD(cityId,1000)=1,0,1) as citySort, StateStateId  
            FROM ${process.env.MYSQL_D_B_}.Cities
            WHERE StateStateId = :stateId
            ORDER BY citySort, cityName`;
  if (!jsonValues.StateStateId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: apiMessage["400"][1],
    });
  } else {
    setLog("TRACE", __filename, funcName, `${apiUrl}${query}`);
    db.sequelize.query(query, {
      replacements: { stateId: jsonValues.StateStateId },
      type: QueryTypes.SELECT,
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
        setLog("ERROR", __filename, funcName, JSON.stringify(err));
      })
      .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeCity;
