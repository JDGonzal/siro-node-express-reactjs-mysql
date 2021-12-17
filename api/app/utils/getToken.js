const jwt = require("jsonwebtoken");
require("dotenv").config(); // import config = require('config');

const getToken = function (expiresIn, rolesArray, userId) {
  console.log('rolesArray:', rolesArray, 'userId:', userId, 'expiresIn', expiresIn);
  return token = jwt.sign({
    id: userId,
    roles: rolesArray,
  }, process.env.AUTH_SEED, { expiresIn: expiresIn });//Expires in x time, eg: 24h, 15m, 480m
}

module.exports = getToken;
