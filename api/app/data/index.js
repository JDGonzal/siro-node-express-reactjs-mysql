const db = require('../models');
const init_Roles = require('./role.data.js');
const init_States = require('./state.data.js');
const init_Cities = require('./city.data.js');
const init_Species = require('./species.data.js')
const init_Breeds = require('./breed.data.js');
const init_TypeOfSample = require('./typeOfSample.data.js');
const init_TestType = require('./testType.data.js');
const init_LaboratoryTests = require('./laboratoryTest.data.js');

async function init_All(){
  await db.sequelize.sync({force: true}).then(async() => {
    console.log('Drop and Resync Db');
    await init_Roles();
    await init_States();
    await init_Cities();
    await init_Species();
    await init_Breeds();
    await init_TypeOfSample();
    await init_TestType();
    await init_LaboratoryTests(); 
  });/* */
  //The next line replaces the previos method, it can use every time
  /*db.sequelize.sync(); /* */
  
}

module.exports = init_All;
