module.exports = (sequelize, Sequelize) => {
  const TypeOfSample = sequelize.define('TypeOfSamples', {
    typeOfSampleId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    typeOfSampleName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return TypeOfSample;
};
