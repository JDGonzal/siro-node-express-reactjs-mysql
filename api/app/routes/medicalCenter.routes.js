const express = require('express');
require('dotenv').config(); // import config = require('config');
const Validator = require('fastest-validator');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, editor } = require('../middleware/roles.js');
const mysqlConnection = require('../utils/database.js');
const apiMessage = require('../utils/messages.js');

// Setup the express server routeMedicalCenter
const routeMedicalCenter = express.Router();

routeMedicalCenter.post('/api/medicalcenter', async (request, response) => {
  var query = `SELECT COUNT(medicalCenterId)as found from ${process.env.MYSQL_D_B_}.medicalCenters
               where medicalCenterId=?`;
  var values = [parseInt(request.body['medicalCenterId'])];
  mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    if (rows[0].found === 0 && values[0] > 0) {
      query = `INSERT into ${process.env.MYSQL_D_B_}.medicalCenters
              (createdAt, updatedAt, medicalCenterId, medicalCenterName)
              VALUE (NOW(), NOW(), ?, ?)`;
      values = [request.body['medicalCenterId'],
        request.body['medicalCenterName'],
        request.body['medicalCenterAddress'],
        request.body['medicalCenterTelNumber'],
        request.body['StateStateId'],
        request.body['CityCityId'],
      ];
      mysqlConnection.query(query, values, function (err, rows, fields) {
        if (err) {
          response.status(501).json({
            message: apiMessage['501'][1],
            ok: false,
            error: err
          });
        }
        response.status(201).json({
          message: apiMessage['201'][1],
          ok: true,
          medicalCenterId: values[0],
          medicalCenterName: values[1],
        });
      });
    } else {
      console.log('medicalCenterId: ', values[0], ', Exists:', rows[0].found);
      response.send({
        ok: true,
        found: rows[0].found
      });
    }
  });

});

routeMedicalCenter.post('/api/medicalcenter/user', async (request, response) => {
  var query = `INSERT into ${process.env.MYSQL_D_B_}.user_medicalCenters
              (createdAt, updatedAt, medicalCenterId, userId)
              VALUE (NOW(), NOW(), ?, ?)`;
  var values = [request.body['medicalCenterId'], request.body['userId']];
  console.log('/api/medicalcenter/user');
  mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      console.log(err);
    }
    response.status(201).json({
      message: apiMessage['201'][1],
      ok: true,
      medicalCenterId: values[0],
      userId: values[1],
    });
  });
});

routeMedicalCenter.get('/api/medicalcenter/medicalcentername/:id', async (request, response) => {
  var query = `SELECT COUNT(MedicalCenterId)as found from ${process.env.MYSQL_D_B_}.MedicalCenters
               where medicalCenterId=?`;
  var values = [
    parseInt(request.params.id)
  ];

  mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    if (rows[0].found > 0) {
      query = `SELECT medicalCenterId as found, medicalCenterName, medicalCenterAddress,
              medicalCenterTelNumber, StateStateId, CityCityId
              from ${process.env.MYSQL_D_B_}.MedicalCenters
              where medicalCenterId=?`;
      mysqlConnection.query(query, values, function (err, rows, fields) {
        if (err) {
          response.status(501).json({
            message: apiMessage['501'][1],
            ok: false,
            error: err,
          });
        }
        response.send({
          ok: true,
          found: rows[0].found,
          medicalCenterName: rows[0].medicalCenterName,
          medicalCenterAddress : rows[0].medicalCenterAddress,
          medicalCenterTelNumber : rows[0].medicalCenterTelNumber,
          StateStateId: rows[0].StateStateId,
          CityCityId: rows[0].CityCityId
        });
      });
    } else {
      response.send({
        ok: true,
        found: rows[0].found
      });
    }
  });
  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

// Export the routeMedicalCenter
module.exports = routeMedicalCenter;