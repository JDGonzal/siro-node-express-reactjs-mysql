const express = require('express');
const { Op } = require("sequelize");

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, laboratory, clinic } = require('../middleware/roles.js');
const db = require("../models");
const apiMessage = require('../utils/messages.js');
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routeLaboratoryTest = express.Router();

routeLaboratoryTest.get('/api/laboratorytest/:id', [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routeLaboratoryTest.get(";
  const apiUrl = "/api/laboratorytest/:";
  var jsonValues = { TestTypeTestTypeId: parseInt(request.params.id) };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `SELECT laboratoryTestId, laboratoryTestName, TestTypeTestTypeId FROM ${process.env.MYSQL_D_B_}.laboratoryTests WHERE laboratoryTestId >0 AND TestTypeTestTypeId=? ORDER BY TestTypeTestTypeId,laboratoryTestName`;
  if (!jsonValues.TestTypeTestTypeId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: validationResponse,
    });
  } else {
    db.laboratoryTest.findAll({
      attributes: ["laboratoryTestId", "laboratoryTestName", "TestTypeTestTypeId"],
      where: {
        [Op.and]: [{ TestTypeTestTypeId: jsonValues.TestTypeTestTypeId },
        { laboratoryTestId: { [Op.gt]: 0 } } /*>0*/]
      },
      order: [['TestTypeTestTypeId', 'ASC'],
      ['laboratoryTestName', 'ASC'],],
    }).then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
      response.send(rows);
    })
      .catch((err) => {
        response.status(501).json({
          message: apiMessage['501'][1],
          ok: false,
          error: err
        });
        setLog("ERROR", __filename, funcName, JSON.stringify(err));
      })
      .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeLaboratoryTest;
