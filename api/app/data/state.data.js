require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');
const setLog = require('../utils/logs.utils.js');

function init_States() {
  const fileName= process.cwd() +  '/app/data/state.data.csv';
  const insertStatement =
        `INSERT INTO ${process.env.MYSQL_D_B_}.States
        (stateId,stateName,createdAt,updatedAt)
        VALUE (?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var stateId = parseInt(source[i]['stateId']),
      stateName = source[i]['stateName'];
      if (!stateId ) { }
      else {
      var items = [stateId, stateName];
      mysqlConnection.query(insertStatement, items,
        (err, results, fields) => {
          if (err) {
            setLog("ERROR",__filename,arguments.callee.name,`'Unable to insert item at row ', ${i + 1}, ${err}`);
          }
        });
      }
    }
    setLog("INFO",__filename,arguments.callee.name,`${i} record(s) for "States" table was added successfully`);
  });
}

module.exports = init_States;
