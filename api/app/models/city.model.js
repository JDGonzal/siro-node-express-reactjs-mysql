module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define('Cities', {
    cityId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    cityName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

  });

  return City;
};
