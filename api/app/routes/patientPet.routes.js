// Import dependencies
const express = require("express");
const { request, response } = require("express");
const { QueryTypes } = require("sequelize");
const Validator = require("fastest-validator");
require("dotenv").config(); // import config = require('config');
const fetch = require("cross-fetch");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, clinic, laboratory, viewer } = require("../middleware/roles.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js")

// Setup the express server routeAuth
const routePatientPet = express.Router();

// On get
routePatientPet.get("/api/patientpet/:medicalCenterArray", [auth, viewer], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientExam.get(";
  const apiUrl = "/api/patientpet/:";
  var jsonValues = await {
    medicalCenterArray: request.params["medicalCenterArray"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${jsonValues.medicalCenterArray}`);
  var query = await `SELECT DISTINCT(pp.patientPetName) as label 
    FROM ${process.env.MYSQL_D_B_}.PatientPets pp
    INNER JOIN ${process.env.MYSQL_D_B_}.medicalcenters mc ON pp.MedicalCenterMedicalCenterId = mc.medicalCenterId
    WHERE mc.medicalCenterId IN (:medicalCenterArray)
    ORDER BY pp.patientPetName`;

  const schema = await {
    medicalCenterArray: { type: "string", optional: false, max: 255, min: 5 },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      error: validationResponse,
    });
  } else {
    db.sequelize.query(query, {
      replacements: { medicalCenterArray: jsonValues.medicalCenterArray },
      type: QueryTypes.SELECT,
    }).then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
      response.send(rows);
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

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use none
});

// On post
routePatientPet.post("/api/patientpet/get", [auth, viewer], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientPet.post(";
  const apiUrl = "/api/patientpet/get|";
  var jsonValues = await {
    medicalCenterArray: request.body["medicalCenterArray"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${jsonValues.medicalCenterArray}`);
  var query =
    await `SELECT pp.*, pw.petOwnerName,sp.speciesName, br.breedName, mc.medicalCenterName 
    FROM ${process.env.MYSQL_D_B_}.PatientPets pp
    INNER JOIN petowners pw ON pp.PetOwnerPetOwnerId = pw.petOwnerId
    INNER JOIN species sp ON pp.SpeciesSpeciesId = sp.speciesId
    INNER JOIN breeds br ON pp.BreedBreedId = br.breedId
    INNER JOIN medicalcenters mc ON pp.MedicalCenterMedicalCenterId = mc.medicalCenterId
    WHERE mc.medicalCenterId IN (:medicalCenterArray)
    ORDER BY pp.patientPetId DESC`;

  const schema = await {
    medicalCenterArray: { type: "array", optional: false, max: 100, min: 1 },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      error: validationResponse,
    });
  } else {
    db.sequelize.query(query, {
      replacements: { medicalCenterArray: jsonValues.medicalCenterArray },
      type: QueryTypes.SELECT,
    }).then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
      response.send(rows);
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

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use none
});

// On post
routePatientPet.post("/api/patientpet/getpatientpetid", [auth, viewer], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientPet.post(";
  const apiUrl = "/api/patientpet/getpatientpetid|";
  var jsonValues = await {
    patientPetName: request.body["patientPetName"],
    petOwnerName: request.body["petOwnerName"],
    petOwnerId: request.body["PetOwnerPetOwnerId"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  var query = await `SELECT pp.patientPetId 
    FROM ${process.env.MYSQL_D_B_}.PatientPets pp
    INNER JOIN petowners pw ON pp.PetOwnerPetOwnerId = pw.petOwnerId
    WHERE pp.patientPetName = :patientPetName AND (pw.petOwnerName = :petOwnerName OR pw.petOwnerId = :petOwnerId)
    LIMIT 1`;

  const schema = await {
    patientPetName: { type: "string", optional: false, max: 100, min: 2 },
    petOwnerName: { type: "string", optional: true, max: 100, min: 0 },
    petOwnerId: {
      type: "number",
      optional: true,
      positive: true,
      integer: true,
      min: 0,
      max: 9999999999,
    },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      error: validationResponse,
    });
  } else {
    db.sequelize.query(query, {
      replacements: jsonValues,
      type: QueryTypes.SELECT,
    }).then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
      if (!rows || rows.length === 0) {
        response.status(404).json({
          message: apiMessage["404"][1],
          ok: false,
        });
        setLog("ERROR", __filename, funcName, `${apiUrl}${apiMessage["404"][0]}`);
      } else response.send(rows);
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

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use none
});

function validatePatientPetBirthday(patientPetBirthday) {
  if (patientPetBirthday.length < 3 || patientPetBirthday[0] === "") return null;
  else return Date(`${patientPetBirthday[0]}-${patientPetBirthday[1]}-${patientPetBirthday[2]}`);
}

routePatientPet.post("/api/patientpet", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientPet.post(";
  const apiUrl = "/api/patientpet|";
  var jsonValues = await {
    patientPetName: request.body["patientPetName"].trim(),
    patientPetBirthday: request.body["patientPetBirthday"],
    patientPetGender: request.body["patientPetGender"],
    patientPetHeight: request.body["patientPetHeight"],
    patientPetWeight: request.body["patientPetWeight"],
    SpeciesSpeciesId: request.body["SpeciesSpeciesId"],
    PetOwnerPetOwnerId: request.body["PetOwnerPetOwnerId"],
    BreedBreedId: request.body["BreedBreedId"],
    MedicalCenterMedicalCenterId: request.body["MedicalCenterMedicalCenterId"],
    petOwnerName: request.body["petOwnerName"],
    TokenExternal: request.body["TokenExternal"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `INSERT into ${process.env.MYSQL_D_B_}.PatientPets (patientPetName, patientPetBirthday, patientPetGender, patientPetHeight,
  //  patientPetWeight, createdAt, updatedAt, SpeciesSpeciesId, PetOwnerPetOwnerId, BreedBreedId, MedicalCenterMedicalCenterId) VALUE (?,?,?,?,?,NOW(),NOW(),?,?,?,?)`;

  const schema = await {
    patientPetName: { type: "string", optional: false, max: 100, min: 2 },
    patientPetBirthday: {
      type: "array",
      optional: true,
      items: "string",
      min: 1,
      max: 3,
    },
    patientPetGender: { type: "string", optional: false, length: 1 },
    patientPetHeight: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 99999,
    },
    patientPetWeight: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 9999999,
    },
    SpeciesSpeciesId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 999,
    },
    PetOwnerPetOwnerId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    BreedBreedId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1000,
      max: 999999,
    },
    MedicalCenterMedicalCenterId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    petOwnerName: { type: "string", optional: false, max: 100, min: 5 },
    TokenExternal: { type: "string", optional: true },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      error: validationResponse,
    });
  } else {
    jsonValues.patientPetBirthday = validatePatientPetBirthday(jsonValues.patientPetBirthday);

    setLog("TRACE", __filename, funcName, `POST"petowner"`);
    await fetch(process.env.EMAIL_API_ + "petowner", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": jsonValues.TokenExternal,
      },
      body: JSON.stringify({
        petOwnerId: jsonValues.PetOwnerPetOwnerId,
        petOwnerName: jsonValues.petOwnerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => { setLog("DEBUG", __filename, funcName, `POST"petowner":${JSON.stringify(data)}`); },
        (error) => { setLog("ERROR", __filename, funcName, `POST"petowner":${JSON.stringify(error)}`); });

    await db.patientPet.create({
      patientPetName: jsonValues.patientPetName,
      patientPetBirthday: jsonValues.patientPetBirthday,
      patientPetGender: jsonValues.patientPetGender,
      patientPetHeight: jsonValues.patientPetHeight,
      patientPetWeight: jsonValues.patientPetWeight,
      SpeciesSpeciesId: jsonValues.SpeciesSpeciesId,
      PetOwnerPetOwnerId: jsonValues.PetOwnerPetOwnerId,
      BreedBreedId: jsonValues.BreedBreedId,
      MedicalCenterMedicalCenterId: jsonValues.MedicalCenterMedicalCenterId,
    }).then((rows) => {
      setLog("TRACE", __filename, funcName, `${apiUrl}patientPet.updated.ok:${jsonValues.patientPetName}, ${rows}`);
      response.status(201).json({
        message: apiMessage["201"][1],
        ok: true,
      });
    })
      .catch((err) => {
        setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(err)}`);
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      })
      .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use POST with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPO"}
  // Run again the GET option to check the list of records
});

routePatientPet.put("/api/patientpet", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientPet.put(";
  const apiUrl = "/api/patientpet|";
  var jsonValues = await {
    patientPetName: request.body["patientPetName"],
    patientPetBirthday: request.body["patientPetBirthday"],
    patientPetGender: request.body["patientPetGender"],
    patientPetHeight: request.body["patientPetHeight"],
    patientPetWeight: request.body["patientPetWeight"],
    SpeciesSpeciesId: request.body["SpeciesSpeciesId"],
    PetOwnerPetOwnerId: request.body["PetOwnerPetOwnerId"],
    BreedBreedId: request.body["BreedBreedId"],
    MedicalCenterMedicalCenterId: request.body["MedicalCenterMedicalCenterId"],
    patientPetId: request.body["patientPetId"],
    petOwnerName: request.body["petOwnerName"],
    TokenExternal: request.body["TokenExternal"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = await `UPDATE ${process.env.MYSQL_D_B_}.PatientPets SET patientPetName=?, patientPetBirthday=?, patientPetGender=?, 
  //     patientPetHeight=?, patientPetWeight=?,SpeciesSpeciesId=?, PetOwnerPetOwnerId=?, BreedBreedId=?,
  //     MedicalCenterMedicalCenterId=?, updatedAt=NOW() WHERE patientPetId=?`;

  const schema = await {
    patientPetName: { type: "string", optional: false, max: 100, min: 2 },
    patientPetBirthday: {
      type: "array",
      optional: true,
      items: "string",
      min: 1,
      max: 3,
    },
    patientPetGender: { type: "string", optional: false, length: 1 },
    patientPetHeight: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 99999,
    },
    patientPetWeight: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 9999999,
    },
    SpeciesSpeciesId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 999,
    },
    PetOwnerPetOwnerId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    BreedBreedId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1000,
      max: 999999,
    },
    MedicalCenterMedicalCenterId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 10000,
      max: 9999999999,
    },
    patientPetId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1,
      max: 9999999,
    },
    petOwnerName: { type: "string", optional: false, max: 100, min: 5 },
    TokenExternal: { type: "string", optional: true },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);
  if (validationResponse !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}.validationResponse:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      error: validationResponse,
    });
  } else {
    jsonValues.patientPetBirthday = validatePatientPetBirthday(jsonValues.patientPetBirthday);

    setLog("TRACE", __filename, funcName, `POST"petowner"`);
    await fetch(process.env.EMAIL_API_ + "petowner", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": jsonValues.TokenExternal,
      },
      body: JSON.stringify({
        petOwnerId: jsonValues.PetOwnerPetOwnerId,
        petOwnerName: jsonValues.petOwnerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => { setLog("DEBUG", __filename, funcName, `POST"petowner":${JSON.stringify(data)}`); },
        (error) => { setLog("ERROR", __filename, funcName, `POST"petowner":${JSON.stringify(error)}`); });

    await db.patientPet.update({
      patientPetName: jsonValues.patientPetName,
      patientPetBirthday: jsonValues.patientPetBirthday,
      patientPetGender: jsonValues.patientPetGender,
      patientPetHeight: jsonValues.patientPetHeight,
      patientPetWeight: jsonValues.patientPetWeight,
      SpeciesSpeciesId: jsonValues.SpeciesSpeciesId,
      PetOwnerPetOwnerId: jsonValues.PetOwnerPetOwnerId,
      BreedBreedId: jsonValues.BreedBreedId,
      MedicalCenterMedicalCenterId: jsonValues.MedicalCenterMedicalCenterId,
    }, {
      where: { patientPetId: jsonValues.patientPetId },
    }).then((rows) => {
      setLog("TRACE", __filename, funcName, `${apiUrl}patientPet.updated.ok:${jsonValues.patientPetName}, ${rows}`);
      response.status(201).json({
        message: apiMessage["201"][1],
        ok: true,
      });
    })
      .catch((err) => {
        setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(err)}`);
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
}
);

routePatientPet.delete("/api/patientpet/:id", [auth, admin], async (request, response) => {
  const funcName = arguments.callee.name + "routePatientPet.delete(";
  const apiUrl = "/api/patientpet/:";
  var jsonValues = { patientPetId: parseInt(String(request.params.id)) };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = await `DELETE from ${process.env.MYSQL_D_B_}.PatientPets where patientPetId=?`;
  if (!jsonValues.patientPetId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: apiMessage["400"][1],
    });
  } else {
    db.patientPet.destroy({
      where:  jsonValues 
    }).then((rows) => {
      response.status(202).json({
        message: apiMessage["202"][1],
        ok: true,
      });
      setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
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

  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/patientpet/3"
  // in "Body" use none
  // Run again the GET option to check the list of records
}
);

module.exports = routePatientPet;
