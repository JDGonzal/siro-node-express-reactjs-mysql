module.exports = (sequelize, Sequelize) => {
  const TestType = sequelize.define('TestTypes', {
    testTypeId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    testTypeName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    testTypeIsMultiple: { 
      type: Sequelize.BOOLEAN,
      allowNull: false, 
      defaultValue: false,
    },
  });

  return TestType;
};
