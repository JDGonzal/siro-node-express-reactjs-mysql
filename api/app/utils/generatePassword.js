const bcrypt = require('bcryptjs');

const encrpted = async function(password){
  return await bcrypt.hashSync(password, 8);
  //that was the answer after use the ".then" : $2b$15$Igd1g/6ky4XAlm41urkPPuDq/.LKTvWIDT5mxW1U6CJKIIgCsCCUq
  //check into "database.js" where this function was called
};


module.exports = encrpted;
