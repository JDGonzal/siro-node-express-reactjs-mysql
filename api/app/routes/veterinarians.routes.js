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

// Setup the express server routeVeterinarian
const routeVeterinarian = express.Router();

routeVeterinarian.post("/api/veterinarian", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routeVeterinarian.post(";
  const apiUrl = "/api/veterinarian|";
  var jsonValues = { veterinarianId: parseInt(String(request.body["veterinarianId"])) };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `SELECT COUNT(veterinarianId)as found from ${process.env.MYSQL_D_B_}.veterinarians where veterinarianId=?`;
  if (!jsonValues.veterinarianId) {
    setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: apiMessage["400"][1],
    });
  } else {
    db.veterinarian.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("veterinarianId")), "found"],
      ],
      where: jsonValues,
    })
      .then((rows) => {
        setLog("DEBUG", __filename, funcName, `${apiUrl}${JSON.stringify(rows)}`);
        if (rows[0].dataValues.found === 0 && jsonValues.veterinarianId > 0) {
          // query = `INSERT into ${process.env.MYSQL_D_B_}.veterinarians (createdAt, updatedAt, veterinarianId, veterinarianName) VALUE (NOW(), NOW(), ?, ?)`;
          jsonValues["veterinarianName"] = request.body["veterinarianName"]; // { veterinarianId:X, veterinarianName:Y }
          const schema = {
            veterinarianId: {
              type: "number",
              optional: false,
              positive: true,
              integer: true,
              min: 10000,
              max: 9999999999,
            },
            veterinarianName: {
              type: "string",
              optional: false,
              max: 100,
              min: 5,
            },
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
            db.veterinarian.create(jsonValues)
              .then((rows) => {
                setLog("TRACE", __filename, funcName, `${apiUrl}.created:${JSON.stringify(jsonValues)}.rows:${rows}`);
                response.status(201).json({
                  message: apiMessage["201"][1],
                  ok: true,
                  petOwnerId: jsonValues.veterinarianId,
                  petOwnerName: jsonValues["veterinarianName"],
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
          setLog("TRACE", __filename, funcName, `${apiUrl}.veterinarianId:${jsonValues.veterinarianId}.exists:${rows[0].dataValues.found}`);
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
  }

});

routeVeterinarian.get("/api/veterinarian/veterinarianname/:id", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routeVeterinarian.get(";
  const apiUrl = "/api/veterinarian/veterinarianname:";
  var jsonValues = { veterinarianId: String(parseInt(request.params.id)) };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  // var query = `SELECT COUNT(veterinarianId)as found from ${process.env.MYSQL_D_B_}.veterinarians where veterinarianId=?`;

  const schema = await {
    veterinarianId: {
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
    db.veterinarian.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("veterinarianId")), "found"],
      ],
      where: jsonValues,
    })
      .then((rows) => {
        setLog("DEBUG", __filename, funcName, `${apiUrl}${JSON.stringify(rows)}`);
        if (rows[0].found > 0) {
          // query = `SELECT veterinarianId as found, veterinarianName from ${process.env.MYSQL_D_B_}.veterinarians where veterinarianId=?`;
          db.veterinarian.findAll({
            attributes: [['veterinarianId', 'found'], 'veterinarianName'],
            where: jsonValues,
          })
            .then((rows) => {
              setLog("DEBUG", __filename, funcName, `${apiUrl}${JSON.stringify(rows)}`);
              response.send({
                ok: true,
                found: rows[0].found,
                petOwnerName: rows[0].veterinarianName,
              });
            })
            .catch((err) => {
              setLog("ERROR", __filename, funcName, `${apiUrl}.error:${JSON.stringify(err)}`);
              response.status(501).json({
                message: apiMessage["501"][1],
                ok: false,
                error: err,
              });
            })
            .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).select.end`); });

        } else {
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
  }

  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

routeVeterinarian.post("/api/veterinarian/veterinariannames", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routeVeterinarian.post(";
  const apiUrl = "/api/veterinarian/veterinariannames";
  var jsonValues = { patientPetName: `%${request.body.patientPetName}%`, };
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  var query = `SELECT po.veterinarianName as label, se.veterinarianId FROM
      (SELECT DISTINCT(po.veterinarianId)
      FROM ${process.env.MYSQL_D_B_}.veterinarians po
      INNER JOIN ${process.env.MYSQL_D_B_}.PatientPets pp ON po.veterinarianId = pp.PetOwnerPetOwnerId
      WHERE pp.patientPetName LIKE :patientPetName)
    as se
    INNER JOIN veterinarians po ON po.veterinarianId = se.veterinarianId
    ORDER BY po.veterinarianName`;

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
    db.veterinarian.query(query, {
      replacements: { patientPetName: jsonValues.patientPetName },
      type: QueryTypes.SELECT,
    })
      .then((rows) => {
        setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
        response.send(rows);
      })
      .catch((err) => {
        setLog("ERROR", __filename, funcName, `${apiUrl}.error:${JSON.stringify(err)}`);
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      })
      .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });
  }

  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

// Export the routeVeterinarian
module.exports = routeVeterinarian;
