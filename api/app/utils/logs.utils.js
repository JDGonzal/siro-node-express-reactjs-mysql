const db = require("../models");

async function setLog(level, fileName, methodName, dataText) {
  try {
    db.log.create({
      logDateTime: new Date().toISOString(),
      logLevel: level,
      logFileName: fileName,
      logMethodName: methodName,
      logDataText: dataText,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = setLog;
