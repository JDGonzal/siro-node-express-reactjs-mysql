require('dotenv').config(); // import config = require('config');
const csvtojson = require('csvtojson');
const mysqlConnection = require('../utils/database.js');

function init_Roles() {
  const fileName= process.cwd() +  '/app/data/role.data.csv';
  const insertStatement =
        `INSERT INTO ${process.env.MYSQL_D_B_}.Roles
        (roleId,roleName,createdAt,updatedAt)
        VALUE (?,?,NOW(),NOW())`;

  csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
      var roleId = parseInt(source[i]['roleId']),
      roleName = source[i]['roleName']
      
      var items = [roleId, roleName];
      mysqlConnection.query(insertStatement, items,
        (err, results, fields) => {
          if (err) {
            console.log('Unable to insert item at row ', i + 1, '\n', err);
          }
        });
    }
    console.log(
      `${i} record(s) for "Roles" table was added successfully`);
  });
}

module.exports = init_Roles;
