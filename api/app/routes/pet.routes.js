const express = require('express');
const { request, response } = require('express');
require('dotenv').config(); // import config = require('config');
const routePet = express.Router();
const Validator = require('fastest-validator');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, clinic, laboratory, viewer } = require("../middleware/roles.js");
const mysqlConnection = require('../utils/database.js');
const apiMessage = require('../utils/messages.js');

routePet.get('/api/pet', [auth, viewer], (request,response)=>{
  var query= `SELECT * from ${process.env.MYSQL_D_B_}.Pet`;
  mysqlConnection.query(query, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: apiMessage['501'][1],
        error: err
      });
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/pet"
  // in "Body" use none
});

routePet.post('/api/pet', [auth, clinic], (request,response)=>{
  var query= `INSERT into ${process.env.MYSQL_D_B_}.Pets
              (PetName)
              VALUE (?)`;
  var jsonValues ={
    PetName: request.body['PetName']
  };
  const schema = {
    PetName:{type:"string", optional:false, max:"100", min:"2"}
  }
  const v= new Validator();
  const validationResponse = v.validate(jsonValues,schema);

  if (validationResponse !== true){
    return response.status(400).json({
      message: apiMessage['400'][1],
      errors: validationResponse
    });
  }
  var arrayValues=Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: apiMessage['501'][1],
        error: err
      });
    }
    response.status(201).json({
      message: apiMessage['201'][1],
    });
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/pet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPO"}
  // Run again the GET option to check the list of records
});

routePet.put('/api/pet', [auth, clinic], (request,response)=>{
  var query= `UPDATE ${process.env.MYSQL_D_B_}.Pets
               set PetName=? where PetId=?`;
  var jsonValues ={
    PetName: request.body['PetName'],
    PetId: request.body['PetId']
  };
  const schema = {
    PetName:{type:"string", optional:false, max:"100", min:"2"},
    PetId:{type:"number", optional:false}
  }
  const v= new Validator();
  const validationResponse = v.validate(jsonValues,schema);
  if (validationResponse !== true){
    return response.status(400).json({
      message: apiMessage['400'][1],
      errors: validationResponse
    });
  }
  var arrayValues=Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: apiMessage['501'][1],
        error: err
      });
    }
    response.status(202).json({
      message: apiMessage['202'][1],
    });
  });
  // To Test in Postman use PUT with this URL "http://localhost:49146/api/pet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPOX", "PetId": "3"}
  // Run again the GET option to check the list of records
});

routePet.delete('/api/pet/:id', [auth, admin], (request,response)=>{
  var query= `DELETE from ${process.env.MYSQL_D_B_}.Pets
               where PetId=?`;
  var values =[
    parseInt(request.params.id)
  ];
  mysqlConnection.query(query, values, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: apiMessage['501'][1],
        error: err
      });
    }
    response.status(202).json({
      message: apiMessage['202'][1],
    });
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/pet/3"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

module.exports = routePet;
