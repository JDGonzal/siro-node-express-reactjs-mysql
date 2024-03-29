// Import dependencies
const express = require("express");
const { request, response } = require("express");
const { QueryTypes } = require("sequelize");
const Validator = require("fastest-validator");
require("dotenv").config(); // import config = require('config');
const fetch = require("cross-fetch");

// Import middlewares
const db = require("../models");
const { encrypted, compare } = require("../utils/generatePassword.js");
const sendEmail = require("../utils/email.js");
const auth = require("../middleware/auth.js");
const { admin, clinic, laboratory, viewer } = require("../middleware/roles.js");
const getToken = require("../utils/getToken.js");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeAuth
const routeAuth = express.Router();

async function getRolesArray(jsonValues, userRole) {
  const funcName = arguments.callee.name;
  setLog("TRACE", __filename, funcName, `${JSON.stringify(jsonValues)},${userRole}`);
  let rolesArray = [];
  if (String(userRole).length > 0) {
    userRole.includes("1") ? rolesArray.push("viewer") : null;
    userRole.includes("2") ? rolesArray.push("clinic") : null;
    userRole.includes("3") ? rolesArray.push("laboratory") : null;
    userRole.includes("4") ? rolesArray.push("admin") : null;
  } else {
    jsonValues.RolesArray[0] === "viewer" ? rolesArray.push("viewer") : null;
    jsonValues.RolesArray[1] === "clinic" ? rolesArray.push("clinic") : null;
    jsonValues.RolesArray[2] === "laboratory" ? rolesArray.push("laboratory") : null;
    jsonValues.RolesArray[3] === "admin" ? rolesArray.push("admin") : null;
  }

  setLog("TRACE", __filename, funcName, `${rolesArray}`);
  return rolesArray;
}
// On post
routeAuth.post("/api/auth/signin", async (request, response) => {
  const funcName = arguments.callee.name + "routeAuth.post(";
  const apiUrl = "/api/auth/signin|";
  // Get to user from the database, if the user is not there return error
  var jsonValues = {
    email: String(request.body["email"]).toLowerCase(),
    password: request.body["password"], // Never "encrypt" because the "compare" will not work
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}${jsonValues.email}`);
  await db.user
    .findAll({
      attributes: ["password"],
      where: { email: jsonValues.email },
    })
    .then((rows) => {
      setLog("INFO", __filename, funcName, `${apiUrl}rows1: ${JSON.stringify(rows)}`);
      // Compare the password with the password in the database
      var isValid = compare(jsonValues.password, rows[0].password);
      const schema = {
        email: { type: "email", optional: false },
        password: { type: "string", optional: false, max: "100", min: "6" },
      };
      const v = new Validator();
      const validationResponse = v.validate(jsonValues, schema);

      setLog("DEBUG", __filename, funcName, `${apiUrl}compare.isValid:${isValid}); 
      validationResponse:${validationResponse}`);
      if (isValid && rows[0].dataValues.password.length > 0 && validationResponse === true) {
        const query = `SELECT u.*, (SELECT GROUP_CONCAT(ur.roleId SEPARATOR ',')
              FROM ${process.env.MYSQL_D_B_}.user_roles ur 
            WHERE ur.userId = u.userId) AS userRole,
            (SELECT GROUP_CONCAT(um.medicalCenterId SEPARATOR ',')
              FROM ${process.env.MYSQL_D_B_}.user_medicalcenters um 
            WHERE um.userId = u.userId) AS medicalCenterArray
        from ${process.env.MYSQL_D_B_}.Users u
        where email=:email or password=:password`;
        setLog("DEBUG", __filename, funcName, `${apiUrl}query:${query}, replacements:${jsonValues.email}`);
        db.sequelize.query(query, {
          replacements: jsonValues,
          type: QueryTypes.SELECT,
        })
          .then(async (rows) => {
            setLog("INFO", __filename, funcName, `${apiUrl}rows2: ${JSON.stringify(rows)}`);
            // response.send(rows);
            setLog("TRACE", __filename, funcName, `${apiUrl}isActive: ${rows[0].isActive}`);
            //The user must be active in true
            const isActive = await rows[0].isActive;
            if (!isActive && isActive === 0) {
              setLog("ERROR", __filename, funcName, apiMessage["511"][1]);
              response.status(511).json({
                message: apiMessage["511"][1],
                ok: false,
              });
            } else {
              const userRole = await rows[0].userRole;
              const rolesArray = await getRolesArray(jsonValues, userRole);
              setLog("TRACE", __filename, funcName, `${apiUrl}userRoles:"${userRole}", rolesArray${JSON.stringify(rolesArray)}`);

              const token = getToken("8h", rolesArray, rows[0].userId); //Expires in 8 hours
              const medicalCenterArray = rows[0].medicalCenterArray.split(",");
              response.send({
                ok: true,
                token: token,
                rolesArray: rolesArray,
                medicalCenterArray: medicalCenterArray,
              });
              var date = new Date();
              setLog("TRACE", __filename, funcName, `${apiUrl}startDate:${date.toLocaleString()}`);
              setLog("TRACE", __filename, funcName, `${apiUrl}endDate__:${new Date(date.getTime() + 8 * 60 * 60000).toLocaleString()}`);
              setLog("TRACE", __filename, funcName, `${apiUrl}token____:${token}`);
            }
          })
          .catch((err) => {
            setLog("ERROR", __filename, funcName, `${apiUrl}error:JSON.stringify(err)`);
            response.status(501).json({
              message: apiMessage["501"][1],
              ok: false,
              error: err,
            });
          })
          .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });
      } else {
        if (validationResponse !== true) {
          response.status(400).json({
            message: apiMessage["400"][1],
            ok: false,
            errors: validationResponse,
          });
        }
      }
    })
    .catch((err) => {
      setLog("ERROR", __filename, funcName, `${apiUrl}error:${err}`);
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
    })
    .finally(() => {
      setLog("INFO", __filename, funcName, `(${apiUrl}).end`);
    });

  // To Test in Postman use POST with this URL 'http://localhost:49146/api/auth/signin
  // in 'Body' use raw and select JSON, put this JSON:
  /* {'email': 'xxx@yycom',
      password: 'abcd1234'}*/
});

routeAuth.get("/api/auth/signup/:email", async (request, response) => {
  var jsonValues = { email: String(request.params.email).toLowerCase() }
  const funcName = arguments.callee.name + "routeAuth.get(";
  const apiUrl = "/api/auth/signup/:";
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(jsonValues)}`);
  db.user.findAll({
    attributes: [
      [db.sequelize.fn("COUNT", db.sequelize.col("userId")), "found"],
    ],
    where: { email: jsonValues.email },
  })
    .then(async (rows) => {
      const quantity = await rows[0].dataValues.found
      await setLog("INFO", __filename, funcName, `${apiUrl}rows: ${JSON.stringify(rows)}.qty:${quantity}`);
      if (await quantity > 0) {
        await db.user.findAll({
          attributes: ["userId"],
          where: { email: jsonValues.email },
        })
          .then((rows) => {
            setLog("INFO", __filename, funcName, `${apiUrl}rows: ${JSON.stringify(rows)}`);
            response.send({
              ok: true,
              found: rows[0].userId,
            });
          })
          .catch((err) => { setLog("ERROR", __filename, funcName, `${apiUrl}.findAll${JSON.stringify(err)}`); })
          .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}.findAll).end`); });
      } else {
        response.send({
          ok: true,
          found: rows[0].dataValues.found,
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
    .finally(() => { setLog("INFO", __filename, funcName, `(${apiUrl}).end`); });

  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

async function addUserRole(userId, roleId) {
  const funcName = arguments.callee.name;
  setLog("TRACE", __filename, funcName, `user_roles.creating(userId:${userId},roleId:${roleId})`);

  await db.user_roles.create({
    roleId: roleId,
    userId: userId
  })
    .then((rows) => { setLog("INFO", __filename, funcName, `user_roles.created:${JSON.stringify(rows)}`); })
    .catch((err) => { setLog("ERROR", __filename, funcName, `user_roles.error:${JSON.stringify(err)}`); })
    .finally(() => { setLog("DEBUG", __filename, funcName, `(user_roles.created).end`); });
}

async function addUserMedicalCenter(jsonValues, userId) {
  const funcName = arguments.callee.name;
  setLog("TRACE", __filename, funcName, `POST"medicalCenter/user"${jsonValues.medicalCenterId},${userId}`);
  await fetch(process.env.EMAIL_API_ + "medicalCenter/user", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      medicalCenterId: jsonValues.medicalCenterId,
      userId: userId,
    }),
  })
    .then((res) => res.json())
    .then((data) => { setLog("DEBUG", __filename, funcName, `POST"medicalCenter/user":${JSON.stringify(data)}`); },
      (error) => { setLog("ERROR", __filename, funcName, `POST"medicalCenter/user".error:${JSON.stringify(error)}`); }
    );
}

async function getUserbyEmail(jsonValues, firstTry) {
  const funcName = arguments.callee.name;
  var userId = 0;
  setLog("TRACE", __filename, funcName, `firstTry:${firstTry}, ${JSON.stringify(jsonValues)}`);
  setLog("TRACE", __filename, funcName, `GET"${process.env.EMAIL_API_}auth/signup/${jsonValues.email}"`);
  await fetch(process.env.EMAIL_API_ + "auth/signup/" + jsonValues.email, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      userId = data[0].found;
      setLog("INFO", __filename, funcName, `userId: ${userId}`);
    },
      (error) => {
        setLog("ERROR", __filename, funcName, JSON.stringify(error));
        if (firstTry === true) setTimeout(() => { getUserbyEmail(jsonValues, false); }, 2000);
      });
  return userId;
}

async function addMedicalCenter(jsonValues) {
  const funcName = arguments.callee.name;
  setLog("TRACE", __filename, funcName, `POST"${process.env.EMAIL_API_}medicalCenter".body(${JSON.stringify(jsonValues)})`);
  await fetch(process.env.EMAIL_API_ + "medicalCenter", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      medicalCenterId: jsonValues.medicalCenterId,
      medicalCenterName: jsonValues.medicalCenterName,
      medicalCenterAddress: jsonValues.medicalCenterAddress,
      medicalCenterTelNumber: jsonValues.medicalCenterTelNumber,
      StateStateId: jsonValues.StateStateId,
      CityCityId: jsonValues.CityCityId,
    }),
  })
    .then((res) => res.json())
    .then((data) => { setLog("DEBUG", __filename, funcName, `POST"medicalCenter"${JSON.stringify(data)}`); },
      (error) => { setLog("ERROR", __filename, funcName, `POST"medicalCenter"${JSON.stringify(error)}`); });
}

routeAuth.post("/api/auth/signup", async (request, response) => {
  const funcName = arguments.callee.name + "routeAuth.post(";
  const apiUrl = "/api/auth/signup|";

  var jsonValues = {
    email: await String(request.body["email"]).toLowerCase(),
    password: await encrypted(request.body["password"]),
    token: await encrypted(request.body["email"]),
    RolesArray: await request.body["Roles"],
    TokenExternal: await request.body["TokenExternal"],
    medicalCenterId: await request.body["medicalCenterId"],
    medicalCenterName: await request.body["medicalCenterName"],
    medicalCenterAddress: await request.body["medicalCenterAddress"],
    medicalCenterTelNumber: await request.body["medicalCenterTelNumber"],
    StateStateId: await request.body["StateStateId"],
    CityCityId: await request.body["CityCityId"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}body:${JSON.stringify(jsonValues)}`);
  let rolesArray = [];
  try {
    if ((await jsonValues.RolesArray[0]) === true) { jsonValues.RolesArray[0] = "viewer"; }
    if ((await jsonValues.RolesArray[1]) === true) { jsonValues.RolesArray[1] = "clinic"; }
    if ((await jsonValues.RolesArray[2]) === true) { jsonValues.RolesArray[2] = "laboratory"; }
    if ((await jsonValues.RolesArray[3]) === true) { jsonValues.RolesArray[3] = "admin"; }
  } catch (err) {
    setLog("ERROR", __filename, funcName, `${apiUrl}RolesArray.error:${JSON.stringify(err)}`);
  }
  const schema = {
    email: { type: "email", optional: false },
    password: { type: "string", optional: false, max: 255, min: 60 },
    token: { type: "string", optional: false, max: 255, min: 60 },
    RolesArray: { type: "array", optional: false, max: 4, min: 1 },
    TokenExternal: { type: "string", optional: true },
    medicalCenterId: {
      type: "number",
      optional: false,
      positive: true,
      integer: true,
      min: 1000,
      max: 9999999999,
    },
    medicalCenterName: { type: "string", optional: false, max: 255, min: 5 },
    medicalCenterAddress: { type: "string", optional: false, max: 255, min: 8 },
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
  } else {
    await addMedicalCenter(jsonValues);
    await setLog("TRACE", __filename, funcName, `Creating the user`);
    // var query = `INSERT into ${process.env.MYSQL_D_B_}.Users (email,password,token,createdAt,updatedAt) VALUE (?,?,?,NOW(),NOW())`;
    await db.user.create({
      email: jsonValues.email,
      password: jsonValues.password,
      token: jsonValues.token,
    })
      .then(async (rows) => {
        await setLog("DEBUG", __filename, funcName, `${apiUrl}.rows:${JSON.stringify(rows)}`);
        response.status(201).json({
          message: apiMessage["201"][1] + "\n" + apiMessage["204"][1],
          ok: true,
          roles: rows,
        });

        var userId = await rows.userId === 0 ? getUserbyEmail(jsonValues, true) : rows.userId;
        if (await userId > 0) {
          const rolesArray = getRolesArray(jsonValues, '');

          await jsonValues.RolesArray[0] === "viewer" ? addUserRole(userId, 1) : null;
          await jsonValues.RolesArray[1] === "clinic" ? addUserRole(userId, 2) : null;
          await jsonValues.RolesArray[2] === "laboratory" ? addUserRole(userId, 3) : null;
          await jsonValues.RolesArray[3] === "admin" ? addUserRole(userId, 4) : null;
          await addUserMedicalCenter(jsonValues, userId);

          // Going to send the email to verify the user/password
          const urlRoute = `${process.env.EMAIL_APP_}token?value=${jsonValues.token}`
            + `&Token=${getToken("12h", jsonValues.RolesArray, 0)}`;
          await setLog("TRACE", __filename, funcName, `To send email:${urlRoute}`);
          await sendEmail(jsonValues.email, "Activar Cuenta.", urlRoute, 1);
          // Get the userId based on the email address
        } else {
          await setLog("ERROR", __filename, funcName, `${apiUrl}.userId:${userId}`);
          response.status(501).json({
            message: apiMessage["501"][1],
            ok: false,
            error: userId,
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
      .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); });
  }



  // To Test in Postman use POST with this URL 'http://localhost:49146//api/auth/signup'
  // in 'Body' use raw and select JSON, put this JSON:
  /* {'email': 'xxx@yycom',
      password: 'abcd1234',
      firstName: 'firstName',
      lastName: 'lastName',
      RolesArray: ['asmin','clinic','laboratory','viewer'],
      Token: 'abc12de36eer84d'*/
});

routeAuth.put("/api/token/activate", [auth, viewer], async (request, response) => {
  const funcName = arguments.callee.name + "routeAuth.put(";
  const apiUrl = "/api/token/activate|";

  var jsonValues = {
    token: request.body["token"],
    TokenExternal: request.headers["x-auth-token"],
  };
  setLog("TRACE", __filename, funcName, `${apiUrl}.jsonValues: ${JSON.stringify(jsonValues)}`);
  const schema = {
    token: { type: "string", optional: false, max: "60", min: "8" },
    TokenExternal: { type: "string", optional: false, max: "255", min: "8" },
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
  // var query = `SELECT COUNT(UserId) as found, UserId FROM ${process.env.MYSQL_D_B_}.Users WHERE token=?`;
  db.user
    .findAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("userId")), "found"],
      ],
      where: { token: jsonValues.token },
    })
    .then((rows) => {
      setLog("INFO", __filename, funcName, `${apiUrl}rows: ${JSON.stringify(rows)}`);
      if (rows[0].dataValues.found > 0) {
        const userId = rows[0].dataValues.found;
        setLog("TRACE", __filename, funcName, `${apiUrl}user.update:${userId}`);
        // query = `UPDATE ${process.env.MYSQL_D_B_}.Users set token=null,isActive=true,updatedAt=NOW() WHERE token=?`;
        db.user.update({
          token: null,
          isActive: true,
        }, {
          where: { token: jsonValues.token },
        }).then((rows) => {
          setLog("TRACE", __filename, funcName, `${apiUrl}user.updated.ok:${userId}, ${rows}`);
          response.status(203).json({
            message: apiMessage["203"][1],
            ok: true,
          });
        })
          .catch((err) => {
            setLog("ERROR", __filename, funcName, `${apiUrl}user.update.error:${JSON.stringify(err)}`);
            response.status(501).json({
              message: apiMessage["501"][1],
              ok: false,
              error: err,
            });
          })
          .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}user.update).end`); });
      } else {
        response.status(409).json({
          ok: false,
          error: apiMessage["409"][1],
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
    .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); });

  // To Test in Postman use POST with this URL 'http://localhost:49146//api/auth/signup'
  // in 'Body' use raw and select JSON, put this JSON:
  /* {'email': 'xxx@yycom',
    password: 'abcd1234',
    firstName: 'firstName',
    lastName: 'lastName',
    RolesArray: ['asmin','clinic','laboratory','viewer'],
    Token: 'abc12de36eer84d'*/
}
);

// Export the routeAuth
module.exports = routeAuth;
