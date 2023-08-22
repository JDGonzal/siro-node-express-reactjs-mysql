const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routePatientexam_Laboratorytest = express.Router();

routePatientexam_Laboratorytest.post("/api/patientexam_laboratorytest", [auth, clinic], (request, response) => {
  const funcName = arguments.callee.name + "routePatientexam_Laboratorytest.post(";
  const apiUrl = "/api/patientexam_laboratorytest|";
  var jsonValues = {
    patientExamId: parseInt(String(request.body["patientExamId"])),
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `DELETE FROM ${process.env.MYSQL_D_B_}.patientexam_laboratorytests WHERE patientExamId = ?`;
  if (!jsonValues.patientExamId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: validationResponse,
    });
  } else {
    db.patientExam_LaboratoryTests.destroy({
      where: { jsonValues }
    })
      .then((rows) => {
        var arrLabTests = request.body["arrLabTests"];
        setLog("TRACE", __filename, funcName, `${apiUrl}.arrLabTests:${arrLabTests}.rows:${rows}`);
        // query = `INSERT into ${process.env.MYSQL_D_B_}.patientexam_laboratorytests (createdAt, updatedAt, patientExamId, laboratoryTestId) VALUE (NOW(), NOW(), ?, ?)`;
        for (var i = 0; i < arrLabTests.length; i++) {
          jsonValues['laboratoryTestId'] = parseInt(arrLabTests[i]); //{patientExamId: X, laboratoryTestId: Y}
          db.patientExam_LaboratoryTests.create(
            jsonValues
          ).then((rows) => { setLog("TRACE", __filename, funcName, `${apiUrl}.created:${JSON.stringify(jsonValues)}.rows:${rows}`); })
            .catch((err) => {
              setLog("ERROR", __filename, funcName, `${apiUrl}.creating:${JSON.stringify(jsonValues)}.error:${JSON.stringify(err)}`);
              response.status(501).json({
                message: apiMessage["501"][1],
                ok: false,
                error: err,
              });
            })
            .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}.created:${JSON.stringify(jsonValues)}).end`); });
        }
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

  // To Test in Postman use a POST with this URL "http://localhost:49146/api/patientexam_laboratorytest"
  // in "Body" use patientExamId (numeric), laboratoryTestIds (array of string)
});

module.exports = routePatientexam_Laboratorytest;
