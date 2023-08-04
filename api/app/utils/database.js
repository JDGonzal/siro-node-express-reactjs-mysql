const mysql = require('mysql');

const dbConfig = require('../config/db.config.js');

//create mysql connection pool
const mysqlConnection = mysql.createPool({
  connectionLimit:10,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// Attempt to catch disconnects
mysqlConnection.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});

module.exports = mysqlConnection;
