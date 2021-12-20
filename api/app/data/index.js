const db = require('../models');
const init_Roles = require('./role.data.js');
const init_States = require('./state.data.js');
const init_Cities = require('./city.data.js');

function init_All(){
  db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    init_Roles();
    init_States();
    init_Cities();
  });/* */
  //The next line replaces the previos method, it can use every time
  /*db.sequelize.sync(); /* */
  
}

module.exports = init_All;
