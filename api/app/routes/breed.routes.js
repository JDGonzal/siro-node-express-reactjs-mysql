const express = require("express");

// Import middlewares
const auth = require("../middleware/auth.js");
const { admin, laboratory, clinic } = require("../middleware/roles.js");
const db = require("../models");
const apiMessage = require("../utils/messages.js");
const setLog = require("../utils/logs.utils.js")

// Setup the express server routeRoles
const routeBreed = express.Router();

routeBreed.get("/api/breed/:id", [auth, clinic], (request, response) => {
  var values = [parseInt(String(request.params.id))];
  const funcName = arguments.callee.name + "routeBreed.get(";
  const apiUrl = "/api/breed/:";
  setLog("TRACE", __filename, funcName, `${apiUrl}${JSON.stringify(values)}`);
  var query = `SELECT breedId,breedName,IF(MOD(breedId,1000)=1,0,1) as breedSort, SpeciesSpeciesId  
            FROM ${process.env.MYSQL_D_B_}.Breeds
            WHERE SpeciesSpeciesId = :speciesId
            ORDER BY breedSort,breedName`;
  if (!values) {
    setLog("ERROR", __filename, funcName, `${apiUrl}:${JSON.stringify(values)}`);
    response.status(400).json({
      message: apiMessage["400"][1],
      ok: false,
      errors: apiMessage["400"][1],
    });
  } else {
    setLog("TRACE", __filename, funcName, `${apiUrl}${query}`);
    db.sequelize
      .query(query, {
        replacements: { speciesId: values },
        type: QueryTypes.SELECT,
      })
      .then((rows)=>{
        setLog("DEBUG",__filename,funcName,`${apiUrl}.rows:${JSON.stringify(rows)}`);
        response.send(rows)
      })
      .catch((err)=>{
        response.status(501).json({
          message: apiMessage["501"][1],
          ok: false,
          error: err,
        });
        setLog("ERROR", __filename, funcName, JSON.stringify(err));
      })
      .finally(()=>{
        setLog("INFO",__filename,funcName,`(${apiUrl}${JSON.stringify(values)}).end`);
      });
  }

  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

module.exports = routeBreed;
