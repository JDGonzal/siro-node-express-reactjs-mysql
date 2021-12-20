module.exports = (sequelize, Sequelize) => {
  const State = sequelize.define('States', {
    stateId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    stateName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return State;
};
