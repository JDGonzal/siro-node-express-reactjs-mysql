require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');
const setLog = require('../utils/logs.utils.js');

function init_Species() {
  const fileName = process.cwd() + '/app/data/species.data.csv';
  const insertStatement =
    `INSERT INTO ${process.env.MYSQL_D_B_}.Species
        (speciesId,speciesName,speciesOrder,createdAt,updatedAt)
        VALUE (?,?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var
        speciesId = source[i]['speciesId'],
        speciesName = source[i]['speciesName'];
        speciesOrder = source[i]['speciesOrder'];
      if (!speciesId || !speciesName) { }
      else {
        var items = [speciesId, speciesName, speciesOrder];
        mysqlConnection.query(insertStatement, items,
          (err, results, fields) => {
            if (err) {
              selLog("ERROR",__filename,arguments.callee.name,`'Unable to insert item at row ', ${i + 1}, ${err}`);
            }
          });
      }
    }
    setLog("INFO",__filename,arguments.callee.name,`${i} record(s) for "Species" table was added successfully`);
  });
}

module.exports = init_Species;
