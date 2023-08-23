const express = require("express");
// Import middlewares
const db = require("../models");
const apiMessage = require("../utils/messages.js");
// Setup the express server routeRoles
const routeState = express.Router();
const setLog = require("../utils/logs.utils.js");

routeState.get("/api/state", async (request, response) => {
  const funcName = arguments.callee.name + "routeState.get(";
  const apiUrl = "/api/state|";
  setLog("TRACE", __filename, funcName, apiUrl);
  //var query = `SELECT stateId, stateName FROM ${process.env.MYSQL_D_B_}.States ORDER BY stateName`;
  db.state.findAll({
    attributes: ['stateId', 'stateName'],
    order: ['stateName'],
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
    .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeState;
