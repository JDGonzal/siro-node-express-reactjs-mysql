require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');
const setLog = require('../utils/logs.utils.js');

function init_TypeOfSample() {
  const fileName= process.cwd() +  '/app/data/typeOfSample.data.csv';
  const insertStatement =
        `INSERT INTO ${process.env.MYSQL_D_B_}.TypeOfSamples
        (typeOfSampleId,typeOfSampleName,createdAt,updatedAt)
        VALUE (?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var typeOfSampleId = parseInt(source[i]['typeOfSampleId']),
      typeOfSampleName = source[i]['typeOfSampleName']
      if (!typeOfSampleName ) { }
      else {
      var items = [typeOfSampleId, typeOfSampleName];
      mysqlConnection.query(insertStatement, items,
        (err, results, fields) => {
          if (err) {
            setLog("ERROR",__filename,arguments.callee.name,`'Unable to insert item at row ', ${i + 1}, ${err}`);
          }
        });
      }
    }
    setLog("INFO",__filename,arguments.callee.name,`${i} record(s) for "TypeOfSamples" table was added successfully`);
  });
}

module.exports = init_TypeOfSample;
