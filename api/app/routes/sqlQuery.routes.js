const express = require("express");
const { QueryTypes } = require('sequelize');
// Import middlewares
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routeSqlQuery = express.Router();

routeSqlQuery.get("/api/sqlquery/:sql" , async (request, response) => {
    var query = request.params.sql;
    try {
      await setLog("TRACE",__filename,arguments.callee.name+'routeSqlQuery.get(',`/api/sqlquery/:${JSON.stringify(query)}`);
      query = String(query).toLowerCase();
      const validationResponse = 
        query.substring(0, 6) === "select" && !query.includes('table_name') && !query.includes('information_schema');
      if (validationResponse !== true) {
        await setLog("ERROR",__filename,arguments.callee.name+'routeSqlQuery.get(',`/api/sqlquery/:${apiMessage["400"][1]}`);
        return response.status(400).json({
          message: apiMessage["400"][1],
          ok: false,
          errors: validationResponse,
        });
      }
      db.sequelize.query(query,{
        type: QueryTypes.SELECT,
      })
      .then((rows)=>{
        response.send(rows);
      })
      .catch((err)=>{
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
        setLog("ERROR",__filename,arguments.callee.name+'routeSqlQuery.get(',JSON.stringify(err));
      })
      .finally(()=>{
        setLog("INFO",__filename,arguments.callee.name+'routeSqlQuery.get(',`(/api/sqlquery/:${JSON.stringify(query)}).end`);
      })
    } catch (err) {
      response.status(501).json({
        message: apiMessage["501"][1],
        ok: false,
        error: err,
      });
      console.error(err);
    }
    // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
    // in "Body" use none
  }
);

module.exports = routeSqlQuery;
