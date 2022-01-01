module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define('Cities', {
    CityId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    CityName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

  });

  return City;
};
