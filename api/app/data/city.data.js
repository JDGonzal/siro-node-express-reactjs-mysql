const fs = require("fs");
const db = require("../models");
const setLog = require('../utils/logs.utils.js');

function init_Cities(firstTry) {
  const fileName = process.cwd() + "/app/data/city.data.json";
  const funcName = arguments.callee.name;
  fs.readFile(fileName, async function (err, data) {
    setLog( "TRACE", __filename, funcName, `filename:${fileName}, firstTry:${firstTry}` );
    await db.city.bulkCreate(await JSON.parse(data.toString()),{ validate: true })
      .then(() => {
        setLog( "INFO", __filename, funcName, `${JSON.parse(data.toString()).length} record(s) for "Cities" table was added successfully` );
      })
      .catch((err) => {
        setLog( "ERROR", __filename, funcName, `Unable to insert items: ${err}` );
        if (firstTry===true) setTimeout(() =>{ init_Cities(false); },2000);
      })
      .finally(() => {});
  });
}

module.exports = init_Cities;
