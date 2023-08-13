module.exports = (Sequelize, DataTypes) => {
  const Log = Sequelize.define('Logs', {
    logId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    logDateTime: {
      type: DataTypes.STRING,
    },
    logLevel: {
      type: DataTypes.ENUM("FATAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE")},
    logFileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logMethodName: {
      type: DataTypes.STRING,
    },
    logDataText: {
      type: DataTypes.STRING,
    },
  });

  return Log;
};
