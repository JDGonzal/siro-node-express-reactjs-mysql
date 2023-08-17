const db = require("../models");

async function setLog(level, fileName, methodName, dataText) {
  try {
    db.log.create({
      logDateTime: new Date().toISOString(),
      logLevel: String(level),
      logFileName: String(fileName).substring(0,255),
      logMethodName: String(methodName).substring(0,255),
      logDataText: String(dataText).substring(0,255),
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = setLog;
