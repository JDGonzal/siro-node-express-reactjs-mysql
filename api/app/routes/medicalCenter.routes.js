const express = require("express");
require("dotenv").config(); // import config = require('config');
const Validator = require("fastest-validator");

// Import middlewares
const db = require("../models");
const { admin, clinic } = require("../middleware/roles.js");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeMedicalCenter
const routeMedicalCenter = express.Router();

routeMedicalCenter.post("/api/medicalcenter", async (request, response) => {
  const funcName = arguments.callee.name + "routeMedicalCenter.post(";
  const apiUrl = "/api/medicalcenter|";
  var jsonValues = {
    medicalCenterId: parseInt(request.body["medicalCenterId"]),
  };
  await setLog("TRACE", __filename, funcName, `${apiUrl}body:${JSON.stringify(jsonValues)}`);
  await db.medicalCenter.findAll({
    attributes: [
      [db.sequelize.fn("COUNT", db.sequelize.col("medicalCenterId")), "found"],
    ],
    where: { medicalCenterId: jsonValues.medicalCenterId },
  })
    .then((rows) => {
      setLog("DEBUG", __filename, funcName, `${apiUrl}${JSON.stringify(rows)}`);
      if (rows[0].dataValues.found === 0 && jsonValues.medicalCenterId > 0) {
        jsonValues = {
          medicalCenterId: request.body["medicalCenterId"],
          medicalCenterName: request.body["medicalCenterName"],
          medicalCenterAddress: request.body["medicalCenterAddress"],
          medicalCenterTelNumber: request.body["medicalCenterTelNumber"],
          StateStateId: request.body["StateStateId"],
          CityCityId: request.body["CityCityId"],
        };
        const schema = {
          medicalCenterId: {
            type: "number",
            optional: false,
            positive: true,
            integer: true,
            min: 1000,
            max: 9999999999,
          },
          medicalCenterName: {
            type: "string",
            optional: false,
            max: "255",
            min: "5",
          },
          medicalCenterAddress: {
            type: "string",
            optional: false,
            max: "255",
            min: "8",
          },
          medicalCenterTelNumber: {
            type: "number",
            optional: false,
            positive: true,
            integer: true,
            min: 1000000,
            max: 9999999999,
          },
          StateStateId: {
            type: "number",
            optional: false,
            positive: true,
            integer: true,
            min: 1,
            max: 99,
          },
          CityCityId: {
            type: "number",
            optional: false,
            positive: true,
            integer: true,
            min: 1000,
            max: 99999,
          },
        };
        const v = new Validator();
        const validationResponse = v.validate(jsonValues, schema);
        if (validationResponse !== true) {
          setLog("ERROR", __filename, funcName, `${apiUrl}validationResponse.error:${JSON.stringify(validationResponse)}`);
          return response.status(400).json({
            message: apiMessage["400"][1],
            ok: false,
            errors: validationResponse,
          });
        };
        setLog("TRACE", __filename, funcName, `Creating the Medical Center`);
        db.medicalCenter.create({
          medicalCenterId: jsonValues.medicalCenterId,
          medicalCenterName: jsonValues.medicalCenterName,
          medicalCenterAddress: jsonValues.medicalCenterAddress,
          medicalCenterTelNumber: jsonValues.medicalCenterTelNumber,
          StateStateId: jsonValues.StateStateId,
          CityCityId: jsonValues.CityCityId,
        })
          .then(() => {
            response.status(201).json({
              message: apiMessage["201"][1],
              ok: true,
              medicalCenterId: jsonValues.medicalCenterId,
              medicalCenterName: jsonValues.medicalCenterName,
            });
          })
          .catch((err) => {
            response.status(501).json({
              message: apiMessage["501"][1],
              ok: false,
              error: err,
            });
          })
          .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).create.end`); });

      } else {
        setLog("TRACE", __filename, funcName, `(${apiUrl}).medicalCenterId:${JSON.stringify(values[0])}.Exists:${rows[0].found}`);
        response.send({
          ok: true,
          found: rows[0].dataValues.found,
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

routeMedicalCenter.post("/api/medicalcenter/user",
  async (request, response) => {
    const funcName = arguments.callee.name + "routeMedicalCenter.post(";
    const apiUrl = "/api/medicalcenter/user|";
    var jsonValues = {
      medicalCenterId: await request.body["medicalCenterId"],
      userId: request.body["userId"],
    }
    setLog("TRACE", __filename, funcName, `${apiUrl}.body:${JSON.stringify(jsonValues)}`);
    // var query = `INSERT into ${process.env.MYSQL_D_B_}.user_medicalcenters (createdAt, updatedAt, medicalCenterId, userId) VALUE (NOW(), NOW(), ?, ?)`;
    db.user_medicalcenters.create({
      medicalCenterId: jsonValues.medicalCenterId,
      userId: jsonValues.userId,
    })
      .then(() => {
        response.status(201).json({
          message: apiMessage["201"][1],
          ok: true,
          medicalCenterId: jsonValues.medicalCenterId,
          userId: jsonValues.userId,
        });
      })
      .catch((err) => {
        setLog("ERROR", __filename, funcName, `${apiUrl}.error:${JSON.stringify(err)}`);
      })
      .finally(() => {
        setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`);
      });
  }
);

routeMedicalCenter.get( "/api/medicalcenter/medicalcentername/:id", async (request, response) => {
    const funcName = arguments.callee.name + "routeMedicalCenter.get(";
    const apiUrl = "/api/medicalcenter/medicalcentername/:";
    var jsonValues = { medicalCenterId: parseInt(request.params.id) };
    setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
    const schema =  {
      medicalCenterId: {
        type: "number",
        optional: false,
        positive: true,
        integer: true,
        min: 10000,
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
        errors: validationResponse,
      });
    }
    // var query = `SELECT COUNT(MedicalCenterId)as found from ${process.env.MYSQL_D_B_}.MedicalCenters where medicalCenterId=?`;
    db.medicalCenter.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("medicalCenterId")), "found"],
      ],
      where: jsonValues,
    })
      .then((rows) => {
        setLog("INFO", __filename, funcName, `${apiUrl}rows: ${JSON.stringify(rows)},${rows[0].dataValues.found}`);
        if (rows[0].dataValues.found > 0) {
          // query = `SELECT medicalCenterId as found, medicalCenterName, medicalCenterAddress, medicalCenterTelNumber, StateStateId, CityCityId from ${process.env.MYSQL_D_B_}.MedicalCenters where medicalCenterId=?`
          db.medicalCenter.findAll({
            attributes:
              [['medicalCenterId', 'found'], 'medicalCenterName', 'medicalCenterAddress', 'medicalCenterTelNumber', 'StateStateId', 'CityCityId'],
            where: { medicalCenterId: jsonValues.medicalCenterId },
          }).then((rows) => {
            setLog("INFO", __filename, funcName, `${apiUrl}rows: ${JSON.stringify(rows)}`);
            response.send({
              ok: true,
              found: rows[0].found,
              medicalCenterName: rows[0].medicalCenterName,
              medicalCenterAddress: rows[0].medicalCenterAddress,
              medicalCenterTelNumber: rows[0].medicalCenterTelNumber,
              StateStateId: rows[0].StateStateId,
              CityCityId: rows[0].CityCityId,
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
            .finally(() => {
              setLog("DEBUG", __filename, funcName, `(db.medicalCenter.findAll).end`);
            })
        } else {

          response.send({
            ok: true,
            found: rows[0].dataValues.found,
            medicalCenterName: '',
            medicalCenterAddress: '',
            medicalCenterTelNumber: '',
            StateStateId: 0,
            CityCityId: 0,
          });
        }
      })
      .catch((err) => {
        setLog("ERROR", __filename, funcName, `${apiUrl}${JSON.stringify(err)}`);
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      })
      .finally(() => {
        setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`);
      });

    // To Test in Postman use GET with this URL 'http://localhost:49146//api/medicalcenter/medicalcentername/909090'
    // in 'Body' use none
  }
);

// Export the routeMedicalCenter
module.exports = routeMedicalCenter;
