const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routePatientexam_TypeOfSample = express.Router();

routePatientexam_TypeOfSample.post("/api/patientexam_typeofsample", [auth, clinic], (request, response) => {
  const funcName = arguments.callee.name + "routePatientexam_TypeOfSample.post(";
  const apiUrl = "/api/patientexam_typeofsample|";
  var jsonValues = {
    patientExamId: parseInt(String(request.body["patientExamId"])),
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `DELETE FROM ${process.env.MYSQL_D_B_}.patientexam_typeofsamples  WHERE patientExamId = ?`;
  if (!jsonValues.patientExamId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: apiMessage["400"][1],
    });
  } else {
    db.patientexam_typeofsamples.destroy({
      where: jsonValues
    })
      .then((rows) => {
        var arrTypeOfSamples = request.body["arrTypeOfSamples"];
        setLog("TRACE", __filename, funcName, `${apiUrl}.arrTypeOfSamples:${arrTypeOfSamples}.rows:${rows}`);
        // query = `INSERT into ${process.env.MYSQL_D_B_}.patientexam_typeofsamples (createdAt, updatedAt, patientExamId, typeOfSampleId)  VALUE (NOW(), NOW(), ?, ?)`;
        for (var i = 0; i < arrTypeOfSamples.length; i++) {
          jsonValues['typeOfSampleId'] = parseInt(arrTypeOfSamples[i]); //{patientExamId: X, typeOfSampleId: Y}
          db.patientexam_typeofsamples.create({
            patientExamId: jsonValues.patientExamId,
            typeOfSampleId: jsonValues.typeOfSampleId,
          })
            .then((rows) => { setLog("TRACE", __filename, funcName, `${apiUrl}.created:${JSON.stringify(jsonValues)}.rows:${rows}`); })
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
        setLog("ERROR", __filename, funcName, `${apiUrl}.deleting:${JSON.stringify(err)}`);
      })
      .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use a POST with this URL "http://localhost:49146/api/patientexam_typeofsample"
  // in "Body" use patientExamId (numeric), laboratoryTestIds (array of string)
});

module.exports = routePatientexam_TypeOfSample;
