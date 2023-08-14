const express = require("express");
require("dotenv").config(); // import config = require('config');
const Validator = require("fastest-validator");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, clinic } = require("../middleware/roles.js");
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js")

// Setup the express server routeMedicalCenter
const routeMedicalCenter = express.Router();

routeMedicalCenter.post("/api/medicalcenter", async (request, response) => {
  var query = `SELECT COUNT(medicalCenterId)as found from ${process.env.MYSQL_D_B_}.medicalCenters
               where medicalCenterId=?`;
  const values = [parseInt(request.body["medicalCenterId"])];
  mysqlConnection.getConnection(function (err, connection) {
    if (err) {
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
      return;
    }
    mysqlConnection.query(query, values, function (err, rows, fields) {
      connection.release();
      if (err) {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
      }
      if (rows[0].found === 0 && values[0] > 0) {
        query = `INSERT into ${process.env.MYSQL_D_B_}.medicalCenters 
              (createdAt, updatedAt, medicalCenterId, medicalCenterName, medicalCenterAddress,
                medicalCenterTelNumber, StateStateId, CityCityId)
              VALUE (NOW(), NOW(), ?, ?, ?, ?, ?, ?)`;

        var jsonValues = {
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
          return response.status(400).json({
            message: apiMessage["400"][1],
            ok: false,
            errors: validationResponse,
          });
        }
        var arrayValues = Object.values(jsonValues);
        mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
          if (err) {
            response.status(501).json({
              message: apiMessage["501"][1],
              ok: false,
              error: err,
            });
          }
          response.status(201).json({
            message: apiMessage["201"][1],
            ok: true,
            medicalCenterId: values[0],
            medicalCenterName: values[1],
          });
        });
      } else {
        setLog("TRACE",__filename,arguments.callee.name,`"medicalCenterId: ", ${JSON.stringify(values[0])}, ", Exists:", ${rows[0].found}`);
        response.send({
          ok: true,
          found: rows[0].found,
        });
      }
    });
    connection.on("error", function (err) {
      return;
    });
  });
});

routeMedicalCenter.post(
  "/api/medicalcenter/user",
  async (request, response) => {
    var query = `INSERT into ${process.env.MYSQL_D_B_}.user_medicalCenters
              (createdAt, updatedAt, medicalCenterId, userId)
              VALUE (NOW(), NOW(), ?, ?)`;
    var values = [request.body["medicalCenterId"], request.body["userId"]];
    setLog("TRACE",__filename,arguments.callee.name,"/api/medicalcenter/user");
    mysqlConnection.getConnection(function (err, connection) {
      if (err) {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
        return;
      }
      mysqlConnection.query(query, values, function (err, rows, fields) {
        connection.release();
        if (err) {
          setLog("ERROR",__filename,arguments.callee.name,JSON.stringify(err));
        }
        response.status(201).json({
          message: apiMessage["201"][1],
          ok: true,
          medicalCenterId: values[0],
          userId: values[1],
        });
      });
      connection.on("error", function (err) {
        return;
      });
    });
  }
);

routeMedicalCenter.get(
  "/api/medicalcenter/medicalcentername/:id",
  async (request, response) => {
    var query = `SELECT COUNT(MedicalCenterId)as found from ${process.env.MYSQL_D_B_}.MedicalCenters
               where medicalCenterId=?`;
    var values = [parseInt(request.params.id)];

    var jsonValues = await {
      medicalCenterId: parseInt(request.params.id),
    };
    const schema = await {
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
      return response.status(400).json({
        found: 0,
        message: apiMessage["400"][1],
        ok: false,
        errors: validationResponse,
      });
    }
    var arrayValues = await Object.values(jsonValues);
    mysqlConnection.getConnection(function (err, connection) {
      if (err) {
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
        return;
      }
      mysqlConnection.query(query, values, function (err, rows, fields) {
        connection.release();
        if (err) {
          response.status(501).json({
            message: apiMessage["501"][1],
            ok: false,
            error: err,
          });
        }
        if (rows[0].found > 0) {
          query = `SELECT medicalCenterId as found, medicalCenterName, medicalCenterAddress,
              medicalCenterTelNumber, StateStateId, CityCityId
              from ${process.env.MYSQL_D_B_}.MedicalCenters
              where medicalCenterId=?`;
          mysqlConnection.query(
            query,
            arrayValues,
            function (err, rows, fields) {
              if (err) {
                response.status(501).json({
                  message: apiMessage["501"][1],
                  ok: false,
                  error: err,
                });
              }
              response.send({
                ok: true,
                found: rows[0].found,
                medicalCenterName: rows[0].medicalCenterName,
                medicalCenterAddress: rows[0].medicalCenterAddress,
                medicalCenterTelNumber: rows[0].medicalCenterTelNumber,
                StateStateId: rows[0].StateStateId,
                CityCityId: rows[0].CityCityId,
              });
            }
          );
        } else {
          response.send({
            ok: true,
            found: rows[0].found,
          });
        }
      });
      connection.on("error", function (err) {
        return;
      });
    });
    // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
    // in 'Body' use none
  }
);

// Export the routeMedicalCenter
module.exports = routeMedicalCenter;
