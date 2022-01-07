const db = require('../models');
const init_Roles = require('./role.data.js');
const init_States = require('./state.data.js');
const init_Cities = require('./city.data.js');
const init_Species = require('./species.data.js')
const init_Breeds = require('./breed.data.js');

async function init_All(){
  await db.sequelize.sync({force: true}).then(async() => {
    console.log('Drop and Resync Db');
    await init_Roles();
    await init_States();
    await init_Cities();
    await init_Species();
    await init_Breeds();
  });/* */
  //The next line replaces the previos method, it can use every time
  /*db.sequelize.sync(); /* */
  
}

module.exports = init_All;
