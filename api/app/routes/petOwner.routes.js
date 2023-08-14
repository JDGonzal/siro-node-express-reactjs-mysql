const express = require("express");
require("dotenv").config(); // import config = require('config');
const Validator = require("fastest-validator");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, clinic } = require("../middleware/roles.js");
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js")

// Setup the express server routePetOwner
const routePetOwner = express.Router();

routePetOwner.post(
  "/api/petowner",
  [auth, clinic],
  async (request, response) => {
    var query = `SELECT COUNT(petOwnerId)as found from ${process.env.MYSQL_D_B_}.petOwners
               where petOwnerId=?`;
    const values = [parseInt(request.body["petOwnerId"])];
    setLog("TRACE",__filename,arguments.callee.name,`${query}, ${JSON.stringify(values)}`);
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
          query = `INSERT into ${process.env.MYSQL_D_B_}.petOwners 
              (createdAt, updatedAt, petOwnerId, petOwnerName)
              VALUE (NOW(), NOW(), ?, ?)`;

          var jsonValues = {
            petOwnerId: request.body["petOwnerId"],
            petOwnerName: request.body["petOwnerName"],
          };
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
            return response.status(400).json({
              message: apiMessage["400"][1],
              ok: false,
              error: validationResponse,
            });
          }
          var arrayValues = Object.values(jsonValues);
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
              response.status(201).json({
                message: apiMessage["201"][1],
                ok: true,
                petOwnerId: arrayValues[0],
                petOwnerName: arrayValues[1],
              });
            }
          );
        } else {
          setLog("TRACE",__filename,arguments.callee.name,`"petOwnerId: ", ${JSON.stringify(values[0])}, ", Exists:", ${rows[0].found}`);
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
  }
);

routePetOwner.get(
  "/api/petowner/petownername/:id",
  [auth, clinic],
  async (request, response) => {
    var query = `SELECT COUNT(petOwnerId)as found from ${process.env.MYSQL_D_B_}.petOwners
               where petOwnerId=?`;

    var jsonValues = await {
      petOwnerId: parseInt(request.params.id),
    };
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
      return response.status(400).json({
        found: 0,
        message: apiMessage["400"][1],
        ok: false,
        error: validationResponse,
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
      mysqlConnection.query(query, arrayValues, function (err, rows) {
        connection.release();
        if (err) {
          response.status(501).json({
            message: apiMessage["501"][1],
            ok: false,
            error: err,
          });
        }
        if (rows[0].found > 0) {
          query = `SELECT petOwnerId as found, petOwnerName
              from ${process.env.MYSQL_D_B_}.petOwners
              where petOwnerId=?`;
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
                petOwnerName: rows[0].petOwnerName,
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

routePetOwner.post(
  "/api/petowner/petownernames",
  [auth, clinic],
  async (request, response) => {
    var query = `SELECT po.petOwnerName as label, se.petOwnerId FROM
      (SELECT DISTINCT(po.petOwnerId)
      FROM ${process.env.MYSQL_D_B_}.petOwners po
      INNER JOIN ${process.env.MYSQL_D_B_}.PatientPets pp ON po.petOwnerId = pp.PetOwnerPetOwnerId
      WHERE pp.patientPetName LIKE ?)
    as se
    INNER JOIN petOwners po ON po.petOwnerId = se.petOwnerId
    ORDER BY po.petOwnerName`;

    var jsonValues = await {
      patientPetName: "%" + request.body.patientPetName + "%",
    };
    const schema = await {
      patientPetName: { type: "string", optional: true, max: 100, min: 2 },
    };
    const v = await new Validator();
    const validationResponse = await v.validate(jsonValues, schema);

    if ((await validationResponse) !== true) {
      return response.status(400).json({
        message: apiMessage["400"][1],
        ok: false,
        error: validationResponse,
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
      mysqlConnection.query(query, arrayValues, function (err, rows) {
        connection.release();
        if (err) {
          response.status(501).json({
            message: apiMessage["501"][1],
            ok: false,
            error: err,
          });
        }
        response.send(rows);
      });
      connection.on("error", function (err) {
        return;
      });
    });
    // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
    // in 'Body' use none
  }
);

// Export the routePetOwner
module.exports = routePetOwner;
