const db = require('../models');
const init_Roles = require('./role.data.js');
const init_States = require('./state.data.js');
const init_Cities = require('./city.data.js');
const init_Species = require('./species.data.js')
const init_Breeds = require('./breed.data.js');
const init_TypeOfSample = require('./typeOfSample.data.js');
const init_TestType = require('./testType.data.js');
const init_LaboratoryTests = require('./laboratoryTest.data.js');
const setLog = require('../utils/logs.utils.js');

async function init_All(force){
  if (!force) return;
  await db.sequelize.sync(force?{force: true}:null).then(async() => {
    await setLog("DEBUG",__filename,arguments.callee.name,'Drop and Resync Db');
    await init_Roles();
    await init_States().then(() =>{init_Cities(true)});
    await init_Species().then(() => { init_Breeds(true)});
    await init_TypeOfSample();
    await init_TestType().then(() => {init_LaboratoryTests(true)}); 
  })
  .finally(async () => {
    await setLog("DEBUG",__filename,arguments.callee.name,'End of init Tables');
  });/* */
  //The next line replaces the previos method, it can use every time
  /*db.sequelize.sync(); /* */
}

module.exports = init_All;
