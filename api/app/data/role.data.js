const fs = require("fs");
const db = require("../models");
const setLog = require('../utils/logs.utils.js');

async function init_Roles() {
  const fileName = process.cwd() + "/app/data/testType.data.json";
  const funcName = arguments.callee.name;
  fs.readFile(fileName, async function (err, data) {
    setLog( "TRACE", __filename, funcName, `filename:${fileName}` );
    await db.testType.bulkCreate(await JSON.parse(data.toString()),{ validate: true })
      .then(() => {
        setLog( "INFO", __filename, funcName, `${JSON.parse(data.toString()).length} record(s) for "testTypes" table was added successfully` );
      })
      .catch((err) => {
        setLog( "ERROR", __filename, funcName, `Unable to insert items: ${err}` );
      })
      .finally(() => {});
  });
}

module.exports = init_Roles;
