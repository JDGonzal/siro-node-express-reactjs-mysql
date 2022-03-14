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
const routePatientExam = express.Router();

routePatientExam.get('/api/patientexam/:VeterinarianVeterinarianId&:PatientPetPatientPetId', async (request, response) => {
  var query = `SELECT COUNT(patientExamId)as found from ${process.env.MYSQL_D_B_}.patientExams
               where VeterinarianVeterinarianId=? AND PatientPetPatientPetId=?`;
  var values = [
    parseInt(request.params.VeterinarianVeterinarianId),
    parseInt(request.params.PatientPetPatientPetId),
  ];
  console.log('/api/patientexam/', values);
  await mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: apiMessage['501'][1],
        ok: false,
        error: err
      });
    }
    if (rows[0].found > 0) {
      query = `SELECT MAX(patientExamId) as found from ${process.env.MYSQL_D_B_}.patientExams
      where VeterinarianVeterinarianId=? AND PatientPetPatientPetId=?`;
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
      console.log('found: ', rows[0].found, ' of ', values[0], ' and ', values[1]);
      response.send({
        ok: true,
        found: rows[0].found
      });
    }
  });
  // To Test in Postman use GET with this URL 'http://localhost:49146/api/auth/signup/im.user@no.matter.com'
  // in 'Body' use none
});

// On post
routePatientExam.post('/api/patientexam/get', [auth, viewer], async (request, response) => {
  var query = await `SELECT pe.*, pp.patientPetName, pp.patientPetGender, pp.patientPetBirthday ,
  pp.MedicalCenterMedicalCenterId, pp.PetOwnerPetOwnerId, pw.petOwnerName,
  sp.speciesName, br.breedName, mc.medicalCenterName, ve.veterinarianName,
  (SELECT GROUP_CONCAT(pt.typeOfSampleId SEPARATOR ',') 
		FROM patientexam_typeofsamples pt 
    WHERE pt.patientExamId = pe.patientExamId) AS typeOfSampleIds,
	(SELECT GROUP_CONCAT(ts.typeOfSampleName SEPARATOR ',') 
		FROM patientexam_typeofsamples pt 
		INNER JOIN typeofsamples ts ON pt.typeOfSampleId = ts.typeOfSampleId
    WHERE pt.patientExamId = pe.patientExamId) AS typeOfSampleNames,
  (SELECT GROUP_CONCAT(pl.laboratoryTestId SEPARATOR ',') 
    FROM patientexam_laboratorytests pl 
    WHERE pl.patientExamId = pe.patientExamId) AS laboratoryTestIds,
  (SELECT GROUP_CONCAT(lt.laboratoryTestName SEPARATOR ',') 
    FROM patientexam_laboratorytests pl 
    INNER JOIN laboratorytests lt ON pl.laboratoryTestId = lt.laboratoryTestId
    WHERE pl.patientExamId = pe.patientExamId) AS laboratoryTestNames,
  (SELECT GROUP_CONCAT(lt.TestTypeTestTypeId SEPARATOR ',') 
    FROM patientexam_laboratorytests pl 
    INNER JOIN laboratorytests lt ON pl.laboratoryTestId = lt.laboratoryTestId
    WHERE pl.patientExamId = pe.patientExamId) AS TestTypeTestTypeIds,
  (SELECT GROUP_CONCAT(tt.testTypeIsMultiple SEPARATOR ',') 
    FROM patientexam_laboratorytests pl 
    INNER JOIN laboratorytests lt ON pl.laboratoryTestId = lt.laboratoryTestId
    INNER JOIN testtypes tt ON tt.testTypeId = lt.TestTypeTestTypeId
    WHERE pl.patientExamId = pe.patientExamId) AS testTypeIsMultiples
  FROM ${process.env.MYSQL_D_B_}.PatientExams pe
  INNER JOIN PatientPets pp ON pe.PatientPetPatientPetId = pp.patientPetId
  INNER JOIN petOwners pw ON pp.PetOwnerPetOwnerId = pw.petOwnerId
  INNER JOIN species sp ON pp.SpeciesSpeciesId = sp.speciesId
  INNER JOIN breeds br ON pp.BreedBreedId = br.breedId
  INNER JOIN medicalcenters mc ON pp.MedicalCenterMedicalCenterId = mc.medicalCenterId
  INNER JOIN veterinarians ve on pe.VeterinarianVeterinarianId = ve.veterinarianId
  WHERE mc.medicalCenterId IN (?)
  ORDER BY pe.patientExamId DESC LIMIT 100`;
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
      errors: validationResponse
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

routePatientExam.post('/api/patientexam', [auth, clinic], async (request, response) => {
  var query = await `INSERT into ${process.env.MYSQL_D_B_}.PatientExams
              (patientExamRemarks, patientExamAddress, patientExamTelNumber, patientExamIsUrgency,
                patientAnotherTypeOfSample, createdAt, updatedAt, 
                VeterinarianVeterinarianId, PatientPetPatientPetId)
              VALUE (?,?,?,?,?,NOW(),NOW(),?,?)`;
  var jsonValues = await {
    patientExamRemarks: request.body['patientExamRemarks'],
    patientExamAddress: request.body['patientExamAddress'],
    patientExamTelNumber: request.body['patientExamTelNumber'],
    patientExamIsUrgency: request.body['patientExamIsUrgency'],
    patientAnotherTypeOfSample: request.body['patientAnotherTypeOfSample'],
    VeterinarianVeterinarianId: request.body['VeterinarianVeterinarianId'],
    patientPetId: request.body['patientPetId'],
    MedicalCenterMedicalCenterId: request.body['MedicalCenterMedicalCenterId'],
    arrTypeOfSamples: request.body['arrTypeOfSamples'],
    arrLabTests: request.body['arrLabTests'],
    TokenExternal: request.body['TokenExternal'],
    veterinarianName: request.body['veterinarianName'],

  };
  console.log('post:patientexam', jsonValues);
  const schema = await {
    patientExamRemarks: { type: 'string', optional: true, max: 255 },
    patientExamAddress: { type: 'string', optional: false, max: 255, min: 8 },
    patientExamTelNumber: { type: 'number', optional: false, positive: true, integer: true, min: 1000000, max: 9999999999 },
    patientExamIsUrgency: { type: 'boolean', optional: false },
    patientAnotherTypeOfSample: { type: 'string', optional: true, max: 255 },
    VeterinarianVeterinarianId: { type: 'number', optional: false, positive: true, integer: true, min: 10000, max: 9999999999 },
    patientPetId: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 9999999 },
    MedicalCenterMedicalCenterId: { type: 'number', optional: false, positive: true, integer: true, min: 10000, max: 9999999999 },
    arrTypeOfSamples: { type: 'array', optional: false, max: 10, min: 1 },
    arrLabTests: { type: 'array', optional: false, max: 10, min: 1 },
    TokenExternal: { type: 'string', optional: true },
    veterinarianName: { type: 'string', optional: false, max: 100, min: 5 },

  }
  const v = await new Validator();
  const validationResponse = await v.validate(jsonValues, schema);

  if (await validationResponse !== true) {
    return response.status(400).json({
      message: apiMessage['400'][1],
      ok: false,
      errors: validationResponse
    });
  }

  await fetch(process.env.EMAIL_API_ + 'veterinarian', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': jsonValues.TokenExternal
    },
    body: JSON.stringify({
      veterinarianId: jsonValues.VeterinarianVeterinarianId,
      veterinarianName: jsonValues.veterinarianName,
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
    var patientExamId = 0;
    fetch(process.env.EMAIL_API_ + 'patientexam/' + jsonValues.VeterinarianVeterinarianId + '&'
      + jsonValues.patientPetId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then((data) => {
        patientExamId = data.found;
        if (jsonValues.arrTypeOfSamples[0] && patientExamId > 0) {
          fetch(process.env.EMAIL_API_ + 'patientexam_typeofsample', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': jsonValues.TokenExternal
            },
            body: JSON.stringify({
              patientExamId: patientExamId,
              arrTypeOfSamples: jsonValues.arrTypeOfSamples,
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log('patientexam_typeofsample(ok)', data);
            }, (error) => {
              console.log('patientexam_typeofsample(error)', error);
            });
        };
        if (jsonValues.arrLabTests[0] && patientExamId > 0) {
          fetch(process.env.EMAIL_API_ + 'patientexam_laboratorytest', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': jsonValues.TokenExternal
            },
            body: JSON.stringify({
              patientExamId: patientExamId,
              arrLabTests: jsonValues.arrLabTests,
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log('patientexam_laboratorytest(ok)', data);
            }, (error) => {
              console.log('patientexam_laboratorytest(error)', error);
            });
        };
      }, (err) => {
        console.log(err);
      });
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/patientpet"
  // in "Body" use raw and select JSON, put this JSON: {"PetName": "BPO"}
  // Run again the GET option to check the list of records
});

routePatientExam.put('/api/patientexam', [auth, clinic], async (request, response) => {
  var query = await `UPDATE ${process.env.MYSQL_D_B_}.PatientExams
               SET patientExamRemarks=?, patientExamAddress=?, patientExamTelNumber=?, 
               patientExamIsUrgency=?, patientAnotherTypeOfSample=?,SpeciesSpeciesId=?,
               VeterinarianVeterinarianId=?, BreedBreedId=?,
               MedicalCenterMedicalCenterId=?, updatedAt=NOW()
               WHERE patientPetId=?`;
  var jsonValues = await {
    patientExamRemarks: request.body['patientExamRemarks'],
    patientExamAddress: request.body['patientExamAddress'],
    patientExamTelNumber: request.body['patientExamTelNumber'],
    patientExamIsUrgency: request.body['patientExamIsUrgency'],
    patientAnotherTypeOfSample: request.body['patientAnotherTypeOfSample'],
    SpeciesSpeciesId: request.body['SpeciesSpeciesId'],
    VeterinarianVeterinarianId: request.body['VeterinarianVeterinarianId'],
    BreedBreedId: request.body['BreedBreedId'],
    MedicalCenterMedicalCenterId: request.body['MedicalCenterMedicalCenterId'],
    patientPetId: request.body['patientPetId'],
    petOwnerName: request.body['petOwnerName'],
    TokenExternal: request.body['TokenExternal'],
  };
  console.log('put:patientpet', jsonValues);
  const schema = await {
    patientExamRemarks: { type: 'string', optional: false, max: 100, min: 2 },
    patientExamAddress: { type: 'array', optional: false, items: 'string', length: 3 },
    patientExamTelNumber: { type: 'string', optional: false, length: 1 },
    patientExamIsUrgency: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 99999 },
    patientAnotherTypeOfSample: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 9999999 },
    SpeciesSpeciesId: { type: 'number', optional: false, positive: true, integer: true, min: 1, max: 999 },
    VeterinarianVeterinarianId: { type: 'number', optional: false, positive: true, integer: true, min: 10000, max: 9999999999 },
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
      errors: validationResponse
    });
  }

  jsonValues.patientExamAddress = new Date(`${jsonValues.patientExamAddress[0]}-${jsonValues.patientExamAddress[1]}-${jsonValues.patientExamAddress[2]}`);
  console.log('patientExamAddress: ', jsonValues.patientExamAddress);

  await fetch(process.env.EMAIL_API_ + 'petowner', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': jsonValues.TokenExternal
    },
    body: JSON.stringify({
      petOwnerId: jsonValues.VeterinarianVeterinarianId,
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

routePatientExam.delete('/api/patientexam/:id', [auth, admin], async (request, response) => {
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

module.exports = routePatientExam;
