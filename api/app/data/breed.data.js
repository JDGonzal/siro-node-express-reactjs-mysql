require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');

function init_Breed() {
  const fileName = process.cwd() + '/app/data/breed.data.csv';
  const insertStatement =
    `INSERT INTO ${process.env.MYSQL_D_B_}.Breeds
        (breedId,SpeciesSpeciesId,breedName,createdAt,updatedAt)
        VALUE (?,?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var
        breedId = source[i]['breedId'];
        SpeciesSpeciesId = source[i]['SpeciesSpeciesId'],
        breedName = source[i]['breedName'];
      if (!SpeciesSpeciesId || !breedName) { }
      else {
        var items = [breedId,SpeciesSpeciesId, breedName];
        mysqlConnection.query(insertStatement, items,
          (err, results, fields) => {
            if (err) {
              console.log('breedName', breedName, 'SpeciesSpeciesId', SpeciesSpeciesId);
              console.log('Unable to insert item at row ', i + 1, '\n', err);
            }
          });
      }
    }
    console.log(
      `${i} record(s) for "Breeds" table was added successfully`);
  });
}

module.exports = init_Breed;
