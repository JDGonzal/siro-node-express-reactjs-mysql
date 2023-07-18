const bcrypt = require('bcryptjs');

const encrypted = async function(password){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
  //that was the answer after use the ".then" : $2b$15$Igd1g/6ky4XAlm41urkPPuDq/.LKTvWIDT5mxW1U6CJKIIgCsCCUq
  //check into "database.js" where this function was called
};

const compare = function(password, hash){
    return bcrypt.compareSync(password, hash);
}

module.exports = {encrypted, compare};