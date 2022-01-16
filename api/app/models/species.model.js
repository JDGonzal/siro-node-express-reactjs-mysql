module.exports = (sequelize, Sequelize) => {
  const Species = sequelize.define('Species', {
    speciesId: {
      type: Sequelize.INTEGER, 
      primaryKey: true
    },
    speciesName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    speciesOrder: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Species;
};
