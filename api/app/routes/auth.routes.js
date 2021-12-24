// Import dependencies
const express = require('express');
const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Validator = require('fastest-validator');
require('dotenv').config(); // import config = require('config');
const fetch = require('cross-fetch');

// Import middlewares
const passwordEncrypt = require('../utils/generatePassword.js');
const sendEmail = require('../utils/email.js');
const auth = require('../middleware/auth.js');
const { admin, editor, viewer } = require('../middleware/roles.js');
const mysqlConnection = require('../utils/database.js');
const getToken = require('../utils/getToken.js');
const apiMessage = require('../utils/messages.js')

// Setup the express server routeAuth
const routeAuth = express.Router();

// On post
routeAuth.post('/api/auth/signin', async (request, response) => {
  var query = `SELECT u.*, (SELECT GROUP_CONCAT(ur.roleId SEPARATOR ',')
                            FROM ${process.env.MYSQL_D_B_}.user_roles ur 
                          WHERE ur.userId = u.userId) AS userRole,
                          (SELECT GROUP_CONCAT(um.medicalCenterId SEPARATOR ',')
                            FROM ${process.env.MYSQL_D_B_}.user_medicalcenters um 
                          WHERE um.userId = u.userId) AS userMedicalCenter
               from ${process.env.MYSQL_D_B_}.Users u
               where email=? or password=?`;
  console.log('/api/auth/signin');
  // Get to user from the database, if the user is not there return error
  var jsonValues = {
    email: request.body['email'].toString().toLowerCase(),
    password: request.body['password']
  };
  const schema = {
    email: { type: 'string', optional: false, max: '100', min: '5' },
    password: { type: 'string', optional: false, max: '100', min: '6' }
  }
  const v = new Validator();
  const validationResponse = v.validate(jsonValues, schema);
  if (validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      errors: validationResponse
    });
  }
  var arrayValues = Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    console.log('row ', rows[0].password, rows[0].isActive);
    //Validate an existing email and password from DB
    if (!rows) {
      return response.status(401).json({
        message: apiMessage['401'][1],
        errors: validationResponse
      });
    }
    //The user must be active in true 

    const isActive = rows[0].isActive;
    if (!isActive === true) {
      return response.status(511).json({
        message: apiMessage['511'][1],
      });
    }
    // Compare the password with the password in the database
    const valid = bcrypt.compare(jsonValues.password, rows[0].password);
    if (!valid) {
      return response.status(403).json({
        message: apiMessage['403'][1],
        errors: validationResponse
      });
    } else {
      let rolesArray = [];
      rows[0].userRole.includes('1') ? rolesArray.push('viewer') : null;
      rows[0].userRole.includes('2') ? rolesArray.push('editor') : null;
      rows[0].userRole.includes('3') ? rolesArray.push('admin') : null;
      console.log('role:', rolesArray);
      const token = getToken('8h', rolesArray, rows[0].userId);//Expires in 8 hours
      const centralMedicalsArray = rows[0].userMedicalCenter.split(',');
      response.send({
        ok: true,
        token: token,
        rolesArray: rolesArray,
        centralMedicalsArray: centralMedicalsArray
      });
      var date = new Date();
      console.log(date.toLocaleString());
      console.log(new Date(date.getTime() + 8 * 60 * 60000).toLocaleString());
      console.log(token);
    }
  });
  // To Test in Postman use POST with this URL 'http://localhost:49146/api/auth/signin
  // in 'Body' use raw and select JSON, put this JSON: 
  /* {'email': 'xxx@yycom',
      password: 'abcd1234'}*/
});

routeAuth.get('/api/auth/signup/:email', async (request, response) => {
  var query = `SELECT COUNT(userId)as found from ${process.env.MYSQL_D_B_}.Users
               where email=?`;
  var values = [
    request.params.email.toString().toLowerCase()
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
      query = `SELECT UserId as found from ${process.env.MYSQL_D_B_}.Users
               where email=?`;
      mysqlConnection.query(query, values, function (err, rows, fields) {
        if (err) {
          response.status(501).json({
            message: apiMessage['501'][1],
            ok: false,
            error: err
          });
        }
        response.send({
          ok: true,
          found: rows[0].found
        });
      });
    } else {
      console.log('found: ', rows[0].found, ' of ', values[0]);
      response.send({
        ok: true,
        found: rows[0].found
      });
    }
  });
  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});


routeAuth.post('/api/auth/signup', async (request, response) => {
  var query = `INSERT into ${process.env.MYSQL_D_B_}.Users
              (email,password,token,createdAt,updatedAt)
              VALUE (?,?,?,NOW(),NOW())`;
  var jsonValues = {
    email: await request.body['email'].toString().toLowerCase(),
    password: await passwordEncrypt(request.body['password']),
    token: await passwordEncrypt(request.body['email']),
    RolesArray: await request.body['Roles'],
    TokenExternal: await request.body['TokenExternal'],
    medicalCenterId: await request.body['medicalCenterId'],
    medicalCenterName: await request.body['medicalCenterName'],
    medicalCenterAddress:  await request.body['medicalCenterAddress'],
    medicalCenterTelNumber: await request.body['medicalCenterTelNumber'],
    StateStateId: await request.body['StateStateId'],
    CityCityId: await request.body['CityCityId'],
  };
  console.log('body:', jsonValues);
  try {
    if (await jsonValues.RolesArray[0] === true) {
      jsonValues.RolesArray[0] = 'viewer';
    }
    if (await jsonValues.RolesArray[1] === true) {
      jsonValues.RolesArray[1] = 'editor';
    }
    if (await jsonValues.RolesArray[2] === true) {
      jsonValues.RolesArray[2] = 'admin';
    }
  } catch (e) {
    console.log('RolesArray:',e);
  };

  const schema = {
    email: { type: 'string', optional: false, max: '100', min: '5' },
    password: { type: 'string', optional: false, max: '255', min: '60' },
    token: { type: 'string', optional: false, max: '255', min: '60' },
    RolesArray: { type: 'array', optional: false, max: '3', min: '1' },
    TokenExternal: { type: 'string', optional: true },
    medicalCenterId: { type: 'number', optional: false, positive: true, integer: true, min:1000, max: 9999999999 },
    medicalCenterName: { type: 'string', optional: false, max: '255', min: '5' },
    medicalCenterAddress: { type: 'string', optional: false, max: '255', min: '8' },
    medicalCenterTelNumber: { type: 'number', optional: false, positive: true, integer: true , min:1000000, max: 9999999999},
    StateStateId: { type: 'number', optional: false, positive: true, integer: true , min:1, max: 99},
    CityCityId: { type: 'number', optional: false, positive: true, integer: true , min:1000, max: 99999},
  }
  const v = new Validator();
  const validationResponse = v.validate(jsonValues, schema);
  if (validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      errors: validationResponse
    });
  }
  await fetch(process.env.EMAIL_API_ + 'medicalCenter', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      medicalCenterId: jsonValues.medicalCenterId,
      medicalCenterName: jsonValues.medicalCenterName,
      medicalCenterAddress: jsonValues.medicalCenterAddress,
      medicalCenterTelNumber: jsonValues.medicalCenterTelNumber,
      StateStateId: jsonValues.StateStateId,
      CityCityId: jsonValues.CityCityId,
    })
  })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });

  var arrayValues = await Object.values(jsonValues);

  await mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        error: err
      });
    }
    response.status(201).json({
      message: apiMessage['201'][1],
      roles: rows
    });
    const urlRoute = `${process.env.EMAIL_APP_}token?value=${jsonValues.token}&Token=${getToken('12h', jsonValues.RolesArray, 0)}`;
    console.log('To send email:', urlRoute);
    sendEmail(jsonValues.email, 'Activar Cuenta.', urlRoute, 1);
    var userId = 0;
    fetch(process.env.EMAIL_API_ + 'auth/signup/' + jsonValues.email, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then((data) => {
        userId = data.found;
        if (jsonValues.RolesArray[0] && userId > 0) {
          fetch(process.env.EMAIL_API_ + 'auth/signup/roleV', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: userId,
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log(data);
            }, (error) => {
              console.log(error);
            });
        };
        if (jsonValues.RolesArray[1] && userId > 0) {
          fetch(process.env.EMAIL_API_ + 'auth/signup/roleE', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': jsonValues.TokenExternal
            },
            body: JSON.stringify({
              userId: userId
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log(data);
            }, (error) => {
              console.log(error);
            });
        };
        console.log('userId: ', userId);
        if (jsonValues.RolesArray[2] && userId > 0) {
          fetch(process.env.EMAIL_API_ + 'auth/signup/roleA', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': jsonValues.TokenExternal
            },
            body: JSON.stringify({
              userId: userId
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log(data);
            }, (error) => {
              console.log(error);
            });
        };
        fetch(process.env.EMAIL_API_ + 'medicalCenter/user', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            medicalCenterId: jsonValues.medicalCenterId,
            userId: userId
          })
        })
          .then(res => res.json())
          .then((data) => {
            console.log(data);
          }, (error) => {
            console.log(error);
          });
      }, (error) => {
        console.log(error);
      });
  });
  // To Test in Postman use POST with this URL 'http://localhost:49146//api/auth/signup'
  // in 'Body' use raw and select JSON, put this JSON: 
  /* {'email': 'xxx@yycom',
      password: 'abcd1234',
      firstName: 'firstName',
      lastName: 'lastName',
      RolesArray: ['asmin','editor','viewer'],
      Token: 'abc12de36eer84d'*/
});

routeAuth.put('/api/token/activate', [auth, viewer], async (request, response) => {
  var query = `SELECT COUNT(UserId) as found FROM ${process.env.MYSQL_D_B_}.Users
              WHERE token=?`;
  var jsonValues = {
    token: request.body['token'],
  };
  console.log('query:', query, '\njsonValues:\n', jsonValues);
  const schema = {
    token: { type: 'string', optional: false, max: '60', min: '8' },
  }
  const v = new Validator();
  const validationResponse = v.validate(jsonValues, schema);
  if (validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      errors: validationResponse
    });
  }
  var arrayValues = Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    if (rows[0].found > 0) {
      query = `UPDATE ${process.env.MYSQL_D_B_}.Users
              set token=null,isActive=true,updatedAt=NOW()
              WHERE token=?`;

      mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
        if (err) {
          response.status(501).json({
            message: apiMessage['501'][1],
            ok: false,
            error: err
          });
        }
        response.status(202).json({
          message: apiMessage['202'][1],
          ok: true
        });

      });
    } else {
      response.status(409).json({
        ok: false,
        error: apiMessage['409'][1],
      });
    }
  });
  // To Test in Postman use POST with this URL 'http://localhost:49146//api/auth/signup'
  // in 'Body' use raw and select JSON, put this JSON: 
  /* {'email': 'xxx@yycom',
      password: 'abcd1234',
      firstName: 'firstName',
      lastName: 'lastName',
      RolesArray: ['asmin','editor','viewer'],
      Token: 'abc12de36eer84d'*/
});

// Export the routeAuth
module.exports = routeAuth;
