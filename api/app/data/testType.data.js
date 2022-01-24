require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');

function init_TestType() {
  const fileName= process.cwd() +  '/app/data/testType.data.csv';
  const insertStatement =
        `INSERT INTO ${process.env.MYSQL_D_B_}.TestTypes
        (TestTypeId,TestTypeName,testTypeIsMultiple,createdAt,updatedAt)
        VALUE (?,?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var TestTypeId = parseInt(source[i]['testTypeId']),
      TestTypeName = source[i]['testTypeName'],
      testTypeIsMultiple = source[i]['testTypeIsMultiple']
      if (!TestTypeName ) { }
      else {
      var items = [TestTypeId, TestTypeName, testTypeIsMultiple];
      mysqlConnection.query(insertStatement, items,
        (err, results, fields) => {
          if (err) {
            console.log('Unable to insert item at row ', i + 1, '\n', err);
          }
        });
      }
    }
    console.log(
      `${i} record(s) for "TestTypes" table was added successfully`);
  });
}

module.exports = init_TestType;
