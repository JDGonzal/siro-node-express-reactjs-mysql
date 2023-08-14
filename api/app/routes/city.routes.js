const express = require("express");
const { QueryTypes } = require('sequelize');
// Import middlewares
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js");

// Setup the express server routeRoles
const routeCity = express.Router();

routeCity.get("/api/city/:id", (request, response) => {
  var values = [parseInt(request.params.id)];
  setLog("TRACE",__filename,arguments.callee.name+'routeCity.get',`/api/city/:${JSON.stringify(values)}`);
  var query = `SELECT cityId,cityName,IF(MOD(cityId,1000)=1,0,1) as citySort, StateStateId  
            FROM ${process.env.MYSQL_D_B_}.Cities
            WHERE StateStateId = :stateId
            ORDER BY CitySort, CityName`;
            //FROM ${process.env.MYSQL_D_B_}.Cities
  db.sequelize.query(query,{
      replacements:{stateId:values},
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
      setLog("ERROR",__filename,arguments.callee.name+'routeCity.get',JSON.stringify(err));
    })
    .finally(()=>{
      setLog("INFO",__filename,arguments.callee.name+'routeCity.get',`(/api/city/:${JSON.stringify(values)}).end`);
    })
  
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeCity;
