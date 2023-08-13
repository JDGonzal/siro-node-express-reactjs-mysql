const db = require('../models');

async function setLog(level, fileName, methodName, dataText){
  db.log.create({
    logDateTime: new Date().toISOString(),
    logLevel: level,
    logFileName: fileName,
    logMethodName: methodName,
    logDataText: dataText,
  })
}

module.exports = setLog;
