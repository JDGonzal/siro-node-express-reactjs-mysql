// Import dependencies
const express = require('express');
const { request, response } = require('express');
const Validator = require('fastest-validator');
require('dotenv').config(); // import config = require('config');
const fetch = require('cross-fetch');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, clinic, laboratory, viewer } = require("../middleware/roles.js");
const mysqlConnection = require('../utils/database.js');
const apiMessage = require('../utils/messages.js');

// Setup the express server routeAuth
const routePatientPet = express.Router();

// On get
routePatientPet.get('/api/patientpet/:medicalCenterArray', [auth, viewer], async (request, response) => {
  var query = await `SELECT DISTINCT(pp.patientPetName) as label 
    FROM ${process.env.MYSQL_D_B_}.PatientPets pp
    INNER JOIN ${process.env.MYSQL_D_B_}.medicalcenters mc ON pp.MedicalCenterMedicalCenterId = mc.medicalCenterId
    WHERE mc.medicalCenterId IN (?)
    ORDER BY pp.patientPetName`;
  var jsonValues = await {
    medicalCenterArray: request.params['medicalCenterArray'],
  };
  const schema = await {
    medicalCenterArray: { type: "string", optional: false, max: 255, min: 5 }
  }
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if (await validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      ok: false,
      error: validationResponse
    });
  }
  var arrayValues = await Object.values(jsonValues);
  await mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use none
});

// On post
routePatientPet.post('/api/patientpet/get', [auth, viewer], async (request, response) => {
  var query = await `SELECT pp.*, pw.petOwnerName,sp.speciesName, br.breedName, mc.medicalCenterName 
    FROM ${process.env.MYSQL_D_B_}.PatientPets pp
    INNER JOIN petowners pw ON pp.PetOwnerPetOwnerId = pw.petOwnerId
    INNER JOIN species sp ON pp.SpeciesSpeciesId = sp.speciesId
    INNER JOIN breeds br ON pp.BreedBreedId = br.breedId
    INNER JOIN medicalcenters mc ON pp.MedicalCenterMedicalCenterId = mc.medicalCenterId
    WHERE mc.medicalCenterId IN (?)
    ORDER BY pp.patientPetId DESC`;
  var jsonValues = await {
    medicalCenterArray: request.body['medicalCenterArray']
  };
  const schema = await {
    medicalCenterArray: { type: "array", optional: false, max: 100, min: 1 }
  }
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if (await validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      ok: false,
      error: validationResponse
    });
  }
  var arrayValues = await Object.values(jsonValues);
  await mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use none
});

// On post
routePatientPet.post('/api/patientpet/getpatientpetid', [auth, viewer], async (request, response) => {
  var query = await `SELECT pp.patientPetId 
    FROM ${process.env.MYSQL_D_B_}.PatientPets pp
    INNER JOIN petowners pw ON pp.PetOwnerPetOwnerId = pw.petOwnerId
    WHERE pp.patientPetName = ? AND (pw.petOwnerName = ? OR pw.petOwnerId = ?)
    LIMIT 1`;
  var jsonValues = await {
    patientPetName: request.body['patientPetName'],
    petOwnerName: request.body['petOwnerName'],
    PetOwnerPetOwnerId: request.body['PetOwnerPetOwnerId'],
  };
  const schema = await {
    patientPetName: { type: 'string', optional: false, max: 100, min: 2 },
    petOwnerName: { type: 'string', optional: true, max: 100, min: 0 },
    PetOwnerPetOwnerId: { type: 'number', optional: true, positive: true, integer: true, min: 0, max: 9999999999 },
  }
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if (await validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      ok: false,
      error: validationResponse,
    });
  }
  var arrayValues = await Object.values(jsonValues);
  await mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err,
      });
    }
    console.log('getpatientpetid:', rows);
    if (!rows || rows.length === 0) {
      response.status(404).json({
        message: apiMessage['404'][1],
        ok: false,
      });
    } else
      response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use none
});

routePatientPet.post('/api/patientpet', [auth, clinic], async (request, response) => {
  var query = await `INSERT into ${process.env.MYSQL_D_B_}.PatientPets
              (patientPetName, patientPetBirthday, patientPetGender, patientPetHeight,
                patientPetWeight, createdAt, updatedAt, SpeciesSpeciesId,
                PetOwnerPetOwnerId, BreedBreedId, MedicalCenterMedicalCenterId)
              VALUE (?,?,?,?,?,NOW(),NOW(),?,?,?,?)`;
  var jsonValues = await {
    patientPetName: request.body['patientPetName'].trim(),
    patientPetBirthday: request.body['patientPetBirthday'],
    patientPetGender: request.body['patientPetGender'],
    patientPetHeight: request.body['patientPetHeight'],
    patientPetWeight: request.body['patientPetWeight'],
    SpeciesSpeciesId: request.body['SpeciesSpeciesId'],
    PetOwnerPetOwnerId: request.body['PetOwnerPetOwnerId'],
    BreedBreedId: request.body['BreedBreedId'],
    MedicalCenterMedicalCenterId: request.body['MedicalCenterMedicalCenterId'],
    petOwnerName: request.body['petOwnerName'],
    TokenExternal: request.body['TokenExternal'],

  };
  console.log('post:patientpet', jsonValues);
  const schema = await {
    patientPetName: { type: 'string', optional: false, max: 100, min: 2 },
    patientPetBirthday: { type: 'array', optional: true, items: 'string', min: 1, max: 3 },
    patientPetGender: { type: 'string', optional: false, length: 1 },
    patientPetHeight: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 99999 },
    patientPetWeight: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 9999999 },
    SpeciesSpeciesId: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 999 },
    PetOwnerPetOwnerId: { type: 'number', optional: false, positive: true, integer: true, min: 10000, max: 9999999999 },
    BreedBreedId: { type: 'number', optional: false, positive: true, integer: true, min: 1000, max: 999999 },
    MedicalCenterMedicalCenterId: { type: 'number', optional: false, positive: true, integer: true, min: 10000, max: 9999999999 },
    petOwnerName: { type: 'string', optional: false, max: 100, min: 5 },
    TokenExternal: { type: 'string', optional: true },

  }
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if (await validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      ok: false,
      error: validationResponse
    });
  }
  if (jsonValues.patientPetBirthday.length < 3 || jsonValues.patientPetBirthday[0] === '') {
    jsonValues.patientPetBirthday = null;
  } else {
    jsonValues.patientPetBirthday = new Date(`${jsonValues.patientPetBirthday[0]}-${jsonValues.patientPetBirthday[1]}-${jsonValues.patientPetBirthday[2]}`);
  }
  console.log('patientPetBirthday: ', jsonValues.patientPetBirthday);

  await fetch(process.env.EMAIL_API_ + 'petowner', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': jsonValues.TokenExternal
    },
    body: JSON.stringify({
      petOwnerId: jsonValues.PetOwnerPetOwnerId,
      petOwnerName: jsonValues.petOwnerName,
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
        ok: false,
        error: err
      });
    }
    response.status(201).json({
      message: apiMessage['201'][1],
      ok: true,
    });
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPO"}
  // Run again the GET option to check the list of records
});

routePatientPet.put('/api/patientpet', [auth, clinic], async (request, response) => {
  var query = await `UPDATE ${process.env.MYSQL_D_B_}.PatientPets
               SET patientPetName=?, patientPetBirthday=?, patientPetGender=?, 
               patientPetHeight=?, patientPetWeight=?,SpeciesSpeciesId=?,
               PetOwnerPetOwnerId=?, BreedBreedId=?,
               MedicalCenterMedicalCenterId=?, updatedAt=NOW()
               WHERE patientPetId=?`;
  var jsonValues = await {
    patientPetName: request.body['patientPetName'],
    patientPetBirthday: request.body['patientPetBirthday'],
    patientPetGender: request.body['patientPetGender'],
    patientPetHeight: request.body['patientPetHeight'],
    patientPetWeight: request.body['patientPetWeight'],
    SpeciesSpeciesId: request.body['SpeciesSpeciesId'],
    PetOwnerPetOwnerId: request.body['PetOwnerPetOwnerId'],
    BreedBreedId: request.body['BreedBreedId'],
    MedicalCenterMedicalCenterId: request.body['MedicalCenterMedicalCenterId'],
    patientPetId: request.body['patientPetId'],
    petOwnerName: request.body['petOwnerName'],
    TokenExternal: request.body['TokenExternal'],
  };
  console.log('put:patientpet', jsonValues);
  const schema = await {
    patientPetName: { type: 'string', optional: false, max: 100, min: 2 },
    patientPetBirthday: { type: 'array', optional: true, items: 'string', min: 1, max: 3 },
    patientPetGender: { type: 'string', optional: false, length: 1 },
    patientPetHeight: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 99999 },
    patientPetWeight: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 9999999 },
    SpeciesSpeciesId: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 999 },
    PetOwnerPetOwnerId: { type: 'number', optional: false, positive: true, integer: true, min: 10000, max: 9999999999 },
    BreedBreedId: { type: 'number', optional: false, positive: true, integer: true, min: 1000, max: 999999 },
    MedicalCenterMedicalCenterId: { type: 'number', optional: false, positive: true, integer: true, min: 10000, max: 9999999999 },
    patientPetId: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 9999999 },
    petOwnerName: { type: 'string', optional: false, max: 100, min: 5 },
    TokenExternal: { type: 'string', optional: true },
  }
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);
  if (validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      ok: false,
      error: validationResponse
    });
  }
  if (jsonValues.patientPetBirthday.length < 3 || jsonValues.patientPetBirthday[0] === '') {
    jsonValues.patientPetBirthday = null;
  } else {
    jsonValues.patientPetBirthday = new Date(`${jsonValues.patientPetBirthday[0]}-${jsonValues.patientPetBirthday[1]}-${jsonValues.patientPetBirthday[2]}`);
  }
  console.log('patientPetBirthday: ', jsonValues.patientPetBirthday);

  await fetch(process.env.EMAIL_API_ + 'petowner', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': jsonValues.TokenExternal
    },
    body: JSON.stringify({
      petOwnerId: jsonValues.PetOwnerPetOwnerId,
      petOwnerName: jsonValues.petOwnerName,
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
        ok: false,
        error: err
      });
    }
    console.log(query);
    response.status(202).json({
      message: apiMessage['202'][1],
      ok: true,
    });
  });
  // To Test in Postman use PUT with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPOX", "PetId": "3"}
  // Run again the GET option to check the list of records
});

routePatientPet.delete('/api/patientpet/:id', [auth, admin], async (request, response) => {
  var query = await `DELETE from ${process.env.MYSQL_D_B_}.PatientPets
               where PetId=?`;
  var values = await [
    parseInt(request.params.id)
  ];
  await mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    response.status(202).json({
      message: apiMessage['202'][1],
      ok: true,
    });
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/patientpet/3"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

module.exports = routePatientPet;
