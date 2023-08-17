const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routeSqlQuery = express.Router();

routeSqlQuery.get(
  "/api/sqlquery/:sql" /*, [auth, clinic]*/,
  (request, response) => {
    var query = request.params.sql;
    try {
      setLog("TRACE",__filename,arguments.callee.name+'routeSqlQuery.get(',`/api/sqlquery/:${JSON.stringify(query)}`);
      const validationResponse =
        String(query).substring(0, 6).toLowerCase() === "select";
      if (validationResponse !== true) {
        return response.status(400).json({
          message: apiMessage["400"][1],
          ok: false,
          errors: validationResponse,
        });
      }
      mysqlConnection.getConnection(function (err, connection) {
        connection.release();
        if (err) {
          response.status(501).json({
            message: apiMessage["501"][1],
            ok: false,
            error: err,
          });
          return;
        }
        mysqlConnection.query(query, (err, rows, fields) => {
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
    } catch (err) {
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
      console.error(err);
    }
    // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
    // in "Body" use none
  }
);

module.exports = routeSqlQuery;
