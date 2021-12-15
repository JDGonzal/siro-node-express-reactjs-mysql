const mysql = require('mysql');
require("dotenv").config(); // import config = require('config');
//const passwordEncrypt = require('./utils/generatePassword.js')
//const sendEmail= require("../utils/email.js");
const mysqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_D_B_
});

mysqlConnection.connect(function(err){
  if(err) {
    console.log(err);
    return;
  } else {
    console.log('DB is connected');
  }
})

module.exports = mysqlConnection;
