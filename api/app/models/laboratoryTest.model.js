module.exports = (sequelize, Sequelize) => {
  const LaboratoryTest = sequelize.define('LaboratoryTests', {
    laboratoryTestId: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    laboratoryTestName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return LaboratoryTest;
};
