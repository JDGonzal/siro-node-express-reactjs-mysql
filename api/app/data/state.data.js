const fs = require("fs");
const db = require("../models");
const setLog = require('../utils/logs.utils.js');

async function init_States() {
  const fileName = process.cwd() + "/app/data/state.data.json";
  const funcName = arguments.callee.name;
  fs.readFile(fileName, function (err, data) {
    setLog( "TRACE", __filename, funcName, `filename:${fileName}`);
    db.state.bulkCreate(JSON.parse(data.toString()),{ validate: true })
      .then(() => {
        setLog( "INFO", __filename, funcName, `${JSON.parse(data.toString()).length} record(s) for "States" table was added successfully` );
      })
      .catch((err) => {
        setLog( "ERROR", __filename, funcName, `Unable to insert items: ${err}` );
      })
      .finally(() => {});
  });
}

module.exports = init_States;
