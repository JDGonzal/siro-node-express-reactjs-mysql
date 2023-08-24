// Import dependencies
const express = require("express");
const { request, response } = require("express");
const { Op, QueryTypes } = require("sequelize");
const Validator = require("fastest-validator");
require("dotenv").config(); // import config = require('config');
const fetch = require("cross-fetch");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, clinic, laboratory, viewer } = require("../middleware/roles.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeAuth
const routePatientExam = express.Router();

routePatientExam.get("/api/patientexam/:VeterinarianVeterinarianId&:PatientPetPatientPetId", async (request, response) => {
  const funcName = arguments.callee.name + "routePatientExam.get(";
  const apiUrl = "/api/patientexam/:";
  var jsonValues =
  {
    VeterinarianVeterinarianId: parseInt(String(request.params.VeterinarianVeterinarianId)),
    PatientPetPatientPetId: parseInt(String(request.params.PatientPetPatientPetId)),
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${jsonValues.VeterinarianVeterinarianId}&${jsonValues.PatientPetPatientPetId}`);
  // var query = `SELECT COUNT(patientExamId)as found from ${process.env.MYSQL_D_B_}.patientExams where VeterinarianVeterinarianId=? AND PatientPetPatientPetId=?`;
  if (!jsonValues.VeterinarianVeterinarianId || !jsonValues.PatientPetPatientPetId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: apiMessage["400"][1],
    });
  } else {
    db.patientExam.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("patientExamId")), "found"],
      ],
      where: {
        [Op.and]: [jsonValues]
      },
    }).then((rows) => {
      setLog("INFO", __filename, funcName, `${apiUrl}rows: ${JSON.stringify(rows)}.qty:${rows[0].dataValues.found}`);
      if (rows[0].dataValues.found > 0) {
        // query = `SELECT MAX(patientExamId) as found from ${process.env.MYSQL_D_B_}.patientExams where VeterinarianVeterinarianId=? AND PatientPetPatientPetId=?`;
        db.patientExam.findAll({
          attributes: [
            [db.sequelize.fn("MAX", db.sequelize.col("patientExamId")), "found"],
          ],
          where: {
            [Op.and]: [jsonValues]
          },
        }).then((rows) => {
          response.send({
            ok: true,
            found: rows[0].dataValues.found,
          });
          setLog("INFO", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}max:${rows[0].dataValues.found}`);
        })
          .catch((err) => {
            response.status(501).json({
              message: apiMessage["501"][1],
              ok: false,
              error: err,
            });
          })
          .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}.max).end`); });
      } else {
        setLog("INFO", __filename, funcName, `found:${rows[0].dataValues.found} of ${JSON.stringify(jsonValues)}`);
        response.send({
          ok: true,
          found: rows[0].dataValues.found,
        });
      }
    })
      .catch((err) => {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      })
      .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}.qty).end`); });
  }

  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

// On post
routePatientExam.post("/api/patientexam/get", [auth, viewer], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientExam.post(";
  const apiUrl = "/api/patientexam/get|";
  var jsonValues = await {
    medicalCenterArray: request.body["medicalCenterArray"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  var query =
    await `SELECT pe.*, pp.patientPetName, pp.patientPetGender, pp.patientPetBirthday, pp.MedicalCenterMedicalCenterId, 
      pp.PetOwnerPetOwnerId, pw.petOwnerName, sp.speciesName, br.breedName, mc.medicalCenterName, ve.veterinarianName,
    (SELECT GROUP_CONCAT(pt.typeOfSampleId SEPARATOR ',') 
      FROM patientexam_typeofsamples pt 
      WHERE pt.patientExamId = pe.patientExamId) AS typeOfSampleIds,
	  (SELECT GROUP_CONCAT(ts.typeOfSampleName SEPARATOR ',') 
      FROM patientexam_typeofsamples pt  INNER JOIN typeofsamples ts ON pt.typeOfSampleId = ts.typeOfSampleId
      WHERE pt.patientExamId = pe.patientExamId) AS typeOfSampleNames,
    (SELECT GROUP_CONCAT(pl.laboratoryTestId SEPARATOR ',') 
      FROM patientexam_laboratorytests pl 
      WHERE pl.patientExamId = pe.patientExamId) AS laboratoryTestIds,
    (SELECT GROUP_CONCAT(lt.laboratoryTestName SEPARATOR ',') 
      FROM patientexam_laboratorytests pl  INNER JOIN laboratorytests lt ON pl.laboratoryTestId = lt.laboratoryTestId
      WHERE pl.patientExamId = pe.patientExamId) AS laboratoryTestNames,
    (SELECT GROUP_CONCAT(lt.TestTypeTestTypeId SEPARATOR ',') 
      FROM patientexam_laboratorytests pl  INNER JOIN laboratorytests lt ON pl.laboratoryTestId = lt.laboratoryTestId
      WHERE pl.patientExamId = pe.patientExamId) AS TestTypeTestTypeIds,
    (SELECT GROUP_CONCAT(tt.testTypeIsMultiple SEPARATOR ',') 
      FROM patientexam_laboratorytests pl 
      INNER JOIN laboratorytests lt ON pl.laboratoryTestId = lt.laboratoryTestId
      INNER JOIN testtypes tt ON tt.testTypeId = lt.TestTypeTestTypeId
      WHERE pl.patientExamId = pe.patientExamId) AS testTypeIsMultiples
    FROM ${process.env.MYSQL_D_B_}.PatientExams pe
    INNER JOIN PatientPets pp ON pe.PatientPetPatientPetId = pp.patientPetId
    INNER JOIN petOwners pw ON pp.PetOwnerPetOwnerId = pw.petOwnerId
    INNER JOIN species sp ON pp.SpeciesSpeciesId = sp.speciesId
    INNER JOIN breeds br ON pp.BreedBreedId = br.breedId
    INNER JOIN medicalcenters mc ON pp.MedicalCenterMedicalCenterId = mc.medicalCenterId
    INNER JOIN veterinarians ve on pe.VeterinarianVeterinarianId = ve.veterinarianId
    WHERE mc.medicalCenterId IN (:arrayValues)
    ORDER BY pe.patientExamId DESC LIMIT 100`;
  const schema = await {
    medicalCenterArray: { type: "array", optional: false, max: 100, min: 1 },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);
  setLog("TRACE", __filename, funcName, `${apiUrl}.sql:${query}`);
  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: validationResponse,
    });
  } else {
    db.sequelize.query(query, {
      replacements: { arrayValues: jsonValues.medicalCenterArray },
      type: QueryTypes.SELECT,
    }).then((rows) => {
      setLog("INFO", __filename, funcName, `${apiUrl}rows:${JSON.stringify(rows)}`);
      response.send(rows);
    })
      .catch((err) => {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      })
      .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); })
  }

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use none
}
);

async function addVeterinarian(jsonValues) {
  const funcName = arguments.callee.name;
  setLog("TRACE", __filename, funcName, `${JSON.stringify(jsonValues)}`);
  await fetch(process.env.EMAIL_API_ + "veterinarian", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth-token": jsonValues.TokenExternal,
    },
    body: JSON.stringify({
      veterinarianId: jsonValues.VeterinarianVeterinarianId,
      veterinarianName: jsonValues.veterinarianName,
    }),
  })
    .then((res) => res.json())
    .then((data) => { setLog("INFO", __filename, funcName, `ok: ${JSON.stringify(data)}`); },
      (error) => { setLog("ERROR", __filename, funcName, JSON.stringify(error)); });
};

async function addTypeOfSample(jsonValues) {
  const funcName = arguments.callee.name;
  setLog("TRACE", __filename, funcName, `${JSON.stringify(jsonValues)}`);
  if (jsonValues.arrTypeOfSamples[0] && jsonValues.patientExamId > 0) {
    fetch(process.env.EMAIL_API_ + "patientexam_typeofsample", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": jsonValues.TokenExternal,
      },
      body: JSON.stringify({
        patientExamId: jsonValues.patientExamId,
        arrTypeOfSamples: jsonValues.arrTypeOfSamples,
      }),
    })
      .then((res) => res.json())
      .then((data) => { setLog("INFO", __filename, funcName, `ok: ${JSON.stringify(data)}`); },
        (error) => { setLog("ERROR", __filename, funcName, JSON.stringify(error)); });
  }
};

async function addLaboratoryTest(jsonValues) {
  const funcName = arguments.callee.name;
  setLog("TRACE", __filename, funcName, `${JSON.stringify(jsonValues)}`);
  if (jsonValues.arrLabTests[0] && jsonValues.patientExamId > 0) {
    fetch(process.env.EMAIL_API_ + "patientexam_laboratorytest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": jsonValues.TokenExternal,
      },
      body: JSON.stringify({
        patientExamId: jsonValues.patientExamId,
        arrLabTests: jsonValues.arrLabTests,
      }),
    })
      .then((res) => res.json())
      .then((data) => { setLog("INFO", __filename, funcName, `ok: ${JSON.stringify(data)}`); },
        (error) => { setLog("ERROR", __filename, funcName, JSON.stringify(error)); }
      );
  }
};

routePatientExam.post("/api/patientexam", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientExam.post(";
  const apiUrl = "/api/patientexam|";
  var jsonValues = await {
    patientExamRemarks: request.body["patientExamRemarks"],
    patientExamAddress: request.body["patientExamAddress"],
    patientExamTelNumber: request.body["patientExamTelNumber"],
    patientExamIsUrgency: request.body["patientExamIsUrgency"],
    patientAnotherTypeOfSample: request.body["patientAnotherTypeOfSample"],
    VeterinarianVeterinarianId: request.body["VeterinarianVeterinarianId"],
    PatientPetPatientPetId: request.body["patientPetId"],
    MedicalCenterMedicalCenterId: request.body["MedicalCenterMedicalCenterId"],
    arrTypeOfSamples: request.body["arrTypeOfSamples"],
    arrLabTests: request.body["arrLabTests"],
    TokenExternal: request.body["TokenExternal"],
    veterinarianName: request.body["veterinarianName"],
    patientExamId: 0,
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);

  const schema = await {
    patientExamRemarks: { type: "string", optional: true, max: 255 },
    patientExamAddress: { type: "string", optional: false, max: 255, min: 8 },
    patientExamTelNumber: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1000000,
      max: 9999999999,
    },
    patientExamIsUrgency: { type: "boolean", optional: false },
    patientAnotherTypeOfSample: { type: "string", optional: true, max: 255 },
    VeterinarianVeterinarianId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    PatientPetPatientPetId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 9999999,
    },
    MedicalCenterMedicalCenterId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    arrTypeOfSamples: { type: "array", optional: false, max: 10, min: 1 },
    arrLabTests: { type: "array", optional: false, max: 10, min: 1 },
    TokenExternal: { type: "string", optional: true },
    veterinarianName: { type: "string", optional: false, max: 100, min: 5 },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);
  // var query = await `INSERT into ${process.env.MYSQL_D_B_}.PatientExams (patientExamRemarks, patientExamAddress, patientExamTelNumber,
  // patientExamIsUrgency, patientAnotherTypeOfSample, createdAt, updatedAt, VeterinarianVeterinarianId, PatientPetPatientPetId) 
  // VALUE (?,?,?,?,?,NOW(),NOW(),?,?)`;
  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: validationResponse,
    });
  } else {
    await addVeterinarian(jsonValues);
    db.patientExam.create({
      patientExamRemarks: jsonValues.patientExamRemarks,
      patientExamAddress: jsonValues.patientExamAddress,
      patientExamTelNumber: jsonValues.patientExamTelNumber,
      patientExamIsUrgency: jsonValues.patientExamIsUrgency,
      patientAnotherTypeOfSample: jsonValues.patientAnotherTypeOfSample,
      VeterinarianVeterinarianId: jsonValues.VeterinarianVeterinarianId,
      PatientPetPatientPetId: jsonValues.PatientPetPatientPetId,
    }).then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
      response.status(201).json({
        message: apiMessage["201"][1],
        ok: true,
      });
      setLog("DEBUG", __filename, funcName, `GET"patientexam/"+${jsonValues.VeterinarianVeterinarianId}&${jsonValues.PatientPetPatientPetId}`);
      fetch(process.env.EMAIL_API_ + "patientexam/" + jsonValues.VeterinarianVeterinarianId + "&" + jsonValues.PatientPetPatientPetId,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          jsonValues.patientExamId = data.found;
          addTypeOfSample(jsonValues);
          addLaboratoryTest(jsonValues);
        },
          (err) => { setLog("ERROR", __filename, funcName, `GET"patientexam/"${apiUrl}${JSON.stringify(error)}`); }
        );
    })
      .catch((err) => {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
        setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(err)}`);
      })
      .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use POST with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPO"}
  // Run again the GET option to check the list of records
}
);

routePatientExam.put("/api/patientexam", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientExam.post(";
  const apiUrl = "/api/patientexam|";
  var jsonValues = await {
    patientExamRemarks: request.body["patientExamRemarks"],
    patientExamAddress: request.body["patientExamAddress"],
    patientExamTelNumber: request.body["patientExamTelNumber"],
    patientExamIsUrgency: request.body["patientExamIsUrgency"],
    patientAnotherTypeOfSample: request.body["patientAnotherTypeOfSample"],
    VeterinarianVeterinarianId: request.body["VeterinarianVeterinarianId"],
    PatientPetPatientPetId: request.body["patientPetId"],
    patientExamId: request.body["patientExamId"],
    MedicalCenterMedicalCenterId:
      request.body["MedicalCenterMedicalCenterId"],
    arrTypeOfSamples: request.body["arrTypeOfSamples"],
    arrLabTests: request.body["arrLabTests"],
    TokenExternal: request.body["TokenExternal"],
    veterinarianName: request.body["veterinarianName"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);

  const schema = await {
    patientExamRemarks: { type: "string", optional: true, max: 255 },
    patientExamAddress: { type: "string", optional: false, max: 255, min: 8 },
    patientExamTelNumber: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1000000,
      max: 9999999999,
    },
    patientExamIsUrgency: { type: "boolean", optional: false },
    patientAnotherTypeOfSample: { type: "string", optional: true, max: 255 },
    VeterinarianVeterinarianId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    PatientPetPatientPetId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 9999999,
    },
    patientExamId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 9999999,
    },
    MedicalCenterMedicalCenterId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    arrTypeOfSamples: { type: "array", optional: false, max: 10, min: 1 },
    arrLabTests: { type: "array", optional: false, max: 10, min: 1 },
    TokenExternal: { type: "string", optional: true },
    veterinarianName: { type: "string", optional: false, max: 100, min: 5 },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);
  // var query = await `UPDATE ${process.env.MYSQL_D_B_}.PatientExams SET patientExamRemarks=?, patientExamAddress=?, patientExamTelNumber=?, 
  // patientExamIsUrgency=?, patientAnotherTypeOfSample=?, VeterinarianVeterinarianId=?, PatientPetPatientPetId=?, updatedAt=NOW() WHERE patientExamId=?`;
  if (validationResponse !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: validationResponse,
    });
  } else {
    await addVeterinarian(jsonValues);
    db.patientExam.update(
      {
        patientExamRemarks: jsonValues.patientExamRemarks,
        patientExamAddress: jsonValues.patientExamAddress,
        patientExamTelNumber: jsonValues.patientExamTelNumber,
        patientExamIsUrgency: jsonValues.patientExamIsUrgency,
        patientAnotherTypeOfSample: jsonValues.patientAnotherTypeOfSample,
        VeterinarianVeterinarianId: jsonValues.VeterinarianVeterinarianId,
        PatientPetPatientPetId: jsonValues.PatientPetPatientPetId,
      }
    ).then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
      response.status(202).json({
        message: apiMessage["202"][1],
        ok: true,
      });

      addTypeOfSample(jsonValues);
      addLaboratoryTest(jsonValues);
    })
      .catch((err) => {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      })
      .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use PUT with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPOX", "PetId": "3"}
  // Run again the GET option to check the list of records
});

routePatientExam.delete("/api/patientexam/:id", [auth, admin], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientExam.delete(";
  const apiUrl = "/api/patientexam/:";
  var jsonValues = await { patientExamId: parseInt(String(request.params.id)) };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `DELETE from ${process.env.MYSQL_D_B_}.PatientExams where patientExamId=?`;
  if (!jsonValues.patientExamId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: apiMessage["400"][1],
    });
  } else {
    db.patientExam.destroy({
      where:  jsonValues 
    }).then((rows) => {
      setLog("TRACE", __filename, funcName, `${apiUrl}.arrLabTests:${arrLabTests}.rows:${rows}`);
      response.status(202).json({
        message: apiMessage["202"][1],
        ok: true,
      });
    })
      .catch((err) => {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      })
      .finally(() => { });
  }

  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/patientpet/3"
  // in "Body" use none
  // Run again the GET option to check the list of records
}
);

module.exports = routePatientExam;
