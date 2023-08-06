const express = require("express");
require("dotenv").config(); // import config = require('config');
const Validator = require("fastest-validator");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, clinic } = require("../middleware/roles.js");
const mysqlConnection = require("../utils/database.js");
const apiMessage = require("../utils/messages.js");

// Setup the express server routeVeterinarian
const routeVeterinarian = express.Router();

routeVeterinarian.post(
  "/api/veterinarian",
  [auth, clinic],
  async (request, response) => {
    var query = `SELECT COUNT(veterinarianId)as found from ${process.env.MYSQL_D_B_}.veterinarians
               where veterinarianId=?`;
    const values = [parseInt(request.body["veterinarianId"])];
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
          query = `INSERT into ${process.env.MYSQL_D_B_}.veterinarians 
              (createdAt, updatedAt, veterinarianId, veterinarianName)
              VALUE (NOW(), NOW(), ?, ?)`;

          var jsonValues = {
            veterinarianId: request.body["veterinarianId"],
            veterinarianName: request.body["veterinarianName"],
          };

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
                veterinarianId: arrayValues[0],
                veterinarianName: arrayValues[1],
              });
            }
          );
        } else {
          console.log(
            "veterinarianId: ",
            values[0],
            ", Exists:",
            rows[0].found
          );
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

routeVeterinarian.get(
  "/api/veterinarian/veterinarianname/:id",
  [auth, clinic],
  async (request, response) => {
    var query = `SELECT COUNT(veterinarianId)as found from ${process.env.MYSQL_D_B_}.veterinarians
               where veterinarianId=?`;

    var jsonValues = await {
      veterinarianId: parseInt(request.params.id),
    };
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
      mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
        connection.release();
        if (err) {
          response.status(501).json({
            message: apiMessage["501"][1],
            ok: false,
            error: err,
          });
        }
        if (rows[0].found > 0) {
          query = `SELECT veterinarianId as found, veterinarianName
              from ${process.env.MYSQL_D_B_}.veterinarians
              where veterinarianId=?`;
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
                veterinarianName: rows[0].veterinarianName,
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

routeVeterinarian.post(
  "/api/veterinarian/veterinariannames",
  [auth, clinic],
  async (request, response) => {
    var query = `SELECT po.veterinarianName as label, se.veterinarianId FROM
      (SELECT DISTINCT(po.veterinarianId)
      FROM ${process.env.MYSQL_D_B_}.veterinarians po
      INNER JOIN ${process.env.MYSQL_D_B_}.PatientPets pp ON po.veterinarianId = pp.PetOwnerPetOwnerId
      WHERE pp.patientPetName LIKE ?)
    as se
    INNER JOIN veterinarians po ON po.veterinarianId = se.veterinarianId
    ORDER BY po.veterinarianName`;

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

// Export the routeVeterinarian
module.exports = routeVeterinarian;
