require('dotenv').config(); // mport config = require('config');
module.exports = {
  secret: process.env.AUTH_SEED
};
