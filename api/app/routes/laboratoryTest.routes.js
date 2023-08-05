const express = require('express');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, laboratory, clinic } = require('../middleware/roles.js');
const mysqlConnection = require('../utils/database.js');
const apiMessage = require('../utils/messages.js');

// Setup the express server routeRoles
const routeLaboratoryTest = express.Router();

routeLaboratoryTest.get('/api/laboratorytest/:id', [auth, clinic], async (request, response) => {
  var query = `SELECT laboratoryTestId, laboratoryTestName, TestTypeTestTypeId FROM ${process.env.MYSQL_D_B_}.laboratoryTests
            WHERE laboratoryTestId >0 AND TestTypeTestTypeId=?
            ORDER BY TestTypeTestTypeId,laboratoryTestName`;
  var values = [
    parseInt(request.params.id)
  ];
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
        message: apiMessage['501'][1],
        ok: false,
        error: err
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

module.exports = routeLaboratoryTest;
