const fs = require("fs");
const db = require("../models");
const setLog = require('../utils/logs.utils.js');

async function init_LaboratoryTests(firstTry) {
  const fileName = process.cwd() + "/app/data/laboratoryTest.data.json";
  const funcName = arguments.callee.name;
  fs.readFile(fileName, async function (err, data) {
    setLog( "TRACE", __filename, funcName, `filename:${fileName}, firstTry:${firstTry}` );
    await db.laboratoryTest.bulkCreate(await JSON.parse(data.toString()),{ validate: true })
      .then(() => {
        setLog( "INFO", __filename, funcName, `${JSON.parse(data.toString()).length} record(s) for "LaboratoryTests" table was added successfully` );
      })
      .catch((err) => {
        setLog( "ERROR", __filename, funcName, `Unable to insert items: ${err}` );
        if (firstTry===true) setTimeout(() =>{ init_LaboratoryTests(false); },2000);
      })
      .finally(() => {});
  });
}

module.exports = init_LaboratoryTests;
