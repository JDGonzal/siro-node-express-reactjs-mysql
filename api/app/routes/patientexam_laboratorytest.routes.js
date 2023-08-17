const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routePatientexam_Laboratorytest = express.Router();

routePatientexam_Laboratorytest.post(
  "/api/patientexam_laboratorytest",
  [auth, clinic],
  (request, response) => {
    
    var query = `DELETE FROM ${process.env.MYSQL_D_B_}.patientexam_laboratorytests
            WHERE patientExamId = ?`;
    var values = [parseInt(request.body["patientExamId"])];
    setLog("TRACE",__filename,arguments.callee.name+'routePatientexam_Laboratorytest.post', `/api/patientexam_laboratorytest ${JSON.stringify(values)}`);
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
        var arrLabTests = request.body["arrLabTests"];
        query = `INSERT into ${process.env.MYSQL_D_B_}.patientexam_laboratorytests
    (createdAt, updatedAt, patientExamId, laboratoryTestId)
    VALUE (NOW(), NOW(), ?, ?)`;
        for (var i = 0; i < arrLabTests.length; i++) {
          values = [request.body["patientExamId"], parseInt(arrLabTests[i])];
          mysqlConnection.query(query, values, (err, rows, fields) => {
            if (err) {
              setLog("ERROR",__filename,arguments.callee.name+'routePatientexam_Laboratorytest.post',JSON.stringify(err));
              response.status(501).json({
                message: apiMessage["501"][1],
                ok: false,
                error: err,
              });
            }
          });
        }
      });
      connection.on("error", function (err) {
        return;
      });
    });
    // To Test in Postman use a POST with this URL "http://localhost:49146/api/patientexam_laboratorytest"
    // in "Body" use patientExamId (numeric), laboratoryTestIds (array of string)
  }
);

module.exports = routePatientexam_Laboratorytest;
