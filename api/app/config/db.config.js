require("dotenv").config();  // mport config = require('config');
module.exports = {
  HOST: String(process.env.MYSQL_HOST),
  USER: String(process.env.MYSQL_USER),
  PASSWORD: String(process.env.MYSQL_PASS),
  DB: String(process.env.MYSQL_D_B_),
  PORT: parseInt(String(process.env.MYSQL_PORT)),
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

