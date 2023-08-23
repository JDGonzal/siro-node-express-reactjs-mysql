const express = require("express");
require("dotenv").config(); // import config = require('config');
const Validator = require("fastest-validator");
const { QueryTypes } = require("sequelize");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, clinic } = require("../middleware/roles.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js")

// Setup the express server routePetOwner
const routePetOwner = express.Router();

routePetOwner.post("/api/petowner", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routePetOwner.post(";
  const apiUrl = "/api/petowner|";
  var jsonValues = { petOwnerId: parseInt(request.body["petOwnerId"]) };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `SELECT COUNT(petOwnerId)as found from ${process.env.MYSQL_D_B_}.petOwners where petOwnerId=?`;
  db.petOwner.findAll({
    attributes: [
      [db.sequelize.fn("COUNT", db.sequelize.col("petOwnerId")), "found"],
    ],
    where: { petOwnerId: jsonValues.petOwnerId },
  })
    .then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}${JSON.stringify(rows)}`);
      if (rows[0].dataValues.found === 0 && jsonValues.petOwnerId > 0) {
        jsonValues["petOwnerName"] = request.body["petOwnerName"]; // { petOwnerId:X, petOwnerName:Y }
        // query = `INSERT into ${process.env.MYSQL_D_B_}.petOwners (createdAt, updatedAt, petOwnerId, petOwnerName) VALUE (NOW(), NOW(), ?, ?)`;
        const schema = {
          petOwnerId: {
            type: "number",
            optional: false,
            positive: true,
            integer: true,
            min: 10000,
            max: 9999999999,
          },
          petOwnerName: { type: "string", optional: false, max: 100, min: 5 },
        };
        const v = new Validator();
        const validationResponse = v.validate(jsonValues, schema);
        if (validationResponse !== true) {
          setLog("ERROR", __filename, funcName, `${apiUrl}validationResponse.error:${JSON.stringify(validationResponse)}`);
          return response.status(400).json({
            message: apiMessage["400"][1],
            ok: false,
            error: validationResponse,
          });
        } else {
          db.petOwner.create(jsonValues)
            .then((rows) => {
              setLog("TRACE", __filename, funcName, `${apiUrl}.created:${JSON.stringify(jsonValues)}.rows:${rows}`);
              response.status(201).json({
                message: apiMessage["201"][1],
                ok: true,
                petOwnerId: jsonValues.petOwnerId,
                petOwnerName: jsonValues["petOwnerName"],
              });
            })
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
      } else {
        setLog("TRACE", __filename, funcName, `${apiUrl}.petOwnerId:${jsonValues.petOwnerId}.exists:${rows[0].found}`);
        response.send({
          ok: true,
          found: rows[0].found,
        });
      }
    })
    .catch((err) => {
      setLog("ERROR", __filename, funcName, `${apiUrl}.error:${JSON.stringify(err)}`);
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
    })
    .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); });

});

routePetOwner.get("/api/petowner/petownername/:id", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routePetOwner.post(";
  const apiUrl = "/api/petowner|";
  var jsonValues = { petOwnerId: parseInt(String(request.params.id)), };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `SELECT COUNT(petOwnerId)as found from ${process.env.MYSQL_D_B_}.petOwners where petOwnerId=?`;

  const schema = await {
    petOwnerId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1000,
      max: 9999999999,
    },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);
  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}validationResponse.error:${JSON.stringify(validationResponse)}`);
    return response.status(400).json({
      found: 0,
      message: apiMessage["400"][1],
      ok: false,
      error: validationResponse,
    });
  } else {
    db.petOwner.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("petOwnerId")), "found"],
      ],
      where: { petOwnerId: jsonValues.petOwnerId },
    })
      .then((rows) => {
        setLog("DEBUG", __filename, funcName, `${apiUrl}${JSON.stringify(rows)}`);
        if (rows[0].dataValues.found > 0) {
          // query = `SELECT petOwnerId as found, petOwnerName from ${process.env.MYSQL_D_B_}.petOwners where petOwnerId=?`;
          db.petOwner.findAll({
            attributes: [['petOwnerId', 'found'], 'petOwnerName'],
            where: { petOwnerId: jsonValues.petOwnerId },
          })
            .then((rows) => {
              response.send({
                ok: true,
                found: rows[0].found,
                petOwnerName: rows[0].petOwnerName,
              });
            })
            .catch((err) => {
              response.status(501).json({
                message: apiMessage["501"][1],
                ok: false,
                error: err,
              });
            })
            .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).select.end`); });
        } else {
          setLog("TRACE", __filename, funcName, `${apiUrl}.petOwnerId:${jsonValues.petOwnerId}.exists:${rows[0].found}`);
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
      .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

routePetOwner.post("/api/petowner/petownernames", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routePetOwner.post(";
  const apiUrl = "/api/petowner|";
  var jsonValues = { patientPetName: `%${request.body.patientPetName}%`, };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  var query = `SELECT po.petOwnerName as label, se.petOwnerId FROM
      (SELECT DISTINCT(po.petOwnerId)
      FROM ${process.env.MYSQL_D_B_}.petOwners po
      INNER JOIN ${process.env.MYSQL_D_B_}.PatientPets pp ON po.petOwnerId = pp.PetOwnerPetOwnerId
      WHERE pp.patientPetName LIKE :patientPetName)
    as se
    INNER JOIN petOwners po ON po.petOwnerId = se.petOwnerId
    ORDER BY po.petOwnerName`;

  const schema = await {
    patientPetName: { type: "string", optional: true, max: 100, min: 2 },
  };
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if ((await validationResponse) !== true) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    return response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      error: validationResponse,
    });
  } else {
    setLog("TRACE", __filename, funcName, `${apiUrl}${query}`);
  }
  db.petOwner.query(query, {
    replacements: { stateId: jsonValues.StateStateId },
    type: QueryTypes.SELECT,
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
    })
    .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });

  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

// Export the routePetOwner
module.exports = routePetOwner;
