const express = require("express");

// Import middlewares
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");
// Setup the express server routeRoles
const routeState = express.Router();
const setLog = require("../utils/logs.utils.js")

routeState.get("/api/state", (request, response) => {
  var query = `SELECT stateId, stateName FROM ${process.env.MYSQL_D_B_}.States
            ORDER BY stateName`;
  setLog("TRACE",__filename,arguments.callee.name,"/api/state");
  mysqlConnection.getConnection(function (err, connection) {
    if (err) {
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
      return;
    }
    connection.query(query, function (err, rows) {
      connection.release();
      if (err) {
        response.status(501).json({
          message: apiMessage['501'][1],
          ok: false,
          error: err
        });
      } else {
        response.send(rows);
      }
    });
    connection.on("error", function (err) {
      return;
    });
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeState;
