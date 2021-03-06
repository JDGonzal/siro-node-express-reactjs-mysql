require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');

function init_LaboratoryTests() {
  const fileName = process.cwd() + '/app/data/laboratoryTest.data.csv';
  const insertStatement =
    `INSERT INTO ${process.env.MYSQL_D_B_}.LaboratoryTests
        (laboratoryTestId,laboratoryTestName,TestTypeTestTypeId,createdAt,updatedAt)
        VALUE (?,?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var laboratoryTestId = parseInt(source[i]['laboratoryTestId']),
        laboratoryTestName = source[i]['laboratoryTestName'],
        TestTypeTestTypeId = source[i]['TestTypeTestTypeId'];
      if (!laboratoryTestName || !TestTypeTestTypeId) { }
      else {
        var items = [laboratoryTestId, laboratoryTestName, TestTypeTestTypeId];
        mysqlConnection.query(insertStatement, items,
          (err, results, fields) => {
            if (err) {
              console.log('Unable to insert item at row ', i + 1, '\n', err);
            }
          });
      }
    }
    console.log(
      `${i} record(s) for "LaboratoryTests" table was added successfully`);
  });
}

module.exports = init_LaboratoryTests;
