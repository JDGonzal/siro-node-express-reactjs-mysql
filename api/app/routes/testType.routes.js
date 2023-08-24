const express = require("express");
const { Op } = require("sequelize");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js")

// Setup the express server routeRoles
const routeTestType = express.Router();

routeTestType.get("/api/testtype", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routeTestType.get(";
  const apiUrl = "/api/testtype|";
  setLog("TRACE", __filename, funcName, apiUrl);
  // var query = `SELECT testTypeId, testTypeName, testTypeIsMultiple FROM ${process.env.MYSQL_D_B_}.testTypes WHERE testTypeId >0 ORDER BY testTypeId`;
  db.testType.findAll({
    attributes: ['testTypeId', 'testTypeName', 'testTypeIsMultiple'],
    where: { testTypeId: { [Op.gt]: 0 } /*>0*/ },
    order: ['testTypeId'],
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
    .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`);  });

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeTestType;
