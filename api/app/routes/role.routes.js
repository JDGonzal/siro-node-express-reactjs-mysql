const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const db = require("../models");
const setLog = require("../utils/logs.utils.js")

// Setup the express server routeRoles
const routeRoles = express.Router();

routeRoles.post("/api/auth/signup/roleV", async (request, response) => {
  const funcName = arguments.callee.name + "routeRoles.post(";
  const apiUrl = "/api/auth/signup/roleV|";
  setLog("TRACE", __filename, funcName, `${apiUrl}user_roles.create(${request.body})`);
  //var query = `INSERT into ${process.env.MYSQL_D_B_}.User_Roles (createdAt, updatedAt, roleId, userId) VALUE (NOW(), NOW(), ?, ?)`;
  db.user_roles.create({
    roleId: "1",
    userId: request.body["userId"]
  }).then(() => { setLog("INFO", __filename, funcName, `${apiUrl}`); })
    .catch((err) => { setLog("ERROR", __filename, funcName, JSON.stringify(err)); })
    .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); })
});

routeRoles.post("/api/auth/signup/roleE", [auth, clinic], async (request, response) => {
  const funcName = arguments.callee.name + "routeRoles.post(";
  const apiUrl = "/api/auth/signup/roleE|";
  setLog("TRACE", __filename, funcName, `${apiUrl}user_roles.create(${request.body})`);
  //var query = `INSERT into ${process.env.MYSQL_D_B_}.User_Roles (createdAt, updatedAt, roleId, userId) VALUE (NOW(), NOW(), ?, ?)`;
  db.user_roles.create({
    roleId: "2",
    userId: request.body["userId"]
  }).then(() => { setLog("INFO", __filename, funcName, `${apiUrl}`); })
    .catch((err) => { setLog("ERROR", __filename, funcName, JSON.stringify(err)); })
    .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); })
});

routeRoles.post("/api/auth/signup/roleL", [auth, laboratory], async (request, response) => {
  const funcName = arguments.callee.name + "routeRoles.post(";
  const apiUrl = "/api/auth/signup/roleL|";
  setLog("TRACE", __filename, funcName, `${apiUrl}user_roles.create(${request.body})`);
  //var query = `INSERT into ${process.env.MYSQL_D_B_}.User_Roles (createdAt, updatedAt, roleId, userId) VALUE (NOW(), NOW(), ?, ?)`;
  db.user_roles.create({
    roleId: "3",
    userId: request.body["userId"]
  }).then(() => { setLog("INFO", __filename, funcName, `${apiUrl}`); })
    .catch((err) => { setLog("ERROR", __filename, funcName, JSON.stringify(err)); })
    .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); })
});

routeRoles.post("/api/auth/signup/roleA", [auth, admin], async (request, response) => {
  const funcName = arguments.callee.name + "routeRoles.post(";
  const apiUrl = "/api/auth/signup/roleA|";
  setLog("TRACE", __filename, funcName, `${apiUrl}user_roles.create(${request.body})`);
  //var query = `INSERT into ${process.env.MYSQL_D_B_}.User_Roles (createdAt, updatedAt, roleId, userId) VALUE (NOW(), NOW(), ?, ?)`;
  db.user_roles.create({
    roleId: "4",
    userId: request.body["userId"]
  }).then(() => { setLog("INFO", __filename, funcName, `${apiUrl}`); })
    .catch((err) => { setLog("ERROR", __filename, funcName, JSON.stringify(err)); })
    .finally(() => { setLog("DEBUG", __filename, funcName, `(${apiUrl}).end`); })
});

// Export the routeRoles
module.exports = routeRoles;
