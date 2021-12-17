require("dotenv").config();  // mport config = require('config');
module.exports = {
  HOST: process.env.MYSQL_HOST,
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASS,
  DB: process.env.MYSQL_D_B_,
  PORT: process.env.MYSQL_PORT,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

