module.exports = (sequelize, Sequelize) => {
  const TestType = sequelize.define('TestTypes', {
    testTypeId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    testTypeName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return TestType;
};
