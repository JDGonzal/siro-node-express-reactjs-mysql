require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');
const setLog = require('../utils/logs.utils.js');

function init_Cities() {
  const fileName = process.cwd() + '/app/data/city.data.csv';
  const insertStatement =
    `INSERT INTO ${process.env.MYSQL_D_B_}.Cities
        (cityId,cityName,stateStateId,createdAt,updatedAt)
        VALUE (?,?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var cityId = parseInt(source[i]['cityId']),
        cityName = source[i]['cityName'],
        stateStateId = source[i]['stateStateId'];
      if (!cityName || !stateStateId) { }
      else {
        var items = [cityId, cityName, stateStateId];
        mysqlConnection.query(insertStatement, items,
          (err, results, fields) => {
            if (err) {
              setLog("ERROR",__filename,arguments.callee.name,`'Unable to insert item at row ', ${i + 1},  ${err}`);
            }
          });
      }
    }
    setLog("INFO",__filename,arguments.callee.name,`${i} record(s) for "Cities" table was added successfully`);
  });
}

module.exports = init_Cities;
